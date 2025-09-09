"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { Hash, Type, Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';

interface SlashCommand {
  id: string;
  label: string;
  icon: any;
  action: string;
  description: string;
}

const slashCommands: SlashCommand[] = [
  {
    id: 'h1',
    label: 'Encabezado 1',
    icon: Hash,
    action: '# ',
    description: 'Encabezado grande'
  },
  {
    id: 'h2', 
    label: 'Encabezado 2',
    icon: Hash,
    action: '## ',
    description: 'Encabezado mediano'
  },
  {
    id: 'h3',
    label: 'Encabezado 3', 
    icon: Hash,
    action: '### ',
    description: 'Encabezado pequeño'
  },
  {
    id: 'bold',
    label: 'Negrita',
    icon: Bold,
    action: '**texto**',
    description: 'Texto en negritas'
  },
  {
    id: 'italic',
    label: 'Cursiva',
    icon: Italic,
    action: '_texto_',
    description: 'Texto en cursiva'
  },
  {
    id: 'bullet',
    label: 'Lista con viñetas',
    icon: List,
    action: '- ',
    description: 'Lista con puntos'
  },
  {
    id: 'number',
    label: 'Lista numerada',
    icon: ListOrdered,
    action: '1. ',
    description: 'Lista numerada'
  },
  {
    id: 'quote',
    label: 'Cita',
    icon: Quote,
    action: '> ',
    description: 'Bloque de cita'
  }
];

interface NotionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function NotionEditor({ value, onChange, placeholder = "Comienza a escribir...", disabled = false }: NotionEditorProps) {
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [commandsPosition, setCommandsPosition] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const editorRef = useRef<HTMLDivElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Convertir HTML a Markdown
  const htmlToMarkdown = (html: string): string => {
    let markdown = html;
    
    // Headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1');
    
    // Bold and italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, '_$1_');
    
    // Lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n').trim();
    });
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gs, (match, content) => {
      let counter = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/g, () => `${counter++}. $1\n`).trim();
    });
    
    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1');
    
    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/g, '\n');
    markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/g, '$1\n');
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n');
    
    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
    
    return markdown;
  };

  // Convertir Markdown a HTML
  const markdownToHtml = (markdown: string): string => {
    let html = markdown;
    
    // Headings
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (showCommands) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCommand(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCommand(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands.length > 0) {
            executeCommand(filteredCommands[selectedCommand]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowCommands(false);
          setSearchTerm('');
          break;
      }
      return;
    }

    // Detectar cuando escriben "/"
    if (e.key === '/') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textContent = editorRef.current?.textContent || '';
        const cursorPos = range.startOffset;
        
        // Solo mostrar comandos si es al inicio de línea o después de un espacio
        const beforeCursor = textContent.substring(0, cursorPos);
        const lastChar = beforeCursor[beforeCursor.length - 1];
        
        if (cursorPos === 0 || lastChar === '\n' || lastChar === ' ') {
          // Mostrar comandos inmediatamente
          setShowCommands(true);
          setSelectedCommand(0);
          
          // Calcular posición inicial con todos los comandos
          setTimeout(() => {
            updateModalPosition(slashCommands.length);
          }, 0);
        }
      }
    }
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    
    const html = editorRef.current.innerHTML;
    const markdown = htmlToMarkdown(html);
    onChange(markdown);
    
    // Manejar filtrado de comandos
    if (showCommands) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textContent = editorRef.current.textContent || '';
        const cursorPos = range.startOffset;
        
        // Encontrar la posición del último "/"
        const beforeCursor = textContent.substring(0, cursorPos);
        const lastSlashIndex = beforeCursor.lastIndexOf('/');
        
        if (lastSlashIndex !== -1) {
          // Extraer el texto después del "/"
          const searchQuery = beforeCursor.substring(lastSlashIndex + 1);
          
          // Si hay espacios o saltos de línea, ocultar comandos
          if (searchQuery.includes(' ') || searchQuery.includes('\n')) {
            setShowCommands(false);
            setSearchTerm('');
          } else {
            setSearchTerm(searchQuery.toLowerCase());
          }
        } else {
          setShowCommands(false);
          setSearchTerm('');
        }
      } else {
        setShowCommands(false);
        setSearchTerm('');
      }
    }
  };

  // Filtrar comandos según el término de búsqueda
  const filteredCommands = slashCommands.filter(command => {
    if (!searchTerm) return true;
    
    return (
      command.label.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.id.toLowerCase().includes(searchTerm)
    );
  });

  // Función para actualizar la posición del modal
  const updateModalPosition = useCallback((commandCount: number = filteredCommands.length) => {
    if (!editorRef.current || !showCommands) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    
    if (editorRect) {
      const modalWidth = 320;
      const modalHeight = Math.min(commandCount * 48 + 16, 280);
      const lineHeight = 24; // Approximate line height
      const minClearance = 8; // Minimum clearance from cursor line
      
      // Posición horizontal - preferir alineación con cursor
      let x = rect.left - editorRect.left;
      x = Math.max(8, Math.min(x, editorRect.width - modalWidth - 8));
      
      // Posición vertical - calcular dentro del editor con clearance inteligente
      const editorHeight = editorRef.current.clientHeight;
      const cursorRelativeY = rect.top - editorRect.top;
      const cursorBottom = rect.bottom - editorRect.top;
      
      // Calcular espacio disponible
      const spaceBelow = editorHeight - cursorBottom;
      const spaceAbove = cursorRelativeY;
      
      let y;
      
      // Algoritmo mejorado de posicionamiento
      if (spaceBelow >= modalHeight + minClearance + lineHeight) {
        // Suficiente espacio debajo - colocar debajo con clearance
        y = cursorBottom + minClearance + lineHeight;
      } else if (spaceAbove >= modalHeight + minClearance + lineHeight) {
        // Suficiente espacio arriba - colocar arriba con clearance
        y = cursorRelativeY - modalHeight - minClearance - lineHeight;
      } else {
        // Espacio limitado - usar posicionamiento inteligente
        if (spaceBelow > spaceAbove) {
          // Más espacio debajo - colocar en la parte inferior disponible
          y = Math.min(
            cursorBottom + minClearance + lineHeight,
            editorHeight - modalHeight - 8
          );
        } else {
          // Más espacio arriba - colocar en la parte superior disponible  
          y = Math.max(
            cursorRelativeY - modalHeight - minClearance - lineHeight,
            8
          );
        }
      }
      
      // Asegurar que el modal esté completamente dentro del editor
      y = Math.max(8, Math.min(y, editorHeight - modalHeight - 8));
      
      setCommandsPosition({ x, y });
    }
  }, [filteredCommands.length, showCommands]);
  
  // Actualizar posición cuando cambian los comandos filtrados
  useEffect(() => {
    if (showCommands) {
      updateModalPosition(filteredCommands.length);
    }
  }, [filteredCommands.length, updateModalPosition, showCommands]);

  // Detectar formatos activos en la selección
  const getActiveFormats = (selection: Selection): Set<string> => {
    const formats = new Set<string>();
    if (!selection.rangeCount) return formats;

    let node = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'strong' || element.classList.contains('font-bold')) {
          formats.add('bold');
        }
        if (tagName === 'em' || element.classList.contains('italic')) {
          formats.add('italic');
        }
        if (tagName === 'h1') formats.add('h1');
        if (tagName === 'h2') formats.add('h2');
        if (tagName === 'h3') formats.add('h3');
        if (tagName === 'blockquote') formats.add('quote');
        if (tagName === 'ul') formats.add('bullet');
        if (tagName === 'ol') formats.add('number');
      }
      node = node.parentNode;
    }
    
    return formats;
  };

  // Manejar selección de texto para toolbar
  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowToolbar(false);
      setActiveFormats(new Set());
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    
    if (selectedText.length === 0) {
      setShowToolbar(false);
      setActiveFormats(new Set());
      return;
    }

    // Detectar formatos activos
    const formats = getActiveFormats(selection);
    setActiveFormats(formats);

    // Calcular posición del toolbar
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current?.getBoundingClientRect();
    
    if (editorRect) {
      const toolbarWidth = 280; // Ancho mayor para más botones
      const toolbarHeight = 40; // Altura aproximada del toolbar
      
      // Calcular posición horizontal centrada, pero sin salirse de los bordes
      let x = rect.left + (rect.width / 2) - editorRect.left - (toolbarWidth / 2);
      x = Math.max(0, Math.min(x, editorRect.width - toolbarWidth));
      
      // Calcular posición vertical - arriba o abajo según el espacio disponible
      const spaceAbove = rect.top - editorRect.top;
      let y;
      
      if (spaceAbove < toolbarHeight) {
        // No hay espacio arriba, posicionar debajo del texto seleccionado
        y = rect.bottom - editorRect.top + 5;
      } else {
        // Hay espacio arriba, posicionar arriba del texto seleccionado
        y = rect.top - editorRect.top - toolbarHeight;
      }
      
      setToolbarPosition({ x, y });
      setShowToolbar(true);
    }
  };

  // Aplicar formato al texto seleccionado (con toggle)
  const applyFormat = (format: string) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (!selectedText) return;

    const isActive = activeFormats.has(format);
    
    if (isActive) {
      // Remover formato existente
      removeFormat(format, selection, range);
    } else {
      // Verificar si se puede aplicar el formato
      if (!canApplyFormat(format)) {
        // Si no se puede aplicar (ej: ya hay otro heading), primero remover conflictos
        const blockFormats = ['h1', 'h2', 'h3', 'quote'];
        if (blockFormats.includes(format)) {
          // Remover cualquier formato de bloque existente
          blockFormats.forEach(blockFormat => {
            if (activeFormats.has(blockFormat)) {
              removeFormat(blockFormat, selection, range);
            }
          });
        }
      }
      
      // Aplicar nuevo formato
      addFormat(format, selection, range);
    }
    
    // Mantener selección y actualizar estados
    setTimeout(() => {
      const newSelection = window.getSelection();
      if (newSelection && newSelection.rangeCount > 0) {
        // Recrear la selección si es necesario
        const newRange = newSelection.getRangeAt(0);
        if (newRange.toString().trim()) {
          const newFormats = getActiveFormats(newSelection);
          setActiveFormats(newFormats);
        } else {
          // Si perdimos la selección, ocultamos el toolbar
          setShowToolbar(false);
        }
      } else {
        setShowToolbar(false);
      }
    }, 50);
    
    handleInput(); // Actualizar markdown
  };

  // Agregar formato
  const addFormat = (format: string, selection: Selection, range: Range) => {
    // Para formatos inline simples, usar execCommand para mejor funcionamiento
    if (format === 'bold') {
      document.execCommand('bold', false);
      return;
    }
    if (format === 'italic') {
      document.execCommand('italic', false);
      return;
    }

    // Para elementos de bloque, crear manualmente
    let element: HTMLElement;
    
    switch (format) {
      case 'h1':
        element = document.createElement('h1');
        element.className = 'text-2xl font-bold text-text-primary mb-3 mt-4';
        break;
      case 'h2':
        element = document.createElement('h2');
        element.className = 'text-xl font-semibold text-text-primary mb-2 mt-4';
        break;
      case 'h3':
        element = document.createElement('h3');
        element.className = 'text-lg font-semibold text-text-primary mb-2 mt-4';
        break;
      case 'quote':
        element = document.createElement('blockquote');
        element.className = 'border-l-4 border-border-secondary pl-4 italic text-text-secondary my-2';
        break;
      default:
        return;
    }

    const contents = range.extractContents();
    element.appendChild(contents);
    range.insertNode(element);
  };

  // Remover formato usando execCommand para mejor compatibilidad
  const removeFormat = (format: string, selection: Selection, range: Range) => {
    // Para formatos inline simples, usar execCommand
    if (format === 'bold') {
      document.execCommand('bold', false);
      return;
    }
    if (format === 'italic') {
      document.execCommand('italic', false);
      return;
    }

    // Para elementos de bloque (headings, quotes), extraer manualmente
    const commonAncestor = range.commonAncestorContainer;
    let element = commonAncestor.nodeType === Node.ELEMENT_NODE ? 
      commonAncestor as Element : 
      commonAncestor.parentElement;

    while (element && element !== editorRef.current) {
      const tagName = element.tagName?.toLowerCase();
      
      const shouldRemove = 
        (format === 'h1' && tagName === 'h1') ||
        (format === 'h2' && tagName === 'h2') ||
        (format === 'h3' && tagName === 'h3') ||
        (format === 'quote' && tagName === 'blockquote');
        
      if (shouldRemove) {
        // Crear un nuevo div para reemplazar el elemento
        const replacement = document.createElement('div');
        replacement.className = 'text-text-primary leading-relaxed my-1';
        
        // Mover todo el contenido
        while (element.firstChild) {
          replacement.appendChild(element.firstChild);
        }
        
        // Reemplazar el elemento
        if (element.parentNode) {
          element.parentNode.replaceChild(replacement, element);
        }
        break;
      }
      element = element.parentElement;
    }
  };

  // Verificar si se puede aplicar un formato (prevenir conflictos)
  const canApplyFormat = (format: string): boolean => {
    // Los formatos de bloque son excluyentes entre sí
    const blockFormats = ['h1', 'h2', 'h3', 'quote'];
    
    if (blockFormats.includes(format)) {
      // Si ya hay otro formato de bloque, no permitir
      const hasOtherBlockFormat = blockFormats
        .filter(f => f !== format)
        .some(f => activeFormats.has(f));
      
      return !hasOtherBlockFormat;
    }
    
    return true;
  };

  const executeCommand = (command: SlashCommand) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textContent = editorRef.current.textContent || '';
    const cursorPos = range.startOffset;
    
    // Encontrar la posición del último "/"
    const beforeCursor = textContent.substring(0, cursorPos);
    const lastSlashIndex = beforeCursor.lastIndexOf('/');
    
    if (lastSlashIndex !== -1) {
      // Remover el "/" y todo el texto de búsqueda después
      const charsToRemove = cursorPos - lastSlashIndex;
      range.setStart(range.startContainer, Math.max(0, range.startOffset - charsToRemove));
      range.deleteContents();
    }

    let element: HTMLElement;

    switch (command.id) {
      case 'h1':
        element = document.createElement('h1');
        element.className = 'text-2xl font-bold text-text-primary mb-3 mt-4';
        element.textContent = '';
        break;
      case 'h2':
        element = document.createElement('h2');
        element.className = 'text-xl font-semibold text-text-primary mb-2 mt-4';
        element.textContent = '';
        break;
      case 'h3':
        element = document.createElement('h3');
        element.className = 'text-lg font-semibold text-text-primary mb-2 mt-4';
        element.textContent = '';
        break;
      case 'bold':
        element = document.createElement('strong');
        element.className = 'font-bold';
        element.textContent = 'texto';
        break;
      case 'italic':
        element = document.createElement('em');
        element.className = 'italic';
        element.textContent = 'texto';
        break;
      case 'bullet':
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.textContent = '';
        ul.appendChild(li);
        element = ul;
        break;
      case 'number':
        const ol = document.createElement('ol');
        const oli = document.createElement('li');
        oli.textContent = '';
        ol.appendChild(oli);
        element = ol;
        break;
      case 'quote':
        element = document.createElement('blockquote');
        element.className = 'border-l-4 border-border-secondary pl-4 italic text-text-secondary my-2';
        element.textContent = '';
        break;
      default:
        return;
    }

    range.insertNode(element);
    
    // Posicionar cursor
    const newRange = document.createRange();
    const textNode = element.firstChild?.firstChild || element;
    if (textNode.nodeType === Node.TEXT_NODE) {
      newRange.setStart(textNode, 0);
      newRange.setEnd(textNode, 0);
    } else {
      newRange.selectNodeContents(element);
      newRange.collapse(false);
    }
    
    selection.removeAllRanges();
    selection.addRange(newRange);

    setShowCommands(false);
    setSearchTerm('');
    handleInput(); // Update the markdown value
  };

  // Inicializar el contenido del editor cuando cambia el value
  useEffect(() => {
    if (editorRef.current && value !== htmlToMarkdown(editorRef.current.innerHTML)) {
      editorRef.current.innerHTML = markdownToHtml(value);
    }
  }, [value]);

  // Resetear selectedCommand cuando cambia el filtro
  useEffect(() => {
    setSelectedCommand(0);
  }, [searchTerm]);

  // Manejar selección y clicks fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandsRef.current && !commandsRef.current.contains(event.target as Node)) {
        setShowCommands(false);
      }
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node) && !editorRef.current?.contains(event.target as Node)) {
        setShowToolbar(false);
      }
    };

    const handleSelectionChange = () => {
      // Pequeño delay para que la selección se complete
      setTimeout(handleSelection, 10);
    };

    if (showCommands) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, [showCommands]);

  return (
    <div className="relative">
      {/* Editor contentEditable */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="notion-editor-textarea w-full min-h-96 bg-transparent p-0 text-text-primary resize-none text-base leading-relaxed font-normal focus:outline-none"
        style={{
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          lineHeight: '1.6',
          letterSpacing: '0.01em',
          border: 'none !important',
          outline: 'none !important',
          boxShadow: 'none !important'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Placeholder cuando está vacío */}
      {!value && (
        <div 
          className="absolute inset-0 pointer-events-none text-text-tertiary text-base leading-relaxed"
          style={{
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: '1.6',
            letterSpacing: '0.01em'
          }}
        >
          {placeholder}
        </div>
      )}

      {/* Toolbar flotante para texto seleccionado */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="absolute bg-surface-elevated border border-border-primary rounded-lg shadow-xl py-1 px-1 z-30 flex items-center gap-1"
          style={{
            left: toolbarPosition.x,
            top: toolbarPosition.y
          }}
        >
          <button
            onClick={() => applyFormat('bold')}
            className={`p-2 hover:bg-interactive-hover rounded transition-all duration-200 ${
              activeFormats.has('bold') ? 'bg-interactive-hover text-text-primary' : 'text-text-primary'
            }`}
            title="Negrita"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className={`p-2 hover:bg-interactive-hover rounded transition-all duration-200 ${
              activeFormats.has('italic') ? 'bg-interactive-hover text-text-primary' : 'text-text-primary'
            }`}
            title="Cursiva"
          >
            <Italic className="h-4 w-4" />
          </button>
          
          <div className="w-px h-4 bg-border-secondary mx-1" />
          
          <button
            onClick={() => applyFormat('h1')}
            disabled={!canApplyFormat('h1') && !activeFormats.has('h1')}
            className={`p-2 rounded transition-all duration-200 text-xs font-medium ${
              activeFormats.has('h1') 
                ? 'bg-interactive-hover text-text-primary' 
                : canApplyFormat('h1')
                  ? 'text-text-primary hover:bg-interactive-hover'
                  : 'text-text-tertiary cursor-not-allowed'
            }`}
            title="Encabezado 1"
          >
            H1
          </button>
          <button
            onClick={() => applyFormat('h2')}
            disabled={!canApplyFormat('h2') && !activeFormats.has('h2')}
            className={`p-2 rounded transition-all duration-200 text-xs font-medium ${
              activeFormats.has('h2') 
                ? 'bg-interactive-hover text-text-primary' 
                : canApplyFormat('h2')
                  ? 'text-text-primary hover:bg-interactive-hover'
                  : 'text-text-tertiary cursor-not-allowed'
            }`}
            title="Encabezado 2"
          >
            H2
          </button>
          <button
            onClick={() => applyFormat('h3')}
            disabled={!canApplyFormat('h3') && !activeFormats.has('h3')}
            className={`p-2 rounded transition-all duration-200 text-xs font-medium ${
              activeFormats.has('h3') 
                ? 'bg-interactive-hover text-text-primary' 
                : canApplyFormat('h3')
                  ? 'text-text-primary hover:bg-interactive-hover'
                  : 'text-text-tertiary cursor-not-allowed'
            }`}
            title="Encabezado 3"
          >
            H3
          </button>
          
          <div className="w-px h-4 bg-border-secondary mx-1" />
          
          <button
            onClick={() => applyFormat('quote')}
            disabled={!canApplyFormat('quote') && !activeFormats.has('quote')}
            className={`p-2 rounded transition-all duration-200 ${
              activeFormats.has('quote') 
                ? 'bg-interactive-hover text-text-primary' 
                : canApplyFormat('quote')
                  ? 'text-text-primary hover:bg-interactive-hover'
                  : 'text-text-tertiary cursor-not-allowed'
            }`}
            title="Cita"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Menú de comandos */}
      {showCommands && (
        <div
          ref={commandsRef}
          className="absolute bg-surface-elevated backdrop-blur-xl border border-border-primary rounded-lg shadow-2xl py-2 min-w-80 max-h-72 overflow-y-auto z-20 transition-all duration-200 ease-in-out"
          style={{
            left: commandsPosition.x,
            top: commandsPosition.y
          }}
        >
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;
              return (
                <button
                  key={command.id}
                  onClick={() => executeCommand(command)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-interactive-hover transition-colors text-left ${
                    index === selectedCommand ? 'bg-interactive-hover' : ''
                  }`}
                >
                  <div className="w-8 h-8 bg-surface-tertiary rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-text-primary" />
                  </div>
                  <div>
                    <div className="text-text-primary font-medium text-sm">{command.label}</div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-text-tertiary text-sm text-center">
              No se encontraron comandos para "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Estilos CSS para el editor */}
      <style jsx>{`
        .notion-editor-textarea h1 {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--text-primary);
          margin: 1rem 0 0.75rem 0;
          line-height: 1.2;
        }
        .notion-editor-textarea h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem 0;
          line-height: 1.3;
        }
        .notion-editor-textarea h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }
        .notion-editor-textarea blockquote {
          border-left: 4px solid var(--border-secondary);
          padding-left: 1rem;
          font-style: italic;
          color: var(--text-secondary);
          margin: 0.5rem 0;
        }
        .notion-editor-textarea ul, .notion-editor-textarea ol {
          margin: 0.5rem 0;
          padding-left: 0;
        }
        .notion-editor-textarea ul li {
          list-style: none;
          margin: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--text-primary);
          line-height: 1.6;
        }
        .notion-editor-textarea ul li::before {
          content: "•";
          color: var(--text-secondary);
          font-weight: bold;
          position: absolute;
          left: 0.5rem;
          top: 0;
        }
        .notion-editor-textarea ol {
          counter-reset: item;
        }
        .notion-editor-textarea ol li {
          list-style: none;
          margin: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--text-primary);
          line-height: 1.6;
          counter-increment: item;
        }
        .notion-editor-textarea ol li::before {
          content: counter(item) ".";
          color: var(--text-secondary);
          font-weight: 500;
          position: absolute;
          left: 0.5rem;
          top: 0;
        }
        .notion-editor-textarea strong {
          font-weight: bold;
          color: var(--text-primary);
        }
        .notion-editor-textarea em {
          font-style: italic;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}