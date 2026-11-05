import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MAIN_NAV_ITEMS } from './navData';

/* Visibility flips instantly on open and only after the fade on close. */
const OPEN =
  'visible translate-y-0 opacity-100 [transition:opacity_200ms_cubic-bezier(0.22,1,0.36,1),transform_200ms_cubic-bezier(0.22,1,0.36,1),visibility_0s]';
const CLOSED =
  'invisible -translate-y-1 opacity-0 [transition:opacity_150ms_cubic-bezier(0.22,1,0.36,1),transform_150ms_cubic-bezier(0.22,1,0.36,1),visibility_0s_150ms]';

interface NavDropdownProps {
  id: string;
  isOpen: boolean;
  onNavigate: () => void;
}

/**
 * Desktop (lg+) menu panel, opened by the Navbar's "Menu" disclosure button.
 * Always mounted; hidden with visibility so closed links are out of the tab order.
 */
export const NavDropdown: React.FC<NavDropdownProps> = ({ id, isOpen, onNavigate }) => {
  const { pathname } = useLocation();

  return (
    <div
      id={id}
      className={`absolute right-0 top-full mt-3 w-[340px] origin-top-right rounded-2xl border border-white/10 bg-navy p-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)] motion-reduce:transition-none ${
        isOpen ? OPEN : CLOSED
      }`}
    >
      <ul>
        {MAIN_NAV_ITEMS.map(({ title, path, description, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <li key={path}>
              <Link
                to={path}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0dc2ff] ${
                  isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.05]'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150 ${
                    isActive
                      ? 'border-[#0dc2ff]/40 bg-[#0dc2ff]/10 text-[#0dc2ff]'
                      : 'border-white/10 text-white/60 group-hover:text-[#0dc2ff]'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-semibold leading-tight ${
                      isActive ? 'text-[#0dc2ff]' : 'text-white'
                    }`}
                  >
                    {title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/50">{description}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
