/// Web Worker: runs the scaffold generator off the main thread and transfers the buffers back.
import { generateScaffold, transferables, type GenerateOptions } from './generate';

self.onmessage = (e: MessageEvent<GenerateOptions>) => {
  const data = generateScaffold(e.data);
  self.postMessage(data, { transfer: transferables(data) });
};
