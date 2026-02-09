import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `font-medium transition-colors duration-200 ${isActive ? 'text-[#e8e8ed]' : 'text-muted hover:text-[#e8e8ed]'
  }`;

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <header className="border-b border-border py-3 px-4 sm:py-4 sm:px-6">
        <nav className="flex flex-wrap gap-4 sm:gap-6 max-w-[900px] mx-auto items-center min-h-[44px]">
          <NavLink to="/" className={`${linkClass} py-2 -my-2 px-1 text-sm sm:text-base min-w-[44px] min-h-[44px] flex items-center justify-center sm:justify-start sm:min-w-0 sm:min-h-0 sm:py-0 sm:px-0`}>
            Home
          </NavLink>
          <NavLink to="/workspace" className={`${linkClass} py-2 -my-2 px-1 text-sm sm:text-base min-w-[44px] min-h-[44px] flex items-center justify-center sm:justify-start sm:min-w-0 sm:min-h-0 sm:py-0 sm:px-0`}>
            Workspace
          </NavLink>
        </nav>
      </header>
      {children}
    </>
  );
}
