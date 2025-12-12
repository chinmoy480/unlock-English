
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import PreviewModal from './components/PreviewModal';
import StudentPortal from './components/StudentPortal';
import { Resource, APP_CONSTANTS, Notice, NAV_STRUCTURE } from './types';
import { FolderOpen, Eye, FileText, Bell, Star, ArrowRight, BookOpen, CheckCircle, Search, AlertCircle } from 'lucide-react';
import { fetchResources, createResource, deleteResource, fetchLatestNotice } from './services/supabaseService';

const App: React.FC = () => {
    // Initialize activeSection from URL if available, otherwise default to 'home'
    const getInitialSection = () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        return page || 'home';
    };

    const [activeSection, setActiveSection] = useState(getInitialSection);
    const [resources, setResources] = useState<Resource[]>([]);
    const [previewResource, setPreviewResource] = useState<Resource | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);
    const [navItems, setNavItems] = useState(NAV_STRUCTURE || []); // Fallback to empty array if undefined, but it should be imported



    const loadCategories = async () => {
        const { fetchCategories } = await import('./services/supabaseService');
        const categories = await fetchCategories();

        if (categories && categories.length > 0) {
            const dynamicNav = categories.map((cat: any) => ({
                label: cat.label,
                id: cat.slug,
                dbId: cat.id // Store DB ID for deletion
            }));

            // Insert dynamic categories before the "Account" item (last item)
            const baseNav = [...NAV_STRUCTURE]; // Create a copy
            const accountItem = baseNav.pop(); // Remove Account

            // Filter out duplicates if any static items match dynamic ones (optional safety)
            const uniqueDynamic = dynamicNav.filter((d: any) => !baseNav.some(b => b.id === d.id));

            setNavItems([...baseNav, ...uniqueDynamic, accountItem!]);
        } else {
            setNavItems(NAV_STRUCTURE);
        }
    };

    // Initial Data Load
    useEffect(() => {
        const loadData = async () => {
            const resData = await fetchResources();
            setResources(resData);
            const noticeData = await fetchLatestNotice();
            setCurrentNotice(noticeData);

            await loadCategories();
        };
        loadData();
    }, []);

    // SEO: Handle Browser Back/Forward buttons and URL sync
    useEffect(() => {
        const handlePopState = () => {
            setActiveSection(getInitialSection());
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // SEO: Update URL, Title, and Meta Description when activeSection changes
    useEffect(() => {
        const title = activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const fullTitle = activeSection === 'home' ? APP_CONSTANTS.APP_NAME : `${title} | ${APP_CONSTANTS.APP_NAME}`;

        // Update Document Title
        document.title = fullTitle;

        // Update URL without reloading
        const url = new URL(window.location.href);
        if (activeSection === 'home') {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', activeSection);
        }
        window.history.pushState({}, '', url);

        // Update Meta Description dynamically
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            if (activeSection === 'home') {
                metaDesc.setAttribute('content', `Welcome to ${APP_CONSTANTS.APP_NAME}. ${APP_CONSTANTS.TAGLINE}. Your source for English Grammar, Literature, and Composition.`);
            } else if (activeSection === 'search') {
                metaDesc.setAttribute('content', `Search results for English resources regarding ${searchQuery} at ${APP_CONSTANTS.APP_NAME}.`);
            } else {
                metaDesc.setAttribute('content', `Explore our ${title} section. Comprehensive English resources, model questions, and study materials for students.`);
            }
        }

    }, [activeSection, searchQuery]);

    const handleUpload = async (newResourceData: Omit<Resource, 'id' | 'created_at'>) => {
        const created = await createResource(newResourceData);
        if (created) {
            setResources(prev => [created, ...prev]);
        }
    };

    const handleDelete = async (id: number) => {
        const success = await deleteResource(id);
        if (success) {
            setResources(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setActiveSection('search');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNoticeUpdate = (notice: Notice) => {
        setCurrentNotice(notice);
    };

    const getSectionTitle = (id: string) => {
        if (id === 'search') return `Search Results for "${searchQuery}"`;
        // Simple formatter for section IDs
        return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Filter Logic
    let filteredResources = resources;
    if (activeSection === 'search') {
        const q = searchQuery.toLowerCase();
        filteredResources = resources.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        );
    } else if (activeSection !== 'home' && activeSection !== 'admin' && activeSection !== 'student-request') {
        filteredResources = resources.filter(r => r.category === activeSection);
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 overflow-x-hidden selection:bg-brand-orange selection:text-white">
            <Navbar activeSection={activeSection} onNavigate={setActiveSection} onSearch={handleSearch} navItems={navItems} />

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 relative z-10">

                {/* --- HOME PAGE --- */}
                {activeSection === 'home' && (
                    <div className="space-y-16 animate-fadeIn">

                        {/* Notice Board Ticker */}
                        {currentNotice && (
                            <div className="bg-brand-greenLight border border-brand-green/20 rounded-xl overflow-hidden shadow-sm relative h-12 flex items-center animate-slideUp">
                                <div className="bg-brand-green text-brand-navy px-4 h-full flex items-center font-bold text-sm uppercase tracking-wider shrink-0 z-20 shadow-md">
                                    <Bell size={16} className="mr-2 animate-pulse" /> Notice
                                </div>
                                <div className="w-full overflow-hidden relative h-full flex items-center">
                                    <div className="animate-marquee whitespace-nowrap absolute font-medium text-brand-orangeDark pl-[100%] w-full">
                                        {currentNotice.content}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hero Section */}
                        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-brand-navy group animate-slideUp delay-100">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000 animate-pulseSlow"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-transparent"></div>

                            <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider animate-fadeIn delay-300">
                                    <Star size={12} fill="currentColor" /> Premier English Learning
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight animate-slideUp delay-200 animate-pulseSlow">
                                    Empowering <span className="text-white">Mind</span><br />
                                    Defining <span className="italic font-light">Future</span>
                                </h2>
                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg animate-slideUp delay-300">
                                    Rooted in knowledge, growing towards success. Join us on a journey of linguistic mastery and academic excellence.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4 animate-slideUp delay-400">
                                    <button
                                        onClick={() => setActiveSection('model-question')}
                                        className="px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/30 flex items-center gap-2 hover:-translate-y-1 animate-glow"
                                    >
                                        Start Learning <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('student-request')}
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                                    >
                                        Request Topic
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-panel p-8 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-slideUp delay-200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-green/30 transition-all"></div>
                                <BookOpen size={40} className="text-brand-navy mb-4 relative z-10" />
                                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4 relative z-10">My Mission</h3>
                                <p className="text-slate-600 leading-relaxed relative z-10">
                                    To simplify complex concepts through structured examples and comprehensive guides. Whether you are mastering literature or refining your grammar, our resources are tailored to support your growth.
                                </p>
                            </div>
                            <div className="glass-panel p-8 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-slideUp delay-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-orange/30 transition-all"></div>
                                <CheckCircle size={40} className="text-brand-navy mb-4 relative z-10" />
                                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4 relative z-10">Why Choose this Site?</h3>
                                <p className="text-slate-600 leading-relaxed relative z-10">
                                    Curated by experienced educators, our content bridges the gap between textbook theory and practical application. We nurture young recruits with pride and care.
                                </p>
                            </div>
                        </div>

                        {/* Recent Content */}
                        {resources.length > 0 && (
                            <div className="animate-slideUp delay-500">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
                                    <h3 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
                                        Recently Added Content
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {resources.slice(0, 3).map((res, idx) => (
                                        <div
                                            key={res.id}
                                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-glass hover:border-brand-orange/30 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                                            onClick={() => setPreviewResource(res)}
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-brand-navy/5 p-3 rounded-xl group-hover:bg-brand-navy group-hover:text-white transition-colors">
                                                    <FileText size={24} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                                                    {res.category}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-lg text-brand-navy mb-2 line-clamp-2 font-serif group-hover:text-brand-orange transition-colors" title={res.title}>
                                                {res.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                                                {res.description}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                                <span className="text-xs text-slate-400 font-medium">{new Date(res.created_at).toLocaleDateString()}</span>
                                                <span className="text-brand-navy text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read Now <ArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- ADMIN PANEL --- */}
                {activeSection === 'admin' && (
                    <AdminPanel
                        resources={resources}
                        onUpload={handleUpload}
                        onDeleteResource={handleDelete}
                        onNoticeUpdate={handleNoticeUpdate}
                        isAuthenticated={isAuthenticated}
                        setIsAuthenticated={setIsAuthenticated}
                        navItems={navItems}
                        onCategoryUpdate={loadCategories}
                    />
                )}

                {/* --- STUDENT PORTAL --- */}
                {activeSection === 'student-request' && (
                    <StudentPortal />
                )}

                {/* --- DYNAMIC RESOURCE SECTIONS & SEARCH --- */}
                {activeSection !== 'home' && activeSection !== 'admin' && activeSection !== 'student-request' && (
                    <div className="animate-fadeIn">
                        <div className="mb-10 text-center md:text-left border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-end gap-4 animate-slideUp">
                            <div>
                                <h2 className="text-4xl font-serif font-bold text-brand-navy mb-2">{getSectionTitle(activeSection)}</h2>
                                <p className="text-slate-500 text-lg">
                                    {activeSection === 'search'
                                        ? `Found ${filteredResources.length} result(s) matching your query.`
                                        : 'Browse curated educational materials in this category.'}
                                </p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-500">
                                {filteredResources.length} Documents
                            </div>
                        </div>

                        {filteredResources.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100 animate-zoomIn">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {activeSection === 'search' ? (
                                        <Search size={48} className="text-slate-300" />
                                    ) : (
                                        <FolderOpen size={48} className="text-slate-300" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No content found</h3>
                                <p className="text-slate-400 max-w-sm mx-auto">
                                    {activeSection === 'search'
                                        ? "We couldn't find any resources matching your keywords. Try different terms."
                                        : "There are no resources uploaded in this category yet. Check back later."}
                                </p>
                                {activeSection === 'search' && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setActiveSection('home'); }}
                                        className="mt-6 px-6 py-2 bg-brand-navy text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        Back to Home
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredResources.map((resource, idx) => (
                                    <div
                                        key={resource.id}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-brand-orange/30 transition-all duration-300 flex flex-col overflow-hidden group h-full animate-slideUp"
                                    >
                                        <div className="p-6 flex-grow flex flex-col">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 bg-brand-greenLight text-brand-orangeDark rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 shadow-sm">
                                                    <FileText size={24} />
                                                </div>
                                                {activeSection === 'search' && (
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-wider">
                                                        {resource.category}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-xl text-brand-navy mb-3 line-clamp-2 font-serif group-hover:text-brand-orange transition-colors leading-tight" title={resource.title}>
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-4 mb-4 flex-grow leading-relaxed">
                                                {resource.description || "Click to read more..."}
                                            </p>

                                            <div className="text-xs text-slate-400 flex flex-col gap-1 mt-auto font-medium">
                                                <span>Added: {new Date(resource.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-3">
                                            <button
                                                onClick={() => setPreviewResource(resource)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-brand-navy text-white py-3 rounded-xl text-sm font-bold hover:bg-brand-orange transition-all shadow-md group-hover:shadow-lg active:scale-95"
                                            >
                                                <Eye size={16} /> Read Content
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />

            <PreviewModal
                resource={previewResource}
                isOpen={!!previewResource}
                onClose={() => setPreviewResource(null)}
            />
        </div>
    );
};

export default App;
