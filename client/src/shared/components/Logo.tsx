import { BarChart2 } from "lucide-react";
import { useTheme } from "../themes/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "../utils/themeClasses";

export default function Logo({ collapsed }: { collapsed: boolean }): React.ReactElement {
    const { dark } = useTheme();
    return (
        <>
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
                    TraqBill
                </motion.span>
                )}
            </AnimatePresence>
        </>
    );
}
