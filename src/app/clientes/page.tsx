import { Users, Mail, Phone, MapPin, Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClientesPage() {
  const clientes = [
    {
      id: 1,
      nombre: "Ana García López",
      email: "ana.garcia@email.com",
      telefono: "+52 81 1234-5678",
      ciudad: "Monterrey, NL",
      eventosAsistidos: 12,
      totalGastado: 2450,
      ultimaCompra: "2024-02-15",
      estado: "Activo",
      categoria: "VIP",
    },
    {
      id: 2,
      nombre: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      telefono: "+52 55 9876-5432",
      ciudad: "Ciudad de México",
      eventosAsistidos: 8,
      totalGastado: 1340,
      ultimaCompra: "2024-02-10",
      estado: "Activo",
      categoria: "Regular",
    },
    {
      id: 3,
      nombre: "María Fernández",
      email: "maria.fernandez@email.com",
      telefono: "+52 33 5555-1234",
      ciudad: "Guadalajara, JAL",
      eventosAsistidos: 15,
      totalGastado: 3200,
      ultimaCompra: "2024-02-20",
      estado: "Activo",
      categoria: "VIP",
    },
    {
      id: 4,
      nombre: "Roberto Silva",
      email: "roberto.silva@email.com",
      telefono: "+52 81 7777-9999",
      ciudad: "Monterrey, NL",
      eventosAsistidos: 3,
      totalGastado: 680,
      ultimaCompra: "2024-01-28",
      estado: "Inactivo",
      categoria: "Nuevo",
    },
  ];

  const estadisticas = [
    {
      titulo: "Total Clientes",
      valor: "3,247",
      descripcion: "+189 este mes",
      icono: Users,
      color: "text-chart-1",
    },
    {
      titulo: "Clientes VIP",
      valor: "324",
      descripcion: "10% del total",
      icono: Users,
      color: "text-chart-2",
    },
    {
      titulo: "Nuevos este Mes",
      valor: "189",
      descripcion: "+23% vs anterior",
      icono: Users,
      color: "text-chart-3",
    },
    {
      titulo: "Tasa de Retención",
      valor: "87.3%",
      descripcion: "+2.1% mejora",
      icono: Users,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gestiona tu base de clientes y analiza su comportamiento
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
              placeholder="Buscar clientes..."
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
          Nuevo Cliente
        </Button>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Información detallada de todos los clientes registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-4 border border-border rounded-lg glassmorphism-input hover-float">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                    <span className="text-text-primary font-semibold">
                      {cliente.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{cliente.nombre}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cliente.categoria === 'VIP' ? 'bg-chart-1/20 text-chart-1' :
                        cliente.categoria === 'Regular' ? 'bg-chart-2/20 text-chart-2' :
                        'bg-chart-3/20 text-chart-3'
                      }`}>
                        {cliente.categoria}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cliente.estado === 'Activo' ? 'bg-chart-2/20 text-chart-2' : 'bg-muted text-muted-foreground'
                      }`}>
                        {cliente.estado}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {cliente.telefono}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cliente.ciudad}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">{cliente.eventosAsistidos} eventos</div>
                    <div className="text-sm text-muted-foreground">Asistidos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${cliente.totalGastado}</div>
                    <div className="text-sm text-muted-foreground">Total gastado</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{cliente.ultimaCompra}</div>
                    <div className="text-sm text-muted-foreground">Última compra</div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover-float">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}