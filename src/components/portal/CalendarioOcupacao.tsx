import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Lock, Unlock, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import DATAS_INSTITUCIONAIS, { type DataInstitucional } from "./datasInstitucionais";

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

interface BlockedDate {
  id: string;
  data: string;
  motivo: string;
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
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [blockMotivo, setBlockMotivo] = useState("");
  const [showBlockForm, setShowBlockForm] = useState(false);
  const { user } = useAuth();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = new Date(year, month + 1, 0);
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    Promise.all([
      supabase
        .from("solicitacoes_auditorio")
        .select("id, titulo_evento, data_evento, horario_inicio, horario_fim, nome_solicitante, status, secretaria_atendida")
        .gte("data_evento", startDate)
        .lte("data_evento", endStr)
        .in("status", ["aprovada", "pendente"]),
      supabase
        .from("blocked_dates")
        .select("id, data, motivo")
        .gte("data", startDate)
        .lte("data", endStr),
    ]).then(([evtRes, blkRes]) => {
      setEventos(evtRes.data || []);
      setBlockedDates(blkRes.data || []);
    });
  }, [month, year]);

  // Pre-index events and blocked dates by date string for O(1) lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Evento[]>();
    for (const e of eventos) {
      const existing = map.get(e.data_evento);
      if (existing) existing.push(e);
      else map.set(e.data_evento, [e]);
    }
    return map;
  }, [eventos]);

  const blockedByDate = useMemo(() => {
    const map = new Map<string, BlockedDate>();
    for (const b of blockedDates) map.set(b.data, b);
    return map;
  }, [blockedDates]);

  const prevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getEventsForDay = useCallback((day: number) => eventsByDate.get(formatDateStr(day)) || [], [eventsByDate, year, month]);
  const getBlockedForDay = useCallback((day: number) => blockedByDate.get(formatDateStr(day)), [blockedByDate, year, month]);
  const getInstitucionalForDay = useCallback((day: number): DataInstitucional | undefined => DATAS_INSTITUCIONAIS[formatDateStr(day)], [year, month]);

  const handleDayClick = useCallback((day: number) => {
    setSelectedDay(new Date(year, month, day));
    setShowBlockForm(false);
    setBlockMotivo("");
  }, [year, month]);

  const reloadData = useCallback(() => {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = new Date(year, month + 1, 0);
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
    
    Promise.all([
      supabase.from("solicitacoes_auditorio")
        .select("id, titulo_evento, data_evento, horario_inicio, horario_fim, nome_solicitante, status, secretaria_atendida")
        .gte("data_evento", startDate).lte("data_evento", endStr).in("status", ["aprovada", "pendente"]),
      supabase.from("blocked_dates").select("id, data, motivo").gte("data", startDate).lte("data", endStr),
    ]).then(([evtRes, blkRes]) => {
      setEventos(evtRes.data || []);
      setBlockedDates(blkRes.data || []);
    });
  }, [year, month]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    await supabase.from("solicitacoes_auditorio").update({ status: status as "pendente" | "aprovada" | "recusada" | "cancelada" }).eq("id", id);
    reloadData();
  }, [reloadData]);

  const handleBlockDate = useCallback(async () => {
    if (!selectedDay || !user) return;
    const dateStr = formatDateStr(selectedDay.getDate());
    const { error } = await supabase.from("blocked_dates").insert({
      data: dateStr,
      motivo: blockMotivo.trim() || "Bloqueado pelo administrador",
      created_by: user.id,
    });
    if (error) {
      if (error.code === "23505") toast.error("Esta data já está bloqueada.");
      else toast.error("Erro ao bloquear data.");
      return;
    }
    toast.success("Data bloqueada com sucesso!");
    setShowBlockForm(false);
    setBlockMotivo("");
    reloadData();
  }, [selectedDay, user, blockMotivo, reloadData]);

  const handleUnblockDate = useCallback(async (blockedId: string) => {
    await supabase.from("blocked_dates").delete().eq("id", blockedId);
    toast.success("Data desbloqueada!");
    reloadData();
  }, [reloadData]);

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const cells = useMemo(() => {
    const result = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(<div key={`empty-${i}`} className="h-24 border border-border/30" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvts = getEventsForDay(day);
      const blocked = getBlockedForDay(day);
      const institucional = getInstitucionalForDay(day);
      const isToday = todayStr === new Date(year, month, day).toDateString();

      const cellContent = (
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`relative h-24 cursor-pointer border border-border/30 p-1 transition-colors hover:bg-accent/50 ${
            isToday ? "bg-primary/5 ring-1 ring-primary" : ""
          } ${blocked ? "bg-destructive/10" : ""} ${
            institucional?.tipo === "feriado" ? "bg-muted/40" : ""
          } ${institucional?.tipo === "pagamento" ? "border-l-2 border-l-primary" : ""}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-foreground"}`}>
              {day}
            </span>
            <div className="flex items-center gap-0.5">
              {institucional?.tipo === "pagamento" && <DollarSign className="h-3 w-3 text-primary" />}
              {institucional?.tipo === "feriado" && <Star className="h-3 w-3 text-amber-500" />}
              {blocked && <Lock className="h-3 w-3 text-destructive" />}
            </div>
          </div>
          <div className="mt-0.5 space-y-0.5 overflow-hidden">
            {blocked && (
              <div className="truncate rounded bg-destructive/20 px-1 py-0.5 text-[10px] font-medium text-destructive">
                {blocked.motivo || "Bloqueado"}
              </div>
            )}
            {institucional && (
              <div className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                institucional.tipo === "pagamento" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700 italic"
              }`}>
                {institucional.titulo}
              </div>
            )}
            {!blocked && dayEvts.slice(0, institucional ? 1 : 2).map((e) => (
              <div key={e.id} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${statusColor[e.status] || "bg-muted text-muted-foreground"}`}>
                {e.titulo_evento}
              </div>
            ))}
            {!blocked && dayEvts.length > (institucional ? 1 : 2) && (
              <span className="text-[10px] text-muted-foreground">+{dayEvts.length - (institucional ? 1 : 2)} mais</span>
            )}
          </div>
        </div>
      );

      if (institucional) {
        result.push(
          <Tooltip key={day}>
            <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p className="font-medium">{institucional.titulo}</p>
              <p className="text-muted-foreground">
                {institucional.tipo === "pagamento" ? "📅 Pagamento do Estado" : "🏛️ Feriado"}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      } else {
        result.push(cellContent);
      }
    }
    return result;
  }, [firstDayOfMonth, daysInMonth, getEventsForDay, getBlockedForDay, getInstitucionalForDay, todayStr, year, month, handleDayClick]);

  const dayEvents = useMemo(() => selectedDay ? getEventsForDay(selectedDay.getDate()) : [], [selectedDay, getEventsForDay]);
  const selectedDayBlocked = useMemo(() => selectedDay ? getBlockedForDay(selectedDay.getDate()) : undefined, [selectedDay, getBlockedForDay]);
  const selectedDayInstitucional = useMemo(() => selectedDay ? getInstitucionalForDay(selectedDay.getDate()) : undefined, [selectedDay, getInstitucionalForDay]);

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
      <div className="flex flex-wrap gap-4 border-b border-border px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Aprovada</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Pendente</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-2.5 w-2.5 text-destructive" />
          <span className="text-xs text-muted-foreground">Bloqueado</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-2.5 w-2.5 text-primary" />
          <span className="text-xs text-muted-foreground">Pagamento</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-2.5 w-2.5 text-amber-500" />
          <span className="text-xs text-muted-foreground">Feriado</span>
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

          {selectedDayInstitucional && (
            <div className={`rounded-lg border p-3 ${
              selectedDayInstitucional.tipo === "pagamento" ? "border-primary/30 bg-primary/5" : "border-amber-300/30 bg-amber-50"
            }`}>
              <div className="flex items-center gap-2">
                {selectedDayInstitucional.tipo === "pagamento" ? <DollarSign className="h-4 w-4 text-primary" /> : <Star className="h-4 w-4 text-amber-500" />}
                <div>
                  <p className={`text-sm font-medium ${selectedDayInstitucional.tipo === "pagamento" ? "text-primary" : "text-amber-700"}`}>
                    {selectedDayInstitucional.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDayInstitucional.tipo === "pagamento" ? "Calendário de Pagamento do Estado" : "Feriado / Data Comemorativa"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedDayBlocked && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Data Bloqueada</p>
                    <p className="text-xs text-muted-foreground">{selectedDayBlocked.motivo}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => handleUnblockDate(selectedDayBlocked.id)}>
                    <Unlock className="h-3 w-3" /> Desbloquear
                  </Button>
                )}
              </div>
            </div>
          )}

          {dayEvents.length === 0 && !selectedDayBlocked && !selectedDayInstitucional ? (
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

          {isAdmin && !selectedDayBlocked && (
            <div className="border-t border-border pt-3">
              {showBlockForm ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Motivo do bloqueio</Label>
                    <Input value={blockMotivo} onChange={(e) => setBlockMotivo(e.target.value)} placeholder="Ex: Feriado, Manutenção programada..." />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-8 gap-1 text-xs" onClick={handleBlockDate}>
                      <Lock className="h-3 w-3" /> Confirmar Bloqueio
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowBlockForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="h-8 w-full gap-1 text-xs" onClick={() => setShowBlockForm(true)}>
                  <Lock className="h-3 w-3" /> Bloquear esta data
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarioOcupacao;