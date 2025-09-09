"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface AudienceFormData {
  age_restriction: string;
  min_age: string;
  max_age: string;
  target_gender: string;
  target_interests: string[];
  language: string;
  dress_code: string;
  special_requirements: string;
  content_warnings: string;
  requires_id: boolean;
  parental_guidance: boolean;
}

export function EventAudienceForm() {
  const [formData, setFormData] = useState<AudienceFormData>({
    age_restriction: 'all_ages',
    min_age: '',
    max_age: '',
    target_gender: 'all',
    target_interests: [],
    language: 'es',
    dress_code: '',
    special_requirements: '',
    content_warnings: '',
    requires_id: false,
    parental_guidance: false
  });

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      target_interests: prev.target_interests.includes(interest)
        ? prev.target_interests.filter(i => i !== interest)
        : [...prev.target_interests, interest]
    }));
  };

  const interests = [
    { id: 'music', label: 'Música', icon: '🎵' },
    { id: 'sports', label: 'Deportes', icon: '⚽' },
    { id: 'technology', label: 'Tecnología', icon: '💻' },
    { id: 'art', label: 'Arte', icon: '🎨' },
    { id: 'food', label: 'Gastronomía', icon: '🍴' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'education', label: 'Educación', icon: '📚' },
    { id: 'health', label: 'Salud', icon: '💪' },
    { id: 'entertainment', label: 'Entretenimiento', icon: '🎭' }
  ];

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Audiencia</h3>
            <p className="text-text-secondary">
              Define el público objetivo y restricciones para tu evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Age Restrictions Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Restricción de Edad</label>
                  <Select value={formData.age_restriction} onValueChange={(value) => setFormData({...formData, age_restriction: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona restricción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_ages">Todas las Edades</SelectItem>
                      <SelectItem value="18_plus">Mayor de 18</SelectItem>
                      <SelectItem value="21_plus">Mayor de 21</SelectItem>
                      <SelectItem value="custom">Edad Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Idioma Principal</label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="fr">Francés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.age_restriction === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-3">Edad Mínima</label>
                    <Input
                      type="number"
                      value={formData.min_age}
                      onChange={(e) => setFormData({...formData, min_age: e.target.value})}
                      placeholder="16"
                      className="glassmorphism-input w-full h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-3">Edad Máxima</label>
                    <Input
                      type="number"
                      value={formData.max_age}
                      onChange={(e) => setFormData({...formData, max_age: e.target.value})}
                      placeholder="65"
                      className="glassmorphism-input w-full h-12"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">Género Objetivo</label>
                <Select value={formData.target_gender} onValueChange={(value) => setFormData({...formData, target_gender: value})}>
                  <SelectTrigger className="glassmorphism-input w-full h-12">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Géneros</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="non_binary">No Binario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target Interests Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-4">Intereses del Público Objetivo</h4>
                <div className="grid grid-cols-3 gap-3">
                  {interests.map((interest) => {
                    const isSelected = formData.target_interests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                          isSelected 
                            ? 'border-interactive-primary bg-interactive-primary/10' 
                            : 'border-border-secondary hover:bg-surface-elevated'
                        }`}
                      >
                        <span className="text-lg">{interest.icon}</span>
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-interactive-primary' : 'text-text-primary'
                        }`}>
                          {interest.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Requiere Identificación</h4>
                    <p className="text-xs text-text-secondary">Los asistentes deben presentar documento de identidad</p>
                  </div>
                  <Switch
                    checked={formData.requires_id}
                    onCheckedChange={(checked) => setFormData({...formData, requires_id: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Requiere Supervisión Parental</h4>
                    <p className="text-xs text-text-secondary">Menores de edad deben estar acompañados</p>
                  </div>
                  <Switch
                    checked={formData.parental_guidance}
                    onCheckedChange={(checked) => setFormData({...formData, parental_guidance: checked})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">Código de Vestimenta</label>
                <Input
                  value={formData.dress_code}
                  onChange={(e) => setFormData({...formData, dress_code: e.target.value})}
                  placeholder="Ej. Formal, Casual, Temático"
                  className="glassmorphism-input w-full h-12"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Requisitos Especiales
                  <span className="text-text-tertiary text-xs ml-1">({formData.special_requirements.length}/500)</span>
                </label>
                <Textarea
                  value={formData.special_requirements}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setFormData({...formData, special_requirements: value});
                    }
                  }}
                  placeholder="Describe cualquier requisito especial para asistir al evento"
                  className="glassmorphism-input w-full min-h-[100px] resize-none"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Advertencias de Contenido
                  <span className="text-text-tertiary text-xs ml-1">({formData.content_warnings.length}/500)</span>
                </label>
                <Textarea
                  value={formData.content_warnings}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setFormData({...formData, content_warnings: value});
                    }
                  }}
                  placeholder="Advierte sobre contenido que podría ser sensible (luces estroboscópicas, ruido fuerte, etc.)"
                  className="glassmorphism-input w-full min-h-[100px] resize-none"
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}