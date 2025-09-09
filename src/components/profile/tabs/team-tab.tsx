"use client"

import { Users, Settings, ShoppingCart, Truck, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TabContentProps } from "@/types/tabs";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  area: 'administration' | 'sales' | 'logistics';
}

export function TeamTab({ producerId, currentProducer }: TabContentProps) {
  const [selectedArea, setSelectedArea] = useState<'administration' | 'sales' | 'logistics'>('administration');
  
  const areas = [
    { id: 'administration' as const, name: 'Administración', icon: Settings },
    { id: 'sales' as const, name: 'Ventas', icon: ShoppingCart },
    { id: 'logistics' as const, name: 'Logística', icon: Truck }
  ];

  // Mock data
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Ana García', email: 'ana@empresa.com', area: 'administration' },
    { id: '2', name: 'Carlos Rodríguez', email: 'carlos@empresa.com', area: 'sales' },
    { id: '3', name: 'María López', email: 'maria@empresa.com', area: 'logistics' }
  ];

  const filteredMembers = teamMembers.filter(member => member.area === selectedArea);

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Equipo</h3>
          <p className="text-text-secondary">
            Gestiona los miembros de tu equipo por áreas de trabajo.
          </p>
        </div>
        <Button className="bg-interactive-primary text-text-inverse hover:bg-interactive-active border border-border-primary">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Miembro
        </Button>
      </div>

      {/* Area Tabs */}
      <div className="flex gap-1 bg-surface-tertiary p-1 rounded-lg">
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 justify-center ${
                selectedArea === area.id
                  ? 'bg-surface-elevated text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              {area.name}
            </button>
          );
        })}
      </div>

      {/* Members Table */}
      <div className="bg-surface-elevated border border-border-secondary rounded-xl overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">No hay miembros</h4>
            <p className="text-text-secondary">
              Agrega el primer miembro a esta área
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-tertiary border-b border-border-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-text-primary">Miembro</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border-secondary last:border-b-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-tertiary border border-border-secondary rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{member.name}</div>
                          <div className="text-sm text-text-secondary">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-surface-tertiary rounded-md transition-colors">
                        <MoreVertical className="h-4 w-4 text-text-secondary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}