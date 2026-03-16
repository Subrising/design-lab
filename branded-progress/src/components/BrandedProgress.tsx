"use client";

import { forwardRef } from "react";

export interface BrandedProgressProps {
  /** 0–100. Omit for indeterminate (loading) state. */
  value?: number;
  /** Accessible label — populates aria-label */
  label?: string;
  /** Optional secondary descriptor rendered below the label */
  sublabel?: string;
  /** Visual rendering variant */
  variant?: "solid" | "segmented" | "striped" | "pulse";
  /** Bar height */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Show numeric value readout */
  showValue?: boolean;
  /** Show tick marks at 10% intervals (visible at lg/xl) */
  showTicks?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const HEIGHT: Record<NonNullable<BrandedProgressProps["size"]>, number> = {
  xs: 3,
  sm: 5,
  md: 10,
  lg: 16,
  xl: 26,
};

export const BrandedProgress = forwardRef<HTMLDivElement, BrandedProgressProps>(
  function BrandedProgress(
    {
      value,
      label,
      sublabel,
      variant = "solid",
      size = "md",
      showValue = true,
      showTicks = false,
      className = "",
      style,
    },
    ref
  ) {
    const isIndeterminate = value === undefined;
    const clamped = isIndeterminate ? 0 : Math.max(0, Math.min(100, value));
    const h = HEIGHT[size];

    return (
      <div ref={ref} className={`bp-root ${className}`} style={style}>
        {(label || showValue) && (
          <div className="bp-header">
            <div className="bp-label-group">
              {label && <span className="bp-label">{label}</span>}
              {sublabel && <span className="bp-sublabel">{sublabel}</span>}
            </div>
            {showValue && (
              <span
                className={`bp-value${isIndeterminate ? " bp-value--busy" : ""}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {isIndeterminate ? "···" : `${String(Math.round(clamped)).padStart(3, "\u2007")}%`}
              </span>
            )}
          </div>
        )}

        {/* The ARIA progressbar lives here */}
        <div
          role="progressbar"
          aria-valuenow={isIndeterminate ? undefined : clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? "Progress"}
          aria-busy={isIndeterminate || undefined}
          data-variant={variant}
          data-size={size}
          className="bp-track"
          style={{ "--bp-h": `${h}px` } as React.CSSProperties}
        >
          {/* Tick marks — decorative, hidden from AT */}
          {showTicks && h >= 12 && (
            <div className="bp-ticks" aria-hidden="true">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((t) => (
                <span
                  key={t}
                  className="bp-tick"
                  style={{ left: `${t}%` }}
                />
              ))}
            </div>
          )}

          <div
            className={`bp-fill${isIndeterminate ? " bp-fill--indeterminate" : ""}`}
            style={isIndeterminate ? undefined : { width: `${clamped}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);
