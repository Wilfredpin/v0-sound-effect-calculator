"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ButtonVariant = "number" | "operator" | "function" | "equals";

interface CalculatorButtonProps {
  value: string;
  variant: ButtonVariant;
  onClick: (value: string) => void;
  className?: string;
  span?: number;
}

export function CalculatorButton({
  value,
  variant,
  onClick,
  className,
  span = 1,
}: CalculatorButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    number:
      "bg-calc-number text-calc-number-foreground hover:bg-calc-number/80",
    operator:
      "bg-calc-operator text-calc-operator-foreground hover:bg-calc-operator/80 font-semibold",
    function:
      "bg-calc-function text-calc-function-foreground hover:bg-calc-function/80",
    equals:
      "bg-calc-equals text-calc-equals-foreground hover:bg-calc-equals/80 font-semibold",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={() => onClick(value)}
      className={cn(
        "flex items-center justify-center rounded-xl text-2xl font-medium transition-colors duration-150",
        "h-16 sm:h-20",
        "shadow-lg shadow-black/20",
        "active:shadow-inner",
        variantStyles[variant],
        span === 2 && "col-span-2",
        className
      )}
    >
      {value}
    </motion.button>
  );
}
