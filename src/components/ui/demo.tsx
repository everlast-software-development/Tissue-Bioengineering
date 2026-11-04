import { LoaderHelix } from "@/components/ui/loader-helix";

export default function LoaderHelixDemo() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center gap-16 bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <LoaderHelix variant="dna" dots={12} />
        <span className="text-xs text-muted-foreground">dna</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <LoaderHelix variant="ribbon" dots={12} />
        <span className="text-xs text-muted-foreground">ribbon</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <LoaderHelix variant="minimal" dots={12} />
        <span className="text-xs text-muted-foreground">minimal</span>
      </div>
    </div>
  );
}
