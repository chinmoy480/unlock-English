import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Quote } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if value is significantly different to prevent cursor jumping
             if (value === '' || (editorRef.current.innerHTML === '<br>' && value === '')) {
                editorRef.current.innerHTML = '';
            } else if (value !== editorRef.current.innerHTML) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const ToolbarButton = ({ icon: Icon, command, arg, title }: { icon: any, command: string, arg?: string, title: string }) => (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                execCommand(command, arg);
            }}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
                <ToolbarButton icon={Bold} command="bold" title="Bold" />
                <ToolbarButton icon={Italic} command="italic" title="Italic" />
                <ToolbarButton icon={Underline} command="underline" title="Underline" />
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <ToolbarButton icon={Heading1} command="formatBlock" arg="H1" title="Heading 1" />
                <ToolbarButton icon={Heading2} command="formatBlock" arg="H2" title="Heading 2" />
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
                <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
                <ToolbarButton icon={Quote} command="formatBlock" arg="blockquote" title="Quote" />
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
                <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
                <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
            </div>

            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[300px] max-h-[600px] overflow-y-auto p-4 focus:outline-none prose max-w-none prose-sm sm:prose-base text-slate-800"
                style={{ emptyCells: 'show' }}
            />
             {!value && placeholder && (
                <div className="absolute pointer-events-none p-4 text-gray-400 italic top-[50px]">
                    {placeholder}
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;