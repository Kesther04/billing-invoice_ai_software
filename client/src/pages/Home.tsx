import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  RefreshCw,
  BarChart2,
  Check,
  X,
  ArrowUpRight,
  Sparkles,
  Sun,
  Moon,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../shared/themes/ThemeContext";
import { SoftButton } from "../shared/components/Button";
import { t } from "../shared/utils/themeClasses";
import { Link } from "react-router-dom";
import Logo from "../shared/components/Logo";
import hero from "../images/hero4.png";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FeatureCardData {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  gradientDark: string;
  textColor: string;
  accent: string;
  badge: string;
  badgeLabel: string;
  isLight?: boolean;
}

interface FeatureCardProps {
  card: FeatureCardData;
  index: number;
  dark: boolean;
}

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

interface InvoiceLine {
  label: string;
  amount: string;
  status: string;
  statusClass: string;
}

interface CompareRowProps {
  label: string;
  oldVal: string;
  newVal: string;
  delay: number;
  dark: boolean;
}

interface CompareRowData {
  label: string;
  oldVal: string;
  newVal: string;
}

interface StepData {
  num: string;
  title: string;
  desc: string;
  tag: string;
}

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const featureCards: FeatureCardData[] = [
  {
    icon: Zap,
    title: "Instant Smart Billing",
    description:
      "Generate professional invoices in seconds using simple prompts. Just describe the work and AI handles the rest.",
    gradient: "from-emerald-900 to-emerald-800",
    gradientDark: "from-emerald-950 to-emerald-900",
    textColor: "text-emerald-50",
    accent: "bg-emerald-700/60",
    badge: "bg-emerald-600/30 text-emerald-200",
    badgeLabel: "Prompt-Powered",
  },
  {
    icon: RefreshCw,
    title: "Automated Follow-Ups",
    description:
      "Create payment links, track status, and automatically follow up on overdue invoices — without awkward emails.",
    gradient: "from-teal-400 to-emerald-500",
    gradientDark: "from-teal-700 to-emerald-700",
    textColor: "text-white",
    accent: "bg-white/20",
    badge: "bg-white/20 text-white",
    badgeLabel: "Smart Reminders",
  },
  {
    icon: BarChart2,
    title: "Revenue Intelligence",
    description:
      "See your cashflow, pending payments, top clients and revenue trends at a glance — all in one clean dashboard.",
    gradient: "from-slate-100 to-white",
    gradientDark: "from-[#1E2130] to-[#1A1D27]",
    textColor: "text-slate-800",
    accent: "bg-slate-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "AI Insights",
    isLight: true,
  },
];

const invoiceLines: InvoiceLine[] = [
  { label: "Invoice #2041", amount: "$3,200", status: "Paid",    statusClass: "text-emerald-500" },
  { label: "Invoice #2042", amount: "$850",   status: "Pending", statusClass: "text-amber-500"  },
  { label: "Invoice #2043", amount: "$5,600", status: "Sent",    statusClass: "text-sky-400"    },
];

const barHeights = [18, 34, 24, 46, 36, 52, 40];

const benefits: string[] = [
  "Designed for freelancers & agencies",
  "No complex accounting software",
  "AI-powered billing workflow",
  "Multi-client & multi-tenant ready",
  "Simple. Fast. Revenue-focused.",
  "Zero setup — start in minutes",
];

const compareRows: CompareRowData[] = [
  { label: "Billing",     oldVal: "Manual invoices",   newVal: "Prompt-based billing"    },
  { label: "Follow-ups",  oldVal: "Manual reminders",  newVal: "Automated AI follow-ups" },
  { label: "Insights",    oldVal: "No revenue insight", newVal: "Real-time intelligence"  },
  { label: "Setup",       oldVal: "Hours of config",    newVal: "Live in minutes"         },
  { label: "Focus",       oldVal: "Software-first",     newVal: "Revenue-first"           },
];

const steps: StepData[] = [
  {
    num: "01",
    title: "Describe the Work",
    desc: "Type a natural-language prompt. No forms, no fields — just describe the work and let AI do the rest.",
    tag: "⚡ Prompt-based input",
  },
  {
    num: "02",
    title: "AI Builds the Invoice",
    desc: "TraqBill parses your prompt and instantly generates a branded, ready-to-send invoice — itemized, dated, and professional.",
    tag: "✦ AI-generated in seconds",
  },
  {
    num: "03",
    title: "Send & Auto-Follow Up",
    desc: "Invoice goes out instantly. TraqBill tracks opens, monitors due dates, and sends polite automated reminders.",
    tag: "🔄 Zero manual follow-up",
  },
  {
    num: "04",
    title: "Track Revenue in Real Time",
    desc: "Watch payments land on your live dashboard. See cashflow trends, outstanding balances and top clients.",
    tag: "📊 Live revenue intelligence",
  },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function ThemeToggle({ dark, onToggle }: ThemeToggleProps): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className={`relative flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        dark
          ? "bg-slate-700 focus:ring-offset-[#0F1117]"
          : "bg-slate-200 focus:ring-offset-[#F3F5F7]"
      }`}
    >
      <Sun
        className={`absolute left-1.5 h-4 w-4 transition-opacity duration-200 ${
          dark ? "opacity-30 text-slate-400" : "opacity-100 text-amber-500"
        }`}
      />
      <Moon
        className={`absolute right-1.5 h-4 w-4 transition-opacity duration-200 ${
          dark ? "opacity-100 text-slate-200" : "opacity-30 text-slate-400"
        }`}
      />
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`h-6 w-6 rounded-full shadow-md ${dark ? "bg-slate-200 ml-auto" : "bg-white ml-0"}`}
      />
    </button>
  );
}

function InvoicePromptWidget({ dark }: { dark: boolean }): React.ReactElement {
  return (
    <div
      className={`rounded-2xl ring-1 shadow-lg overflow-hidden ${
        dark
          ? "bg-white/7 ring-white/12 backdrop-blur-2xl"
          : "bg-white/10 ring-white/18 backdrop-blur-2xl"
      }`}
    >
      {/* Prompt bar */}
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          dark ? "border-white/8 bg-white/4" : "border-white/10 bg-white/5"
        }`}
      >
        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">AI Prompt</span>
        <motion.span
          className="ml-1 text-xs text-white/60 flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          "Invoice Acme Corp $3,200 for design work — net 14"
        </motion.span>
        <motion.span
          className="ml-0.5 inline-block h-3.5 w-0.5 bg-emerald-400"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </div>

      {/* Invoice rows */}
      <div className="divide-y divide-white/6 px-4">
        {invoiceLines.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.18 }}
            className="flex items-center justify-between py-3"
          >
            <span className="text-sm text-white/55">{row.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">{row.amount}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium bg-white/7 border border-white/10 ${row.statusClass}`}
              >
                {row.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex h-16 items-end gap-1.5 border-t border-white/6 px-4 pb-3 pt-2">
        {barHeights.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h }}
            transition={{ delay: 1.2 + i * 0.07, type: "spring" }}
            style={{ height: h }}
            className="flex-1 rounded bg-gradient-to-t from-emerald-500 to-teal-400 opacity-65"
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ card, index, dark }: FeatureCardProps): React.ReactElement {
  const Icon      = card.icon;
  const textColor = card.isLight && dark ? "text-slate-200"          : card.textColor;
  const accentBg  = card.isLight && dark ? "bg-white/10"             : card.accent;
  const badgeCls  = card.isLight && dark ? "bg-emerald-900/60 text-emerald-400" : card.badge;
  const gradient  = dark ? card.gradientDark : card.gradient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${gradient} p-6 shadow-lg`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-10 pointer-events-none" viewBox="0 0 300 300">
        {[60, 100, 140, 180].map((r, i) => (
          <circle key={i} cx="240" cy="60" r={r} fill="none" stroke="currentColor" strokeOpacity="0.4" />
        ))}
      </svg>
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${accentBg} p-2.5 ring-1 ring-white/10`}>
            <Icon className={`h-5 w-5 ${textColor}`} />
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeCls}`}>
            {card.badgeLabel}
          </span>
        </div>
        <h3 className={`text-lg font-semibold leading-snug ${textColor}`}>{card.title}</h3>
        <p className={`text-sm leading-relaxed ${textColor} opacity-80`}>{card.description}</p>
      </div>
    </motion.div>
  );
}

function CompareRow({ label, oldVal, newVal, delay, dark }: CompareRowProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`grid grid-cols-3 gap-2 items-center text-sm py-3 border-b last:border-none ${t.compareRowBorder(dark)}`}
    >
      <span className={`font-medium ${t.textMuted(dark)}`}>{label}</span>
      <div className={`flex items-center gap-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <X className="h-3.5 w-3.5 text-red-400 shrink-0" />
        {oldVal}
      </div>
      <div className="flex items-center gap-2 text-emerald-500 font-medium">
        <Check className="h-3.5 w-3.5 shrink-0" />
        {newVal}
      </div>
    </motion.div>
  );
}

function SectionBadge({ label, dark }: { label: string; dark: boolean }): React.ReactElement {
  return (
    <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${t.badgeBg(dark)}`}>
      <span className={`text-xs font-medium ${t.badgeText(dark)}`}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function HomeLandingPage(): React.ReactElement {
  const { dark, toggleTheme } = useTheme();
  const [currentSection, setCurrentSection] = useState<string>("hero");
  const [activeStep, setActiveStep]         = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  /* Close mobile menu when resizing to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Active nav section */
  useEffect(() => {
    const ids = ["hero", "features", "howitworks", "why"];
    const handleScroll = () => {
      const scrollMid = window.scrollY + window.innerHeight / 2;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMid) setCurrentSection(id);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Auto-cycle steps */
  useEffect(() => {
    const timer = setInterval(() => setActiveStep((s) => (s + 1) % steps.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const navItems = [
    { label: "Home",          id: "hero"       },
    { label: "Features",      id: "features"   },
    { label: "How It Works",  id: "howitworks" },
    { label: "Why Different", id: "why"        },
  ];

  return (
    <motion.div
      className={`min-h-screen w-full transition-colors duration-300 ${t.bg(dark)}`}
      animate={{ backgroundColor: dark ? "#0F1117" : "#F3F5F7" }}
      transition={{ duration: 0.3 }}
    >

      {/* ── NAV ── */}
      <nav className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-colors duration-300 border-b ${t.borderBottom(dark)} ${dark ? "bg-[#0F1117]/80" : "bg-[#F3F5F7]/80"}`}>

        {/* ── Main bar ── */}
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4 md:px-8">
          <Logo collapsed={false} />

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm transition-colors bg-transparent border-none cursor-pointer ${
                  currentSection === item.id
                    ? `font-semibold ${t.text(dark)}`
                    : `${t.textMuted(dark)} ${t.navHover(dark)}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />

            {/* Desktop auth buttons */}
            <div className="hidden gap-2 md:flex">
              <Link to="/auth/login">
                <button className={`rounded-full px-4 py-2 text-sm transition-colors ${t.textSub(dark)} hover:bg-white/10`}>
                  Login
                </button>
              </Link>
              <Link to="/billing/create">
                <SoftButton dark={dark}>Start Free</SoftButton>
              </Link>
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors md:hidden ${
                dark
                  ? "border-white/15 text-white/70 hover:bg-white/8"
                  : "border-black/10 text-black/60 hover:bg-black/5"
              }`}
            >
              {mobileMenuOpen
                ? <X className="h-5 w-5" />
                : <Menu className="h-5 w-5" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="overflow-hidden md:hidden"
        >
          <div className={`flex flex-col gap-1 border-t px-4 pb-5 pt-2 ${t.borderBottom(dark)}`}>

            {/* Nav links */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}  // scrollTo handles both close + scroll
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors border-none cursor-pointer ${
                  currentSection === item.id
                    ? dark
                      ? "bg-white/8 text-white"
                      : "bg-emerald-50 text-emerald-700"
                    : dark
                      ? `${t.textMuted(dark)} hover:bg-white/5`
                      : `${t.textMuted(dark)} hover:bg-black/4`
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Divider */}
            <div className={`my-2 h-px ${dark ? "bg-white/8" : "bg-black/8"}`} />

            {/* Auth buttons */}
            <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <button className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors border-none cursor-pointer ${
                dark ? "text-white/60 hover:bg-white/5" : "text-slate-500 hover:bg-black/4"
              }`}>
                Login
              </button>
            </Link>
            <Link to="/billing/create" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <button className="mt-1 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 border-none cursor-pointer">
                Start Free →
              </button>
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* ══ HERO ══ */}
      <section
        id="hero"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="relative overflow-hidden min-h-screen flex items-center pt-20"
      >
        {/* Base dark overlay */}
        <div className={`absolute inset-0 bg-black/85  pointer-events-none`} />

        {/* Bottom vignette — kills the client data bleed specifically */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Left vignette — protects headline from background content */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />

        {/* Subtle grid lines on top of overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-24 -right-16 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-[360px] h-[360px] rounded-full bg-teal-500/8 blur-[80px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-16 md:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-center">

            {/* Left */}
            <div className="flex flex-col gap-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-300">AI-Powered Revenue Assistant</span>
                </div>

                <h1 className="text-5xl text-left font-bold leading-[1.04] tracking-tight text-white md:text-6xl ">
                  Stop Chasing
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Payments.
                  </span>
                  <br />
                  Start Tracking
                  <br />
                  Revenue.
                </h1>

                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                  Generate invoices with a prompt, automate payment reminders and see exactly how your
                  money flows — all in one simple dashboard.
                </p>
              </motion.div>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link to="/billing/create">
                  <SoftButton variant="accent">
                    Try the Prompt <ArrowUpRight className="ml-1 inline h-4 w-4" />
                  </SoftButton>
                </Link>
                <Link to="/auth/signup">
                  <SoftButton variant="ghost">Sign Up</SoftButton>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-3 gap-5 max-w-xs"
              >
                {[
                  { value: "50K+",   label: "Invoices Sent"   },
                  { value: "$8.4M",  label: "Revenue Tracked" },
                  { value: "12h/mo", label: "Time Saved"      },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="mt-1 text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-5 opacity-50"
              >
                <span className="text-xs text-white/50 tracking-widest uppercase">Trusted By</span>
                <div className="flex gap-4 text-sm font-semibold text-white/40">
                  <span>Contra</span>
                  <span>Indiehackers</span>
                  <span>Toptal</span>
                </div>
              </motion.div>
            </div>

            {/* Right — widgets */}
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <InvoicePromptWidget dark={dark} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="rounded-2xl p-4 bg-emerald-500/12 backdrop-blur-xl border border-emerald-500/20">
                  <div className="text-xs text-emerald-400 mb-1">Overdue recovered</div>
                  <div className="text-2xl font-bold text-white">$12,400</div>
                  <div className="mt-1 text-xs text-emerald-400/80">↑ 18% this month via AI reminders</div>
                </div>
                <div className="rounded-2xl p-4 bg-white/7 backdrop-blur-xl border border-white/10">
                  <div className="text-xs text-white/45 mb-1">Avg. payment time</div>
                  <div className="text-2xl font-bold text-white">4.2 days</div>
                  <div className="mt-1 text-xs text-emerald-400">↓ was 11 days before TraqBill</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-white tracking-widest uppercase">Scroll to explore</span>
          <motion.span
            className="text-white text-lg"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className={`border-t ${t.border(dark)}`}>
        <div className="mx-auto w-full max-w-[1600px] px-6 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <SectionBadge label="Core Features" dark={dark} />
            <h2 className={`text-4xl font-bold tracking-tight leading-[1.07] mt-1 ${t.text(dark)}`}>
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Get Paid — On Time.
              </span>
            </h2>
            <p className={`mt-3 max-w-md text-sm leading-relaxed ${t.textMuted(dark)}`}>
              Three focused tools working together to make sure revenue never slips through the cracks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {featureCards.map((card, i) => (
              <FeatureCard key={i} card={card} index={i} dark={dark} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="howitworks" className={`border-t ${t.border(dark)}`}>
        <div className="mx-auto w-full max-w-[1600px] px-6 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <SectionBadge label="How It Works" dark={dark} />
            <h2 className={`text-4xl font-bold tracking-tight leading-[1.07] mt-1 ${t.text(dark)}`}>
              From Prompt to
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Paid — in Minutes.
              </span>
            </h2>
            <p className={`mt-3 max-w-md text-sm leading-relaxed ${t.textMuted(dark)}`}>
              Four simple steps from writing a prompt to watching revenue land in your account.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-start">
            {/* Steps list */}
            <div className="flex flex-col divide-y divide-emerald-500/10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveStep(i)}
                  className={`flex gap-5 py-6 cursor-pointer transition-opacity ${
                    activeStep === i ? "opacity-100" : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <div className={`text-3xl font-bold w-10 shrink-0 leading-none transition-colors ${
                    activeStep === i ? "text-emerald-500" : t.textMuted(dark)
                  }`}>
                    {step.num}
                  </div>
                  <div>
                    <div className={`text-base font-semibold mb-1.5 ${t.text(dark)}`}>{step.title}</div>
                    <div className={`text-sm leading-relaxed ${t.textMuted(dark)}`}>{step.desc}</div>
                    <span className={`mt-2.5 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      dark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {step.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Preview panel */}
            <div className={`rounded-2xl border p-6 shadow-lg sticky top-24 ${t.card(dark)}`}>
              <div className={`flex items-center gap-3 pb-4 border-b mb-4 ${t.border(dark)}`}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className={`text-xs ${t.textMuted(dark)}`}>
                  Step {activeStep + 1} — {steps[activeStep].title}
                </span>
              </div>

              {activeStep === 0 && (
                <motion.div key="panel-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                  <div className={`border rounded-xl p-4 ${t.border(dark)} ${dark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">✦ AI Prompt</div>
                    <div className={`text-sm ${t.text(dark)}`}>
                      Invoice Acme Corp $3,200 for UI design work — net 14 days
                      <span className="inline-block w-0.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse" />
                    </div>
                  </div>
                  <button className="self-start rounded-full bg-emerald-500 text-white text-xs font-medium px-4 py-2">
                    Generate Invoice →
                  </button>
                  <p className={`text-xs leading-relaxed ${t.textMuted(dark)}`}>
                    TraqBill understands plain English. No forms — just describe the work and let AI do the rest.
                  </p>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div key="panel-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className={`rounded-xl overflow-hidden border ${t.border(dark)}`}>
                    <div className="bg-gradient-to-r from-emerald-900 to-teal-700 p-4 text-white flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm">Acme Corp</div>
                        <div className="text-xs opacity-65 mt-0.5">Invoice #2041 · Due in 14 days</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">$3,200</div>
                        <div className="text-xs opacity-60 mt-0.5">Total Due</div>
                      </div>
                    </div>
                    <div className={`divide-y px-4 ${t.rowDivide(dark)}`}>
                      {[
                        ["UI Design — Homepage", "$1,800"],
                        ["Component Library",    "$900" ],
                        ["Prototype & Handoff",  "$500" ],
                      ].map(([name, amt]) => (
                        <div key={name} className="flex justify-between py-2.5 text-xs">
                          <span className={t.textSub(dark)}>{name}</span>
                          <span className={`font-medium ${t.text(dark)}`}>{amt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className={`text-xs ${t.textMuted(dark)}`}>Branded, itemized & ready to send in seconds ✓</p>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div key="panel-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className={`flex gap-3 items-start p-3 rounded-xl border ${t.border(dark)} ${dark ? "bg-slate-800/40" : "bg-slate-50"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${dark ? "bg-emerald-900/60 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                      🔔
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${t.text(dark)}`}>Automated Reminder Sequence</div>
                      <div className={`text-xs ${t.textMuted(dark)} mt-0.5`}>Invoice #2041 · Acme Corp · $3,200</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { done: true,  label: "✓ Invoice sent — Day 0"       },
                      { done: true,  label: "✓ Viewed by client — Day 2"   },
                      { done: true,  label: "✓ Friendly reminder — Day 12" },
                      { done: false, label: "⏳ Final notice — Day 14"     },
                      { done: false, label: "⏳ Escalation — Day 21"       },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${row.done ? "bg-emerald-500" : t.border(dark)}`} />
                        <span className={`text-xs ${row.done ? t.text(dark) : t.textMuted(dark)} ${row.done ? "font-medium" : ""}`}>
                          {row.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div key="panel-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Total Revenue", value: "$24.8K",   trend: "↑ 22% this month",  color: "text-emerald-500" },
                      { label: "Outstanding",   value: "$6,400",   trend: "2 invoices pending", color: "text-amber-500"  },
                      { label: "Avg. Pay Time", value: "4.2d",     trend: "↓ from 11 days",    color: "text-emerald-500" },
                      { label: "Top Client",    value: "Acme Corp",trend: "$12,400 lifetime",   color: t.textMuted(dark) },
                    ].map((card) => (
                      <div key={card.label} className={`rounded-xl p-3 border ${t.border(dark)} ${dark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                        <div className={`text-xs ${t.textMuted(dark)} mb-1`}>{card.label}</div>
                        <div className={`text-lg font-bold ${t.text(dark)}`}>{card.value}</div>
                        <div className={`text-xs mt-0.5 ${card.color}`}>{card.trend}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {[24, 38, 30, 50, 42].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: h }}
                        transition={{ delay: i * 0.08, type: "spring" }}
                        style={{ height: h }}
                        className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-teal-400 opacity-70"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY DIFFERENT ══ */}
      <section id="why" className={`border-t ${t.border(dark)}`}>
        <div className="mx-auto w-full max-w-[1600px] px-6 py-20 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 items-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <div>
                <SectionBadge label="Why TraqBill" dark={dark} />
                <h2 className={`text-4xl font-bold tracking-tight leading-[1.07] mt-1 ${t.text(dark)}`}>
                  Not Just Invoices.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                    A Revenue System.
                  </span>
                </h2>
                <p className={`mt-3 max-w-sm text-sm leading-relaxed ${t.textMuted(dark)}`}>
                  Built for freelancers, agencies and indie businesses who want to focus on work —
                  with a system that assures cash flow.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {benefits.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-start gap-2 text-sm ${t.textSub(dark)}`}
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl ring-1 overflow-hidden shadow-lg ${t.card(dark)}`}
            >
              <div className={`grid grid-cols-3 gap-2 border-b px-6 py-3 text-xs font-bold uppercase tracking-wider ${t.compareHeader(dark)} ${t.compareHeaderTxt(dark)}`}>
                <span>Workflow</span>
                <span>Traditional Tools</span>
                <span className="text-emerald-500">TraqBill</span>
              </div>
              <div className="px-6 py-2">
                {compareRows.map((row, i) => (
                  <CompareRow
                    key={i}
                    label={row.label}
                    oldVal={row.oldVal}
                    newVal={row.newVal}
                    delay={i * 0.07}
                    dark={dark}
                  />
                ))}
              </div>
              <div className={`border-t p-6 flex items-center justify-between ${t.ctaStrip(dark)}`}>
                <div>
                  <div className={`text-sm font-semibold ${t.text(dark)}`}>Ready to switch?</div>
                  <div className={`text-xs mt-0.5 ${t.textMuted(dark)}`}>No credit card required.</div>
                </div>
                <Link to="/billing/create">
                  <SoftButton variant="accent">
                    Start Free <ArrowUpRight className="ml-1 inline h-4 w-4" />
                  </SoftButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t ${t.border(dark)}`}>
        <div className="mx-auto w-full max-w-[1600px] px-6 py-8 md:px-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className={`flex items-center gap-2 font-bold text-base ${t.text(dark)}`}>
            <span className="text-emerald-500">✦</span> TraqBill
          </div>
          <span className={`text-xs ${t.footerText(dark)}`}>
            © {new Date().getFullYear()} TraqBill, Inc. All rights reserved.
          </span>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className={`text-xs transition-colors ${t.footerText(dark)} hover:text-emerald-500`}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </motion.div>
  );
}