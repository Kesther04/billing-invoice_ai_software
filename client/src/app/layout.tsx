import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { t } from "../shared/utils/themeClasses";
import { useTheme } from "../shared/themes/ThemeContext";
import { MobileSidebar, Sidebar, Topbar } from "../shared/components/Navbar";


// check if user is logged in, if not redirect to login page
const useRequireAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);
};

/* ══════════════════════════════════════════
   MAIN LAYOUT
══════════════════════════════════════════ */
export default function MainLayout(): React.ReactElement {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  
  useRequireAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;
  const {dark, toggleTheme} = useTheme();
  return (
    <div
      className={`min-h-screen ${t.bg(dark)} transition-colors duration-300`}
    >
      

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          dark={dark}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          currentPath={currentPath}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        dark={dark}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={currentPath}
      />

      {/* Topbar — full width, shifts right on desktop */}
      <motion.div
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block"
      >
        <Topbar
          dark={dark}
          toggleTheme={toggleTheme}
          sidebarCollapsed={sidebarCollapsed}
          name ={user?.name}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />
      </motion.div>

      {/* Mobile topbar (no left padding) */}
      <div className="md:hidden">
        <Topbar
          dark={dark}
          toggleTheme={toggleTheme}
          sidebarCollapsed={false}
          name={user?.name}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />
      </div>

      {/* Page content */}
      <motion.main
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block pt-16 min-h-screen"
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </motion.main>

      {/* Mobile content */}
      <main className="md:hidden pt-16 min-h-screen">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
