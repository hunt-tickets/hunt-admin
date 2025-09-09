import { BarChart3, TrendingUp, DollarSign, Calendar, Download, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportesPage() {
  const reportesMensuales = [
    { mes: "Enero", ventas: 45200, eventos: 12, clientes: 890 },
    { mes: "Febrero", ventas: 38900, eventos: 8, clientes: 720 },
    { mes: "Marzo", ventas: 52100, eventos: 15, clientes: 1120 },
  ];

  const metricas = [
    {
      titulo: "Revenue Total",
      valor: "$186,200",
      cambio: "+23.4%",
      descripcion: "vs mes anterior",
      icono: DollarSign,
      color: "text-chart-1",
      tendencia: "up",
    },
    {
      titulo: "Tickets Vendidos",
      valor: "8,247",
      cambio: "+12.1%",
      descripcion: "vs mes anterior",
      icono: BarChart3,
      color: "text-chart-2",
      tendencia: "up",
    },
    {
      titulo: "Eventos Completados",
      valor: "35",
      cambio: "+8.3%",
      descripcion: "vs mes anterior",
      icono: Calendar,
      color: "text-chart-3",
      tendencia: "up",
    },
    {
      titulo: "Tasa de Ocupación",
      valor: "87.4%",
      cambio: "+4.2%",
      descripcion: "vs mes anterior",
      icono: TrendingUp,
      color: "text-chart-4",
      tendencia: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">
          Análisis detallado del rendimiento de tus eventos y ventas
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" className="glassmorphism hover-float">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" className="glassmorphism hover-float">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
        </div>
        <Button className="hover-float">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
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
              <div className="flex items-center text-xs">
                <TrendingUp
                  className={`h-3 w-3 mr-1 ${
                    metrica.tendencia === "up" ? "text-chart-2" : "text-chart-1"
                  }`}
                />
                <span
                  className={
                    metrica.tendencia === "up" ? "text-chart-2" : "text-chart-1"
                  }
                >
                  {metrica.cambio}
                </span>
                <span className="text-muted-foreground ml-1">{metrica.descripcion}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="glassmorphism col-span-4">
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
            <CardDescription>
              Comparativa de ingresos en los últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Gráfico de barras de ventas mensuales
              <br />
              (Integrar con recharts o similar)
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism col-span-3">
          <CardHeader>
            <CardTitle>Top Eventos</CardTitle>
            <CardDescription>Eventos más exitosos del mes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Concierto Rock Nacional</p>
                <p className="text-xs text-muted-foreground">5,000 asistentes</p>
              </div>
              <div className="text-sm font-bold">$45,200</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Festival de Jazz</p>
                <p className="text-xs text-muted-foreground">1,200 asistentes</p>
              </div>
              <div className="text-sm font-bold">$18,900</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Comedy Night</p>
                <p className="text-xs text-muted-foreground">300 asistentes</p>
              </div>
              <div className="text-sm font-bold">$8,400</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Reporte Mensual Detallado</CardTitle>
          <CardDescription>
            Resumen completo de métricas por mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4">Mes</th>
                  <th className="text-left py-2 px-4">Ventas ($)</th>
                  <th className="text-left py-2 px-4">Eventos</th>
                  <th className="text-left py-2 px-4">Nuevos Clientes</th>
                  <th className="text-left py-2 px-4">Tasa Conversión</th>
                </tr>
              </thead>
              <tbody>
                {reportesMensuales.map((reporte, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{reporte.mes}</td>
                    <td className="py-3 px-4">${reporte.ventas.toLocaleString()}</td>
                    <td className="py-3 px-4">{reporte.eventos}</td>
                    <td className="py-3 px-4">{reporte.clientes}</td>
                    <td className="py-3 px-4">
                      <span className="text-chart-2">
                        {Math.round((reporte.clientes / (reporte.eventos * 100)) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}