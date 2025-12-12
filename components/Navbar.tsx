import React, { useState } from 'react';
import { Phone, Mail, GraduationCap, Search, Menu, X, ChevronDown, ChevronRight, User } from 'lucide-react';
import { APP_CONSTANTS, NAV_STRUCTURE, NavItem } from '../types';

interface NavbarProps {
    activeSection: string;
    onNavigate: (id: string) => void;
    onSearch: (query: string) => void;
    navItems?: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onSearch, navItems = NAV_STRUCTURE }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            // Close mobile menu if open
            setMobileMenuOpen(false);
        }
    };

    const NavItemRenderer: React.FC<{ item: NavItem; depth?: number }> = ({ item, depth = 0 }) => {
        const [isOpen, setIsOpen] = useState(false);
        const hasChildren = item.children && item.children.length > 0;

        // Mobile View for Submenu
        if (hasChildren) {
            return (
                <div
                    className="relative group lg:static"
                    onMouseEnter={() => window.innerWidth >= 1024 && setIsOpen(true)}
                    onMouseLeave={() => window.innerWidth >= 1024 && setIsOpen(false)}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center justify-between w-full lg:w-auto px-4 py-3 lg:py-4 text-sm font-medium transition-all duration-300
                            ${depth > 0
                                ? 'text-slate-700 hover:bg-slate-100'
                                : 'text-slate-200 hover:text-brand-orange lg:hover:bg-white/5'}
                        `}
                    >
                        {item.label}
                        {depth === 0
                            ? <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            : <ChevronRight size={14} className="ml-auto lg:ml-2" />
                        }
                    </button>

                    {/* Dropdown */}
                    <div className={`
                        ${isOpen ? 'block animate-slideUp' : 'hidden'}
                        lg:absolute lg:top-full lg:left-0 lg:min-w-[240px] lg:shadow-xl lg:bg-white lg:rounded-b-xl lg:z-50
                        w-full bg-brand-navyLight lg:bg-white lg:border-t-0 border-l-4 border-l-brand-orange lg:border-l-0 overflow-hidden
                    `}>
                        <ul className="py-2">
                            {item.children!.map((child, idx) => (
                                <li key={idx} className="relative">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (child.id) {
                                                onNavigate(child.id);
                                                setMobileMenuOpen(false);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className="block px-6 py-3 text-sm lg:text-slate-700 text-slate-300 hover:bg-brand-greenLight hover:text-brand-orangeDark hover:pl-8 transition-all duration-300 border-b lg:border-none border-white/5 last:border-0"
                                    >
                                        {child.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    if (item.id) {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                    }
                }}
                className={`block px-4 py-3 lg:py-4 text-sm font-medium transition-all duration-300 relative
                    ${depth > 0
                        ? 'text-slate-700 hover:bg-brand-greenLight hover:text-brand-orangeDark'
                        : activeSection === item.id
                            ? 'text-white font-bold bg-white/10 lg:bg-transparent lg:text-brand-orange lg:after:w-full'
                            : 'text-slate-200 hover:text-brand-orange lg:after:w-0 lg:hover:after:w-full'}
                    
                    ${depth === 0 && `
                        lg:after:content-[''] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:h-1 lg:after:bg-brand-orange lg:after:transition-all lg:after:duration-300
                    `}
                `}
            >
                {item.label}
            </a>
        );
    };

    return (
        <div className="flex flex-col w-full shadow-lg relative z-50">
            {/* Top Bar - Contact Info & Name */}
            <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                        <span className="flex items-center gap-2 font-bold text-brand-orange animate-pulse text-sm md:text-base bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                            <User size={14} /> <span className="uppercase tracking-wider">{APP_CONSTANTS.TEACHER_NAME}</span>
                        </span>
                        <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
                        <a href={`tel:${APP_CONSTANTS.PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors group text-sm font-medium">
                            <Phone size={14} className="text-brand-green group-hover:rotate-12 transition-transform" /> {APP_CONSTANTS.PHONE}
                        </a>
                        <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
                        <a href={`mailto:${APP_CONSTANTS.EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors group text-sm font-medium">
                            <Mail size={14} className="text-brand-green group-hover:rotate-12 transition-transform" /> {APP_CONSTANTS.EMAIL}
                        </a>
                    </div>
                    <div className="hidden md:block text-white text-[10px] uppercase tracking-widest">
                        {APP_CONSTANTS.TAGLINE}
                    </div>
                </div>
            </div>

            {/* Main Header with Navy Gradient */}
            <header className="bg-gradient-to-r from-brand-navy to-brand-navyLight text-white py-6 md:py-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulseSlow"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2 pointer-events-none animate-float"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="flex items-center gap-5 group cursor-pointer" onClick={() => onNavigate('home')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-orange blur-lg opacity-40 rounded-full group-hover:opacity-60 transition-opacity animate-pulse"></div>
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <GraduationCap size={40} className="text-brand-orange drop-shadow-md group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-serif text-brand-orangeDark tracking-wide drop-shadow-md leading-tight animate-fadeIn">
                                Unlock English
                            </h1>
                            <p className="text-xs md:text-sm text-blue-900 font-bold tracking-widest uppercase mt-1 group-hover:tracking-[0.2em] transition-all duration-300 animate-slideInRight">
                                Excellence in Education
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-brand-green rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-brand-navyLight rounded-full overflow-hidden border border-white/10 focus-within:border-brand-orange/50 transition-colors">
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="pl-6 pr-4 py-3 w-full md:w-64 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                className="pr-4 pl-2 text-slate-400 hover:text-brand-orange transition-colors hover:scale-110 transform"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav className="bg-brand-navy border-t border-white/5 shadow-xl sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center lg:block">
                        <span className="lg:hidden py-4 text-white font-medium flex items-center gap-2 text-sm uppercase tracking-wider animate-fadeIn">
                            <Menu size={18} className="text-brand-orange" /> Navigation
                        </span>
                        <button
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} className="animate-spin" /> : <Menu size={24} />}
                        </button>
                    </div>

                    <ul className={`
                        lg:flex lg:flex-wrap lg:items-center lg:gap-1
                        ${mobileMenuOpen ? 'block animate-slideUp' : 'hidden'}
                        pb-4 lg:pb-0 divide-y divide-white/5 lg:divide-y-0
                    `}>
                        {navItems.map((item, idx) => (
                            <li key={idx} className="relative" style={{ animationDelay: `${idx * 50}ms` }}>
                                <NavItemRenderer item={item} />
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;