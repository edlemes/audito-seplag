import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Noticia {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string;
  data_publicacao: string;
}

const NoticiasSection = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    supabase
      .from("noticias")
      .select("*")
      .eq("ativo", true)
      .order("data_publicacao", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setNoticias(data);
      });
  }, []);

  if (noticias.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <h2 className="text-center text-3xl font-bold text-foreground">
            Últimos Eventos
          </h2>
        </div>
        <p className="mb-10 text-center text-muted-foreground">
          Confira os eventos e notícias mais recentes do auditório
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="glass-card group overflow-hidden rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={noticia.imagem_url}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {format(new Date(noticia.data_publicacao), "dd MMM yyyy", { locale: ptBR })}
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2">
                  {noticia.titulo}
                </h3>
                {noticia.descricao && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {noticia.descricao}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NoticiasSection;
