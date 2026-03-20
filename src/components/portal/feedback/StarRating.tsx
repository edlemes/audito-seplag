import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}

const StarRating = ({ value, onChange, size = "md" }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  const dim = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="rounded-sm p-0.5 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={`${dim} transition-colors duration-150 ${
              star <= (hover || value)
                ? "fill-primary text-primary"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
