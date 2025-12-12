import React, { useState } from 'react';
import { Send, BookOpen, User, Hash, MessageCircle } from 'lucide-react';
import { createRequest } from '../services/supabaseService';

const StudentPortal: React.FC = () => {
    const [name, setName] = useState('');
    const [roll, setRoll] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await createRequest({
            student_name: name,
            class_roll: roll,
            topic: topic,
            message: message
        });

        setIsSubmitting(false);
        if (success) {
            alert("Your request has been submitted successfully to the teacher!");
            setName('');
            setRoll('');
            setTopic('');
            setMessage('');
        } else {
            alert("Failed to submit request. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-zoomIn">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform hover:shadow-2xl transition-all duration-500">
                <div className="bg-brand-navy p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange rounded-full opacity-10 -mr-10 -mt-10 animate-pulseSlow"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-green rounded-full opacity-10 -ml-10 -mb-10 animate-float"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner animate-slideUp">
                            <BookOpen size={32} className="text-brand-orange" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold animate-slideUp delay-100">Student Request Portal</h2>
                        <p className="text-brand-greenLight text-sm mt-2 font-light animate-slideUp delay-200">Submit your request for Model Questions, Paragraphs, or specific topics.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn delay-300">
                        <div className="space-y-2 group">
                            <label className="text-sm font-bold text-brand-navy flex items-center gap-2 group-focus-within:text-brand-orange transition-colors">
                                <User size={16} className="text-brand-orange" /> Full Name
                            </label>
                            <input 
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder-slate-400"
                                placeholder="e.g. Anika Tabassum"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-sm font-bold text-brand-navy flex items-center gap-2 group-focus-within:text-brand-orange transition-colors">
                                <Hash size={16} className="text-brand-orange" /> Class & Roll
                            </label>
                            <input 
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder-slate-400"
                                placeholder="e.g. Class 10, Roll 12"
                                value={roll}
                                onChange={e => setRoll(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group animate-fadeIn delay-400">
                        <label className="text-sm font-bold text-brand-navy flex items-center gap-2 group-focus-within:text-brand-orange transition-colors">
                             <BookOpen size={16} className="text-brand-orange" /> Topic Category
                        </label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        >
                            <option value="">Select a topic type...</option>
                            <option value="Model Question">Model Question</option>
                            <option value="Paragraph">Paragraph</option>
                            <option value="Composition">Composition</option>
                            <option value="Grammar Explanation">Grammar Explanation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2 group animate-fadeIn delay-500">
                        <label className="text-sm font-bold text-brand-navy flex items-center gap-2 group-focus-within:text-brand-orange transition-colors">
                             <MessageCircle size={16} className="text-brand-orange" /> Detailed Request
                        </label>
                        <textarea 
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder-slate-400 resize-none"
                            placeholder="Describe exactly what you need help with..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg transform active:scale-[0.99] hover:-translate-y-1 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 animate-slideUp delay-500"
                    >
                        {isSubmitting ? 'Sending...' : (
                            <>
                                <Send size={20} className="animate-pulse" /> Submit Request
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentPortal;