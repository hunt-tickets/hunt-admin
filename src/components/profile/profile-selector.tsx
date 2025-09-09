"use client"

import { Building2, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Producer {
  id: string;
  name: string;
  description?: string;
}

interface ProfileSelectorProps {
  producers: Producer[];
  currentProducerId: string;
  onSelectionChange?: (producerId: string) => void;
  onProducerAdded?: (producer: Producer) => void;
}

export function ProfileSelector({ producers, currentProducerId, onSelectionChange, onProducerAdded }: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentProducer = producers.find(p => p.id === currentProducerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/producers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
        }),
      });

      if (response.ok) {
        const newProducer = await response.json();
        onProducerAdded?.(newProducer);
        setFormData({ name: "", description: "" });
        setShowAddForm(false);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error creating producer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 bg-surface-tertiary backdrop-blur-xl border border-border-secondary hover:bg-interactive-hover hover:border-border-focus transition-all duration-300 rounded-lg text-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {currentProducer && (
            <>
              <div className="w-7 h-7 border border-border-secondary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-surface-elevated">
                <img 
                  src={`https://db.hunt-tickets.com/storage/v1/object/public/producers/${currentProducer.id}/logos/logo.png`}
                  alt={`${currentProducer.name} logo`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Building2 className="h-3.5 w-3.5 text-text-secondary hidden" />
              </div>
              <span className="text-text-primary font-medium">{currentProducer.name}</span>
            </>
          )}
          {!currentProducer && <span className="text-text-secondary">Seleccionar productor...</span>}
        </div>
        <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => {
              setIsOpen(false);
              setShowAddForm(false);
            }}
          />
          <div className="absolute top-full mt-1 w-full z-20 bg-surface-elevated backdrop-blur-xl border border-border-primary rounded-xl p-2 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
            {!showAddForm ? (
              <div className="space-y-1">
                {producers.map((producer) => (
                  <button
                    key={producer.id}
                    onClick={() => {
                      onSelectionChange?.(producer.id);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-interactive-hover"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-7 h-7 border border-border-secondary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-surface-tertiary">
                        <img 
                          src={`https://db.hunt-tickets.com/storage/v1/object/public/producers/${producer.id}/logos/logo.png`}
                          alt={`${producer.name} logo`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <Building2 className="h-3.5 w-3.5 text-text-secondary hidden" />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium text-sm text-text-primary">{producer.name}</div>
                        {producer.description && <div className="text-xs text-text-secondary">{producer.description}</div>}
                      </div>
                    </div>
                  </button>
                ))}
                <hr className="border-border-secondary my-1" />
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-interactive-hover"
                >
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-7 h-7 border border-border-secondary rounded-lg flex items-center justify-center flex-shrink-0 bg-surface-tertiary">
                      <Plus className="h-3.5 w-3.5 text-text-secondary" />
                    </div>
                    <div className="font-medium text-sm text-text-primary">Agregar nuevo productor</div>
                  </div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 p-1">
                <div>
                  <label className="text-xs font-medium text-text-primary block mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del productor"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-secondary rounded-lg text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-border-focus"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary block mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción opcional"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-secondary rounded-lg text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-border-focus"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ name: "", description: "" });
                    }}
                    className="flex-1 px-3 py-2 bg-surface-secondary border border-border-secondary rounded-lg text-text-primary text-xs hover:bg-interactive-hover transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !formData.name.trim()}
                    className="flex-1 px-3 py-2 bg-interactive-primary border border-border-focus rounded-lg text-text-inverse text-xs hover:bg-interactive-active transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Creando..." : "Agregar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}