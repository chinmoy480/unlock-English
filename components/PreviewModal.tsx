
import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check } from 'lucide-react';
import { Resource } from '../types';

interface PreviewModalProps {
    resource: Resource | null;
    isOpen: boolean;
    onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ resource, isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !resource) return null;



    const handleCopy = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = resource.content;
        const text = tempDiv.innerText;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 bg-brand-navy text-white flex justify-between items-center shrink-0 border-b border-brand-navyLight">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-orange p-2 rounded-lg text-white">
                            <FileText size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md font-serif tracking-wide">{resource.title}</h2>
                            <p className="text-xs text-brand-green">Category: {resource.category}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto bg-gray-50 flex-1 custom-scrollbar">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                        <div
                            className="prose max-w-none prose-slate prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-orange hover:prose-a:text-orange-700 prose-img:rounded-lg"
                            dangerouslySetInnerHTML={{ __html: resource.content }}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex flex-wrap items-center justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors font-medium text-sm"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
                    >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy Text"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
