import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const fullText = "SEPLAG Agenda Fácil";

  useEffect(() => {
    supabase
      .from("cms_content")
      .select("imagem_url")
      .eq("tipo", "logo")
      .eq("ativo", true)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setLogoUrl(data.imagem_url);
      });
  }, []);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[hsl(212,100%,18%)] via-[hsl(212,100%,26%)] to-[hsl(212,80%,40%)]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-24 w-24 rounded-2xl object-contain drop-shadow-2xl" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary shadow-2xl">
            <Building2 className="h-12 w-12 text-secondary-foreground" />
          </div>
        )}
      </motion.div>

      <div className="text-center">
        <h1 className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="ml-0.5 inline-block w-0.5 bg-white align-middle"
            style={{ height: "1.2em" }}
          />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
          className="mt-2 text-sm text-white/60"
        >
          Portal do Auditório — Mato Grosso
        </motion.p>
      </div>
    </motion.div>
  );
};

const SplashWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
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
