import React from "react";

interface PipProps {
  filled: boolean;
  onClick?: () => void;
  label?: string;
  color?: "primary" | "destructive" | "success";
  size?: "sm" | "md";
}

const Pip = ({
  filled,
  onClick,
  label,
  color = "primary",
  size = "md",
}: PipProps) => {
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const fillCls =
    color === "destructive"
      ? "bg-destructive border-destructive"
      : color === "success"
        ? "bg-emerald-500 border-emerald-500"
        : "bg-primary border-primary";
  const emptyCls = "bg-transparent border-border hover:border-primary";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${dim} rounded-full border-2 transition-colors ${filled ? fillCls : emptyCls} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    />
  );
};

export default Pip;
