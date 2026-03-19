import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 splash-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Neon Title — pure CSS glow */}
      <h1 className="splash-title text-3xl font-extrabold tracking-wider md:text-5xl lg:text-6xl text-center px-6">
        AUDITÓRIO SEPLAG
        <br />
        ANTÔNIO MENDES
      </h1>

      <div className="splash-line" />

      <p className="text-sm tracking-widest text-blue-200/50">
        SEPLAG Agenda Fácil — Mato Grosso
      </p>
    </motion.div>
  );
};

const SplashWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem("splash_shown")) return false;
    return true;
  });

  const handleComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleComplete} />}
      </AnimatePresence>
      {children}
    </>
  );
};

export default SplashWrapper;
