"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Mail, AlertCircle } from "lucide-react";
import type { TabContentProps } from "@/types/tabs";

interface BannedEmail {
  id: string;
  email: string;
  reason?: string;
  createdAt: Date;
}

export function EmailsBloqueadosTab({ producerId, currentProducer }: TabContentProps) {
  const [bannedEmails, setBannedEmails] = useState<BannedEmail[]>([
    {
      id: "1",
      email: "spam@example.com",
      reason: "Actividad sospechosa",
      createdAt: new Date("2024-01-15")
    },
    {
      id: "2", 
      email: "fraud@test.com",
      reason: "Intento de fraude",
      createdAt: new Date("2024-02-20")
    }
  ]);
  
  const [newEmail, setNewEmail] = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmail = async () => {
    if (!newEmail.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newBannedEmail: BannedEmail = {
        id: Date.now().toString(),
        email: newEmail.trim().toLowerCase(),
        reason: newReason.trim() || undefined,
        createdAt: new Date()
      };
      
      setBannedEmails(prev => [newBannedEmail, ...prev]);
      setNewEmail("");
      setNewReason("");
      setLoading(false);
    }, 500);
  };

  const handleRemoveEmail = async (emailId: string) => {
    setBannedEmails(prev => prev.filter(email => email.id !== emailId));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (!currentProducer) {
    return (
      <div className="text-center text-muted-foreground">
        Selecciona un productor para gestionar emails bloqueados
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-text-primary">Emails Bloqueados</h3>
        <p className="text-text-secondary">
          Gestiona la lista de emails que no pueden comprar tickets para tus eventos.
        </p>
      </div>

      {/* Add new banned email */}
      <div className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
        <h4 className="text-lg font-medium text-text-primary mb-4">Agregar Email Bloqueado</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Email</label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="glassmorphism-input w-full h-12"
            />
            {newEmail && !isValidEmail(newEmail) && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Email inválido
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Razón (Opcional)</label>
            <Input
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Motivo del bloqueo"
              className="glassmorphism-input w-full h-12"
            />
          </div>
        </div>
        <Button
          onClick={handleAddEmail}
          disabled={loading || !newEmail.trim() || !isValidEmail(newEmail)}
          className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium disabled:opacity-50 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          {loading ? 'Agregando...' : 'Agregar Email'}
        </Button>
      </div>

      {/* Banned emails list */}
      <div className="bg-surface-elevated border border-border-secondary rounded-lg">
        <div className="p-6 border-b border-border-secondary">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-text-secondary" />
            <h4 className="text-lg font-medium text-text-primary">
              Lista de Emails Bloqueados ({bannedEmails.length})
            </h4>
          </div>
        </div>
        
        {bannedEmails.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary">No hay emails bloqueados</p>
          </div>
        ) : (
          <div className="divide-y divide-border-secondary">
            {bannedEmails.map((email) => (
              <div key={email.id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{email.email}</p>
                      {email.reason && (
                        <p className="text-sm text-text-secondary">{email.reason}</p>
                      )}
                      <p className="text-xs text-text-tertiary">
                        Bloqueado el {email.createdAt.toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveEmail(email.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}