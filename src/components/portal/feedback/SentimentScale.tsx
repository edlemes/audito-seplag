import { motion } from "framer-motion";

interface SentimentScaleProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
}

const labels = ["Insatisfatório", "Ruim", "Regular", "Bom", "Muito Bom", "Excelente"];

const SentimentScale = ({ value, onChange, label }: SentimentScaleProps) => {
  const filled = value > 0 ? (value / 5) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {value > 0 && (
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-primary"
          >
            {labels[value]}
          </motion.span>
        )}
      </div>

      {/* Track */}
      <div className="relative">
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            initial={false}
            animate={{ width: `${filled}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Buttons */}
        <div className="absolute inset-0 flex items-center justify-between -top-1.5">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="group relative flex flex-col items-center focus-visible:outline-none"
            >
              <motion.div
                className={`h-5 w-5 rounded-full border-2 transition-colors ${
                  n <= value && value > 0
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30 bg-background hover:border-primary/50"
                }`}
                whileTap={{ scale: 0.9 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom labels */}
      <div className="flex justify-between px-0.5">
        {labels.map((lbl, i) => (
          <span
            key={lbl}
            className={`text-[10px] leading-tight text-center transition-all duration-200 max-w-[3.5rem] ${
              value === i
                ? "font-bold text-primary"
                : "font-normal text-muted-foreground/50"
            }`}
          >
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SentimentScale;
