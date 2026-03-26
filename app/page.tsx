import { Calculator } from "@/components/calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Sound Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Click buttons to hear satisfying sounds
        </p>
      </div>
      <Calculator />
      <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-calc-number" />
          <span className="text-muted-foreground">Numbers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-calc-operator" />
          <span className="text-muted-foreground">Operators</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-calc-function" />
          <span className="text-muted-foreground">Functions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-calc-equals" />
          <span className="text-muted-foreground">Equals</span>
        </div>
      </div>
    </main>
  );
}
