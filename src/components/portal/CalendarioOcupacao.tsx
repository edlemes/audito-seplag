import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Evento {
  id: string;
  titulo_evento: string;
  data_evento: string;
  horario_inicio: string;
  horario_fim: string;
  nome_solicitante: string;
  status: string;
  secretaria_atendida: string;
}

interface CalendarioOcupacaoProps {
  isAdmin?: boolean;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const statusColor: Record<string, string> = {
  aprovada: "bg-success text-success-foreground",
  pendente: "bg-warning text-warning-foreground",
  recusada: "bg-destructive text-destructive-foreground",
  cancelada: "bg-muted text-muted-foreground",
};

const statusLabel: Record<string, string> = {
  aprovada: "Aprovada",
  pendente: "Pendente",
  recusada: "Recusada",
  cancelada: "Cancelada",
};

const CalendarioOcupacao = ({ isAdmin = false }: CalendarioOcupacaoProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<Evento[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadEventos();
  }, [month, year]);

  const loadEventos = async () => {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = new Date(year, month + 1, 0);
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    const { data } = await supabase
      .from("solicitacoes_auditorio")
      .select("id, titulo_evento, data_evento, horario_inicio, horario_fim, nome_solicitante, status, secretaria_atendida")
      .gte("data_evento", startDate)
      .lte("data_evento", endStr)
      .in("status", ["aprovada", "pendente"]);

    setEventos(data || []);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day: number): Evento[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return eventos.filter((e) => e.data_evento === dateStr);
  };

  const handleDayClick = (day: number) => {
    const evts = getEventsForDay(day);
    setSelectedDay(new Date(year, month, day));
    setDayEvents(evts);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("solicitacoes_auditorio").update({ status }).eq("id", id);
    loadEventos();
    if (selectedDay) {
      const day = selectedDay.getDate();
      setDayEvents(getEventsForDay(day));
    }
  };

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} className="h-24 border border-border/30" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    cells.push(
      <div
        key={day}
        onClick={() => handleDayClick(day)}
        className={`relative h-24 cursor-pointer border border-border/30 p-1 transition-colors hover:bg-accent/50 ${
          isToday ? "bg-primary/5 ring-1 ring-primary" : ""
        }`}
      >
        <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-foreground"}`}>
          {day}
        </span>
        <div className="mt-0.5 space-y-0.5 overflow-hidden">
          {dayEvents.slice(0, 2).map((e) => (
            <div
              key={e.id}
              className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${statusColor[e.status] || "bg-muted text-muted-foreground"}`}
            >
              {e.titulo_evento}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} mais</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Calendário de Ocupação</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[160px] text-center text-sm font-medium text-foreground">
            {MESES[month]} {year}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 border-b border-border px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Aprovada</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Pendente</span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="border border-border/30 bg-muted/50 py-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {cells}
        </div>
      </div>

      {/* Day detail dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDay?.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </DialogTitle>
          </DialogHeader>
          {dayEvents.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nenhum evento neste dia.</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((e) => (
                <div key={e.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{e.titulo_evento}</p>
                      <p className="text-xs text-muted-foreground">{e.nome_solicitante}</p>
                      <p className="text-xs text-muted-foreground">{e.secretaria_atendida}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[e.status]}`}>
                      {statusLabel[e.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    🕐 {e.horario_inicio} — {e.horario_fim}
                  </p>
                  {isAdmin && e.status === "pendente" && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(e.id, "aprovada")}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => updateStatus(e.id, "recusada")}>
                        Recusar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarioOcupacao;
