import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Shield,
  Clock,
  MapPin,
  Menu,
  X,
  Phone,
  Send,
  CheckCircle,
  Loader2,
  ChevronDown,
  Cpu,
  Building2,
  BedDouble,
  Users,
  HeartHandshake,
  Lightbulb,
  Mail,
  MessageCircle,
} from "lucide-react";
import { lerGclid } from "./gclid";

/* ─── Assets: local images from /public/img/ ─── */
const AMHEMED_LOGO = "/img/amhemed-logo.webp";
const AMHEMED_ICON = "/img/amhemed-icon.webp";
const NOVA_VIDA_LOGO = "/img/nova-vida-logo.png";
const HERO_BG = "/img/hero-bg.webp";

/* Unit images */
const UNIT_IMAGES = {
  hospital: "/img/hospital-amhemed.webp",
  infantil: "/img/centro-clinico-infantil.webp",
  lab: "/img/lab-coleta.webp",
  terapias: "/img/centro-terapias.webp",
  especialidades: "/img/centro-especialidades.webp",
  clinico: "/img/centro-clinico.webp",
  zonaNorte: "/img/clinica-zona-norte.webp",
};

const WHATSAPP_LINK =
  "https://wa.me/5515997250726?text=Olá! Gostaria de uma cotação do Plano de Saúde Amhemed Empresarial em Sorocaba.";
const WEBHOOK_URL = "https://hook.us1.make.com/2tbq5ddhp1fn3kn4frjgdkabgvxti6vw";
const REDIRECT_URL = "https://planosdesaudeinterior.com.br/obrigado";

/* ================================================================
   CONTACT FORM
   ================================================================ */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function scrollToForm(e: React.MouseEvent) {
  e.preventDefault();
  const isMobile = window.innerWidth < 1024;
  const target = document.getElementById(isMobile ? "contato-mobile" : "contato");
  if (target) target.scrollIntoView({ behavior: "smooth" });
}

function ContactForm() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cnpj: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 11) return;
    setForm((prev) => ({ ...prev, telefone: formatPhone(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        cnpj_mei: form.cnpj || "Não informado",
        origem: "Landing Page Amhemed Sorocaba",
        gclid: lerGclid(),
      });
      await fetch(WEBHOOK_URL, { method: "POST", body: params, mode: "no-cors" });
    } catch {
      /* fire-and-forget */
    }
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8 border border-border text-center">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-lg text-foreground mb-2">Recebemos seu contato!</h3>
        <p className="text-muted-foreground text-sm mb-1">Um consultor especializado entrará em contato em breve.</p>
        <p className="text-muted-foreground text-xs">Redirecionando em instantes...</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8 border border-border">
      <h3 className="font-display font-bold text-base text-primary text-center mb-0.5 uppercase tracking-wide">
        COTAÇÃO AMHEMED SOROCABA
      </h3>
      <p className="text-muted-foreground text-sm text-center mb-5">
        Preencha e receba sua proposta personalizada
      </p>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nome completo</label>
          <input
            type="text"
            required
            placeholder="Seu nome"
            value={form.nome}
            onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">WhatsApp</label>
          <input
            type="tel"
            required
            placeholder="(15) XXXXX-XXXX"
            value={form.telefone}
            onChange={handlePhoneChange}
            maxLength={15}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">E-mail</label>
          <input
            type="email"
            required
            placeholder="voce@exemplo.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Possui CNPJ ou MEI?</label>
          <div className="grid grid-cols-2 gap-3">
            {["Sim", "Não"].map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setForm((prev) => ({ ...prev, cnpj: opt }))}
                className={`rounded-lg border py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  form.cnpj === opt
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-input bg-background text-foreground hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-cta text-white py-3 rounded-lg font-display font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? "Enviando..." : "Quero minha cotação"}
        </button>
      </form>
    </div>
  );
}

/* ================================================================
   HEADER
   ================================================================ */
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src={AMHEMED_LOGO} alt="Amhemed - Plano de Saúde Empresarial Sorocaba" className="h-12 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground">
          <a href="#vantagens" className="hover:text-turq transition-colors">Vantagens</a>
          <a href="#valores" className="hover:text-turq transition-colors">Valores</a>
          <a href="#estrutura" className="hover:text-turq transition-colors">Estrutura</a>
          <a href="#duvidas" className="hover:text-turq transition-colors">Dúvidas</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 gradient-cta text-white px-5 py-2.5 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            <Phone className="w-4 h-4" />
            Falar com Consultor
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground cursor-pointer" aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <a href="#vantagens" onClick={() => setOpen(false)} className="block text-sm font-medium">Vantagens</a>
          <a href="#valores" onClick={() => setOpen(false)} className="block text-sm font-medium">Valores</a>
          <a href="#estrutura" onClick={() => setOpen(false)} className="block text-sm font-medium">Estrutura</a>
          <a href="#duvidas" onClick={() => setOpen(false)} className="block text-sm font-medium">Dúvidas</a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 gradient-cta text-white px-5 py-2.5 rounded-lg font-semibold text-sm w-full"
          >
            <Phone className="w-4 h-4" /> Falar com Consultor
          </a>
        </div>
      )}
    </header>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */
function HeroSection() {
  return (
    <section className="relative overflow-hidden" id="hero">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Hospital Amhemed em Sorocaba" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15">
              <MapPin className="w-3.5 h-3.5" />
              Plano de Saúde em Sorocaba e Região
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.7rem] text-white leading-[1.15]">
              Plano de Saúde Amhemed:
              <br />
              <span className="text-turq">Qualidade e Economia</span>
              <br />
              para Você e Sua Empresa
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
              Descubra o plano de saúde empresarial com{" "}
              <strong className="text-white">hospital próprio em Sorocaba</strong>, equipe especializada e o melhor
              custo-benefício da região para sua empresa.
            </p>
            <a
              href="#contato"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 gradient-cta text-white px-7 py-3.5 rounded-xl font-display font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
            >
              Solicitar Cotação Gratuita
              <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Heart, value: "90+", label: "Leitos" },
                { icon: Shield, value: "250+", label: "Profissionais" },
                { icon: Clock, value: "24h", label: "Pronto-Socorro" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-turq" />
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-xl leading-none">{stat.value}</p>
                    <p className="text-white/60 text-xs">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block" id="contato">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   MOBILE CONTACT CTA
   ================================================================ */
function MobileContactCTA() {
  return (
    <section className="lg:hidden py-12 bg-background px-4" id="contato-mobile">
      <ContactForm />
    </section>
  );
}

/* ================================================================
   DIFERENCIAIS
   ================================================================ */
const diferenciais = [
  { icon: Cpu, title: "Tecnologia de Ponta", desc: "Equipamentos modernos que garantem diagnósticos precisos e tratamentos eficientes no plano de saúde Amhemed." },
  { icon: Building2, title: "Infraestrutura Completa", desc: "Hospital próprio em Sorocaba com centro cirúrgico de alta complexidade e ambiente acolhedor." },
  { icon: Clock, title: "Pronto-Socorro 24 Horas", desc: "Emergência adulta e pediátrica disponível todos os dias, a qualquer hora, para beneficiários Amhemed." },
  { icon: BedDouble, title: "Capacidade Hospitalar", desc: "Mais de 90 leitos disponíveis para internações, garantindo agilidade no atendimento empresarial." },
  { icon: Users, title: "Equipe Multidisciplinar", desc: "Mais de 250 profissionais de saúde credenciados em diversas especialidades em Sorocaba e região." },
  { icon: HeartHandshake, title: "Cuidado Especial Sênior", desc: "Programas dedicados ao bem-estar da melhor idade com acompanhamento personalizado no plano Amhemed." },
];

function Diferenciais() {
  return (
    <section id="vantagens" className="py-14 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <span className="block text-center text-xs font-semibold text-turq uppercase tracking-widest mb-3 bg-accent/10 w-fit mx-auto px-3 py-1 rounded-full">
          Vantagens Amhemed
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground text-center mb-2">
          Plano de Saúde Amhemed Empresarial: <span className="text-turq">Seus Diferenciais</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 text-sm">
          O Amhemed PME oferece estrutura hospitalar própria em Sorocaba, com atendimento humanizado e tecnologia
          avançada para empresas de todos os portes.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {diferenciais.map((item) => (
            <div key={item.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-turq" />
              </div>
              <h3 className="font-display font-bold text-base text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   TABELA DE PREÇOS
   ================================================================ */
const amhePlus = [
  { faixa: "00 a 18 anos", valor: "R$ 125,04" },
  { faixa: "19 a 23 anos", valor: "R$ 168,20" },
  { faixa: "24 a 28 anos", valor: "R$ 198,00" },
  { faixa: "29 a 33 anos", valor: "R$ 198,00" },
  { faixa: "34 a 38 anos", valor: "R$ 198,00" },
  { faixa: "39 a 43 anos", valor: "R$ 236,59" },
  { faixa: "44 a 48 anos", valor: "R$ 304,92" },
  { faixa: "49 a 53 anos", valor: "R$ 381,88" },
  { faixa: "54 a 58 anos", valor: "R$ 518,76" },
  { faixa: "59 ou mais", valor: "R$ 728,90" },
];

const amheLight = [
  { faixa: "00 a 18 anos", valor: "R$ 199,99" },
  { faixa: "19 a 23 anos", valor: "R$ 245,52" },
  { faixa: "24 a 28 anos", valor: "R$ 263,89" },
  { faixa: "29 a 33 anos", valor: "R$ 285,74" },
  { faixa: "34 a 38 anos", valor: "R$ 309,93" },
  { faixa: "39 a 43 anos", valor: "R$ 330,22" },
  { faixa: "44 a 48 anos", valor: "R$ 446,33" },
  { faixa: "49 a 53 anos", valor: "R$ 493,90" },
  { faixa: "54 a 58 anos", valor: "R$ 637,23" },
  { faixa: "59 ou mais", valor: "R$ 978,84" },
];

function TabelaPrecos() {
  return (
    <section id="valores" className="py-14 lg:py-20 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <span className="block text-center text-xs font-semibold text-turq uppercase tracking-widest mb-3 bg-accent/10 w-fit mx-auto px-3 py-1 rounded-full">
          Valores Amhemed
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground text-center mb-2">
          Tabela de Preços do Plano de Saúde Amhemed em Sorocaba
        </h2>
        <p className="text-muted-foreground text-center mb-10 text-sm">
          Planos Amhemed PME e individual com valores acessíveis. Confira os preços por faixa etária e solicite sua
          cotação empresarial.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Amhe+ */}
          <div className="relative bg-card rounded-2xl border-2 border-accent shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 gradient-cta text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              ★ Melhor Custo-Benefício
            </div>
            <div className="gradient-cta px-6 py-5">
              <h3 className="font-display font-bold text-2xl text-white">
                Amhe+ <span className="text-sm font-normal opacity-80">Empresarial</span>
              </h3>
              <p className="text-white/80 text-sm">Exclusivo para CNPJ, MEI e Produtor Rural</p>
            </div>
            <div className="px-6 py-4 space-y-0">
              {amhePlus.map((row) => (
                <div key={row.faixa} className="flex justify-between py-2.5 border-b border-border last:border-0 text-sm">
                  <span className="text-muted-foreground">{row.faixa}</span>
                  <span className="font-semibold text-foreground">{row.valor}</span>
                </div>
              ))}
              <a href="#contato" onClick={scrollToForm} className="block text-center gradient-cta text-white py-3 rounded-lg font-display font-bold text-sm mt-4 hover:opacity-90 transition-opacity shadow-md">
                Solicitar Cotação Empresarial
              </a>
            </div>
          </div>
          {/* Amhe Light */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary px-6 py-5">
              <h3 className="font-display font-bold text-2xl text-primary-foreground">
                Amhe Light <span className="text-sm font-normal opacity-70">Individual</span>
              </h3>
              <p className="text-primary-foreground/70 text-sm">Pessoa Física — sem necessidade de CNPJ</p>
            </div>
            <div className="px-6 py-4 space-y-0">
              {amheLight.map((row) => (
                <div key={row.faixa} className="flex justify-between py-2.5 border-b border-border last:border-0 text-sm">
                  <span className="text-muted-foreground">{row.faixa}</span>
                  <span className="font-semibold text-foreground">{row.valor}</span>
                </div>
              ))}
              <a href="#contato" onClick={scrollToForm} className="block text-center bg-primary text-primary-foreground py-3 rounded-lg font-display font-bold text-sm mt-4 hover:opacity-90 transition-opacity">
                Solicitar Cotação Individual
              </a>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-xs text-center mt-4">
          * Valores do plano de saúde Amhemed sujeitos a análise. Consulte condições para Sorocaba e região.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   UNIDADES
   ================================================================ */
const unidades = [
  { img: UNIT_IMAGES.hospital, nome: "Hospital AmheMed", endereco: "R. Pedro José Senger, 223, Vila Haro - Sorocaba, SP" },
  { img: UNIT_IMAGES.infantil, nome: "Centro Clínico Infantil", endereco: "R. Pedro José Senger, 223, Vila Haro - Sorocaba, SP" },
  { img: UNIT_IMAGES.lab, nome: "Coleta Laboratorial", endereco: "R. Pedro José Senger, 430, Vila Haro - Sorocaba, SP" },
  { img: UNIT_IMAGES.terapias, nome: "Centro de Terapias", endereco: "R. Pedro José Senger, 404, Vila Haro - Sorocaba, SP" },
  { img: UNIT_IMAGES.especialidades, nome: "Centro de Especialidades", endereco: "R. Pedro José Senger, 359, Vila Haro - Sorocaba, SP" },
  { img: UNIT_IMAGES.clinico, nome: "Centro Clínico 1 e 2", endereco: "R. Pedro José Senger, 379 e 421, Vila Haro - Sorocaba, SP" },
  { img: UNIT_IMAGES.zonaNorte, nome: "Clínica e Laboratório Zona Norte", endereco: "Av. Itavuvu, 165, Vila Olímpia - Sorocaba, SP" },
];

function Unidades() {
  return (
    <section id="estrutura" className="py-14 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground text-center mb-2">
          Estrutura do Plano de Saúde <span className="text-turq">Amhemed em Sorocaba</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 text-sm">
          Conheça as unidades próprias que fazem do Amhemed Empresarial a melhor opção de plano de saúde na região de
          Sorocaba.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {unidades.map((u) => (
            <div key={u.nome} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={u.img}
                  alt={`${u.nome} - Plano de Saúde Amhemed Sorocaba`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-sm text-foreground mb-1">{u.nome}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{u.endereco}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   REDE DE COBERTURA
   ================================================================ */
const cidades = [
  { nome: "Sorocaba", destaque: true },
  { nome: "Votorantim" },
  { nome: "Araçoiaba da Serra" },
  { nome: "Boituva" },
  { nome: "Capela do Alto" },
  { nome: "Iperó" },
  { nome: "Itapetininga" },
  { nome: "Itu" },
  { nome: "Porto Feliz" },
  { nome: "Salto" },
  { nome: "Salto de Pirapora" },
  { nome: "São Roque" },
];

function RedeCobertura() {
  return (
    <section id="cobertura" className="py-14 lg:py-20 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <span className="block text-center text-xs font-semibold text-turq uppercase tracking-widest mb-3 bg-accent/10 w-fit mx-auto px-3 py-1 rounded-full">
          Área de Cobertura
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground text-center mb-2">
          Plano de Saúde Amhemed: Cobertura em Sorocaba e Região
        </h2>
        <p className="text-muted-foreground text-center mb-10 text-sm">
          O Amhemed Empresarial e individual atende diversas cidades com rede credenciada de qualidade.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cidades.map((c) => (
            <div
              key={c.nome}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                c.destaque
                  ? "gradient-cta text-white shadow-md"
                  : "bg-card border border-border text-foreground hover:border-accent"
              }`}
            >
              {c.destaque ? <MapPin className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 text-turq shrink-0" />}
              {c.nome}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   EMPRESARIAL SECTION
   ================================================================ */
const empresarialValues = [
  { icon: Heart, title: "Acolhimento", desc: "Cada beneficiário Amhemed recebe atenção personalizada." },
  { icon: Shield, title: "Segurança", desc: "Protocolos rigorosos no plano de saúde empresarial." },
  { icon: Lightbulb, title: "Inovação", desc: "Tecnologia de ponta no atendimento em Sorocaba." },
  { icon: Users, title: "Humanização", desc: "Equipe preparada para cuidar com excelência." },
];

const chips = [
  "Amhemed PME acessível",
  "Rede própria em Sorocaba",
  "Atendimento empresarial dedicado",
  "Urgência e emergência 24h",
];

function Empresarial() {
  return (
    <section id="empresarial" className="py-14 lg:py-20 gradient-dark-section text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight mb-4">
              Amhemed Empresarial: Seu <span className="text-turq">Plano de Saúde em Sorocaba</span> com Atendimento
              Premium
            </h2>
            <p className="text-white/80 text-base mb-4 leading-relaxed">
              O plano de saúde Amhemed combina tecnologia de ponta com atendimento humanizado. Nossa equipe é preparada
              para receber cada paciente com respeito e excelência em Sorocaba e região.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              Instalações modernas e planejadas para uma experiência hospitalar diferenciada. Centro cirúrgico equipado
              para procedimentos de alta complexidade no plano empresarial Amhemed.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {empresarialValues.map((v) => (
              <div key={v.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <v.icon className="w-5 h-5 text-turq mb-3" />
                <h3 className="font-display font-bold text-sm text-white mb-1">{v.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <img
                src={AMHEMED_ICON}
                alt="Amhemed Plano de Saúde Empresarial Sorocaba"
                className="w-16 h-16 object-contain rounded-2xl bg-white p-2 mb-5"
              />
              <h2 className="font-display font-extrabold text-3xl text-white mb-3 leading-tight">
                Proteja Sua Equipe com o Amhemed
              </h2>
              <p className="text-white/70 text-sm mb-5">
                O melhor plano de saúde empresarial em Sorocaba. Valores acessíveis, rede completa e atendimento premium
                para sua empresa.
              </p>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10">
                    <CheckCircle className="w-3.5 h-3.5 text-turq" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 lg:p-8" id="lead-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FAQ
   ================================================================ */
const faqs = [
  {
    q: "Quem pode contratar o plano de saúde Amhemed Empresarial?",
    a: "Empresas com CNPJ ativo, MEI e produtores rurais podem contratar o Amhe+ (empresarial) a partir de 2 vidas. Já o Amhe Light está disponível para pessoa física sem necessidade de CNPJ.",
  },
  {
    q: "O Amhemed oferece carência zero em Sorocaba?",
    a: "Sim! Para planos empresariais Amhemed com 30 ou mais vidas, é possível obter carência zero. Grupos menores devem consultar as condições com nosso corretor.",
  },
  {
    q: "Qual a diferença entre Amhe+ Empresarial e Amhe Light?",
    a: "O Amhe+ é o plano de saúde empresarial da Amhemed, exclusivo para CNPJ/MEI, com mensalidades mais acessíveis. O Amhe Light é voltado para pessoa física, com cobertura individual ou familiar.",
  },
  {
    q: "Como funciona a coparticipação no plano Amhemed?",
    a: "A coparticipação é uma taxa cobrada apenas quando o beneficiário utiliza serviços como consultas e exames. Isso reduz a mensalidade do plano de saúde Amhemed, tornando-o mais acessível para empresas em Sorocaba.",
  },
  {
    q: "O plano de saúde Amhemed cobre maternidade?",
    a: "Sim, o Amhemed inclui cobertura completa para pré-natal, parto e assistência neonatal conforme rol da ANS, em todas as modalidades empresarial e individual.",
  },
  {
    q: "Qual a rede de atendimento do Amhemed em Sorocaba?",
    a: "O Amhemed possui hospital próprio, centros clínicos, laboratório de coleta e centro de especialidades em Sorocaba. Além disso, conta com rede credenciada em Votorantim, Itu, Salto e mais 9 cidades da região.",
  },
  {
    q: "A operadora Amhemed é registrada na ANS?",
    a: "Sim, a Amhemed é uma operadora de planos de saúde devidamente registrada na Agência Nacional de Saúde Suplementar (ANS), garantindo segurança e transparência ao beneficiário.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="duvidas" className="py-14 lg:py-20 bg-background">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground text-center mb-2">
          Dúvidas sobre o Plano de Saúde Amhemed
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Perguntas frequentes sobre o Amhemed Empresarial e individual em Sorocaba e região.
        </p>
        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
              >
                <span className="font-display font-semibold text-sm text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  return (
    <footer className="gradient-hero text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <img src={AMHEMED_LOGO} alt="Amhemed Assistência à Saúde" className="h-14 w-auto mb-4 brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed">
              Operadora de planos de saúde registrada na ANS. Hospital próprio em Sorocaba com mais de 90 leitos e 250+
              profissionais especializados.
            </p>
          </div>
          <div>
            <img src={NOVA_VIDA_LOGO} alt="Nova Vida Corretora de Seguros" className="h-12 w-auto mb-4" />
            <p className="font-display font-semibold text-sm text-white/90 mb-2">Corretora autorizada Amhemed</p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>CNPJ: 07.944.737/0001-01</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Rua Angelo Verrone, 23 - Jd Embaixador - Sorocaba/SP</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-4 uppercase tracking-wider text-white/80">Contato</h4>
            <div className="space-y-3 text-sm text-white/60">
              <a href="tel:1532385050" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>(15) 3238-5050</span>
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>(15) 99725-0726</span>
              </a>
              <a href="mailto:contato@novavidaseguros.com.br" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>contato@novavidaseguros.com.br</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-xs text-white/40 text-center leading-relaxed">
            Site de propriedade da Nova Vida Seguros — Corretora de Seguros e Planos de Saúde — CNPJ 07.944.737/0001-01.
            A Nova Vida Seguros é uma corretora autorizada que comercializa os planos da operadora Amhemed em Sorocaba e
            região. Produtos, preços e condições sujeitos a alterações e análise de elegibilidade. *Carência zero conforme
            regras da ANS e condições contratuais vigentes.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   WHATSAPP FLOAT
   ================================================================ */
function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp sobre Plano Amhemed"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-cta shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

/* ================================================================
   APP
   ================================================================ */
export function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MobileContactCTA />
      <Diferenciais />
      <TabelaPrecos />
      <Unidades />
      <RedeCobertura />
      <Empresarial />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
