"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Palette, 
  Type, 
  Move, 
  Download, 
  Upload,
  Eye,
  Code,
  Paintbrush,
  FormInput,
  MousePointer,
  Layout,
  ToggleLeft,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  Table,
  List,
  BarChart,
  Image,
  Video,
  FileImage,
  Modal,
  Tooltip,
  Popover,
  Switch,
  Slider,
  Shield,
  Lock,
  User,
  Zap,
  Clock,
  MapPin,
  Star,
  Heart,
  Share,
  MessageSquare
} from "lucide-react";
// import { designTokens, defaultThemes, type ThemeDefinition } from "@/design-system";
import { useTheme } from "@/hooks/use-theme";
import { SidebarSelect } from "@/components/ui/sidebar-select";
import { CalendarInput } from "@/components/ui/calendar-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { EmailInput } from "@/components/ui/email-input";
import { TextareaInput } from "@/components/ui/textarea-input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

interface DocsTabProps {
  currentProducer?: any;
  activeSection?: string;
}


export function DocsTab({ currentProducer, activeSection: propActiveSection }: DocsTabProps) {
  const { actualTheme } = useTheme();
  const [internalActiveSection, setInternalActiveSection] = useState<'claude-md' | 'tokens' | 'inputs' | 'buttons' | 'cards' | 'navigation' | 'feedback' | 'data' | 'media' | 'overlays' | 'interactive' | 'security' | 'events' | 'notifications' | 'preview'>('claude-md');
  
  // Use prop activeSection if provided, otherwise use internal state
  const activeSection = propActiveSection as 'claude-md' | 'tokens' | 'inputs' | 'buttons' | 'cards' | 'navigation' | 'feedback' | 'data' | 'media' | 'overlays' | 'interactive' | 'security' | 'events' | 'notifications' | 'preview' || internalActiveSection;
  // const [customTheme, setCustomTheme] = useState<ThemeDefinition>(defaultThemes[actualTheme]);

  // Sync with theme changes
  useEffect(() => {
    // setCustomTheme(defaultThemes[actualTheme]);
  }, [actualTheme]);


  // const updateColor = (tokenKey: keyof ThemeDefinition['values'], value: string) => {
  //   setCustomTheme(prev => ({
  //     ...prev,
  //     values: { ...prev.values, [tokenKey]: value }
  //   }));
  //   
  //   // Apply changes in real-time to the current page
  //   const root = document.documentElement;
  //   root.style.setProperty(`--${tokenKey}`, value);
  // };

  const resetToDefault = () => {
    // const defaultTheme = defaultThemes[actualTheme];
    // setCustomTheme(defaultTheme);
    
    // Reset all CSS variables to default
    // const root = document.documentElement;
    // Object.entries(defaultTheme.values).forEach(([key, value]) => {
    //   root.style.setProperty(`--${key}`, value);
    // });
  };

  const exportTheme = () => {
    // const themeCSS = Object.entries(customTheme.values)
    //   .map(([key, value]) => `  --${key}: ${value};`)
    //   .join('\n');
    
    // const css = actualTheme === 'dark' 
    //   ? `.dark {\n${themeCSS}\n}` 
    //   : `:root {\n${themeCSS}\n}`;
    
    // const blob = new Blob([css], { type: 'text/css' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `hunt-${actualTheme}-theme.css`;
    // a.click();
    // URL.revokeObjectURL(url);
  };

  // const ColorInput = ({ token, label }: { token: keyof ThemeDefinition['values']; label: string }) => (
  //   <div className="space-y-3">
  //     <label className="text-sm font-medium text-text-primary">{label}</label>
  //     <div className="relative group">
  //       <input 
  //         type="color" 
  //         value={customTheme.values[token]}
  //         onChange={(e) => updateColor(token, e.target.value)}
  //         className="absolute opacity-0 w-full h-12 cursor-pointer z-10"
  //       />
  //       <div className="glassmorphism-input rounded-lg h-12 flex items-center gap-3 px-3 cursor-pointer transition-all hover:border-border-focus">
  //         <div 
  //           className="w-6 h-6 rounded-md border border-border-secondary transition-all" 
  //           style={{ 
  //             backgroundColor: customTheme.values[token],
  //             backgroundImage: 'none'
  //           }}
  //         />
  //         <span className="text-text-primary text-sm font-mono">{customTheme.values[token]}</span>
  //         <span className="text-text-tertiary text-xs ml-auto">{token}</span>
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderColorEditor = () => (
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-surface-secondary rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Tema actual: {actualTheme === 'dark' ? 'Oscuro' : 'Claro'}</h3>
        <p className="text-text-secondary text-sm">
          Editando paleta de colores para el tema {actualTheme}. Los cambios se aplicarán en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Surface Colors */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-4 h-4 bg-surface-primary border border-border-secondary rounded"></div>
            Superficies
          </h3>
          <div className="space-y-4">
            {/* <ColorInput token="surface-primary" label="Primaria" />
            <ColorInput token="surface-secondary" label="Secundaria" />
            <ColorInput token="surface-tertiary" label="Terciaria" />
            <ColorInput token="surface-elevated" label="Elevada" /> */}
            <p className="text-text-secondary">Color editor components disabled for now</p>
          </div>
        </Card>

        {/* Text Colors */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Texto
          </h3>
          <div className="space-y-4">
            {/* <ColorInput token="text-primary" label="Primario" />
            <ColorInput token="text-secondary" label="Secundario" />
            <ColorInput token="text-tertiary" label="Terciario" />
            <ColorInput token="text-inverse" label="Inverso" /> */}
            <p className="text-text-secondary">Text color editor components disabled for now</p>
          </div>
        </Card>

        {/* Interactive Colors */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Paintbrush className="w-4 h-4" />
            Interactivos
          </h3>
          <div className="space-y-4">
            {/* <ColorInput token="interactive-primary" label="Primario" />
            <ColorInput token="interactive-secondary" label="Secundario" />
            <ColorInput token="interactive-hover" label="Hover" />
            <ColorInput token="interactive-active" label="Activo" /> */}
            <p className="text-text-secondary">Interactive color editor components disabled for now</p>
          </div>
        </Card>

        {/* Status Colors */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estados</h3>
          <div className="space-y-4">
            {/* <ColorInput token="status-error" label="Error" />
            <ColorInput token="status-success" label="Éxito" />
            <ColorInput token="status-warning" label="Advertencia" />
            <ColorInput token="status-info" label="Información" /> */}
            <p className="text-text-secondary">Status color editor components disabled for now</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button onClick={exportTheme} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Tema {actualTheme === 'dark' ? 'Oscuro' : 'Claro'}
        </Button>
        <Button variant="outline" onClick={resetToDefault} className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4" />
          Resetear a Default
        </Button>
      </div>
    </div>
  );

  const renderTypographyEditor = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tamaños de Fuente</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* {Object.entries(designTokens.typography.sizes).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <span className="text-sm font-medium">{key}</span>
              <span style={{ fontSize: value }}>Sample Text ({value})</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Pesos de Fuente</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* {Object.entries(designTokens.typography.weights).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <span className="text-sm font-medium">{key}</span>
              <span style={{ fontWeight: value }}>Sample Text ({value})</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderClaudeMDCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Claude MD Documentation</h3>
        <p className="text-text-secondary mb-6">
          Documentación y guías para trabajar eficientemente con Claude Code.
        </p>
        
        <div className="space-y-8">
          {/* Project Overview */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Hunt Admin Panel</h4>
            <div className="p-4 border border-border-secondary rounded-lg">
              <div className="prose prose-sm max-w-none text-text-primary">
                <p className="mb-4">Panel de administración moderno para eventos de Hunt Tickets, construido con las últimas tecnologías y optimizado para rendimiento y eficiencia de costos.</p>
                
                <h5 className="font-semibold text-text-primary mb-3">🚀 Tecnologías</h5>
                <ul className="space-y-1 text-text-secondary text-sm mb-4">
                  <li>• <strong>Next.js 15</strong> - Framework React con App Router y Turbopack</li>
                  <li>• <strong>React 19</strong> - Última versión con React Compiler</li>
                  <li>• <strong>TypeScript</strong> - Tipado estático completo</li>
                  <li>• <strong>Tailwind CSS v4</strong> - Estilos utilitarios sin configuración</li>
                  <li>• <strong>shadcn/ui</strong> - Componentes UI accesibles y customizables</li>
                </ul>

                <h5 className="font-semibold text-text-primary mb-3">✨ Características</h5>
                <ul className="space-y-1 text-text-secondary text-sm mb-4">
                  <li>• <strong>🎨 Diseño Hunt Tickets</strong>: Sistema de diseño con y gradientes animados</li>
                  <li>• <strong>📱 Responsive</strong>: Optimizado para todos los dispositivos</li>
                  <li>• <strong>⚡ Alto Rendimiento</strong>: Turbopack, optimizaciones de Next.js 15</li>
                  <li>• <strong>🔒 Seguro</strong>: Headers de seguridad y mejores prácticas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Development Commands */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Comandos de Desarrollo</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border border-border-secondary rounded-lg">
                  <h5 className="font-medium text-text-primary mb-3">Comandos Principales</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-surface-secondary rounded text-xs">npm run dev</code>
                      <span className="text-text-secondary">Desarrollo con Turbopack</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-surface-secondary rounded text-xs">npm run build</code>
                      <span className="text-text-secondary">Build para producción</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-surface-secondary rounded text-xs">npm start</code>
                      <span className="text-text-secondary">Servidor de producción</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-border-secondary rounded-lg">
                  <h5 className="font-medium text-text-primary mb-3">Estructura del Proyecto</h5>
                  <div className="text-xs text-text-secondary font-mono">
                    <div>src/</div>
                    <div>├── app/ - App Router (Next.js 15)</div>
                    <div>├── components/ - Componentes reutilizables</div>
                    <div>│   ├── ui/ - shadcn/ui components</div>
                    <div>│   └── profile/ - Componentes de perfil</div>
                    <div>└── lib/ - Utilidades y configuración</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Design System */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Sistema de Diseño</h4>
            <div className="p-4 border border-border-secondary rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-text-primary mb-2">Paleta de Colores</h5>
                  <div className="space-y-1 text-text-secondary text-sm">
                    <div>Base: <code className="text-xs">#0a0a0a</code></div>
                    <div>Secundarios: <code className="text-xs">#151515, #202020</code></div>
                    <div>Texto: <code className="text-xs">#ffffff, #b8b8b8</code></div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-text-primary mb-2">Efectos Visuales</h5>
                  <div className="space-y-1 text-text-secondary text-sm">
                    <div>Glassmorphism: <code className="text-xs">backdrop-blur(25px)</code></div>
                    <div>Border Radius: <code className="text-xs">12px cards, 16px forms</code></div>
                    <div>Animaciones: <code className="text-xs">8s ease infinite</code></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claude Code Guidelines */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Guías Claude Code</h4>
            <div className="p-4 border border-border-secondary rounded-lg">
              <div className="prose prose-sm max-w-none text-text-primary">
                <h5 className="font-semibold text-text-primary mb-3">🎯 Mejores Prácticas</h5>
                <ul className="space-y-1 text-text-secondary text-sm mb-4">
                  <li>• <strong>Usar variables semánticas</strong>: <code className="text-xs">var(--border-secondary)</code> en lugar de <code className="text-xs">hsl(var(--border))</code></li>
                  <li>• <strong>Glassmorphism consistente</strong>: Aplicar clase <code className="text-xs">glassmorphism</code> a todos los contenedores</li>
                  <li>• <strong>Componentes unificados</strong>: Seguir patrones establecidos en el design system</li>
                  <li>• <strong>TypeScript estricto</strong>: Definir interfaces claras para todos los props</li>
                </ul>

                <h5 className="font-semibold text-text-primary mb-3">📁 Convenciones</h5>
                <ul className="space-y-1 text-text-secondary text-sm">
                  <li>• <strong>Componentes UI</strong>: <code className="text-xs">src/components/ui/</code></li>
                  <li>• <strong>Páginas</strong>: <code className="text-xs">src/app/</code> con App Router</li>
                  <li>• <strong>Estilos globales</strong>: <code className="text-xs">src/app/globals.css</code></li>
                  <li>• <strong>Utilidades</strong>: <code className="text-xs">src/lib/</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderInputsCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Input Components</h3>
        <p className="text-text-secondary mb-6">
          Componentes de entrada de datos con estética unificada y compatibilidad completa.
        </p>
        
        <div className="space-y-8">
          {/* Text Input */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Text Input</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Input Básico</label>
                  <Input placeholder="Escribe algo aquí..." className="glassmorphism-input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Input con Error</label>
                  <Input placeholder="Campo requerido" className="glassmorphism-input border-status-error" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Input Deshabilitado</label>
                  <Input placeholder="Campo deshabilitado" disabled className="glassmorphism-input" />
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`<Input 
  placeholder="Placeholder" 
  className="glassmorphism-input" 
/>

// Con error
<Input 
  className="glassmorphism-input border-status-error" 
/>

// Deshabilitado
<Input disabled className="glassmorphism-input" />`}
                </code>
              </div>
            </div>
          </div>

          {/* Calendar Input */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Calendar Input</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CalendarInput 
                  label="Fecha del Evento"
                  onChange={(date) => console.log('Selected date:', date)}
                />
                <CalendarInput 
                  label="Fecha con Error"
                  error={true}
                />
                <CalendarInput 
                  label="Fecha Deshabilitada"
                  disabled={true}
                />
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`import { CalendarInput } from "@/components/ui/calendar-input";

<CalendarInput 
  label="Fecha del Evento"
  onChange={(date) => console.log(date)}
/>

// Con error
<CalendarInput 
  label="Fecha"
  error={true}
/>

// Deshabilitado
<CalendarInput 
  label="Fecha"
  disabled={true}
/>`}
                </code>
              </div>
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Phone Input</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <PhoneInput 
                  label="Teléfono con Prefijo"
                  placeholder="123 456 7890"
                  onChange={(phone) => console.log('Phone:', phone)}
                />
                <PhoneInput 
                  label="Teléfono sin Prefijo"
                  placeholder="123 456 7890"
                  showPrefix={false}
                />
                <PhoneInput 
                  label="Teléfono con Error"
                  error={true}
                />
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`import { PhoneInput } from "@/components/ui/phone-input";

<PhoneInput 
  label="Teléfono"
  placeholder="123 456 7890"
  showPrefix={true}
  onChange={(phone) => console.log(phone)}
/>

// Sin prefijo
<PhoneInput 
  label="Teléfono"
  showPrefix={false}
/>

// Con error
<PhoneInput 
  label="Teléfono"
  error={true}
/>`}
                </code>
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Email Input</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EmailInput 
                  label="Correo Electrónico"
                  placeholder="ejemplo@correo.com"
                  onChange={(email) => console.log('Email:', email)}
                />
                <EmailInput 
                  label="Email sin Validación"
                  showValidation={false}
                />
                <EmailInput 
                  label="Email con Error"
                  error={true}
                />
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`import { EmailInput } from "@/components/ui/email-input";

<EmailInput 
  label="Correo Electrónico"
  placeholder="ejemplo@correo.com"
  showValidation={true}
  onChange={(email) => console.log(email)}
/>

// Sin validación visual
<EmailInput 
  label="Email"
  showValidation={false}
/>

// Con error
<EmailInput 
  label="Email"
  error={true}
/>`}
                </code>
              </div>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Textarea Input</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <TextareaInput 
                  label="Descripción"
                  placeholder="Escribe una descripción..."
                  variant="default"
                />
                <TextareaInput 
                  label="Comentario con Contador"
                  placeholder="Escribe tu comentario..."
                  maxLength={280}
                  showCounter={true}
                />
                <TextareaInput 
                  label="Textarea Grande"
                  placeholder="Texto largo..."
                  variant="large"
                />
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`import { TextareaInput } from "@/components/ui/textarea-input";

<TextareaInput 
  label="Descripción"
  placeholder="Escribe..."
  variant="default"
/>

// Con contador
<TextareaInput 
  label="Comentario"
  maxLength={280}
  showCounter={true}
/>

// Variantes: 'small' | 'default' | 'large'
<TextareaInput 
  variant="large"
/>`}
                </code>
              </div>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Markdown Editor</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <MarkdownEditor 
                  label="Editor de Markdown"
                  placeholder="# Título&#10;&#10;Escribe tu contenido en **markdown**..."
                  height="medium"
                  showPreview={true}
                />
                <MarkdownEditor 
                  label="Editor Grande"
                  height="large"
                  showPreview={false}
                />
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`import { MarkdownEditor } from "@/components/ui/markdown-editor";

<MarkdownEditor 
  label="Editor de Markdown"
  placeholder="# Título..."
  height="medium"
  showPreview={true}
  onChange={(content) => console.log(content)}
/>

// Sin preview
<MarkdownEditor 
  label="Editor"
  showPreview={false}
/>

// Alturas: 'small' | 'medium' | 'large'
<MarkdownEditor 
  height="large"
/>`}
                </code>
              </div>
            </div>
          </div>

          {/* Select Component */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Select Component</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <SidebarSelect 
                  label="Configuración del Menú"
                  options={[
                    { value: 'collapsed', label: 'Cerrado', description: 'Menú siempre contraído' },
                    { value: 'expanded', label: 'Abierto', description: 'Menú siempre expandido' },
                    { value: 'hover', label: 'Expandir al hover', description: 'Se expande al pasar el mouse' },
                  ]}
                  defaultValue="hover"
                  onChange={(value) => console.log('Selected:', value)}
                />
                <SidebarSelect 
                  label="Selector Simple"
                  options={[
                    { value: 'option1', label: 'Primera opción' },
                    { value: 'option2', label: 'Segunda opción' },
                    { value: 'option3', label: 'Tercera opción' },
                  ]}
                  defaultValue="option1"
                />
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`import { SidebarSelect } from "@/components/ui/sidebar-select";

<SidebarSelect 
  label="Configuración"
  options={[
    { 
      value: 'option1', 
      label: 'Primera opción', 
      description: 'Descripción opcional' 
    }
  ]}
  defaultValue="option1"
  onChange={(value) => console.log(value)}
/>`}
                </code>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Color Picker</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Color Principal</label>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={customTheme.values['interactive-primary']}
                      onChange={(e) => updateColor('interactive-primary', e.target.value)}
                      className="absolute opacity-0 w-full h-12 cursor-pointer z-10"
                    />
                    <div className="glassmorphism-input rounded-lg h-12 flex items-center gap-3 px-3 cursor-pointer hover:border-border-focus transition-all">
                      <div 
                        className="w-6 h-6 rounded-md border border-border-secondary" 
                        style={{ backgroundColor: customTheme.values['interactive-primary'] }}
                      />
                      <span className="text-text-primary text-sm font-mono">{customTheme.values['interactive-primary']}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Color Secundario</label>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={customTheme.values['interactive-secondary']}
                      onChange={(e) => updateColor('interactive-secondary', e.target.value)}
                      className="absolute opacity-0 w-full h-12 cursor-pointer z-10"
                    />
                    <div className="glassmorphism-input rounded-lg h-12 flex items-center gap-3 px-3 cursor-pointer hover:border-border-focus transition-all">
                      <div 
                        className="w-6 h-6 rounded-md border border-border-secondary" 
                        style={{ backgroundColor: customTheme.values['interactive-secondary'] }}
                      />
                      <span className="text-text-primary text-sm font-mono">{customTheme.values['interactive-secondary']}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`<div className="relative">
  <input 
    type="color" 
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="absolute opacity-0 w-full h-12 cursor-pointer z-10"
  />
  <div className="glassmorphism-input rounded-lg h-12 flex items-center gap-3 px-3 cursor-pointer">
    <div className="w-6 h-6 rounded-md border border-border-secondary" style={{ backgroundColor: color }} />
    <span className="text-text-primary text-sm font-mono">{color}</span>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderButtonsCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Button Components</h3>
        <p className="text-text-secondary mb-6">
          Sistema completo de botones con variantes, tamaños y estados.
        </p>
        
        <div className="space-y-8">
          {/* Variantes Básicas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Variantes</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
                
                <div className="pt-2">
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Estados</h5>
                  <div className="flex gap-3 flex-wrap">
                    <Button disabled>Disabled</Button>
                    <Button variant="outline" disabled>Outline Disabled</Button>
                    <Button variant="destructive" disabled>Destructive Disabled</Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Estados
<Button disabled>Disabled</Button>`}
                </code>
              </div>
            </div>
          </div>

          {/* Tamaños */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Tamaños</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                
                <div className="pt-2">
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Botones con Iconos</h5>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button size="sm">
                      <Calendar className="w-4 h-4" />
                      Small Icon
                    </Button>
                    <Button>
                      <Calendar className="w-4 h-4" />
                      Default Icon
                    </Button>
                    <Button size="lg">
                      <Calendar className="w-4 h-4" />
                      Large Icon
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Solo Iconos</h5>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button size="icon" variant="outline">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button size="icon">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Tamaños
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Con iconos
<Button>
  <Calendar className="w-4 h-4" />
  Con Icono
</Button>

// Solo icono
<Button size="icon">
  <Calendar className="w-4 h-4" />
</Button>`}
                </code>
              </div>
            </div>
          </div>

          {/* Botones Glassmorphism */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Glassmorphism Buttons</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <button className="px-4 py-2 rounded-lg text-text-primary font-medium hover:bg-interactive-secondary transition-all">
                    Glassmorphism
                  </button>
                  <button className="px-4 py-2 rounded-lg text-text-primary font-medium hover:bg-interactive-secondary transition-all border border-border-secondary">
                    With Border
                  </button>
                  <button className="px-4 py-2 rounded-lg text-status-success font-medium hover:bg-status-success/20 transition-all">
                    Success
                  </button>
                  <button className="px-4 py-2 rounded-lg text-status-error font-medium hover:bg-status-error/20 transition-all">
                    Error
                  </button>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Glassmorphism básico
<button className="px-4 py-2 rounded-lg text-text-primary font-medium hover:bg-interactive-secondary transition-all">
  Glassmorphism
</button>

// Con borde
<button className="px-4 py-2 rounded-lg border border-border-secondary">
  With Border
</button>

// Variantes de estado
<button className="px-4 py-2 rounded-lg text-status-success hover:bg-status-success/20">
  Success
</button>`}
                </code>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Action Buttons</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <Button className="bg-status-success hover:bg-status-success/90 text-text-inverse">
                    Confirmar
                  </Button>
                  <Button className="bg-status-warning hover:bg-status-warning/90 text-text-inverse">
                    Advertencia
                  </Button>
                  <Button className="bg-status-info hover:bg-status-info/90 text-text-inverse">
                    Información
                  </Button>
                </div>
                
                <div className="pt-2">
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Loading States</h5>
                  <div className="flex gap-3 flex-wrap">
                    <Button disabled className="relative">
                      <div className="animate-spin h-4 w-4 border-2 border-text-inverse border-t-transparent rounded-full mr-2"></div>
                      Cargando...
                    </Button>
                    <Button variant="outline" disabled className="relative">
                      <div className="animate-spin h-4 w-4 border-2 border-text-primary border-t-transparent rounded-full mr-2"></div>
                      Procesando...
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Botones de acción
<Button className="bg-status-success hover:bg-status-success/90 text-text-inverse">
  Confirmar
</Button>

<Button className="bg-status-warning hover:bg-status-warning/90 text-text-inverse">
  Advertencia
</Button>

// Loading state
<Button disabled>
  <div className="animate-spin h-4 w-4 border-2 border-text-inverse border-t-transparent rounded-full mr-2"></div>
  Cargando...
</Button>`}
                </code>
              </div>
            </div>
          </div>

          {/* Button Groups */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Button Groups</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Grupo Horizontal</h5>
                  <div className="flex border border-border-secondary rounded-lg overflow-hidden">
                    <button className="flex-1 px-4 py-2 bg-interactive-secondary text-text-primary hover:bg-interactive-hover transition-all">
                      Izquierda
                    </button>
                    <button className="flex-1 px-4 py-2 bg-surface-secondary text-text-secondary hover:bg-interactive-secondary hover:text-text-primary transition-all border-l border-border-secondary">
                      Centro
                    </button>
                    <button className="flex-1 px-4 py-2 bg-surface-secondary text-text-secondary hover:bg-interactive-secondary hover:text-text-primary transition-all border-l border-border-secondary">
                      Derecha
                    </button>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Toggle Group</h5>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-border-secondary">
                      Opción 1
                    </Button>
                    <Button className="bg-interactive-primary text-text-inverse">
                      Seleccionada
                    </Button>
                    <Button variant="outline" className="border-border-secondary">
                      Opción 3
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Button group
<div className="flex border border-border-secondary rounded-lg overflow-hidden">
  <button className="flex-1 px-4 py-2 bg-interactive-secondary">
    Izquierda
  </button>
  <button className="flex-1 px-4 py-2 border-l border-border-secondary">
    Centro
  </button>
</div>

// Toggle group
<div className="flex gap-2">
  <Button variant="outline">Opción 1</Button>
  <Button className="bg-interactive-primary">Seleccionada</Button>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Floating Action Buttons</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative h-32 bg-surface-tertiary rounded-lg p-4">
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-interactive-primary hover:bg-interactive-primary/90 text-text-inverse rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    +
                  </button>
                  <button className="absolute bottom-4 right-20 w-10 h-10 bg-status-success hover:bg-status-success/90 text-text-inverse rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105">
                    ✓
                  </button>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-text-secondary mb-3">FAB con Glassmorphism</h5>
                  <div className="relative h-24 bg-gradient-to-r from-interactive-primary/20 to-interactive-secondary/20 rounded-lg p-4">
                    <button className="absolute bottom-4 right-4 w-12 h-12 border border-border-secondary hover:border-border-focus text-text-primary rounded-full flex items-center justify-center transition-all hover:scale-105">
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// FAB básico
<button className="w-12 h-12 bg-interactive-primary hover:bg-interactive-primary/90 text-text-inverse rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
  +
</button>

// FAB glassmorphism
<button className="w-12 h-12 border border-border-secondary hover:border-border-focus text-text-primary rounded-full flex items-center justify-center transition-all hover:scale-105">
  +
</button>`}
                </code>
              </div>
            </div>
          </div>

          {/* Tamaños */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Tamaños</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-end gap-3 flex-wrap">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                
                <div className="pt-2">
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Con Iconos</h5>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button size="sm">
                      <Calendar className="w-4 h-4" />
                      Small
                    </Button>
                    <Button>
                      <Calendar className="w-4 h-4" />
                      Default
                    </Button>
                    <Button size="lg">
                      <Calendar className="w-4 h-4" />
                      Large
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Solo Iconos</h5>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button size="icon" variant="outline">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button size="icon">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Tamaños
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Con iconos
<Button>
  <Calendar className="w-4 h-4" />
  Con Icono
</Button>

// Solo icono
<Button size="icon">
  <Calendar className="w-4 h-4" />
</Button>`}
                </code>
              </div>
            </div>
          </div>

          {/* Button Combinations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Combinaciones Comunes</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Acciones de Formulario</h5>
                  <div className="flex gap-3">
                    <Button variant="outline">Cancelar</Button>
                    <Button>Guardar</Button>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Acciones Críticas</h5>
                  <div className="flex gap-3">
                    <Button variant="ghost">Cancelar</Button>
                    <Button variant="destructive">Eliminar</Button>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-text-secondary mb-3">Navegación</h5>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      ← Anterior
                    </Button>
                    <Button>
                      Siguiente →
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Acciones de formulario
<div className="flex gap-3">
  <Button variant="outline">Cancelar</Button>
  <Button>Guardar</Button>
</div>

// Acciones críticas
<div className="flex gap-3">
  <Button variant="ghost">Cancelar</Button>
  <Button variant="destructive">Eliminar</Button>
</div>

// Navegación
<div className="flex gap-3">
  <Button variant="outline">← Anterior</Button>
  <Button>Siguiente →</Button>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCardsCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Card Components</h3>
        <p className="text-text-secondary mb-6">
          Componentes de tarjeta y contenedores.
        </p>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Variantes</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-4 text-center">
                    <h6 className="font-medium">Base</h6>
                    <p className="text-xs text-text-secondary mt-1">Card básica</p>
                  </Card>
                  <Card className="p-4 text-center bg-surface-elevated">
                    <h6 className="font-medium">Elevated</h6>
                    <p className="text-xs text-text-secondary mt-1">Card elevada</p>
                  </Card>
                  <Card className="p-4 text-center glassmorphism">
                    <h6 className="font-medium">Glass</h6>
                    <p className="text-xs text-text-secondary mt-1">Glassmorphism</p>
                  </Card>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`<Card className="p-4">Base</Card>
<Card className="p-4 bg-surface-elevated">Elevated</Card>
<Card className="p-4 glassmorphism">Glass</Card>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNavigationCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Navigation Components</h3>
        <p className="text-text-secondary mb-6">
          Componentes de navegación, menús y breadcrumbs.
        </p>
        
        <div className="space-y-8">
          {/* Breadcrumbs */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Breadcrumbs</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <nav className="flex items-center space-x-2 text-sm">
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Home</a>
                  <span className="text-text-tertiary">/</span>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Eventos</a>
                  <span className="text-text-tertiary">/</span>
                  <span className="text-text-primary font-medium">Configuración</span>
                </nav>
                
                <nav className="flex items-center space-x-2 text-sm bg-surface-secondary px-3 py-2 rounded-lg">
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Dashboard</a>
                  <span className="text-text-tertiary">→</span>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Perfil</a>
                  <span className="text-text-tertiary">→</span>
                  <span className="text-text-primary font-medium">Branding</span>
                </nav>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Breadcrumb básico
<nav className="flex items-center space-x-2 text-sm">
  <a href="#" className="text-text-secondary hover:text-text-primary">Home</a>
  <span className="text-text-tertiary">/</span>
  <span className="text-text-primary font-medium">Current</span>
</nav>

// Breadcrumb con fondo
<nav className="flex items-center space-x-2 text-sm bg-surface-secondary px-3 py-2 rounded-lg">
  <a href="#" className="text-text-secondary hover:text-text-primary">Dashboard</a>
  <span className="text-text-tertiary">→</span>
  <span className="text-text-primary font-medium">Current</span>
</nav>`}
                </code>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Tab Navigation</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-2 bg-surface-secondary p-1 rounded-lg">
                  <button className="flex-1 px-4 py-2 bg-surface-primary text-text-primary rounded-md shadow-sm font-medium">
                    Activo
                  </button>
                  <button className="flex-1 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 rounded-md transition-all">
                    Tab 2
                  </button>
                  <button className="flex-1 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 rounded-md transition-all">
                    Tab 3
                  </button>
                </div>

                <div className="border-b border-border-secondary">
                  <div className="flex gap-6">
                    <button className="px-1 py-2 border-b-2 border-interactive-primary text-interactive-primary font-medium">
                      Activo
                    </button>
                    <button className="px-1 py-2 text-text-secondary hover:text-text-primary transition-colors">
                      Tab 2
                    </button>
                    <button className="px-1 py-2 text-text-secondary hover:text-text-primary transition-colors">
                      Tab 3
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Tabs con fondo
<div className="flex gap-2 bg-surface-secondary p-1 rounded-lg">
  <button className="flex-1 px-4 py-2 bg-surface-primary text-text-primary rounded-md">
    Activo
  </button>
  <button className="flex-1 px-4 py-2 text-text-secondary hover:bg-surface-primary/50">
    Tab 2
  </button>
</div>

// Tabs con underline
<div className="border-b border-border-secondary">
  <div className="flex gap-6">
    <button className="px-1 py-2 border-b-2 border-interactive-primary text-interactive-primary">
      Activo
    </button>
    <button className="px-1 py-2 text-text-secondary hover:text-text-primary">
      Tab 2
    </button>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFeedbackCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feedback Components</h3>
        <p className="text-text-secondary mb-6">
          Alertas, notificaciones y componentes de estado.
        </p>
        
        <div className="space-y-8">
          {/* Alerts */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Alerts</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Éxito</span>
                  </div>
                  <p className="text-sm mt-1 opacity-90">La operación se completó correctamente.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-status-error/10 border border-status-error/20 text-status-error">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm mt-1 opacity-90">Ocurrió un error durante la operación.</p>
                </div>

                <div className="p-4 rounded-lg bg-status-warning/10 border border-status-warning/20 text-status-warning">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Advertencia</span>
                  </div>
                  <p className="text-sm mt-1 opacity-90">Esta acción no se puede deshacer.</p>
                </div>

                <div className="p-4 rounded-lg bg-status-info/10 border border-status-info/20 text-status-info">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span className="font-medium">Información</span>
                  </div>
                  <p className="text-sm mt-1 opacity-90">Revisa los detalles antes de continuar.</p>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Alert de éxito
<div className="p-4 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success">
  <div className="flex items-center gap-2">
    <CheckCircle className="h-4 w-4" />
    <span className="font-medium">Éxito</span>
  </div>
  <p className="text-sm mt-1 opacity-90">Mensaje de éxito</p>
</div>

// Alert de error
<div className="p-4 rounded-lg bg-status-error/10 border border-status-error/20 text-status-error">
  <div className="flex items-center gap-2">
    <XCircle className="h-4 w-4" />
    <span className="font-medium">Error</span>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Toast Notifications */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Toast Notifications</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="border border-border-secondary p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-status-success flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Guardado exitosamente</p>
                      <p className="text-xs text-text-secondary">Los cambios se han aplicado</p>
                    </div>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors">×</button>
                  </div>

                  <div className="border border-border-secondary p-4 rounded-lg flex items-center gap-3">
                    <Bell className="h-5 w-5 text-status-info flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Nueva notificación</p>
                      <p className="text-xs text-text-secondary">Tienes 3 eventos pendientes</p>
                    </div>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors">×</button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Toast notification
<div className="border border-border-secondary p-4 rounded-lg flex items-center gap-3">
  <CheckCircle className="h-5 w-5 text-status-success" />
  <div className="flex-1">
    <p className="font-medium text-text-primary">Título</p>
    <p className="text-xs text-text-secondary">Descripción</p>
  </div>
  <button className="text-text-tertiary hover:text-text-primary">×</button>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Loading States */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Loading States</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-text-primary border-t-transparent rounded-full"></div>
                    <span className="text-text-primary">Cargando...</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-text-primary">Procesando...</span>
                  </div>

                  <div className="p-4 rounded-lg">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-text-tertiary rounded w-3/4"></div>
                      <div className="h-4 bg-text-tertiary rounded w-1/2"></div>
                      <div className="h-4 bg-text-tertiary rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Spinner
<div className="animate-spin h-5 w-5 border-2 border-text-primary border-t-transparent rounded-full"></div>

// Dots loading
<div className="animate-pulse flex space-x-1">
  <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce"></div>
  <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
</div>

// Skeleton
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-text-tertiary rounded w-3/4"></div>
  <div className="h-4 bg-text-tertiary rounded w-1/2"></div>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Display Components</h3>
        <p className="text-text-secondary mb-6">
          Tablas, listas y componentes de visualización de datos.
        </p>
        
        <div className="space-y-8">
          {/* Tables */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Tables</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="border border-border-secondary rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Evento</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Fecha</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Estado</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border-secondary hover:bg-interactive-hover/30 transition-colors">
                        <td className="px-4 py-3 text-text-primary">Concierto Rock</td>
                        <td className="px-4 py-3 text-text-secondary">25 Dic 2024</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-status-success/20 text-status-success rounded-full text-xs">Activo</span>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost">Ver</Button>
                        </td>
                      </tr>
                      <tr className="border-t border-border-secondary hover:bg-interactive-hover/30 transition-colors">
                        <td className="px-4 py-3 text-text-primary">Festival Jazz</td>
                        <td className="px-4 py-3 text-text-secondary">30 Dic 2024</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-status-warning/20 text-status-warning rounded-full text-xs">Pendiente</span>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost">Editar</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Lists */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Lists</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border border-border-secondary rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 hover:bg-interactive-hover/30 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-text-inverse" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">Evento creado</p>
                        <p className="text-xs text-text-secondary">Hace 2 minutos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 hover:bg-interactive-hover/30 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-status-info rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4 text-text-inverse" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">Nueva notificación</p>
                        <p className="text-xs text-text-secondary">Hace 5 minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Lista con iconos
<div className="border border-border-secondary rounded-lg p-4">
  <div className="space-y-3">
    <div className="flex items-center gap-3 p-2 hover:bg-interactive-hover/30 rounded-lg">
      <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center">
        <CheckCircle className="h-4 w-4 text-text-inverse" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-text-primary">Título</p>
        <p className="text-xs text-text-secondary">Descripción</p>
      </div>
    </div>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Progress Indicators</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Progress Bar</label>
                  <div className="w-full bg-surface-secondary rounded-full h-2 border border-border-secondary">
                    <div className="bg-status-success h-full rounded-full transition-all duration-300" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">70% completado</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Steps Progress</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-text-inverse" />
                    </div>
                    <div className="flex-1 h-0.5 bg-status-success"></div>
                    <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-text-inverse" />
                    </div>
                    <div className="flex-1 h-0.5 bg-border-secondary"></div>
                    <div className="w-8 h-8 bg-surface-secondary border-2 border-border-focus rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-text-primary">3</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Progress bar
<div className="w-full bg-surface-secondary rounded-full h-2 border border-border-secondary">
  <div className="bg-status-success h-full rounded-full" style={{ width: '70%' }}></div>
</div>

// Steps progress
<div className="flex items-center gap-2">
  <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center">
    <CheckCircle className="h-4 w-4 text-text-inverse" />
  </div>
  <div className="flex-1 h-0.5 bg-status-success"></div>
  <div className="w-8 h-8 bg-surface-secondary border-2 border-border-focus rounded-full">
    <span className="text-sm font-medium">3</span>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMediaCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Media Components</h3>
        <p className="text-text-secondary mb-6">
          Componentes para manejo de imágenes, videos y galerías.
        </p>
        
        <div className="space-y-8">
          {/* Image Display */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Image Display</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square border border-border-secondary rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-interactive-primary/20 to-interactive-secondary/20 flex items-center justify-center">
                      <Image className="h-8 w-8 text-text-secondary" />
                    </div>
                  </div>
                  
                  <div className="aspect-video border border-border-secondary rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-status-info/20 to-status-success/20 flex items-center justify-center">
                      <Video className="h-6 w-6 text-text-secondary" />
                    </div>
                  </div>
                  
                  <div className="aspect-square border border-border-secondary rounded-lg overflow-hidden relative group cursor-pointer">
                    <div className="w-full h-full bg-gradient-to-br from-status-warning/20 to-status-error/20 flex items-center justify-center">
                      <FileImage className="h-8 w-8 text-text-secondary" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-6 w-6 text-text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Image container
<div className="aspect-square border border-border-secondary rounded-lg overflow-hidden">
  <img src="image.jpg" alt="Description" className="w-full h-full object-cover" />
</div>

// Video container
<div className="aspect-video border border-border-secondary rounded-lg overflow-hidden">
  <video className="w-full h-full object-cover" controls>
    <source src="video.mp4" type="video/mp4" />
  </video>
</div>

// Upload overlay
<div className="relative group cursor-pointer">
  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
    <Upload className="h-6 w-6 text-text-primary" />
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderInteractiveCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Interactive Components</h3>
        <p className="text-text-secondary mb-6">
          Switches, sliders, toggles y controles interactivos.
        </p>
        
        <div className="space-y-8">
          {/* Switches */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Switches & Toggles</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Notificaciones</p>
                    <p className="text-xs text-text-secondary">Recibir alertas por email</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-interactive-secondary border border-border-secondary rounded-full cursor-pointer transition-colors">
                      <div className="w-4 h-4 bg-text-inverse rounded-full mt-1 ml-1 transition-transform"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Modo Oscuro</p>
                    <p className="text-xs text-text-secondary">Activar tema oscuro</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked />
                    <div className="w-10 h-6 bg-status-success border border-border-secondary rounded-full cursor-pointer">
                      <div className="w-4 h-4 bg-text-inverse rounded-full mt-1 ml-5 transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Switch component
<div className="flex items-center justify-between p-3 border border-border-secondary rounded-lg">
  <div>
    <p className="font-medium text-text-primary">Label</p>
    <p className="text-xs text-text-secondary">Description</p>
  </div>
  <div className="relative">
    <input type="checkbox" className="sr-only" />
    <div className="w-10 h-6 bg-interactive-secondary border border-border-secondary rounded-full cursor-pointer">
      <div className="w-4 h-4 bg-text-inverse rounded-full mt-1 ml-1 transition-transform"></div>
    </div>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Range Sliders */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Range Sliders</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Precio (0 - 1000)</label>
                  <div className="px-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      defaultValue="500"
                      className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                      <span>$0</span>
                      <span className="font-medium text-text-primary">$500</span>
                      <span>$1000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Range slider
<input 
  type="range" 
  min="0" 
  max="1000" 
  defaultValue="500"
  className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer"
/>

<div className="flex justify-between text-xs text-text-secondary mt-1">
  <span>Min</span>
  <span className="font-medium text-text-primary">Current</span>
  <span>Max</span>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderOverlaysCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Overlay Components</h3>
        <p className="text-text-secondary mb-6">
          Modales, tooltips, popovers y elementos superpuestos.
        </p>
        
        <div className="space-y-8">
          {/* Modal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Modal Dialog</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Button 
                  onClick={() => alert('Modal would open here')}
                  className="bg-interactive-primary text-text-inverse"
                >
                  Abrir Modal
                </Button>
                <div className="p-4 border border-border-secondary rounded-lg bg-surface-secondary/50">
                  <div className="text-xs text-text-secondary mb-2">Vista previa del modal:</div>
                  <div className="p-4 border border-border-secondary rounded-lg">
                    <h4 className="font-semibold text-text-primary mb-2">Título del Modal</h4>
                    <p className="text-text-secondary text-sm mb-4">Contenido del modal aquí...</p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">Cancelar</Button>
                      <Button size="sm">Confirmar</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Modal básico
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="border border-border-secondary rounded-lg p-6 max-w-md">
    <h4 className="font-semibold mb-2">Título</h4>
    <p className="text-text-secondary mb-4">Contenido...</p>
    <div className="flex gap-2 justify-end">
      <Button variant="outline">Cancelar</Button>
      <Button>Confirmar</Button>
    </div>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Tooltips */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Tooltips</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="relative group">
                    <Button variant="outline" size="sm">Hover para tooltip</Button>
                    <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-text-inverse bg-surface-primary border border-border-secondary rounded shadow-lg">
                      Información útil
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Tooltip
<div className="relative group">
  <button>Hover me</button>
  <div className="invisible group-hover:visible absolute bottom-full mb-2 px-2 py-1 text-xs bg-surface-primary border rounded shadow-lg">
    Tooltip text
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Popovers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Popovers</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Button variant="outline" size="sm">
                  Click para popover
                </Button>
                <div className="p-3 border border-border-secondary rounded-lg max-w-xs">
                  <h5 className="font-medium text-text-primary mb-2">Popover Title</h5>
                  <p className="text-xs text-text-secondary mb-3">Contenido detallado del popover con información adicional.</p>
                  <Button size="sm" className="w-full">Acción</Button>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Popover
<div className="border border-border-secondary rounded-lg p-3">
  <h5 className="font-medium mb-2">Título</h5>
  <p className="text-xs text-text-secondary mb-3">Contenido...</p>
  <Button size="sm" className="w-full">Acción</Button>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecurityCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security Components</h3>
        <p className="text-text-secondary mb-6">
          Componentes de autenticación, permisos y seguridad.
        </p>
        
        <div className="space-y-8">
          {/* Login Forms */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Login & Authentication</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border border-border-secondary rounded-lg">
                  <h5 className="font-medium text-text-primary mb-3">Iniciar Sesión</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-primary block mb-1">Email</label>
                      <div className="glassmorphism-input w-full px-3 py-2 rounded-lg border border-border-secondary">
                        usuario@ejemplo.com
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary block mb-1">Contraseña</label>
                      <div className="glassmorphism-input w-full px-3 py-2 rounded-lg border border-border-secondary">
                        ••••••••
                      </div>
                    </div>
                    <Button className="w-full bg-interactive-primary text-text-inverse">
                      Iniciar Sesión
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Login form
<div className="border border-border-secondary rounded-lg p-4">
  <h5 className="font-medium mb-3">Iniciar Sesión</h5>
  <div className="space-y-3">
    <input type="email" placeholder="Email" className="glassmorphism-input" />
    <input type="password" placeholder="Contraseña" className="glassmorphism-input" />
    <Button className="w-full bg-interactive-primary">Iniciar Sesión</Button>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Permission Cards */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Permissions & Roles</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-3 border border-border-secondary rounded-lg flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-status-success" />
                      <span className="font-medium text-text-primary">Admin</span>
                    </div>
                    <p className="text-xs text-text-secondary">Acceso completo al sistema</p>
                  </div>
                  <div className="p-3 border border-border-secondary rounded-lg flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-status-warning" />
                      <span className="font-medium text-text-primary">Viewer</span>
                    </div>
                    <p className="text-xs text-text-secondary">Solo lectura</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Permission card
<div className="border border-border-secondary rounded-lg p-3">
  <div className="flex items-center gap-2 mb-2">
    <Shield className="h-4 w-4 text-status-success" />
    <span className="font-medium">Admin</span>
  </div>
  <p className="text-xs text-text-secondary">Descripción del rol</p>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderEventsCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Events Components</h3>
        <p className="text-text-secondary mb-6">
          Componentes específicos para la gestión de eventos.
        </p>
        
        <div className="space-y-8">
          {/* Event Cards */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Event Cards</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border border-border-secondary rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-interactive-primary mt-1" />
                    <div className="flex-1">
                      <h5 className="font-medium text-text-primary">Conferencia Tech 2024</h5>
                      <p className="text-xs text-text-secondary mb-2">15 de Diciembre, 2024 - 10:00 AM</p>
                      <p className="text-sm text-text-secondary mb-3">Conferencia sobre las últimas tendencias en tecnología.</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-interactive-primary text-text-inverse">Ver Detalles</Button>
                        <Button variant="outline" size="sm">Compartir</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Event card
<div className="border border-border-secondary rounded-lg p-4">
  <div className="flex items-start gap-3">
    <Calendar className="h-5 w-5 text-interactive-primary" />
    <div className="flex-1">
      <h5 className="font-medium">Título del Evento</h5>
      <p className="text-xs text-text-secondary">Fecha y hora</p>
      <p className="text-sm text-text-secondary mb-3">Descripción...</p>
      <Button size="sm">Ver Detalles</Button>
    </div>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Event Status */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Event Status</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="px-2 py-1 bg-status-success/10 border border-status-success/20 rounded text-xs text-status-success">
                    Activo
                  </div>
                  <div className="px-2 py-1 bg-status-warning/10 border border-status-warning/20 rounded text-xs text-status-warning">
                    Pendiente
                  </div>
                  <div className="px-2 py-1 bg-status-error/10 border border-status-error/20 rounded text-xs text-status-error">
                    Cancelado
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Status badges
<div className="px-2 py-1 bg-status-success/10 border border-status-success/20 rounded text-xs text-status-success">
  Activo
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsCategory = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications System</h3>
        <p className="text-text-secondary mb-6">
          Sistema completo de notificaciones y alertas.
        </p>
        
        <div className="space-y-8">
          {/* Toast Notifications */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Toast Notifications</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-status-success/20 rounded-lg bg-status-success/5">
                    <div className="w-2 h-2 bg-status-success rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">¡Éxito!</p>
                      <p className="text-xs text-text-secondary">La operación se completó correctamente</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-status-warning/20 rounded-lg bg-status-warning/5">
                    <div className="w-2 h-2 bg-status-warning rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">Advertencia</p>
                      <p className="text-xs text-text-secondary">Revisa la configuración antes de continuar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-status-error/20 rounded-lg bg-status-error/5">
                    <div className="w-2 h-2 bg-status-error rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">Error</p>
                      <p className="text-xs text-text-secondary">No se pudo procesar la solicitud</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Toast notification
<div className="flex items-center gap-3 p-3 border border-status-success/20 rounded-lg bg-status-success/5">
  <div className="w-2 h-2 bg-status-success rounded-full"></div>
  <div className="flex-1">
    <p className="text-sm font-medium">¡Éxito!</p>
    <p className="text-xs text-text-secondary">Mensaje del toast</p>
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>

          {/* Notification Badges */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-border-secondary pb-2">Notification Badges</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Bell className="h-6 w-6 text-text-secondary" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-status-error text-text-inverse text-xs rounded-full flex items-center justify-center">
                      3
                    </div>
                  </div>
                  <div className="relative">
                    <Bell className="h-6 w-6 text-text-secondary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-error rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary p-4 rounded-lg">
                <code className="text-xs text-text-secondary">
                  {`// Notification badge
<div className="relative">
  <Bell className="h-6 w-6" />
  <div className="absolute -top-2 -right-2 w-5 h-5 bg-status-error text-text-inverse text-xs rounded-full flex items-center justify-center">
    3
  </div>
</div>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preview del Sistema</h3>
        <div className="space-y-4">
          {/* Buttons Preview */}
          <div className="flex gap-3 flex-wrap">
            <Button>Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructivo</Button>
          </div>
          
          {/* Status Alerts Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success">
              ✓ Operación exitosa
            </div>
            <div className="p-3 rounded-lg bg-status-error/10 border border-status-error/20 text-status-error">
              ✗ Error en la operación
            </div>
            <div className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/20 text-status-warning">
              ⚠ Advertencia importante
            </div>
            <div className="p-3 rounded-lg bg-status-info/10 border border-status-info/20 text-status-info">
              ℹ Información relevante
            </div>
          </div>
          
          {/* Cards Preview */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold">Card Primaria</h4>
              <p className="text-text-secondary">Superficie principal</p>
            </Card>
            <Card className="p-4 bg-surface-secondary">
              <h4 className="font-semibold">Card Secundaria</h4>
              <p className="text-text-secondary">Superficie secundaria</p>
            </Card>
            <Card className="p-4 bg-surface-elevated">
              <h4 className="font-semibold">Card Elevada</h4>
              <p className="text-text-secondary">Superficie elevada</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Design System</h2>
        <p className="text-text-secondary">
          Administra colores, tipografías y componentes de forma centralizada para todo el panel.
        </p>
      </div>

      {/* Category Content */}
      <div>
        {activeSection === 'claude-md' && renderClaudeMDCategory()}
        {activeSection === 'tokens' && renderColorEditor()}
        {activeSection === 'inputs' && renderInputsCategory()}
        {activeSection === 'buttons' && renderButtonsCategory()}
        {activeSection === 'cards' && renderCardsCategory()}
        {activeSection === 'navigation' && renderNavigationCategory()}
        {activeSection === 'feedback' && renderFeedbackCategory()}
        {activeSection === 'data' && renderDataCategory()}
        {activeSection === 'media' && renderMediaCategory()}
        {activeSection === 'overlays' && renderOverlaysCategory()}
        {activeSection === 'interactive' && renderInteractiveCategory()}
        {activeSection === 'security' && renderSecurityCategory()}
        {activeSection === 'events' && renderEventsCategory()}
        {activeSection === 'notifications' && renderNotificationsCategory()}
        {activeSection === 'preview' && renderPreview()}
      </div>
    </div>
  );
}