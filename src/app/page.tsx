import { Calendar, BarChart3, Users, Megaphone, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const stats = [
    {
      title: "Eventos Activos",
      value: "24",
      description: "Eventos programados este mes",
      icon: Calendar,
      color: "text-chart-1",
    },
    {
      title: "Ventas Totales",
      value: "$127,340",
      description: "+12.5% vs mes anterior",
      icon: BarChart3,
      color: "text-chart-2",
    },
    {
      title: "Clientes Registrados",
      value: "3,247",
      description: "+189 nuevos este mes",
      icon: Users,
      color: "text-chart-3",
    },
    {
      title: "Campañas Activas",
      value: "8",
      description: "Alcanzando 15,240 usuarios",
      icon: Megaphone,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de Hunt Tickets
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glassmorphism hover-float">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="glassmorphism col-span-4">
          <CardHeader>
            <CardTitle>Vista General de Eventos</CardTitle>
            <CardDescription>
              Rendimiento de tus eventos en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de eventos (integrar con biblioteca de gráficos)
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-1 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo evento creado</p>
                  <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-2 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Campaña activada</p>
                  <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cliente registrado</p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
