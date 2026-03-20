import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import auditorio1 from "@/assets/auditorio-1.jpg";
import auditorio2 from "@/assets/auditorio-2.jpg";
import auditorio3 from "@/assets/auditorio-3.jpg";

const defaultSlides = [
  { image: auditorio1, title: "Auditório Antônio Mendes", subtitle: "Espaço moderno para eventos institucionais da SEPLAG" },
  { image: auditorio2, title: "Infraestrutura Completa", subtitle: "Equipamentos audiovisuais de última geração" },
  { image: auditorio3, title: "Eventos Profissionais", subtitle: "Capacidade para grandes conferências e reuniões" },
];

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);

  useEffect(() => {
    supabase
      .from("cms_content")
      .select("*")
      .eq("tipo", "carousel")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSlides(
            data.map((d) => ({
              image: d.imagem_url,
              title: d.titulo || "",
              subtitle: d.subtitulo || "",
            }))
          );
        }
      });
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[420px] overflow-hidden md:h-[520px]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/50 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center">
        <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-primary-foreground drop-shadow-lg md:text-5xl">
          {slides[current].title}
        </h2>
        <p className="mb-6 text-lg font-light text-primary-foreground/80 md:text-xl">
          {slides[current].subtitle}
        </p>
        <Link to="/agendamento">
          <Button size="lg" className="gap-2 bg-secondary text-secondary-foreground shadow-xl hover:bg-secondary/90">
            <CalendarPlus className="h-5 w-5" />
            Solicitar Agendamento
          </Button>
        </Link>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/20 p-2 backdrop-blur-sm transition hover:bg-primary-foreground/30">
        <ChevronLeft className="h-6 w-6 text-primary-foreground" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/20 p-2 backdrop-blur-sm transition hover:bg-primary-foreground/30">
        <ChevronRight className="h-6 w-6 text-primary-foreground" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-secondary" : "w-2 bg-primary-foreground/40"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
