import { UserCheck, Mail, Phone, Shield, Calendar, Plus, Search, Filter, MoreHorizontal, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EquipoPage() {
  const miembros = [
    {
      id: 1,
      nombre: "Luis Fernando García",
      email: "luis@hunt.com",
      telefono: "+52 81 1234-5678",
      rol: "Administrador",
      departamento: "Gerencia",
      fechaIngreso: "2023-01-15",
      ultimaActividad: "Hace 5 minutos",
      estado: "Activo",
      permisos: ["Todos"],
      avatar: "LG",
    },
    {
      id: 2,
      nombre: "Ana Sofía Martínez",
      email: "ana@hunt.com",
      telefono: "+52 81 9876-5432",
      rol: "Gerente de Eventos",
      departamento: "Operaciones",
      fechaIngreso: "2023-03-10",
      ultimaActividad: "Hace 1 hora",
      estado: "Activo",
      permisos: ["Eventos", "Reportes"],
      avatar: "AM",
    },
    {
      id: 3,
      nombre: "Carlos Eduardo López",
      email: "carlos@hunt.com",
      telefono: "+52 55 5555-1234",
      rol: "Especialista en Marketing",
      departamento: "Marketing",
      fechaIngreso: "2023-06-20",
      ultimaActividad: "Hace 30 minutos",
      estado: "Activo",
      permisos: ["Campañas", "Clientes"],
      avatar: "CL",
    },
    {
      id: 4,
      nombre: "María José Hernández",
      email: "maria@hunt.com",
      telefono: "+52 33 7777-8888",
      rol: "Analista de Datos",
      departamento: "Analytics",
      fechaIngreso: "2023-09-05",
      ultimaActividad: "Hace 2 horas",
      estado: "Ausente",
      permisos: ["Reportes"],
      avatar: "MH",
    },
    {
      id: 5,
      nombre: "Roberto Silva Jiménez",
      email: "roberto@hunt.com",
      telefono: "+52 81 3333-9999",
      rol: "Soporte Técnico",
      departamento: "IT",
      fechaIngreso: "2023-11-12",
      ultimaActividad: "Hace 45 minutos",
      estado: "Activo",
      permisos: ["Configuración"],
      avatar: "RS",
    },
  ];

  const estadisticas = [
    {
      titulo: "Miembros del Equipo",
      valor: "12",
      descripcion: "2 contrataciones este mes",
      icono: UserCheck,
      color: "text-chart-1",
    },
    {
      titulo: "Administradores",
      valor: "3",
      descripcion: "Acceso completo",
      icono: Shield,
      color: "text-chart-2",
    },
    {
      titulo: "Miembros Activos",
      valor: "11",
      descripcion: "92% de actividad",
      icono: UserCheck,
      color: "text-chart-3",
    },
    {
      titulo: "Nuevos este Mes",
      valor: "2",
      descripcion: "En proceso de onboarding",
      icono: Calendar,
      color: "text-chart-4",
    },
  ];

  const roles = [
    { nombre: "Administrador", color: "bg-chart-1/20 text-chart-1" },
    { nombre: "Gerente de Eventos", color: "bg-chart-2/20 text-chart-2" },
    { nombre: "Especialista en Marketing", color: "bg-chart-3/20 text-chart-3" },
    { nombre: "Analista de Datos", color: "bg-chart-4/20 text-chart-4" },
    { nombre: "Soporte Técnico", color: "bg-chart-5/20 text-chart-5" },
  ];

  const getRolColor = (rol: string) => {
    const roleConfig = roles.find(r => r.nombre === rol);
    return roleConfig?.color || "bg-muted/50 text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Equipo</h1>
        <p className="text-muted-foreground">
          Gestiona los miembros de tu equipo y sus permisos de acceso
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((stat, index) => (
          <Card key={index} className="glassmorphism hover-float">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.titulo}</CardTitle>
              <stat.icono className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.valor}</div>
              <p className="text-xs text-muted-foreground">{stat.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar miembros..."
              className="pl-10 glassmorphism-input"
            />
          </div>
          <Button variant="outline" className="glassmorphism hover-float">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
        <Button className="hover-float">
          <Plus className="h-4 w-4 mr-2" />
          Invitar Miembro
        </Button>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>
            Lista completa de todos los miembros y sus roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {miembros.map((miembro) => (
              <div key={miembro.id} className="flex items-center justify-between p-4 border border-border rounded-lg glassmorphism-input hover-float">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                    <span className="text-text-primary font-semibold text-sm">
                      {miembro.avatar}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{miembro.nombre}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRolColor(miembro.rol)}`}>
                        {miembro.rol}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        miembro.estado === 'Activo' 
                          ? 'bg-chart-2/20 text-chart-2' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        {miembro.estado}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {miembro.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {miembro.telefono}
                      </span>
                      <span>{miembro.departamento}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ingreso: {miembro.fechaIngreso} • {miembro.ultimaActividad}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Permisos</div>
                    <div className="text-sm text-muted-foreground">
                      {miembro.permisos.join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="hover-float">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover-float">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Distribución por Departamento</CardTitle>
            <CardDescription>Organización del equipo por área</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Operaciones</span>
                <span className="text-sm font-semibold">4 miembros</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Marketing</span>
                <span className="text-sm font-semibold">3 miembros</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Analytics</span>
                <span className="text-sm font-semibold">2 miembros</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">IT</span>
                <span className="text-sm font-semibold">2 miembros</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gerencia</span>
                <span className="text-sm font-semibold">1 miembro</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-1 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Luis actualizó configuración</p>
                  <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-2 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ana creó un nuevo evento</p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Carlos lanzó campaña</p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}