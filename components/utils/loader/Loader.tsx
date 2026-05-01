import React from "react";

type LoaderProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClassMap = {
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

export default function Loader({ label = "Loading...", size = "md" }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <span className={`loading loading-spinner text-primary ${sizeClassMap[size]}`} />
      <p className="text-sm text-base-content/70">{label}</p>
    </div>
  );
}
