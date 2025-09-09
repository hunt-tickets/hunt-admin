"use client"

import { useState } from "react";
import { Bold, Italic, List, Link, Eye, Edit } from "lucide-react";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  showPreview?: boolean;
  height?: 'small' | 'medium' | 'large';
}

export function MarkdownEditor({ 
  value = '',
  onChange,
  label,
  placeholder = "# Título\n\nEscribe tu contenido en **markdown**...",
  disabled = false,
  error = false,
  showPreview = true,
  height = 'medium'
}: MarkdownEditorProps) {
  const [text, setText] = useState(value);
  const [isPreview, setIsPreview] = useState(false);

  const getHeight = () => {
    switch (height) {
      case 'small': return 'h-32';
      case 'large': return 'h-96';
      default: return 'h-48';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange?.(newText);
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    setText(newText);
    onChange?.(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const renderPreview = (markdown: string) => {
    // Simple markdown to HTML conversion for preview
    return markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-interactive-primary underline">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="relative">
      {label && (
        <label className="text-sm font-medium text-text-primary block mb-2">{label}</label>
      )}
      
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            disabled={disabled}
            className="p-2 hover:bg-interactive-secondary rounded-lg transition-colors disabled:opacity-50"
            title="Negrita"
          >
            <Bold className="h-4 w-4 text-text-secondary" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            disabled={disabled}
            className="p-2 hover:bg-interactive-secondary rounded-lg transition-colors disabled:opacity-50"
            title="Cursiva"
          >
            <Italic className="h-4 w-4 text-text-secondary" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('* ')}
            disabled={disabled}
            className="p-2 hover:bg-interactive-secondary rounded-lg transition-colors disabled:opacity-50"
            title="Lista"
          >
            <List className="h-4 w-4 text-text-secondary" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('[', '](url)')}
            disabled={disabled}
            className="p-2 hover:bg-interactive-secondary rounded-lg transition-colors disabled:opacity-50"
            title="Enlace"
          >
            <Link className="h-4 w-4 text-text-secondary" />
          </button>
        </div>
        
        {showPreview && (
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isPreview 
                ? 'bg-interactive-secondary text-text-primary' 
                : 'text-text-secondary hover:text-text-primary hover:bg-interactive-secondary'
            }`}
          >
            {isPreview ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {isPreview ? 'Editar' : 'Preview'}
          </button>
        )}
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {isPreview ? (
          <div className={`glassmorphism-input w-full ${getHeight()} px-3 py-3 rounded-lg overflow-auto`}>
            <div 
              className="prose prose-sm max-w-none text-text-primary"
              dangerouslySetInnerHTML={{ __html: renderPreview(text) }}
            />
          </div>
        ) : (
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`glassmorphism-input w-full ${getHeight()} px-3 py-3 rounded-lg transition-all resize-none ${
              error ? 'border-status-error' : 'hover:border-border-focus'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        )}
      </div>
    </div>
  );
}