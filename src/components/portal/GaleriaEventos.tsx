import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GaleriaItem {
  id: string;
  titulo: string | null;
  subtitulo: string | null;
  imagem_url: string;
}

const GaleriaEventos = () => {
  const [fotos, setFotos] = useState<GaleriaItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("cms_content")
      .select("id, titulo, subtitulo, imagem_url")
      .eq("tipo", "galeria")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        if (data) setFotos(data);
      });
  }, []);

  if (fotos.length === 0) return null;

  const navigate = (dir: 1 | -1) => {
    if (selected === null) return;
    setSelected((selected + dir + fotos.length) % fotos.length);
  };

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-10 flex items-center justify-center gap-3">
              <Camera className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Galeria de Eventos
              </h2>
            </div>

            <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {fotos.map((foto, i) => (
                <motion.button
                  key={foto.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelected(i)}
                  aria-label={`Ver foto: ${foto.titulo || "Evento"}`}
                >
                  <img
                    src={foto.imagem_url}
                    alt={foto.titulo || "Evento no auditório"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {foto.titulo && (
                    <span className="absolute bottom-3 left-4 right-4 translate-y-2 text-left text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {foto.titulo}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              aria-label="Próxima foto"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              key={selected}
              className="max-h-[85vh] max-w-[90vw]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fotos[selected].imagem_url}
                alt={fotos[selected].titulo || "Evento"}
                className="max-h-[85vh] rounded-xl object-contain shadow-2xl"
              />
              {fotos[selected].titulo && (
                <p className="mt-3 text-center text-sm font-medium text-white/80">
                  {fotos[selected].titulo}
                  {fotos[selected].subtitulo && (
                    <span className="ml-2 font-normal text-white/50">
                      — {fotos[selected].subtitulo}
                    </span>
                  )}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GaleriaEventos;
