"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorButton } from "./calculator-button";
import { useCalculatorSounds } from "@/hooks/use-calculator-sounds";
import { cn } from "@/lib/utils";

type ButtonType = {
  value: string;
  variant: "number" | "operator" | "function" | "equals";
  span?: number;
};

const buttons: ButtonType[] = [
  { value: "C", variant: "function" },
  { value: "±", variant: "function" },
  { value: "%", variant: "function" },
  { value: "÷", variant: "operator" },
  { value: "7", variant: "number" },
  { value: "8", variant: "number" },
  { value: "9", variant: "number" },
  { value: "×", variant: "operator" },
  { value: "4", variant: "number" },
  { value: "5", variant: "number" },
  { value: "6", variant: "number" },
  { value: "−", variant: "operator" },
  { value: "1", variant: "number" },
  { value: "2", variant: "number" },
  { value: "3", variant: "number" },
  { value: "+", variant: "operator" },
  { value: "0", variant: "number", span: 2 },
  { value: ".", variant: "number" },
  { value: "=", variant: "equals" },
];

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isError, setIsError] = useState(false);
  const { playSound } = useCalculatorSounds();

  const calculate = useCallback(
    (left: number, right: number, op: string): number => {
      switch (op) {
        case "+":
          return left + right;
        case "−":
          return left - right;
        case "×":
          return left * right;
        case "÷":
          if (right === 0) {
            setIsError(true);
            playSound("error");
            throw new Error("Division by zero");
          }
          return left / right;
        default:
          return right;
      }
    },
    [playSound]
  );

  const handleButtonClick = useCallback(
    (value: string) => {
      setIsError(false);

      // Numbers
      if (/[0-9]/.test(value)) {
        playSound("number");
        if (waitingForOperand) {
          setDisplay(value);
          setWaitingForOperand(false);
        } else {
          setDisplay(display === "0" ? value : display + value);
        }
        return;
      }

      // Decimal point
      if (value === ".") {
        playSound("number");
        if (waitingForOperand) {
          setDisplay("0.");
          setWaitingForOperand(false);
        } else if (!display.includes(".")) {
          setDisplay(display + ".");
        }
        return;
      }

      // Clear
      if (value === "C") {
        playSound("function");
        setDisplay("0");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
      }

      // Toggle sign
      if (value === "±") {
        playSound("function");
        setDisplay(
          display.startsWith("-") ? display.slice(1) : "-" + display
        );
        return;
      }

      // Percentage
      if (value === "%") {
        playSound("function");
        const currentValue = parseFloat(display);
        setDisplay(String(currentValue / 100));
        return;
      }

      // Operators
      if (["+", "−", "×", "÷"].includes(value)) {
        playSound("operator");
        if (operator && previousValue && !waitingForOperand) {
          try {
            const result = calculate(
              parseFloat(previousValue),
              parseFloat(display),
              operator
            );
            const formattedResult = parseFloat(result.toFixed(10)).toString();
            setDisplay(formattedResult);
            setPreviousValue(formattedResult);
          } catch {
            setDisplay("Error");
            setPreviousValue(null);
            setOperator(null);
            setWaitingForOperand(true);
            return;
          }
        } else {
          setPreviousValue(display);
        }
        setOperator(value);
        setWaitingForOperand(true);
        return;
      }

      // Equals
      if (value === "=") {
        playSound("equals");
        if (operator && previousValue) {
          try {
            const result = calculate(
              parseFloat(previousValue),
              parseFloat(display),
              operator
            );
            const formattedResult = parseFloat(result.toFixed(10)).toString();
            setDisplay(formattedResult);
            setPreviousValue(null);
            setOperator(null);
            setWaitingForOperand(true);
          } catch {
            setDisplay("Error");
            setPreviousValue(null);
            setOperator(null);
            setWaitingForOperand(true);
          }
        }
        return;
      }
    },
    [display, operator, previousValue, waitingForOperand, calculate, playSound]
  );

  // Format display for better readability
  const formatDisplay = (value: string) => {
    if (value === "Error") return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (value.endsWith(".")) return value;
    if (value.includes(".") && value.split(".")[1]?.length > 8) {
      return parseFloat(num.toFixed(8)).toString();
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/40">
        {/* Display */}
        <div
          className={cn(
            "bg-background rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 min-h-[100px] sm:min-h-[120px] flex flex-col justify-end items-end",
            "border border-border/50"
          )}
        >
          {/* Previous operation indicator */}
          <AnimatePresence mode="wait">
            {previousValue && operator && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-muted-foreground text-sm sm:text-base mb-2"
              >
                {previousValue} {operator}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            key={display}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className={cn(
              "font-mono font-semibold tracking-tight text-right w-full truncate",
              isError ? "text-destructive" : "text-foreground",
              display.length > 12
                ? "text-2xl sm:text-3xl"
                : display.length > 8
                  ? "text-3xl sm:text-4xl"
                  : "text-4xl sm:text-5xl"
            )}
          >
            {formatDisplay(display)}
          </motion.div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {buttons.map((button) => (
            <CalculatorButton
              key={button.value}
              value={button.value}
              variant={button.variant}
              onClick={handleButtonClick}
              span={button.span}
            />
          ))}
        </div>

        {/* Sound indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-muted-foreground text-xs sm:text-sm">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <span>Sound enabled</span>
        </div>
      </div>
    </motion.div>
  );
}
