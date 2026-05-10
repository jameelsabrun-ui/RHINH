import React from 'react';
import { Home, Calculator, Building2, Phone, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext.tsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'Properti', href: '/properties', icon: Building2 },
    { name: 'Kalkulator', href: '/calculator', icon: Calculator },
    { name: 'Pembangunan', href: '#tracking', icon: Building2 },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled 
        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            RH
          </div>
          <div className="hidden sm:block">
            <h1 className={cn(
              "font-bold text-lg leading-tight", 
              isScrolled ? "text-slate-900 dark:text-white" : "text-white"
            )}>
              Rumah Halal
            </h1>
            <p className={cn(
              "text-xs", 
              isScrolled ? "text-slate-500 dark:text-emerald-400" : "text-emerald-100"
            )}>
              Nur Holis Personal Website
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isRoute = link.href.startsWith('/');
            const Comp = isRoute ? Link : 'a';
            const props = isRoute ? { to: link.href } : { href: isHomePage ? link.href : `/${link.href}` };

            return (
              <Comp
                key={link.name}
                {...props}
                className={cn(
                  "text-sm font-medium hover:text-emerald-500 transition-colors",
                  isScrolled ? "text-slate-600 dark:text-slate-300" : "text-emerald-50"
                )}
              >
                {link.name}
              </Comp>
            );
          })}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 backdrop-blur-sm",
              isScrolled ? "text-slate-600 dark:text-slate-300" : "text-white"
            )}
            title="Toggle Tema"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <a
            href="https://wa.me/6281234567890"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Phone size={16} />
            Konsultasi Gratis
          </a>
        </div>

        {/* Mobile Toggle & Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full",
              isScrolled ? "text-slate-900 dark:text-white" : "text-white"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <button
            className={cn("p-2", isScrolled ? "text-slate-900 dark:text-white" : "text-white")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-xl border-t dark:border-slate-800 md:hidden p-6 gap-4 flex flex-col"
          >
            {navLinks.map((link) => {
              const isRoute = link.href.startsWith('/');
              const Comp = isRoute ? Link : 'a';
              const props = isRoute 
                ? { to: link.href, onClick: () => setIsOpen(false) } 
                : { href: isHomePage ? link.href : `/${link.href}`, onClick: () => setIsOpen(false) };

              return (
                <Comp
                  key={link.name}
                  {...props}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium py-2"
                >
                  <link.icon size={18} className="text-emerald-600" />
                  {link.name}
                </Comp>
              );
            })}
            <hr />
            <a
              href="https://wa.me/6281234567890"
              className="bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold"
            >
              <Phone size={18} />
              Hubungi Nur Holis
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
