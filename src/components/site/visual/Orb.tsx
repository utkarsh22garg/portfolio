import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Soft, matte, powdery orb ("Floating Orb Exchange"): no specular hotspot, a rim that
 * dissolves into its surroundings, and grain + stipple living inside the form.
 */
const STIPPLE =
  "radial-gradient(rgba(6,8,15,0.22) 0.6px, transparent 0.9px)";

const Orb = forwardRef<HTMLDivElement, { className?: string; halo?: boolean }>(
  ({ className, halo = true }, ref) => (
    <div ref={ref} aria-hidden className={cn("relative aspect-square", className)}>
      {halo && (
        <div
          className="absolute inset-[-45%] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(143,178,255,0.22), rgba(143,178,255,0.06) 60%, transparent)" }}
        />
      )}
      <div
        className="absolute inset-[-6%] rounded-full"
        style={{
          WebkitMaskImage: "radial-gradient(circle, #000 67.1%, rgba(0,0,0,0.6) 69.1%, transparent 70.5%)",
          maskImage: "radial-gradient(circle, #000 67.1%, rgba(0,0,0,0.6) 69.1%, transparent 70.5%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 42% 36%, #f3f6ff 0%, #e2e9fd 22%, #c3d2fa 48%, #97aeee 74%, #6f8bde 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: STIPPLE, backgroundSize: "3px 3px", opacity: 0.32, mixBlendMode: "multiply" }}
        />
        <div className="grain-layer absolute inset-0" style={{ opacity: 0.45, mixBlendMode: "overlay", backgroundSize: "120px 120px" }} />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 70% 78%, rgba(40,70,190,0.28), transparent 55%)" }}
        />
      </div>
    </div>
  ),
);
Orb.displayName = "Orb";
export default Orb;
