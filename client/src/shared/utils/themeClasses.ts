export const t = {
  bg: (d: boolean) => (d ? "bg-[#0F1117]" : "bg-[#F3F5F7]"),
  card: (d: boolean) =>
    d ? "bg-[#1A1D27] ring-white/10" : "bg-white ring-slate-200",
  text: (d: boolean) => (d ? "text-white" : "text-slate-900"),
  textMuted: (d: boolean) => (d ? "text-slate-400" : "text-slate-500"),
  textDanger: (d: boolean) => (d ? "text-red-400" : "text-red-600"),
  textSub: (d: boolean) => (d ? "text-slate-300" : "text-slate-600"),
  border: (d: boolean) => (d ? "border-white/10" : "border-slate-100"),
  navHover: (d: boolean) => (d ? "hover:text-white" : "hover:text-slate-900"),
  inputBg: (d: boolean) =>
    d
      ? "bg-[#1A1D27] border-white/10 text-white placeholder:text-slate-500"
      : "bg-white border-slate-200 text-slate-700",
  badgeBg: (d: boolean) =>
    d ? "bg-emerald-950 ring-emerald-800" : "bg-emerald-50 ring-emerald-200",
  badgeText: (d: boolean) => (d ? "text-emerald-400" : "text-emerald-700"),
  dot: (d: boolean) => (d ? "bg-emerald-400" : "bg-emerald-500"),
  compareHeader: (d: boolean) =>
    d ? "bg-[#141620] border-white/10" : "bg-slate-50 border-slate-100",
  compareHeaderTxt: (d: boolean) => (d ? "text-slate-500" : "text-slate-400"),
  compareRowBorder: (d: boolean) => (d ? "border-white/5" : "border-slate-100"),
  ctaStrip: (d: boolean) =>
    d
      ? "bg-emerald-950/50 border-white/5"
      : "bg-gradient-to-r from-emerald-50 to-teal-50 border-slate-100",
  heroWidget: (d: boolean) =>
    d ? "bg-[#1A1D27] ring-white/10" : "bg-white ring-slate-200",
  promptBar: (d: boolean) =>
    d ? "bg-[#141620] border-white/5" : "bg-slate-50 border-slate-100",
  barChartGrad: (d: boolean) => (d ? "from-[#141620]" : "from-emerald-50"),
  barBar: (d: boolean) =>
    d ? "from-emerald-900 to-emerald-600" : "from-emerald-200 to-emerald-400",
  rowDivide: (d: boolean) => (d ? "divide-white/5" : "divide-slate-50"),
  miniCardGreen: (d: boolean) =>
    d ? "from-emerald-950 to-emerald-900" : "from-emerald-900 to-emerald-800",
  footerText: (d: boolean) => (d ? "text-slate-600" : "text-slate-400"),
  sidebar: (d: boolean) =>
    d
      ? "bg-[#13161F] border-white/[0.06]"
      : "bg-white border-slate-200/80",
  topbar: (d: boolean) =>
    d
      ? "bg-[#0F1117]/80 border-white/[0.06]"
      : "bg-white/80 border-slate-200/80",
  navItem: (d: boolean, active: boolean) =>
    active
      ? d
        ? "bg-emerald-600/20 text-emerald-400"
        : "bg-emerald-50 text-emerald-700"
      : d
      ? "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
  navItemDot: (d: boolean, active: boolean) =>
    active ? "bg-emerald-500" : d ? "bg-slate-600" : "bg-slate-300",
  badge: (d: boolean) =>
    d
      ? "bg-emerald-600/20 text-emerald-400 ring-emerald-500/20"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200",
  input: (d: boolean) =>
    d
      ? "bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500/40"
      : "bg-slate-100 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-emerald-500/30 focus:border-emerald-400",
  notifBtn: (d: boolean) =>
    d
      ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200"
      : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700",
  avatarRing: (d: boolean) =>
    d ? "ring-white/10" : "ring-slate-200",
  divider: (d: boolean) => (d ? "border-white/[0.06]" : "border-slate-200/80"),
  collapsedTooltip: (d: boolean) =>
    d ? "bg-[#1A1D27] text-slate-200 ring-white/10" : "bg-white text-slate-700 ring-slate-200",
};