import React from "react";

export function AdminField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="fieldset">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children}
    </fieldset>
  );
}
