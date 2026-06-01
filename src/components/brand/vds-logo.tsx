import { cn } from "@/lib/utils";

interface VdsLogoProps {
  className?: string;
  markClassName?: string;
  showLabel?: boolean;
}

export function VdsLogo({
  className,
  markClassName,
  showLabel = true,
}: VdsLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-400/20 bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm shadow-orange-950/40",
          markClassName,
        )}
        aria-hidden
      >
        <span className="text-[9px] font-bold tracking-[-0.08em] text-white">
          VDS
        </span>
      </div>
      {showLabel && (
        <span className="text-sm font-semibold tracking-tight text-white">
          VDS Studio Console
        </span>
      )}
    </div>
  );
}
