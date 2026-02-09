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
      <header className="border-b border-border py-4 px-6">
        <nav className="flex gap-6 max-w-[900px] mx-auto">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/workspace" className={linkClass}>
            Workspace
          </NavLink>
        </nav>
      </header>
      {children}
    </>
  );
}
