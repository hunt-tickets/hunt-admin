import { Megaphone, Eye, Users, TrendingUp, Play, Pause, Settings, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CampanasPage() {
  const campanas = [
    {
      id: 1,
      nombre: "Concierto Rock Nacional - Early Bird",
      tipo: "Email Marketing",
      estado: "Activa",
      fechaInicio: "2024-02-01",
      fechaFin: "2024-03-15",
      audiencia: 2500,
      impresiones: 18450,
      clicks: 1240,
      conversiones: 186,
      ctr: "6.7%",
      roi: "320%",
      presupuesto: 5000,
      gastado: 3200,
    },
    {
      id: 2,
      nombre: "Festival de Jazz - Promoción VIP",
      tipo: "Redes Sociales",
      estado: "Activa",
      fechaInicio: "2024-02-15",
      fechaFin: "2024-03-22",
      audiencia: 1800,
      impresiones: 24680,
      clicks: 1580,
      conversiones: 124,
      ctr: "6.4%",
      roi: "275%",
      presupuesto: 3500,
      gastado: 2100,
    },
    {
      id: 3,
      nombre: "Comedy Night - Retargeting",
      tipo: "Google Ads",
      estado: "Pausada",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-04-05",
      audiencia: 950,
      impresiones: 8920,
      clicks: 445,
      conversiones: 67,
      ctr: "5.0%",
      roi: "180%",
      presupuesto: 2000,
      gastado: 890,
    },
  ];

  const metricas = [
    {
      titulo: "Campañas Activas",
      valor: "8",
      descripcion: "2 nuevas esta semana",
      icono: Megaphone,
      color: "text-chart-1",
    },
    {
      titulo: "Alcance Total",
      valor: "47,320",
      descripcion: "Usuarios únicos",
      icono: Eye,
      color: "text-chart-2",
    },
    {
      titulo: "Tasa Conversión",
      valor: "6.2%",
      descripcion: "+0.8% vs anterior",
      icono: TrendingUp,
      color: "text-chart-3",
    },
    {
      titulo: "ROI Promedio",
      valor: "258%",
      descripción: "+15% mejora",
      icono: TrendingUp,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Campañas</h1>
        <p className="text-muted-foreground">
          Gestiona tus campañas de marketing y analiza su rendimiento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricas.map((metrica, index) => (
          <Card key={index} className="glassmorphism hover-float">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
              <metrica.icono className={`h-4 w-4 ${metrica.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrica.valor}</div>
              <p className="text-xs text-muted-foreground">{metrica.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campañas..."
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
          Nueva Campaña
        </Button>
      </div>

      <div className="grid gap-6">
        {campanas.map((campana) => (
          <Card key={campana.id} className="glassmorphism hover-float">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{campana.nombre}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="px-2 py-1 bg-muted rounded-full text-xs">
                      {campana.tipo}
                    </span>
                    <span>
                      {campana.fechaInicio} - {campana.fechaFin}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      campana.estado === "Activa"
                        ? "bg-chart-2/20 text-chart-2"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {campana.estado}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={campana.estado === "Activa" ? "text-chart-1" : "text-chart-2"}
                  >
                    {campana.estado === "Activa" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Audiencia</p>
                  <p className="text-lg font-semibold">{campana.audiencia.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Impresiones</p>
                  <p className="text-lg font-semibold">{campana.impresiones.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-lg font-semibold">{campana.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversiones</p>
                  <p className="text-lg font-semibold">{campana.conversiones}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">CTR</p>
                  <p className="text-lg font-semibold text-chart-2">{campana.ctr}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-lg font-semibold text-chart-1">{campana.roi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Presupuesto</p>
                  <p className="text-lg font-semibold">${campana.presupuesto}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gastado</p>
                  <p className="text-lg font-semibold">${campana.gastado}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso del presupuesto</span>
                  <span>{Math.round((campana.gastado / campana.presupuesto) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-chart-4 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(campana.gastado / campana.presupuesto) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="hover-float">
                  Ver Métricas
                </Button>
                <Button variant="outline" size="sm" className="hover-float">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
                <Button size="sm" className="hover-float">
                  Optimizar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}