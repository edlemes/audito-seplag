interface NpsScaleProps {
  value: number;
  onChange: (v: number) => void;
}

const NpsScale = ({ value, onChange }: NpsScaleProps) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>Nada provável</span>
      <span>Extremamente provável</span>
    </div>
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex-1 rounded-md py-2 text-xs font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            value === n
              ? n <= 6
                ? "bg-destructive text-destructive-foreground shadow-md"
                : n <= 8
                ? "bg-amber-500 text-white shadow-md"
                : "bg-emerald-500 text-white shadow-md"
              : "bg-muted hover:bg-muted-foreground/10"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

export default NpsScale;
