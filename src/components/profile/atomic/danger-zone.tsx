"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Producer } from "@/types/producer";

interface DangerZoneProps {
  producer: Producer;
  onDelete: () => Promise<void>;
}

export function DangerZone({ producer, onDelete }: DangerZoneProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setDeleteModalOpen(false);
      setDeleteConfirmText('');
    } catch (error) {
      console.error('Error deleting producer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmationText = `eliminar ${producer.name}`;
  const isConfirmValid = deleteConfirmText === confirmationText;

  return (
    <>
      <div className="mt-8 pt-8 border-t border-status-error/20">
        <div className="bg-status-error/5 border border-status-error/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-status-error">Eliminar Productor</h5>
              <p className="text-sm text-muted-foreground">
                Esta acción es permanente y no se puede deshacer.
              </p>
            </div>
            <Button 
              variant="outline"
              className="border-status-error/50 text-status-error hover:bg-status-error/10 hover:border-status-error"
              onClick={() => setDeleteModalOpen(true)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-lg glassmorphism">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-primary">Eliminar Productor</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                ¿Estás seguro de que deseas eliminar el productor <span className="font-semibold text-text-primary italic">{producer.name}</span>? Esta acción es <span className="text-status-error font-medium">permanente</span> y no se puede deshacer.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Escribe <span className="font-mono bg-interactive-secondary px-2 py-1 rounded text-text-primary">{confirmationText}</span> para confirmar
                </p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={confirmationText}
                  className="glassmorphism-input w-full h-12 font-mono"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline"
                className="flex-1 hover:bg-interactive-secondary border-border-secondary text-text-primary"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                disabled={!isConfirmValid || isDeleting}
                className="flex-1 bg-status-error hover:bg-status-error text-text-primary disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}