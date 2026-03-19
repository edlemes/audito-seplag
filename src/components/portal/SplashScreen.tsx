import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import logoSeplag from "@/assets/logoseplag.png";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [text, setText] = useState("");
  const [splashName, setSplashName] = useState("AUDITÓRIO SEPLAG ANTÔNIO MENDES");
  const [splashLogo, setSplashLogo] = useState<string>(logoSeplag);

  // Load CMS overrides
  useEffect(() => {
    supabase
      .from("cms_content")
      .select("*")
      .in("tipo", ["splash_nome", "logo"])
      .eq("ativo", true)
      .then(({ data }) => {
        if (data) {
          const nome = data.find((d) => d.tipo === "splash_nome");
          const logo = data.find((d) => d.tipo === "logo");
          if (nome?.titulo) setSplashName(nome.titulo);
          if (logo?.imagem_url) setSplashLogo(logo.imagem_url);
        }
      });
  }, []);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(splashName.slice(0, i + 1));
      i++;
      if (i >= splashName.length) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [onComplete, splashName]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-[hsl(212,100%,10%)] via-[hsl(212,100%,20%)] to-[hsl(212,80%,32%)]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400/10"
            style={{
              width: 100 + i * 60,
              height: 100 + i * 60,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Neon Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative text-center"
      >
        <h1
          className="neon-text text-3xl font-extrabold tracking-wider md:text-5xl"
          style={{
            color: "#fff",
            textShadow:
              "0 0 7px hsl(212 100% 60%), 0 0 20px hsl(212 100% 50%), 0 0 42px hsl(212 100% 40%), 0 0 80px hsl(212 100% 30%)",
          }}
        >
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="ml-0.5 inline-block w-[3px] bg-blue-300 align-middle"
            style={{ height: "1.1em", boxShadow: "0 0 8px hsl(212 100% 70%)" }}
          />
        </h1>

        {/* Neon underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="mx-auto mt-3 h-[2px] w-3/4 origin-left"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(212 100% 60%), transparent)",
            boxShadow: "0 0 12px hsl(212 100% 50%)",
          }}
        />
      </motion.div>

      {/* Logo below */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <img
          src={splashLogo}
          alt="SEPLAG Logo"
          className="h-28 w-auto object-contain drop-shadow-2xl md:h-36"
          style={{ filter: "drop-shadow(0 0 15px hsl(212 100% 50% / 0.4))" }}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8 }}
        className="text-sm tracking-widest text-blue-200/60"
      >
        SEPLAG Agenda Fácil — Mato Grosso
      </motion.p>
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
