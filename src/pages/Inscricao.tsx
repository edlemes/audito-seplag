import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarDays, Clock, MapPin, Users, CheckCircle2, Sparkles,
  BookOpen, Handshake, TrendingUp, ArrowRight, Loader2, ArrowLeft,
  UserCheck, Briefcase, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(200),
  email: z.string().email("E-mail inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  orgao: z.string().min(2, "Informe o órgão").max(200),
  cargo: z.string().min(2, "Informe o cargo").max(200),
});

type FormData = z.infer<typeof schema>;

const reveal = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const eventInfo = [
  { icon: CalendarDays, label: "Data", value: "A definir", color: "text-primary" },
  { icon: Clock, label: "Horário", value: "08h – 17h", color: "text-primary" },
  { icon: MapPin, label: "Local", value: "Auditório Antônio Mendes – CPA, Cuiabá", color: "text-primary" },
  { icon: Users, label: "Vagas", value: "200 participantes", color: "text-primary" },
];

const benefits = [
  { icon: Handshake, title: "Networking", desc: "Conexão com servidores e gestores de diferentes secretarias" },
  { icon: BookOpen, title: "Conhecimento Prático", desc: "Conteúdo aplicável ao dia a dia da gestão pública" },
  { icon: TrendingUp, title: "Atualização Profissional", desc: "Tendências e boas práticas em inovação governamental" },
];

const audience = [
  { icon: UserCheck, title: "Servidores Públicos", desc: "Profissionais do executivo estadual" },
  { icon: Briefcase, title: "Gestores", desc: "Líderes de equipes e coordenadores" },
  { icon: Building2, title: "Analistas", desc: "Técnicos de planejamento e gestão" },
];

const Inscricao = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });

  const fields = watch();
  const filledCount = Object.keys(dirtyFields).length;
  const progress = Math.min((filledCount / 5) * 100, 100);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { error } = await supabase.from("inscricoes_evento").insert({
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      telefone: data.telefone.replace(/\D/g, ""),
      orgao: data.orgao.trim(),
      cargo: data.cargo.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error("Erro ao realizar inscrição. Tente novamente.");
      return;
    }
    setSubmitted(true);
    toast.success("Inscrição realizada com sucesso!");
  };

  const fieldStatus = (name: keyof FormData) => {
    if (errors[name]) return "ring-2 ring-destructive/40 border-destructive";
    if (dirtyFields[name] && !errors[name]) return "ring-2 ring-emerald-400/40 border-emerald-500";
    return "";
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-md text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Inscrição Confirmada!</h2>
            <p className="mb-6 text-muted-foreground">
              Sua vaga foi garantida. Você receberá um e-mail com as informações do evento.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Voltar ao Portal
                </Button>
              </Link>
              <Button onClick={() => { setSubmitted(false); }} variant="secondary">
                Nova Inscrição
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#004587] py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-[#004587] via-[#003366] to-[#1a1a3e]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <motion.div
            className="container relative z-10 mx-auto max-w-4xl px-4 text-center"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={reveal} transition={{ duration: 0.6 }}>
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> Inscrições Abertas
              </span>
            </motion.div>
            <motion.h1
              variants={reveal}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl"
              style={{ lineHeight: "1.1" }}
            >
              Inscrições Abertas –{" "}
              <span className="text-[#66B2FF]">Auditório Antônio Mendes</span>
            </motion.h1>
            <motion.p
              variants={reveal}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mx-auto mb-8 max-w-2xl text-base text-white/70 md:text-lg"
            >
              Participe de um encontro estratégico para inovação e gestão pública
            </motion.p>
            <motion.div variants={reveal} transition={{ duration: 0.6, delay: 0.24 }}>
              <Button
                size="lg"
                onClick={scrollToForm}
                className="gap-2 rounded-xl bg-[#66B2FF] px-8 py-3 text-base font-bold text-[#003366] shadow-lg shadow-[#66B2FF]/20 transition-all hover:bg-[#99CCFF] hover:shadow-xl active:scale-[0.97]"
              >
                Garantir minha vaga <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* EVENT INFO */}
        <motion.section
          className="bg-background py-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto max-w-5xl px-4">
            <motion.h2 variants={reveal} transition={{ duration: 0.5 }} className="mb-8 text-center text-2xl font-bold text-foreground">
              Informações do Evento
            </motion.h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {eventInfo.map(({ icon: Icon, label, value, color }) => (
                <motion.div
                  key={label}
                  variants={reveal}
                  transition={{ duration: 0.5 }}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <Icon className={`mb-3 h-7 w-7 ${color}`} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ABOUT */}
        <motion.section
          className="bg-muted/40 py-16"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Sobre o Evento</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Encontro Estratégico do Auditório SEPLAG reúne servidores, gestores e especialistas
              para debater soluções de inovação na administração pública. Com palestras, painéis e
              workshops, o evento promove a troca de experiências e o desenvolvimento de competências
              essenciais para a modernização do serviço público em Mato Grosso.
            </p>
          </div>
        </motion.section>

        {/* BENEFITS */}
        <motion.section
          className="bg-background py-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto max-w-5xl px-4">
            <motion.h2 variants={reveal} transition={{ duration: 0.5 }} className="mb-8 text-center text-2xl font-bold text-foreground">
              Benefícios
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={reveal} transition={{ duration: 0.5 }} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AUDIENCE */}
        <motion.section
          className="bg-muted/40 py-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto max-w-5xl px-4">
            <motion.h2 variants={reveal} transition={{ duration: 0.5 }} className="mb-8 text-center text-2xl font-bold text-foreground">
              Público-Alvo
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-3">
              {audience.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={reveal} transition={{ duration: 0.5 }} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FORM */}
        <motion.section
          ref={formRef}
          className="bg-background py-16"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto max-w-xl px-4">
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Formulário de Inscrição</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">Preencha seus dados para garantir sua vaga</p>

            <div className="mb-6">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div>
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" placeholder="Seu nome" className={`mt-1 ${fieldStatus("nome")}`} {...register("nome")} />
                {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" placeholder="seu@email.gov.br" className={`mt-1 ${fieldStatus("email")}`} {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(65) 99999-0000"
                  className={`mt-1 ${fieldStatus("telefone")}`}
                  {...register("telefone")}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    setValue("telefone", masked, { shouldValidate: true, shouldDirty: true });
                  }}
                />
                {errors.telefone && <p className="mt-1 text-xs text-destructive">{errors.telefone.message}</p>}
              </div>
              <div>
                <Label htmlFor="orgao">Órgão *</Label>
                <Input id="orgao" placeholder="SEPLAG, SEFAZ, etc." className={`mt-1 ${fieldStatus("orgao")}`} {...register("orgao")} />
                {errors.orgao && <p className="mt-1 text-xs text-destructive">{errors.orgao.message}</p>}
              </div>
              <div>
                <Label htmlFor="cargo">Cargo *</Label>
                <Input id="cargo" placeholder="Analista, Gestor, etc." className={`mt-1 ${fieldStatus("cargo")}`} {...register("cargo")} />
                {errors.cargo && <p className="mt-1 text-xs text-destructive">{errors.cargo.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 rounded-xl bg-[#004587] py-3 text-base font-bold shadow-lg transition-all hover:bg-[#003366] active:scale-[0.97]"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</>
                ) : (
                  <>Confirmar Inscrição <ArrowRight className="h-5 w-5" /></>
                )}
              </Button>
            </form>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Inscricao;
