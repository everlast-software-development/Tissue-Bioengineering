import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAIN_NAV_ITEMS, UnifiedNavItem } from './navData';
import { ChevronRight } from 'lucide-react';

interface NavDropdownProps {
  onClose: () => void;
}

/* ─── Animation Variants ──────────────────────────────────── */
const panelVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.04,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Component ───────────────────────────────────────────── */
export const NavDropdown: React.FC<NavDropdownProps> = ({ onClose }) => {
  const location = useLocation();

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full right-0 mt-3 w-[300px] sm:w-[340px] z-50"
      role="menu"
      aria-orientation="vertical"
      aria-label="Navigation Menu"
    >
      {/* ── White Premium Floating Panel ─────────────────────── */}
      <div
        className="relative rounded-[22px] overflow-hidden bg-white"
        style={{
          border: '1px solid #E5E7EB',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)',
        }}
      >
        {/* ── Subtle top accent line ───────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[22px]"
          style={{
            background: 'linear-gradient(90deg, #38BDF8 0%, #0EA5E9 50%, #0284C7 100%)',
          }}
        />

        {/* ── Section label ────────────────────────────────────── */}
        <div className="px-5 pt-5 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </span>
        </div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div className="mx-4 h-px bg-slate-100" />

        {/* ── Menu Items ──────────────────────────────────────── */}
        <div className="p-2.5">
          {MAIN_NAV_ITEMS.map((item: UnifiedNavItem) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div key={item.title} variants={itemVariants}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  role="menuitem"
                  tabIndex={0}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-[14px] cursor-pointer transition-all duration-[250ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#0B5ED7]'
                      : 'text-slate-700 hover:bg-[#F5F9FF] hover:text-[#0B5ED7]'
                  }`}
                >
                  {/* Icon box */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-all duration-[250ms] ${
                      isActive
                        ? 'bg-blue-100 text-[#0B5ED7]'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#0B5ED7]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold leading-tight transition-colors duration-[250ms] ${
                        isActive ? 'text-[#0B5ED7]' : 'text-slate-800 group-hover:text-[#0B5ED7]'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-normal leading-snug mt-0.5 line-clamp-1 group-hover:text-slate-500 transition-colors duration-[250ms]">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-all duration-[250ms] ${
                      isActive
                        ? 'text-[#0B5ED7] opacity-100 translate-x-0'
                        : 'text-slate-300 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#0B5ED7]'
                    }`}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Footer CTA ──────────────────────────────────────── */}
        <div className="mx-2.5 mb-2.5 mt-1">
          <div className="h-px bg-slate-100 mb-2.5" />
          <Link
            to="/consultation"
            onClick={onClose}
            className="group flex items-center justify-between w-full px-3.5 py-3 rounded-[14px] transition-all duration-[250ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border border-sky-100 hover:border-sky-200"
          >
            <div>
              <p className="text-sm font-bold text-sky-700 group-hover:text-sky-800 transition-colors">
                Book a Consultation
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 group-hover:text-slate-500 transition-colors">
                Connect with our clinical team
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
