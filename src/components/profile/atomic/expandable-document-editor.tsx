"use client"

import { useState } from "react";
import { ChevronDown, ChevronRight, Shield, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpandableDocumentEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: 'privacy' | 'terms' | 'refund';
}

export function ExpandableDocumentEditor({ 
  title, 
  value, 
  onChange, 
  placeholder = `Escribe tu ${title.toLowerCase()} aquí...`,
  icon = 'privacy'
}: ExpandableDocumentEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'privacy': return Shield;
      case 'terms': return FileText;
      case 'refund': return RefreshCw;
      default: return Shield;
    }
  };

  const IconComponent = getIcon();

  const handleSave = () => {
    setIsModalOpen(false);
    setIsExpanded(false);
  };

  return (
    <>
      <div className="space-y-3">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 bg-interactive-hover border border-border-primary rounded-xl hover:bg-interactive-secondary transition-all duration-300 text-left group "
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-interactive-secondary rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <IconComponent className="h-6 w-6 text-text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-lg">{title}</h4>
              <p className="text-sm text-muted-foreground">
                {value ? `${value.length} caracteres` : 'No configurado'}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        {isExpanded && (
          <div className="pl-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Vista previa: {value ? value.substring(0, 100) + '...' : 'Sin contenido'}
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-interactive-secondary hover:bg-white/20 text-text-primary border border-border-secondary w-full"
            >
              Editar {title}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-primary">Editar {title}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-[500px] p-4 bg-surface-primary border border-border-primary rounded-lg text-text-primary placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm leading-relaxed"
            />
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-border-primary">
            <Button
              variant="outline"
              className="flex-1 hover:bg-interactive-secondary border-border-secondary text-text-primary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-surface-primary text-text-primary hover:bg-surface-secondary font-medium"
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}