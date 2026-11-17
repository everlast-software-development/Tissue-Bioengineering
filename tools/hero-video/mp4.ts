/**
 * Minimal MP4 (ISO BMFF) muxer for one H.264 video track, used by render.ts to wrap the samples
 * that the browser's WebCodecs encoder produces (length-prefixed NAL units plus an `avcC` record).
 * Writes a progressive-download file: `ftyp`, `moov`, then `mdat`.
 */
export interface Mp4Sample {
  /** Length-prefixed NAL units (WebCodecs `avc: { format: 'avc' }`). */
  data: Uint8Array;
  keyFrame: boolean;
  /** Presentation timestamp in microseconds. */
  timestamp: number;
}

export interface Mp4Options {
  width: number;
  height: number;
  fps: number;
  /** Samples in decode order. */
  samples: Mp4Sample[];
  /** The `AVCDecoderConfigurationRecord` (WebCodecs `decoderConfig.description`). */
  avcC: Uint8Array;
}

const ascii = (s: string) => new TextEncoder().encode(s);
const u8 = (...v: number[]) => Uint8Array.from(v);
const u16 = (v: number) => u8((v >>> 8) & 255, v & 255);
const u32 = (v: number) => u8((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255);
const zeros = (n: number) => new Uint8Array(n);
const UNITY_MATRIX = concat(u32(0x10000), u32(0), u32(0), u32(0), u32(0x10000), u32(0), u32(0), u32(0), u32(0x40000000));

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function box(type: string, ...children: Uint8Array[]): Uint8Array {
  const body = concat(...children);
  return concat(u32(8 + body.length), ascii(type), body);
}

function fullBox(type: string, version: number, flags: number, ...children: Uint8Array[]): Uint8Array {
  return box(type, u8(version, (flags >>> 16) & 255, (flags >>> 8) & 255, flags & 255), ...children);
}

export function muxMp4({ width, height, fps, samples, avcC }: Mp4Options): Uint8Array {
  const timescale = fps * 1000;
  const delta = 1000;
  const count = samples.length;
  const durationTs = count * delta;
  const durationMs = Math.round((count * 1000) / fps);

  // Composition offsets, in case the encoder reordered frames (B-frames).
  const frameUs = 1e6 / fps;
  const offsets = samples.map((s, i) => (Math.round(s.timestamp / frameUs) - i) * delta);
  const minOffset = Math.min(...offsets);
  const ctts = offsets.map((o) => o - minOffset);
  const needsCtts = ctts.some((o) => o !== 0);

  const keyIndices = samples.flatMap((s, i) => (s.keyFrame ? [u32(i + 1)] : []));

  const avc1 = box(
    'avc1',
    zeros(6),
    u16(1), // data reference index
    u16(0),
    u16(0),
    zeros(12),
    u16(width),
    u16(height),
    u32(0x00480000),
    u32(0x00480000),
    u32(0),
    u16(1), // frame count
    zeros(32), // compressor name
    u16(0x18),
    u16(0xffff),
    box('avcC', avcC)
  );

  const stbl = box(
    'stbl',
    fullBox('stsd', 0, 0, u32(1), avc1),
    fullBox('stts', 0, 0, u32(1), u32(count), u32(delta)),
    fullBox('stss', 0, 0, u32(keyIndices.length), ...keyIndices),
    ...(needsCtts ? [fullBox('ctts', 0, 0, u32(count), ...ctts.map((o) => concat(u32(1), u32(o))))] : []),
    fullBox('stsc', 0, 0, u32(1), u32(1), u32(count), u32(1)),
    fullBox('stsz', 0, 0, u32(0), u32(count), ...samples.map((s) => u32(s.data.length))),
    fullBox('stco', 0, 0, u32(1), u32(0)) // chunk offset patched below
  );

  const moov = box(
    'moov',
    fullBox(
      'mvhd',
      0,
      0,
      u32(0),
      u32(0),
      u32(1000),
      u32(durationMs),
      u32(0x00010000),
      u16(0x0100),
      zeros(10),
      UNITY_MATRIX,
      zeros(24),
      u32(2)
    ),
    box(
      'trak',
      fullBox(
        'tkhd',
        0,
        3,
        u32(0),
        u32(0),
        u32(1),
        u32(0),
        u32(durationMs),
        zeros(8),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        UNITY_MATRIX,
        u32(width << 16),
        u32(height << 16)
      ),
      box(
        'mdia',
        fullBox('mdhd', 0, 0, u32(0), u32(0), u32(timescale), u32(durationTs), u16(0x55c4), u16(0)),
        fullBox('hdlr', 0, 0, u32(0), ascii('vide'), zeros(12), ascii('VideoHandler\0')),
        box(
          'minf',
          fullBox('vmhd', 0, 1, zeros(8)),
          box('dinf', fullBox('dref', 0, 0, u32(1), fullBox('url ', 0, 1))),
          stbl
        )
      )
    )
  );

  const ftyp = box('ftyp', ascii('isom'), u32(0x200), ascii('isom'), ascii('iso2'), ascii('avc1'), ascii('mp41'));
  const mdat = box('mdat', ...samples.map((s) => s.data));

  // The single chunk starts right after the mdat header; patch it into stco (last 4 bytes of moov).
  const chunkOffset = ftyp.length + moov.length + 8;
  moov.set(u32(chunkOffset), moov.length - 4);

  return concat(ftyp, moov, mdat);
}
