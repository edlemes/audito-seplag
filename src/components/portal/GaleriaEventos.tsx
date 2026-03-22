import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90"
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

      {/* Lightbox Dialog */}
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] border-none bg-black/90 p-0 sm:rounded-2xl overflow-hidden [&>button]:text-white [&>button]:hover:bg-white/20">
          <VisuallyHidden>
            <DialogTitle>Visualizar foto</DialogTitle>
          </VisuallyHidden>

          {selected !== null && (
            <div className="relative flex items-center justify-center">
              {/* Nav buttons */}
              {fotos.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                    onClick={() => navigate(-1)}
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                    onClick={() => navigate(1)}
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  className="flex flex-col items-center p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={fotos[selected].imagem_url}
                    alt={fotos[selected].titulo || "Evento"}
                    className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
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
              </AnimatePresence>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GaleriaEventos;
