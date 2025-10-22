import React from "react";

type ReadOnlyAutoGrowProps = {
  value: string | null | undefined;
  minRows?: number;
  className?: string;
};

export function ExpandableTextArea({
  value,
  minRows = 1,
  className = "",
}: ReadOnlyAutoGrowProps) {
  // Keep line-height consistent (1.5em)
  const lineHeight = 1.5;

  return (
    <div className={`grid w-full ${className}`}>
      {/* Invisible sizer to calculate height */}
      <div
        aria-hidden
        className="whitespace-pre-wrap break-words invisible col-start-1 row-start-1"
        style={{ minHeight: `calc(${lineHeight}em * ${minRows})` }}
      >
        {(value ?? "") + "\n"}
      </div>

      {/* Actual textarea overlays the sizer */}
      <textarea
        readOnly
        value={value ?? ""}
        rows={minRows}
        className="col-start-1 row-start-1 h-full w-full leading-[1.5] border-0 border-b border-gray-400 focus:ring-0 resize-none bg-transparent overflow-hidden"
      />
    </div>
  );
}
