import { Link } from "react-router-dom";
import { useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  Zap,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { t } from "../../shared/utils/themeClasses";
import ThemeToggle from "../themes/ThemeToggle";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
}


/* ══════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════ */
const primaryNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Invoices", icon: FileText, href: "/billing/invoices", badge: "6" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Revenue", icon: TrendingUp, href: "/revenue" },
  { label: "AI Billing", icon: Zap, href: "/billing/create", badge: "New" },
];

const secondaryNav: NavItem[] = [
  { label: "Settings", icon: Settings, href: "/settings" },
];

/* ══════════════════════════════════════════
   SIDEBAR NAV ITEM
══════════════════════════════════════════ */
export function SideNavItem({
  item,
  active,
  dark,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  dark: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link to={item.href} className="relative group block">
      <motion.div
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${t.navItem(dark, active)}`}
        whileTap={{ scale: 0.97 }}
      >
        {active && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute left-0 top-1/0 -translate-y-1/2 h-6 w-0.5 rounded-full bg-emerald-500"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        <Icon className={`h-4.5 w-4.5 shrink-0 ${collapsed ? "mx-auto" : ""}`} style={{ width: 18, height: 18 }} />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap flex-1"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {!collapsed && item.badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${t.badge(dark)}`}
          >
            {item.badge}
          </motion.span>
        )}
      </motion.div>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div
          className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 
            opacity-0 group-hover:opacity-100 transition-opacity duration-150
            flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium shadow-lg ring-1 whitespace-nowrap
            ${t.collapsedTooltip(dark)}`}
        >
          {item.label}
          {item.badge && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${t.badge(dark)}`}>
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
export function Sidebar({
  dark,
  collapsed,
  onCollapse,
  currentPath,
}: {
  dark: boolean;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  currentPath: string;
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r ${t.sidebar(dark)} overflow-hidden`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${t.divider(dark)}`}>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white shadow">
          <BarChart2 className="h-4 w-4" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className={`text-lg font-bold tracking-tight whitespace-nowrap ${t.text(dark)}`}
            >
              RevPilot
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1">
        {primaryNav.map((item) => (
          <SideNavItem
            key={item.href}
            item={item}
            active={currentPath === item.href || currentPath.startsWith(item.href + "/")}
            dark={dark}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className={`mx-3 border-t ${t.divider(dark)}`} />

      {/* Secondary nav */}
      <div className="px-3 py-3 space-y-1">
        {secondaryNav.map((item) => (
          <SideNavItem
            key={item.href}
            item={item}
            active={currentPath === item.href}
            dark={dark}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* Collapse toggle */}
      <div className={`px-3 pb-4 border-t pt-3 ${t.divider(dark)}`}>
        <button
          onClick={() => onCollapse(!collapsed)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium transition-all ${t.navItem(dark, false)}`}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}

/* ══════════════════════════════════════════
   TOP BAR
══════════════════════════════════════════ */
export function Topbar({
  dark,
  toggleTheme,
  sidebarCollapsed,
  name,
  onMobileMenuToggle
}: {
  dark: boolean;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  name: string | null;
  onMobileMenuToggle: () => void;
}) {
  const [notifications] = useState(primaryNav[1].badge ? parseInt(primaryNav[1].badge) : 0);

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center  gap-30 border-b px-4 w-full backdrop-blur-md transition-all duration-300 ${t.topbar(dark)}`}
      style={{ left: "inherit", width: "100%" }}
    >
      {/* Mobile menu btn */}
      <button
        onClick={onMobileMenuToggle}
        className={`md:hidden rounded-lg p-2 ${t.notifBtn(dark)}`}
      >
        <Menu className="h-5 w-5" />
      </button>

        

      <div className="ml-auto flex items-center gap-12 w-auto">
        
        {/* Search */}
        <div className="w-96 hidden md:block mx-12">
            <div className="relative">
                <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${t.textMuted(dark)}`}
                />
                <input
                    type="text"
                    placeholder="Search invoices, clients…"
                    className={`w-full rounded-xl border pl-9 pr-4 py-2 text-sm outline-none transition-all focus:ring-2 ${t.input(dark)}`}
                />
            </div>
        </div>      

        <ThemeToggle dark={dark} onToggle={toggleTheme} />

        {/* Notifications */}
        <button
          className={`relative rounded-xl p-2 transition-colors ${t.notifBtn(dark)}`}
        >
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 text-[9px] font-bold text-white grid place-items-center"
            >
              {notifications}
            </motion.span>
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 ml-1">
          <div
            className={`h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 ring-2 shadow ${t.avatarRing(dark)}`}
          />
          <div className="hidden md:block">
            <div className={`text-xs font-semibold leading-tight ${t.text(dark)}`}>
              {name}
            </div>
            <div className={`text-[10px] ${t.textMuted(dark)}`}>Pro Plan</div>
          </div>
        </div>

        {/* Logout */}
        <Link to="/">
        <button
          className={`hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${t.notifBtn(dark)}`}
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token"); 
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
        </Link>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════
   MOBILE SIDEBAR OVERLAY
══════════════════════════════════════════ */
export function MobileSidebar({
  dark,
  open,
  onClose,
  currentPath,
}: {
  dark: boolean;
  open: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r md:hidden ${t.sidebar(dark)}`}
          >
            <div className={`flex items-center justify-between px-4 py-5 border-b ${t.divider(dark)}`}>
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white shadow">
                  <BarChart2 className="h-4 w-4" />
                </div>
                <span className={`text-lg font-bold tracking-tight ${t.text(dark)}`}>
                  RevPilot
                </span>
              </div>
              <button onClick={onClose} className={`rounded-lg p-1.5 ${t.notifBtn(dark)}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {primaryNav.map((item) => (
                <div key={item.href} onClick={onClose}>
                  <SideNavItem
                    item={item}
                    active={currentPath === item.href}
                    dark={dark}
                    collapsed={false}
                  />
                </div>
              ))}
            </nav>
            <div className={`mx-3 border-t ${t.divider(dark)}`} />
            <div className="px-3 py-3 space-y-1">
              {secondaryNav.map((item) => (
                <div key={item.href} onClick={onClose}>
                  <SideNavItem
                    item={item}
                    active={currentPath === item.href}
                    dark={dark}
                    collapsed={false}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}