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
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../shared/themes/ThemeContext";
import { SoftButton } from "../shared/components/Button";
import { t } from "../shared/utils/themeClasses";
import { Link } from "react-router-dom";
import Logo from "../shared/components/Logo";

interface StatProps {
  label: string;
  value: string;
  dark?: boolean;
}

interface FeatureCardData {
  icon?: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  gradientDark: string;
  textColor: string;
  accent: string;
  badge: string;
  badgeLabel: string;
}

interface FeatureCardProps {
  card: FeatureCardData;
  index: number;
  dark: boolean;
}

/* ─── Theme toggle ─── */
interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

/* ─── Invoice prompt widget ─── */
interface InvoiceLine {
  label: string;
  amount: string;
  status: string;
  color: string;
}

interface CompareRowProps {
  label: string;
  old: string;
  newVal: string;
  delay: number;
  dark: boolean;
}

interface CompareRowData {
  label: string;
  old: string;
  newVal: string;
}

const Stat: React.FC<StatProps> = ({ label, value, dark = false }) => (
  <div className="space-y-1">
    <div className={`text-3xl font-semibold tracking-tight ${t.text(dark)}`}>
      {value}
    </div>
    <div className={`text-sm ${t.textMuted(dark)}`}>{label}</div>
  </div>
);

/* ─── Feature cards ─── */
const featureCards: FeatureCardData[] = [
  {
    icon: Zap,
    title: "Instant Smart Billing",
    description:
      "Generate professional invoices in seconds using simple prompts. Just the description of the work and AI handles the rest.",
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
      "Create payment links, track status, and automatically follow up on overdue invoices, without awkward emails.",
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
      "See your cashflow, pending payments, top clients and revenue trends at a glance, all in one clean dashboard.",
    gradient: "from-slate-100 to-white",
    gradientDark: "from-[#1E2130] to-[#1A1D27]",
    textColor: "text-slate-800",
    accent: "bg-slate-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "AI Insights",
  },
];

function FeatureCard({
  card,
  index,
  dark,
}: FeatureCardProps): React.ReactElement {
  const Icon = card.icon;
  const isLightCard =
    card.gradient.includes("slate-100") || card.gradient.includes("white");
  const textColorFinal =
    isLightCard && dark ? "text-slate-200" : card.textColor;
  const accentFinal = isLightCard && dark ? "bg-white/10" : card.accent;
  const badgeFinal =
    isLightCard && dark ? "bg-emerald-900/60 text-emerald-400" : card.badge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b p-6 shadow-lg ${dark ? card.gradientDark : card.gradient}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 300 300"
      >
        {[60, 100, 140, 180].map((r, i) => (
          <circle
            key={i}
            cx="240"
            cy="60"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
        ))}
      </svg>
      <div className="relative flex flex-col h-full gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full ${accentFinal} p-2.5 ring-1 ring-white/10`}
          >
            {Icon && <Icon className={`h-5 w-5 ${textColorFinal}`} />}
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeFinal}`}
          >
            {card.badgeLabel}
          </span>
        </div>
        <h3 className={`text-lg font-semibold leading-snug ${textColorFinal}`}>
          {card.title}
        </h3>
        <p className={`text-sm leading-relaxed ${textColorFinal} opacity-80`}>
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

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
  const lines: InvoiceLine[] = [
    {
      label: "Invoice #2041",
      amount: "$3,200",
      status: "Paid",
      color: "text-emerald-500",
    },
    {
      label: "Invoice #2042",
      amount: "$850",
      status: "Pending",
      color: "text-amber-500",
    },
    {
      label: "Invoice #2043",
      amount: "$5,600",
      status: "Sent",
      color: "text-sky-400",
    },
  ];

  return (
    <div
      className={`rounded-xl ring-1 shadow-lg overflow-hidden ${t.heroWidget(dark)}`}
    >
      {/* prompt bar */}
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${t.promptBar(dark)}`}
      >
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <span className={`text-xs font-medium ${t.textMuted(dark)}`}>
          AI Prompt
        </span>
        <motion.span
          className={`ml-1 text-xs ${t.textSub(dark)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          "Invoice Acme Corp $3,200 for design work — net 14"
        </motion.span>
        <motion.span
          className="ml-0.5 inline-block h-3.5 w-0.5 bg-emerald-500"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </div>

      {/* rows */}
      <div className={`divide-y px-4 ${t.rowDivide(dark)}`}>
        {lines.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.2 }}
            className="flex items-center justify-between py-3"
          >
            <span className={`text-sm ${t.textSub(dark)}`}>{row.label}</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${t.text(dark)}`}>
                {row.amount}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.color} ${dark ? "bg-white/5" : "bg-slate-50"}`}
              >
                {row.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* bar chart */}
      <div
        className={`flex h-20 items-end gap-2 border-t px-4 pb-3 pt-2 bg-gradient-to-b to-transparent ${t.barChartGrad(dark)} ${t.border(dark)}`}
      >
        {[30, 55, 42, 80, 65, 90, 72].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h * 0.55 }}
            transition={{ delay: 1.2 + i * 0.07, type: "spring" }}
            style={{ height: h * 0.55 }}
            className={`flex-1 rounded-md bg-gradient-to-t ${t.barBar(dark)}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Compare row ─── */
function CompareRow({
  label,
  old: oldVal,
  newVal,
  delay,
  dark,
}: CompareRowProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`grid grid-cols-3 gap-2 items-center text-sm py-3 border-b last:border-none ${t.compareRowBorder(dark)}`}
    >
      <span className={`font-medium ${t.textMuted(dark)}`}>{label}</span>
      <div
        className={`flex items-center gap-2 ${dark ? "text-slate-500" : "text-slate-400"}`}
      >
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

/* ─── Static data ─── */
const benefits: string[] = [
  "Designed for freelancers & agencies",
  "No complex accounting software",
  "AI-powered billing workflow",
  "Multi-client & multi-tenant ready",
  "Simple. Fast. Revenue-focused.",
  "Zero setup — start in minutes",
];

const compareRows: CompareRowData[] = [
  { label: "Billing", old: "Manual invoices", newVal: "Prompt-based billing" },
  {
    label: "Follow-ups",
    old: "Manual reminders",
    newVal: "Automated AI follow-ups",
  },
  {
    label: "Insights",
    old: "No revenue insight",
    newVal: "Real-time intelligence",
  },
  { label: "Setup", old: "Hours of config", newVal: "Live in minutes" },
  { label: "Focus", old: "Software-first", newVal: "Revenue-first" },
];

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function HomeLandingPage(): React.ReactElement {
  const { dark, toggleTheme } = useTheme();
  const [currentSection, setCurrentSection] = useState<string>("hero");

  // to set active section based on scroll position
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    const handleScroll = () => {
      let current = currentSection;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          current = section.id;
        }
      });

      setCurrentSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  useEffect(() => {
    const sections = ["hero", "features", "why"];
    const handler = () => {
      const scrollY = window.scrollY + 50; // offset for fixed nav
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setCurrentSection(id);
        }
      }
    };
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Smooth scroll to section
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className={`min-h-screen w-full transition-colors duration-300 ${t.bg(dark)}`}
      animate={{ backgroundColor: dark ? "#0F1117" : "#F3F5F7" }}
      transition={{ duration: 0.3 }}
    >
      

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50  backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-4 md:px-0">
          <div className="flex items-center gap-3">
           <Logo collapsed={false} />
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: "Home", href: "#hero", id: "hero" },
              { label: "Features", href: "#features", id: "features" },
              { label: "Why Different", href: "#why", id: "why" },
            ].map((item) => (
              <a
                key={item.href}
                href={`/#${item.href.toLowerCase()}`}
                className={`text-sm transition-colors ${t.textMuted(dark)} ${t.navHover(dark)} ${currentSection === item.id ? "font-semibold" : ""} `}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            <div className="hidden gap-2 md:flex">
              <Link to="/auth/login">
              <button
                className={`rounded-full px-4 py-2 text-sm transition-colors ${t.textSub(dark)} hover:bg-white/10`}
              >
                Login
              </button>
              </Link>
              <Link to="/billing/create"><SoftButton dark={dark}>Start Free</SoftButton></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════ SECTION 1 — HERO ══════ */}
      <section
        id="hero"
        className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-8 px-4 pb-20 pt-28 md:grid-cols-2 md:px-0 "
      >
        <div className="flex flex-col justify-center space-y-8 pr-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${t.badgeBg(dark)}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${t.dot(dark)}`}
              />
              <span className={`text-xs font-medium ${t.badgeText(dark)}`}>
                AI-Powered Revenue Assistant
              </span>
            </div>
            <h1
              className={`text-5xl  md:text-left font-bold leading-[1.05] tracking-tight md:text-6xl ${t.text(dark)}`}
            >
              Stop Chasing
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Payments.
              </span>
              <br />
              Start Tracking
              <br />
              Revenue.
            </h1>
            <p className={`mt-5 max-w-md leading-relaxed text-center md:text-left ${t.textSub(dark)}`}>
              Generate invoices with a prompt, automate payment reminders and
              see exactly how your money flows. All in one simple dashboard.
            </p>
          </motion.div>
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <SoftButton variant="accent">
              <Link to="/billing/create">
                Try the Prompt
                <ArrowUpRight className="ml-1 inline h-4 w-4" />
              </Link>
            </SoftButton>

            <SoftButton variant="ghost"><Link to="/auth/signup">Sign Up</Link></SoftButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-2 md:max-w-sm"
          >
            <Stat label="Invoices Sent" value="50K+" dark={dark} />
            <Stat label="Revenue Tracked" value="$8.4M" dark={dark} />
            <Stat label="Time Saved" value="12h/mo" dark={dark} />
          </motion.div>

          {/* Trust strip */}
          <div className="flex items-center gap-6 opacity-60">
            <span className={`text-xs ${t.textMuted(dark)}`}>TRUSTED BY</span>
            <div
              className={`flex items-center gap-5 text-sm font-semibold ${t.footerText(dark)}`}
            >
              <span>Contra</span>
              <span>Indiehackers</span>
              <span>Toptal</span>
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="flex flex-col gap-5">
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
            className="grid grid-cols-2 gap-5"
          >
            <div
              className={`rounded-xl bg-gradient-to-b p-4 text-white shadow-lg ${t.miniCardGreen(dark)}`}
            >
              <div className="text-xs text-emerald-400 mb-1">
                Overdue recovered
              </div>
              <div className="text-2xl font-semibold">$12,400</div>
              <div className="mt-1 text-xs text-emerald-400/80">
                ↑ 18% this month via AI reminders
              </div>
            </div>
            <div className={`rounded-xl ring-1 p-4 shadow-lg ${t.card(dark)}`}>
              <div className={`text-xs mb-1 ${t.textMuted(dark)}`}>
                Avg. payment time
              </div>
              <div className={`text-2xl font-semibold ${t.text(dark)}`}>
                4.2 days
              </div>
              <div className="mt-1 text-xs text-emerald-500">
                ↓ was 11 days before TraqBill
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ SECTION 2 — FEATURES ══════ */}
      <section
        id="features"
        className="mx-auto w-full max-w-[1180px] px-4 pb-24 md:px-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${t.badgeBg(dark)}`}
          >
            <span className={`text-xs font-medium ${t.badgeText(dark)}`}>
              Core Features
            </span>
          </div>
          <h2
            className={`text-4xl font-bold tracking-tight max-w-lg leading-[1.1] ${t.text(dark)}`}
          >
            Everything You Need to
            <br />
            <span className="text-emerald-500">Get Paid — On Time.</span>
          </h2>
          <p
            className={`mt-3 max-w-md text-sm leading-relaxed ${t.textMuted(dark)}`}
          >
            Three focused tools working together to make sure revenue never
            slips through the cracks.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featureCards.map((card, i) => (
            <FeatureCard key={i} card={card} index={i} dark={dark} />
          ))}
        </div>
      </section>

      {/* ══════ SECTION 3 — WHY DIFFERENT ══════ */}
      <section
        id="why"
        className="mx-auto w-full max-w-[1180px] px-4 pb-28 md:px-0"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center gap-6"
          >
            <div>
              <div
                className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${t.badgeBg(dark)}`}
              >
                <span className={`text-xs font-medium ${t.badgeText(dark)}`}>
                  Why TraqBill
                </span>
              </div>
              <h2
                className={`text-4xl font-bold tracking-tight leading-[1.1] ${t.text(dark)}`}
              >
                Not Just Invoices.
                <br />
                <span className="text-emerald-500">A Revenue System.</span>
              </h2>
              <p
                className={`mt-3 text-sm leading-relaxed max-w-sm ${t.textMuted(dark)}`}
              >
                Built for freelancers, agencies and indie businesses who want to
                focus on work with a system that assures cash flow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
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

          {/* Right: comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl shadow-lg ring-1 overflow-hidden ${t.card(dark)}`}
          >
            <div
              className={`grid grid-cols-3 gap-2 border-b px-6 py-3 text-xs font-semibold uppercase tracking-wider ${t.compareHeader(dark)} ${t.compareHeaderTxt(dark)}`}
            >
              <span>Workflow</span>
              <span>Traditional Tools</span>
              <span className="text-emerald-500">TraqBill</span>
            </div>
            <div className="px-6 py-2">
              {compareRows.map((row, i) => (
                <CompareRow
                  key={i}
                  label={row.label}
                  old={row.old}
                  newVal={row.newVal}
                  delay={i * 0.07}
                  dark={dark}
                />
              ))}
            </div>
            <div
              className={`border-t p-6 flex items-center justify-between ${t.ctaStrip(dark)}`}
            >
              <div>
                <div className={`text-sm font-semibold ${t.text(dark)}`}>
                  Ready to switch?
                </div>
                <div className={`text-xs mt-0.5 ${t.textMuted(dark)}`}>
                  No credit card required.
                </div>
              </div>
              <Link to="/billing/create">
              <SoftButton variant="accent">
                Start Free <ArrowUpRight className="ml-1 inline h-4 w-4" />
              </SoftButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mx-auto w-full max-w-[1180px] px-4 pb-10 text-center text-xs md:px-0">
        <span className={t.footerText(dark)}>
          &copy; {new Date().getFullYear()} TraqBill, Inc. All rights reserved.
        </span>
      </footer>
    </motion.div>
  );
}
