import { createClient } from '@supabase/supabase-js';
import { Resource, StudentRequest, Notice } from '../types';

// Safe environment variable access for browser environments (Vite support + standard process.env)
const getEnv = (key: string) => {
    // Check for Vite's import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        return import.meta.env[key];
    }
    // Check for standard process.env safely
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
        // @ts-ignore
        return process.env[key];
    }
    return undefined;
};

// NOTE: Replace these with your actual Project URL and Anon Key from Supabase Dashboard
// You can set these in a .env file as VITE_SUPABASE_URL and VITE_SUPABASE_KEY for Vite
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || 'https://ajgeitxdlssspdmaqstn.supabase.co';
const SUPABASE_KEY = getEnv('VITE_SUPABASE_KEY') || getEnv('SUPABASE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ2VpdHhkbHNzc3BkbWFxc3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDg2NzksImV4cCI6MjA4MDMyNDY3OX0.6Fa21ylvgt7RwEPcMdMWK96tpmDIp6uvNfVuGvIg4X8';

// Initialize client if keys exist and aren't placeholders, otherwise null
const supabase = (SUPABASE_URL !== 'https://xyz.supabase.co')
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// --- AUTHENTICATION ---

export const signIn = async (email: string, pass: string) => {
    if (!supabase) return { user: null, error: 'Supabase not configured' };
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
    });
    return { user: data.user, error: error?.message };
};

export const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
};

export const getUser = async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
};

// --- RESOURCES ---

export const fetchResources = async (): Promise<Resource[]> => {
    if (!supabase) {
        // Fallback to localStorage for demo purposes if Supabase isn't configured
        const local = localStorage.getItem('english_power_resources');
        return local ? JSON.parse(local) : [];
    }

    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
    return data as Resource[];
};

export const createResource = async (resource: Omit<Resource, 'id' | 'created_at'>): Promise<Resource | null> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_resources');
        const current = local ? JSON.parse(local) : [];
        const newRes = { ...resource, id: Date.now(), created_at: new Date().toISOString() };
        localStorage.setItem('english_power_resources', JSON.stringify([newRes, ...current]));
        return newRes;
    }

    const { data, error } = await supabase
        .from('resources')
        .insert([resource])
        .select()
        .single();

    if (error) {
        console.error('Error creating resource:', error);
        return null;
    }
    return data as Resource;
};

export const deleteResource = async (id: number): Promise<boolean> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_resources');
        if (local) {
            const parsed = JSON.parse(local) as Resource[];
            const filtered = parsed.filter(r => r.id !== id);
            localStorage.setItem('english_power_resources', JSON.stringify(filtered));
        }
        return true;
    }

    const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting resource:', error);
        return false;
    }
    return true;
};

// --- STUDENT REQUESTS ---

export const fetchRequests = async (): Promise<StudentRequest[]> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_requests');
        return local ? JSON.parse(local) : [];
    }

    const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching requests:', error);
        return [];
    }
    return data as StudentRequest[];
};

export const createRequest = async (request: Omit<StudentRequest, 'id' | 'created_at'>): Promise<boolean> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_requests');
        const current = local ? JSON.parse(local) : [];
        const newReq = { ...request, id: Date.now(), created_at: new Date().toISOString() };
        localStorage.setItem('english_power_requests', JSON.stringify([newReq, ...current]));
        return true;
    }

    const { error } = await supabase
        .from('requests')
        .insert([request]);

    if (error) {
        console.error('Error creating request:', error);
        return false;
    }
    return true;
};

export const deleteRequest = async (id: number): Promise<boolean> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_requests');
        if (local) {
            const parsed = JSON.parse(local) as StudentRequest[];
            const filtered = parsed.filter(r => r.id !== id);
            localStorage.setItem('english_power_requests', JSON.stringify(filtered));
        }
        return true;
    }
    const { error } = await supabase.from('requests').delete().eq('id', id);
    return !error;
};

// --- NOTICE BOARD ---

export const fetchLatestNotice = async (): Promise<Notice | null> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_notice');
        return local ? JSON.parse(local) : null;
    }

    const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows found
        console.error('Error fetching notice:', error);
        return null;
    }
    return data as Notice;
};

export const createNotice = async (content: string): Promise<Notice | null> => {
    if (!supabase) {
        const newNotice = { id: Date.now(), content, created_at: new Date().toISOString() };
        localStorage.setItem('english_power_notice', JSON.stringify(newNotice));
        return newNotice;
    }

    const { data, error } = await supabase
        .from('notices')
        .insert([{ content }])
        .select()
        .single();

    if (error) {
        console.error('Error creating notice:', error);
        return null;
    }
    return data as Notice;
};

// --- CATEGORIES ---

export const fetchCategories = async (): Promise<any[]> => {
    if (!supabase) {
        const local = localStorage.getItem('english_power_categories');
        return local ? JSON.parse(local) : [];
    }

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data;
};

export const createCategory = async (label: string): Promise<any | null> => {
    const slug = label.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    if (!supabase) {
        const local = localStorage.getItem('english_power_categories');
        const current = local ? JSON.parse(local) : [];
        const newCat = { id: Date.now(), label, slug, created_at: new Date().toISOString() };
        localStorage.setItem('english_power_categories', JSON.stringify([...current, newCat]));
        return newCat;
    }

    const { data, error } = await supabase
        .from('categories')
        .insert([{ label, slug }])
        .select()
        .single();

    if (error) {
        console.error('Error creating category:', error);
        return null;
    }
    return data;
};

export const deleteCategory = async (id: number): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
        try {
            const local = localStorage.getItem('english_power_categories');
            if (local) {
                const parsed = JSON.parse(local);
                const initialLength = parsed.length;
                const filtered = parsed.filter((c: any) => c.id !== id);

                if (filtered.length === initialLength) {
                    return { success: false, error: 'Category not found in local storage' };
                }

                localStorage.setItem('english_power_categories', JSON.stringify(filtered));
            }
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
};