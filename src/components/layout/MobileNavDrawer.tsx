import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MAIN_NAV_ITEMS, UnifiedNavItem } from './navData';
import { Button } from '@/components/common/Button';
import { X, ArrowRight, ChevronRight } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            aria-hidden="true"
          />

          {/* Full Screen Right Slide Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-gradient-to-b from-[#0B1F3A] via-[#0E284A] to-[#12335C] text-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Top Bar: Brand Logo & Close Button */}
            <div className="p-6 flex items-center justify-between border-b border-white/15">
              <Link to="/" onClick={onClose} className="flex items-center">
                <img
                  src="/images/tissuebioengineering.webp"
                  alt="Tissue Bioengineering"
                  className="h-9 w-auto object-contain drop-shadow-md"
                />
              </Link>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-sky"
                aria-label="Close Navigation Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items List with Icons & Subtitles */}
            <div className="p-6 space-y-3 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Explore Navigation
              </span>

              {MAIN_NAV_ITEMS.map((item: UnifiedNavItem) => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/15 border border-white/30 text-white'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white/10 text-sky shrink-0 border border-white/15">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-sky opacity-80" />
                      </div>
                      <p className="text-xs text-slate-300 font-normal line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Actions & CTA */}
            <div className="p-6 border-t border-white/15 bg-navy-footer/40">
              <Link to="/consultation" onClick={onClose}>
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full bg-white text-navy hover:bg-slate-100 hover:text-navy-hover font-bold shadow-xl border border-white/20 py-3.5 rounded-2xl text-base"
                  rightIcon={<ArrowRight className="w-5 h-5 text-navy" />}
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
