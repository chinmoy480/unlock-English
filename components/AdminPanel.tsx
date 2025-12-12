import React, { useState, useEffect } from 'react';
import { Lock, LogIn, FilePlus, Trash2, MessageSquare, RefreshCw, Bell, LayoutDashboard } from 'lucide-react';
import { Resource, StudentRequest, APP_CONSTANTS, NAV_STRUCTURE, Notice, NavItem } from '../types';
import RichTextEditor from './RichTextEditor';
import { fetchRequests, deleteRequest, createNotice, fetchLatestNotice, createCategory, deleteCategory } from '../services/supabaseService';

interface AdminPanelProps {
    resources: Resource[];
    onUpload: (resource: Omit<Resource, 'id' | 'created_at'>) => void;
    onDeleteResource: (id: number) => void;
    onNoticeUpdate: (notice: Notice) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    navItems?: NavItem[];
    onCategoryUpdate?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ resources, onUpload, onDeleteResource, onNoticeUpdate, isAuthenticated, setIsAuthenticated, navItems = NAV_STRUCTURE, onCategoryUpdate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'requests' | 'notice' | 'categories'>('content');
    const [user, setUser] = useState<any>(null);

    // Initial Auth Check
    useEffect(() => {
        const checkUser = async () => {
            const { getUser } = await import('../services/supabaseService');
            const currentUser = await getUser();
            if (currentUser) {
                setIsAuthenticated(true);
                setUser(currentUser);
            }
        };
        checkUser();
    }, [setIsAuthenticated]);

    // Cleanup resources if they are state dependent, though mostly handled by parent.

    // Upload State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');

    // Requests State
    const [requests, setRequests] = useState<StudentRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    // Notice State
    const [noticeText, setNoticeText] = useState('');
    const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);

    // Category State
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'requests') loadRequests();
            if (activeTab === 'notice') loadNotice();
        }
    }, [isAuthenticated, activeTab]);

    const loadRequests = async () => {
        setLoadingRequests(true);
        const data = await fetchRequests();
        setRequests(data);
        setLoadingRequests(false);
    };

    const loadNotice = async () => {
        const data = await fetchLatestNotice();
        setCurrentNotice(data);
        if (data) setNoticeText(data.content);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { signIn } = await import('../services/supabaseService');
        const { user, error } = await signIn(email, password);

        if (error) {
            setError(error);
        } else if (user) {
            setIsAuthenticated(true);
            setUser(user);
        }
    };

    const handleLogout = async () => {
        const { signOut } = await import('../services/supabaseService');
        await signOut();
        setIsAuthenticated(false);
        setUser(null);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !content) {
            alert('Please fill in all required fields');
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const description = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');

        onUpload({
            title,
            category,
            description,
            content
        });

        setTitle('');
        setCategory('');
        setContent('');
        alert('Content published successfully!');
    };

    const handleDeleteRequest = async (id: number) => {
        if (window.confirm("Delete this student request?")) {
            const success = await deleteRequest(id);
            if (success) {
                setRequests(prev => prev.filter(r => r.id !== id));
            }
        }
    };

    const handleUpdateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noticeText.trim()) return;

        const updated = await createNotice(noticeText);
        if (updated) {
            setCurrentNotice(updated);
            onNoticeUpdate(updated);
            alert("Notice Board updated successfully!");
        } else {
            alert("Failed to update notice.");
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setIsAddingCategory(true);
        const created = await createCategory(newCategory);
        setIsAddingCategory(false);

        if (created) {
            alert(`Category "${created.label}" added!`);
            setNewCategory('');
            if (onCategoryUpdate) onCategoryUpdate();
        } else {
            alert("Failed to add category.");
        }
    };

    const confirmDeleteCategory = async (id: number) => {
        const result = await deleteCategory(id);

        if (result.success) {
            alert("Category deleted successfully. Page will reload.");
            window.location.reload(); // Force reload to ensure menu updates
        } else {
            alert(`Failed to delete: ${result.error}`);
            setDeletingId(null);
        }
    };

    const getCategories = () => {
        const flatten = (items: any[]): any[] => {
            let res: any[] = [];
            items.forEach(item => {
                if (item.children) res = [...res, ...flatten(item.children)];
                else if (item.id && !['home', 'admin', 'student-request'].includes(item.id)) res.push(item);
            });
            return res;
        }
        return flatten(navItems);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4 animate-zoomIn">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-brand-navy p-6 text-center relative">
                        <div className="absolute inset-0 bg-brand-orange opacity-10 blur-xl animate-pulseSlow"></div>
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner relative z-10 animate-float">
                            <Lock size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white relative z-10">Admin Portal</h2>
                        <p className="text-brand-greenLight text-sm mt-1 relative z-10">Security Clearance Required</p>
                    </div>

                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        <div className="group">
                            <label className="block text-sm font-bold text-brand-navy mb-2 group-focus-within:text-brand-orange transition-colors">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-sm font-bold text-brand-navy mb-2 group-focus-within:text-brand-orange transition-colors">Access Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter credentials..."
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-slideUp">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-brand-navy hover:bg-slate-800 text-white py-3 rounded-lg transition-colors font-bold flex justify-center items-center gap-2 hover:scale-[1.02] transform duration-200"
                        >
                            <LogIn size={18} /> Authenticate
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Dashboard Header & Tabs */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 animate-slideUp">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-navy p-3 rounded-lg text-white shadow-lg shadow-brand-navy/30">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-brand-navy">Dashboard</h2>
                        <p className="text-slate-500 text-sm">Manage your platform content</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-sm font-bold transition-colors"
                >
                    Sign Out
                </button>

                <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'content' ? 'bg-white text-brand-navy shadow-sm transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Manage Content
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'requests' ? 'bg-white text-brand-navy shadow-sm transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('notice')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none flex items-center justify-center gap-2 ${activeTab === 'notice' ? 'bg-white text-brand-navy shadow-sm transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Bell size={16} /> Notice
                    </button>

                    <div className="w-px h-6 bg-slate-300 mx-1 hidden md:block"></div>

                    <div className="relative group">
                        <button
                            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition-all flex items-center gap-2"
                            onClick={() => setActiveTab('categories')}
                        >
                            <FilePlus size={16} /> Categories
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'categories' && (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Add Form */}
                        <div className="md:w-1/3 space-y-6">
                            <div className="pb-4 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-brand-navy mb-2">Add Category</h3>
                                <p className="text-sm text-slate-500">Create new menu items for your content.</p>
                            </div>
                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-bold text-brand-navy mb-2">Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Poetry"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAddingCategory}
                                    className="w-full py-3 bg-brand-navy text-white rounded-lg hover:bg-slate-800 transition-colors font-bold flex justify-center items-center gap-2"
                                >
                                    {isAddingCategory ? <RefreshCw size={18} className="animate-spin" /> : <FilePlus size={18} />}
                                    Add Category
                                </button>
                            </form>
                        </div>

                        {/* List */}
                        <div className="md:w-2/3">
                            <h3 className="text-xl font-bold text-brand-navy mb-4">Manage Categories</h3>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                {navItems.filter(item => item.dbId).length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        No custom categories added yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-200">
                                        {navItems.filter(item => item.dbId).map((item) => (
                                            <div key={item.dbId} className="p-4 flex justify-between items-center hover:bg-white transition-colors">
                                                <span className="font-bold text-brand-navy">{item.label}</span>
                                                <div className="flex items-center gap-2">
                                                    {deletingId === item.dbId ? (
                                                        <div className="flex items-center gap-2 animate-fadeIn">
                                                            <span className="text-xs text-red-500 font-bold">Confirm?</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => confirmDeleteCategory(item.dbId!)}
                                                                className="p-1 px-2 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition-colors"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingId(null)}
                                                                className="p-1 px-2 bg-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-300 transition-colors"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setDeletingId(item.dbId!);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
                    {/* Left Col: Upload Form */}
                    <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-slideInRight delay-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <FilePlus size={24} className="text-brand-orange" />
                            <h3 className="text-xl font-bold text-brand-navy">Create Content</h3>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-bold text-brand-navy group-focus-within:text-brand-orange transition-colors">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all"
                                        placeholder="Content Title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-bold text-brand-navy group-focus-within:text-brand-orange transition-colors">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {getCategories().map((cat, idx) => (
                                            <option key={idx} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brand-navy">Content Body</label>
                                <RichTextEditor value={content} onChange={setContent} placeholder="Start typing your content here..." />
                            </div>
                            <button type="submit" className="w-full bg-brand-navy text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-lg transform hover:-translate-y-1 active:scale-[0.99] duration-200">
                                Publish Now
                            </button>
                        </form>
                    </div>

                    {/* Right Col: Existing List */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] animate-slideUp delay-200">
                        <h3 className="text-lg font-bold text-brand-navy mb-4">Recent Uploads</h3>
                        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-3">
                            {resources.length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-10">No content uploaded yet.</p>
                            ) : (
                                resources.map((res, index) => (
                                    <div
                                        key={res.id}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        className="p-4 rounded-xl border border-slate-100 hover:border-brand-orange/30 hover:shadow-md transition-all group bg-slate-50 animate-slideUp"
                                    >
                                        <h4 className="font-bold text-brand-navy text-sm mb-1 line-clamp-1">{res.title}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">{res.category}</span>
                                            <button
                                                onClick={() => onDeleteResource(res.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-slideUp">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                            <MessageSquare className="text-brand-orange" /> Student Inbox
                        </h3>
                        <button onClick={loadRequests} className="p-2 hover:bg-slate-100 rounded-full text-brand-navy transition-colors hover:rotate-180 duration-500" title="Refresh">
                            <RefreshCw size={20} className={loadingRequests ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    {loadingRequests ? (
                        <div className="text-center py-10 text-slate-500 animate-pulse">Loading requests...</div>
                    ) : (
                        <div className="overflow-x-auto -mx-6 md:mx-0">
                            <div className="min-w-[800px] px-6 md:px-0">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold">
                                            <th className="pb-4 pl-4">Student Info</th>
                                            <th className="pb-4">Topic</th>
                                            <th className="pb-4">Message Details</th>
                                            <th className="pb-4 text-right pr-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {requests.length === 0 ? (
                                            <tr><td colSpan={5} className="p-10 text-center text-slate-400">No pending requests.</td></tr>
                                        ) : (
                                            requests.map((req, index) => (
                                                <tr
                                                    key={req.id}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                    className="hover:bg-slate-50 transition-colors group animate-slideUp"
                                                >
                                                    <td className="py-4 pl-4 align-top">
                                                        <div className="font-bold text-brand-navy">{req.student_name}</div>
                                                        <div className="text-xs text-slate-500">{req.class_roll}</div>
                                                    </td>
                                                    <td className="py-4 align-top">
                                                        <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2 py-1 rounded border border-orange-100">{req.topic}</span>
                                                    </td>
                                                    <td className="py-4 align-top text-sm text-slate-600 max-w-md leading-relaxed">
                                                        {req.message}
                                                        <div className="text-[10px] text-slate-400 mt-1">{new Date(req.created_at).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="py-4 pr-4 align-top text-right">
                                                        <button onClick={() => handleDeleteRequest(req.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all transform hover:scale-110">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'notice' && (
                <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-zoomIn">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Bell size={32} className="text-brand-orange" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy">Update Marquee Notice</h3>
                        <p className="text-slate-500 text-sm">This message scrolls across the home page.</p>
                    </div>

                    <div className="mb-8 p-4 bg-brand-navy rounded-xl border border-brand-navy text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-brand-orange/10 animate-pulseSlow"></div>
                        <h4 className="text-xs uppercase tracking-wider opacity-70 mb-2 font-bold relative z-10">Preview:</h4>
                        <div className="font-medium text-brand-orange truncate relative z-10">{currentNotice ? currentNotice.content : 'No active notice.'}</div>
                    </div>

                    <form onSubmit={handleUpdateNotice} className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-bold text-brand-navy mb-2 group-focus-within:text-brand-orange transition-colors">New Message</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all resize-none"
                                placeholder="Enter the text to display..."
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-brand-orange hover:bg-orange-600 text-white py-3 rounded-xl transition-colors font-bold shadow-lg transform active:scale-[0.99] hover:-translate-y-1 duration-200"
                        >
                            Update Notice
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;