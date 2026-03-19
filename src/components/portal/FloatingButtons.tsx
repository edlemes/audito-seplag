import { useState } from "react";
import { MessageCircle, Accessibility, Plus, Minus, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "556596886670";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20audit%C3%B3rio.`;

const FloatingButtons = () => {
  const [a11yOpen, setA11yOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  const changeFontSize = (delta: number) => {
    const next = Math.max(80, Math.min(150, fontSize + delta));
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}%`;
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle("high-contrast");
  };

  return (
    <>
      {/* Accessibility - bottom left */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        <AnimatePresence>
          {a11yOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mb-2 flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-lg"
            >
              <p className="text-xs font-semibold text-foreground">Acessibilidade</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeFontSize(-10)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground"
                  aria-label="Diminuir fonte"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3ch] text-center text-xs text-muted-foreground">{fontSize}%</span>
                <button
                  onClick={() => changeFontSize(10)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground"
                  aria-label="Aumentar fonte"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={toggleContrast}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  highContrast
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Alto Contraste
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setA11yOpen(!a11yOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
          aria-label="Menu de acessibilidade"
        >
          {a11yOpen ? <X className="h-5 w-5" /> : <Accessibility className="h-5 w-5" />}
        </button>
      </div>

      {/* WhatsApp - bottom right */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#20bd5a]"
        aria-label="Contato pelo WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
};

export default FloatingButtons;
