"use client"

import { useState } from "react";
import { FileText, Shield, DollarSign, Edit, Eye, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import type { TabContentProps } from "@/types/tabs";
import { PolicyItem, PolicyType } from "@/types/policies";
import { usePolicies } from "@/hooks/use-policies";
import { NotionEditor } from "@/components/profile/atomic/notion-editor";

// Icon mapping for policy types
const iconMap = {
  FileText,
  Shield, 
  DollarSign
};

export function PoliticasTab({ producerId, currentProducer }: TabContentProps) {
  const [editingId, setEditingId] = useState<PolicyType | null>(null);
  const [viewingId, setViewingId] = useState<PolicyType | null>(null);
  const [content, setContent] = useState('');
  
  const {
    policies,
    loading,
    saving,
    error,
    showSuccess,
    updatePolicy,
    clearError
  } = usePolicies({ producerId });

  const handleEdit = (policy: PolicyItem) => {
    setEditingId(policy.id);
    setContent(policy.content);
  };

  const handleView = (policy: PolicyItem) => {
    setViewingId(policy.id);
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    const success = await updatePolicy(editingId, content);
    if (success) {
      setEditingId(null);
      setContent('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setContent('');
    clearError();
  };

  const handleCloseView = () => {
    setViewingId(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Políticas</h3>
          <p className="text-text-secondary">Gestiona tus documentos legales</p>
        </div>

        <div className="grid gap-4">
          {[
            { title: 'Términos y Condiciones', description: 'Reglas de uso del servicio', icon: FileText },
            { title: 'Política de Privacidad', description: 'Manejo de datos personales', icon: Shield },
            { title: 'Política de Reembolso', description: 'Condiciones de devolución', icon: DollarSign }
          ].map((policy, index) => {
            const Icon = policy.icon;
            return (
              <div key={index}>
                <div className="bg-surface-elevated backdrop-blur-sm border border-border-secondary p-6 rounded-xl animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-tertiary border border-border-secondary rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-text-primary/40" />
                      </div>
                      <div>
                        <div className="h-5 bg-surface-tertiary rounded w-40 mb-2"></div>
                        <div className="h-4 bg-surface-tertiary/50 rounded w-32"></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="w-10 h-10 bg-surface-tertiary border border-border-secondary rounded-lg"></div>
                      <div className="w-10 h-10 bg-surface-tertiary border border-border-secondary rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Políticas</h3>
          <p className="text-text-secondary">Gestiona tus documentos legales</p>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-300">Política guardada correctamente</span>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-300">{error}</span>
            <button 
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {policies.map((policy) => {
            const Icon = iconMap[policy.icon as keyof typeof iconMap];
            
            return (
              <div key={policy.id}>
                {/* Policy Card */}
                <div className="bg-surface-elevated backdrop-blur-sm border border-border-secondary p-6 rounded-xl hover:bg-interactive-hover transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-tertiary border border-border-secondary rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-text-primary/80" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-text-primary">{policy.title}</h4>
                        <p className="text-sm text-text-secondary">{policy.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(policy)}
                        className="p-2 bg-surface-tertiary border border-border-secondary hover:bg-interactive-hover rounded-lg transition-all duration-200 flex items-center justify-center"
                        disabled={saving}
                        title="Editar política"
                      >
                        <Edit className="h-4 w-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => handleView(policy)}
                        className="p-2 bg-surface-tertiary border border-border-secondary hover:bg-interactive-hover rounded-lg transition-all duration-200 flex items-center justify-center"
                        disabled={saving}
                        title="Ver política"
                      >
                        <Eye className="h-4 w-4 text-text-secondary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals - Outside of glassmorphism container */}
      {policies.map((policy) => (
        <div key={`modal-${policy.id}`}>
          {/* View Modal */}
          {viewingId === policy.id && (
            <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-surface-elevated backdrop-blur-xl border border-border-primary w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-border-secondary flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-medium text-text-primary">{policy.title}</h4>
                    <p className="text-text-secondary">{policy.description}</p>
                  </div>
                  <button
                    onClick={handleCloseView}
                    className="px-4 py-2 bg-surface-tertiary border border-border-secondary hover:bg-interactive-hover rounded-lg text-text-secondary transition-all duration-200"
                  >
                    Cerrar
                  </button>
                </div>
                
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="text-text-primary/80 whitespace-pre-wrap">
                    {policy.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Editor Modal - Lateral */}
          {editingId === policy.id && (
            <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex">
              {/* Overlay para cerrar */}
              <div 
                className="flex-1 cursor-pointer" 
                onClick={handleCancel}
              />
              
              {/* Panel lateral */}
              <div className="w-[600px] bg-surface-elevated border-l border-border-primary h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-border-secondary flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-medium text-text-primary">{policy.title}</h4>
                      <p className="text-text-secondary">{policy.description}</p>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-surface-tertiary border border-border-secondary hover:bg-interactive-hover rounded-lg text-text-secondary hover:text-text-primary transition-all duration-200"
                      disabled={saving}
                      title="Cerrar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto">
                  <NotionEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Comienza a escribir tu política... (escribe / para ver comandos)"
                    disabled={saving}
                  />
                </div>
                
                <div className="p-6 border-t border-border-secondary flex justify-end gap-3 flex-shrink-0">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-surface-tertiary border border-border-secondary hover:bg-interactive-hover rounded-lg text-text-secondary transition-all duration-200"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-interactive-primary hover:bg-interactive-active rounded-lg text-text-inverse transition-all duration-200 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}