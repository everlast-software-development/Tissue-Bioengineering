import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileNavDrawer } from './MobileNavDrawer';
import { NavDropdown } from './NavDropdown';
import { Button } from '@/components/common/Button';
import { Menu, ArrowRight, ChevronDown } from 'lucide-react';



export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();

  /* ── Scroll listener ──────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Close dropdown on route change ──────────────────────── */
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  /* ── Click-outside to close ───────────────────────────────── */
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !dropdownTriggerRef.current?.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  /* ── Keyboard: Escape closes ──────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        dropdownTriggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isDropdownOpen]);

  /* ── Hover-intent helpers ─────────────────────────────────── */
  const handleMouseEnterTrigger = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsDropdownOpen(true);
  }, []);

  const handleMouseLeaveTriggerArea = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 180);
  }, []);

  const handleMouseEnterDropdown = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, []);

  const handleMouseLeaveDropdown = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 180);
  }, []);

  return (
    <motion.header
      ref={navRef}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 shadow-2xl shadow-navy-footer/60 border-b border-white/10'
          : 'py-5'
      }`}
      style={{
        background: isScrolled ? 'rgba(5, 20, 45, 0.88)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        willChange: 'background, backdrop-filter',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* ── LEFT: Logo ─────────────────────────────────────── */}
        <Link to="/" className="flex items-center group flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src="/images/tissuebioengineering.webp"
              alt="Tissue Bioengineering"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-md"
            />
          </motion.div>
        </Link>

        {/* ── RIGHT: CTA + Menu Dropdown + Mobile trigger ───── */}
        <div className="flex items-center gap-4">
          {/* Book Consultation — desktop only */}
          <div className="hidden lg:block">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/consultation">
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-white text-navy hover:bg-sky-100 font-bold shadow-lg border border-white rounded-full px-5 py-2.5 text-xs flex items-center gap-2 transition-all duration-300"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 text-navy" />}
                >
                  Book Consultation
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* ── Desktop "Menu" trigger + Dropdown ───────────────── */}
          <nav
            className="hidden xl:flex items-center"
            role="navigation"
            aria-label="Main Navigation"
          >
            <div
              className="relative"
              onMouseEnter={handleMouseEnterTrigger}
              onMouseLeave={handleMouseLeaveTriggerArea}
            >
              {/* ── Menu trigger button ──────────────────────────── */}
              <button
                ref={dropdownTriggerRef}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-controls="nav-mega-dropdown"
                aria-label="Open navigation menu"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isDropdownOpen
                    ? 'bg-white/15 text-white border-white/30 shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30'
                }`}
              >
                <Menu className="w-4 h-4" />
                Menu
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </motion.div>
              </button>

              {/* ── Dropdown Panel ────────────────────────────────── */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    id="nav-mega-dropdown"
                    onMouseEnter={handleMouseEnterDropdown}
                    onMouseLeave={handleMouseLeaveDropdown}
                  >
                    <NavDropdown onClose={() => setIsDropdownOpen(false)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Hamburger — mobile/tablet */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* ── Mobile Nav Slide Drawer ─────────────────────────── */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </motion.header>
  );
};
