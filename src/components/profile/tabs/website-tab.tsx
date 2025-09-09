"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SpotlightCard } from "../../../../../noxglass-ui/src/components/creative/spotlight-card";
import { LiquidGlassButton } from "../../../../../noxglass-ui/src/components/creative/liquid-glass-button";
import { GlassMorphismOverlay } from "../../../../../noxglass-ui/src/components/creative/animated-backgrounds";
import { AuroraBackground } from "@/components/ui/digital-aurora";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { WebGLShaderBackground } from "@/components/ui/web-gl-shader";
import { Globe, ExternalLink, Copy, CheckCircle, BarChart3, Settings, TrendingUp, Users, Eye, MousePointer, Palette, Monitor, Heart, Sun, Moon, Laptop, Share2, MessageCircle, Facebook, Twitter, Instagram, Building2 } from "lucide-react";
import { LogoAvatar } from "@/components/ui/logo-avatar";
import { validateImageExists } from "@/lib/logo-utils";
import { ProfileHeader } from "../profile-header";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { TabContentProps } from "@/types/tabs";

export function WebsiteTab({ producerId, currentProducer }: TabContentProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'settings'>('analytics');
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    websiteUrl: currentProducer?.websiteUrl || '',
    customDomain: currentProducer?.customDomain || '',
    isPublished: currentProducer?.isPublished || false,
    seoTitle: currentProducer?.seoTitle || '',
    seoDescription: currentProducer?.seoDescription || '',
  });

  // Update settings when currentProducer changes
  useEffect(() => {
    if (currentProducer) {
      setSettings({
        websiteUrl: currentProducer.websiteUrl || '',
        customDomain: currentProducer.customDomain || '',
        isPublished: currentProducer.isPublished || false,
        seoTitle: currentProducer.seoTitle || '',
        seoDescription: currentProducer.seoDescription || '',
      });
    }
  }, [currentProducer]);
  const [copied, setCopied] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<'blue' | 'redblue' | 'aurora' | 'shader' | 'webgl' | 'none'>('blue');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [previewPlatform, setPreviewPlatform] = useState<'whatsapp' | 'facebook' | 'twitter' | 'google'>('whatsapp');

  const defaultUrl = `https://hunt-tickets.com/hosts/${currentProducer?.domain || 'productor'}`;
  const websiteUrl = settings.customDomain ? `https://${settings.customDomain}` : defaultUrl;

  // Enhanced glassmorphism skeleton system
  const getGlassmorphismClasses = () => {
    const isSystem = selectedTheme === 'system';
    const isDark = selectedTheme === 'dark' || (isSystem && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
      // Container backgrounds with glassmorphism effect
      containerBg: isDark 
        ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
        : 'bg-white/15 backdrop-blur-xl border border-white/25',
      
      // Skeleton elements with proper glassmorphism
      skeletonPrimary: isDark
        ? 'bg-white/10 backdrop-blur-sm border border-white/15'
        : 'bg-white/20 backdrop-blur-sm border border-white/30',
      
      skeletonSecondary: isDark
        ? 'bg-white/8 backdrop-blur-sm border border-white/12'
        : 'bg-white/15 backdrop-blur-sm border border-white/25',
      
      skeletonTertiary: isDark
        ? 'bg-white/6 backdrop-blur-sm border border-white/10'
        : 'bg-white/12 backdrop-blur-sm border border-white/20',
      
      // Icon backgrounds with enhanced glassmorphism
      iconBg: isDark
        ? 'bg-white/8 backdrop-blur-md border border-white/15'
        : 'bg-white/18 backdrop-blur-md border border-white/30',
      
      // Interactive elements
      buttonPrimary: isDark
        ? 'bg-white/12 backdrop-blur-md border border-white/20 hover:bg-white/18'
        : 'bg-white/25 backdrop-blur-md border border-white/35 hover:bg-white/30',
      
      buttonSecondary: isDark
        ? 'bg-white/8 backdrop-blur-md border border-white/15 hover:bg-white/12'
        : 'bg-white/18 backdrop-blur-md border border-white/25 hover:bg-white/22',
      
      // Text colors
      textPrimary: isDark ? 'text-white/90' : 'text-gray-900/90',
      textSecondary: isDark ? 'text-white/70' : 'text-gray-700/80',
      textTertiary: isDark ? 'text-white/50' : 'text-gray-600/70',
    };
  };

  // Glassmorphism Skeleton Components
  const GlassmorphismSkeleton = ({ 
    variant = 'primary', 
    shape = 'rectangle', 
    className = '',
    children 
  }: {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'icon' | 'button-primary' | 'button-secondary';
    shape?: 'rectangle' | 'circle' | 'rounded';
    className?: string;
    children?: React.ReactNode;
  }) => {
    const classes = getGlassmorphismClasses();
    
    const baseClasses = 'animate-pulse shadow-lg transition-all duration-300 hover:shadow-xl';
    let variantClasses = '';
    let shapeClasses = '';
    
    // Enhanced animation classes
    const glowAnimation = 'animate-[glow_2s_ease-in-out_infinite_alternate]';
    const pulseAnimation = 'animate-[glassmorphism-pulse_1.5s_ease-in-out_infinite]';
    
    // Variant styling
    switch (variant) {
      case 'primary':
        variantClasses = classes.skeletonPrimary;
        break;
      case 'secondary':
        variantClasses = classes.skeletonSecondary;
        break;
      case 'tertiary':
        variantClasses = classes.skeletonTertiary;
        break;
      case 'icon':
        variantClasses = classes.iconBg;
        break;
      case 'button-primary':
        variantClasses = classes.buttonPrimary;
        break;
      case 'button-secondary':
        variantClasses = classes.buttonSecondary;
        break;
    }
    
    // Shape styling
    switch (shape) {
      case 'circle':
        shapeClasses = 'rounded-full';
        break;
      case 'rounded':
        shapeClasses = 'rounded-lg';
        break;
      case 'rectangle':
        shapeClasses = 'rounded-md';
        break;
    }
    
    return (
      <div className={`relative ${baseClasses} ${variantClasses} ${shapeClasses} ${pulseAnimation} ${className}`}>
        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-[inherit]"></div>
        {children && <div className="opacity-0 relative z-10">{children}</div>}
      </div>
    );
  };

  const GlassmorphismContainer = ({ 
    children, 
    className = '' 
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const classes = getGlassmorphismClasses();
    return (
      <div className={`${classes.containerBg} shadow-xl ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-lg"></div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  };

  // Mock analytics data
  const analyticsData = [
    { name: 'Ene', visits: 1200, pageViews: 2400, uniqueVisitors: 800 },
    { name: 'Feb', visits: 1900, pageViews: 3200, uniqueVisitors: 1200 },
    { name: 'Mar', visits: 2100, pageViews: 4100, uniqueVisitors: 1400 },
    { name: 'Abr', visits: 2800, pageViews: 5200, uniqueVisitors: 1800 },
    { name: 'May', visits: 3200, pageViews: 6100, uniqueVisitors: 2100 },
    { name: 'Jun', visits: 2900, pageViews: 5800, uniqueVisitors: 1900 },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  if (!currentProducer) {
    return (
      <div className="text-center text-muted-foreground">
        Selecciona un productor para gestionar su website
      </div>
    );
  }

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Website URL and Status */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-text-primary">Website Activo</h4>
            <p className="text-text-secondary text-sm break-all">{websiteUrl}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={settings.isPublished ? "default" : "secondary"}
              className={settings.isPublished ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}
            >
              {settings.isPublished ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Publicado
                </>
              ) : "Borrador"}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="hover:bg-interactive-secondary border-border-secondary"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-interactive-secondary border-border-secondary"
              >
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Visitas Totales</p>
              <p className="text-2xl font-bold text-text-primary">14,200</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+12.5%</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Visitantes Únicos</p>
              <p className="text-2xl font-bold text-text-primary">9,300</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+8.2%</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Páginas Vistas</p>
              <p className="text-2xl font-bold text-text-primary">26,800</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+15.3%</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-text-primary">3.2%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+0.8%</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <MousePointer className="w-4 h-4 text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-6">
        <div className="mb-4">
          <h4 className="text-lg font-medium text-text-primary">Tráfico del Website</h4>
          <p className="text-text-secondary text-sm">Últimos 6 meses</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisits)"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPageViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-text-secondary">Visitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-text-secondary">Páginas Vistas</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Domain Configuration */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-6 rounded-xl">
        <h4 className="text-lg font-medium text-text-primary mb-4">Configuración de Dominio</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Dominio Personalizado (Opcional)</label>
            <Input
              value={settings.customDomain}
              onChange={(e) => setSettings(prev => ({ ...prev, customDomain: e.target.value }))}
              placeholder="www.miproductora.com"
              className="glassmorphism-input w-full h-12"
              disabled={!isEditing}
            />
            <p className="text-xs text-text-secondary">
              Conecta tu propio dominio personalizado. Requiere configuración DNS.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">URL del Website Externo</label>
            <Input
              value={settings.websiteUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, websiteUrl: e.target.value }))}
              placeholder="https://www.miwebsite.com"
              className="glassmorphism-input w-full h-12"
              disabled={!isEditing}
            />
            <p className="text-xs text-text-secondary">
              Si tienes un website externo, puedes vincularlo aquí.
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium px-6 border border-border-primary"
            >
              Editar Configuración
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="hover:bg-interactive-secondary border-border-secondary text-text-primary px-6"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium px-6 border border-border-primary"
              >
                Guardar Cambios
              </Button>
            </>
          )}
        </div>
      </div>

      {/* SEO & Social Media Configuration */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-6 py-4 border-b border-border-secondary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-primary">SEO & Social Media</h4>
              <p className="text-sm text-text-secondary">Optimiza cómo se ve tu website cuando lo compartan</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - SEO Configuration */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic SEO */}
              <div className="space-y-4">
                <h5 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Configuración Básica
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Título SEO</label>
                    <Input
                      value={settings.seoTitle}
                      onChange={(e) => setSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder={`${currentProducer?.name} - Eventos y Tickets`}
                      className="glassmorphism-input h-11"
                      disabled={!isEditing}
                      maxLength={60}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-text-tertiary">Título que aparece en Google</span>
                      <span className={settings.seoTitle.length > 50 ? 'text-orange-400' : 'text-text-secondary'}>
                        {settings.seoTitle.length}/60
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">URL Slug</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={settings.customDomain || currentProducer?.domain}
                        className="glassmorphism-input h-11 text-text-tertiary"
                        disabled
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11 px-3"
                        onClick={() => navigator.clipboard.writeText(websiteUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Descripción SEO</label>
                  <textarea
                    value={settings.seoDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder={`Descubre los mejores eventos de ${currentProducer?.name}. Compra tus tickets de forma segura y fácil con la mejor experiencia.`}
                    rows={3}
                    maxLength={160}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-interactive-hover border border-border-secondary rounded-lg text-text-primary placeholder-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-text-tertiary">Descripción que aparece en resultados de búsqueda</span>
                    <span className={settings.seoDescription.length > 140 ? 'text-orange-400' : 'text-text-secondary'}>
                      {settings.seoDescription.length}/160
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced SEO */}
              <div className="space-y-6 pt-6 border-t border-border-secondary">
                <h5 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuración Avanzada
                </h5>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Keywords Principales</label>
                  <Input
                    placeholder="eventos, tickets, música, conciertos"
                    className="glassmorphism-input h-11"
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-text-tertiary">Palabras clave separadas por comas para mejorar el SEO</p>
                </div>
              </div>
            </div>

            {/* Right Column - Social Media Preview */}
            <div className="lg:col-span-2 space-y-4">
              <h5 className="text-base font-semibold text-text-primary">Preview Social Media</h5>
              
              {/* Platform Selector */}
              <div className="glassmorphism p-2 rounded-xl">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewPlatform('whatsapp')}
                    className={`flex-1 p-3 rounded-lg transition-all duration-300 ${
                      previewPlatform === 'whatsapp' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-md shadow-lg shadow-green-500/10' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 backdrop-blur-sm border border-transparent hover:border-border-secondary/50'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('facebook')}
                    className={`flex-1 p-3 rounded-lg transition-all duration-300 ${
                      previewPlatform === 'facebook' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-lg shadow-blue-500/10' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 backdrop-blur-sm border border-transparent hover:border-border-secondary/50'
                    }`}
                  >
                    <Facebook className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('twitter')}
                    className={`flex-1 p-3 rounded-lg transition-all duration-300 ${
                      previewPlatform === 'twitter' 
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 backdrop-blur-md shadow-lg shadow-sky-500/10' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 backdrop-blur-sm border border-transparent hover:border-border-secondary/50'
                    }`}
                  >
                    <Twitter className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('google')}
                    className={`flex-1 p-3 rounded-lg transition-all duration-300 ${
                      previewPlatform === 'google' 
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-md shadow-lg shadow-yellow-500/10' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 backdrop-blur-sm border border-transparent hover:border-border-secondary/50'
                    }`}
                  >
                    <Globe className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="min-h-[300px]">
                {previewPlatform === 'whatsapp' && (
                  <div className="bg-[#111b21] rounded-lg p-4 max-w-sm mx-auto">
                    {/* WhatsApp Chat Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700/50">
                      <LogoAvatar 
                        producer={currentProducer}
                        size="md"
                        variant="social"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{currentProducer?.name || 'Mi Productora'}</p>
                        <p className="text-[#8ba6c8] text-xs flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full block"></span>
                          en línea
                        </p>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-3">
                      <div className="bg-[#005c4b] rounded-lg rounded-br-sm px-3 py-2 max-w-[85%] ml-auto">
                        <p className="text-white text-sm">¡Conoce mi perfil de productor! 🎭</p>
                        <div className="flex justify-end items-center gap-1 mt-1">
                          <span className="text-[#8ba6c8] text-xs">ahora</span>
                          <div className="flex gap-0.5">
                            <div className="w-4 h-3 fill-[#53bdeb]">
                              <svg viewBox="0 0 16 11" className="w-full h-full">
                                <path fill="currentColor" d="M11.071 1.429L4.929 7.571 2.5 5.143 1.071 6.571 4.929 10.429 12.5 2.857z"/>
                              </svg>
                            </div>
                            <div className="w-4 h-3 fill-[#53bdeb]">
                              <svg viewBox="0 0 16 11" className="w-full h-full">
                                <path fill="currentColor" d="M11.071 1.429L4.929 7.571 2.5 5.143 1.071 6.571 4.929 10.429 12.5 2.857z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Link Preview Card */}
                      <div className="bg-[#1f2937] rounded-lg overflow-hidden max-w-[90%] border border-[#374151]">
                        <div className="aspect-[1.91] bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center relative">
                          <Globe className="w-8 h-8 text-white/90" />
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-[#1f2937]">
                          <p className="text-white text-sm font-medium mb-1 line-clamp-2">
                            {settings.seoTitle || `${currentProducer?.name || 'Mi Productora'} - Perfil de Productor`}
                          </p>
                          <p className="text-[#8ba6c8] text-xs mb-2 line-clamp-2">
                            {settings.seoDescription || `Conoce el perfil completo de ${currentProducer?.name || 'nuestro productor'}, su trayectoria y próximos proyectos.`}
                          </p>
                          <p className="text-[#8ba6c8]/60 text-xs">
                            {websiteUrl.replace('https://', '').replace('http://', '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewPlatform === 'facebook' && (
                  <div className="bg-[#1c1e21] rounded-lg p-4 max-w-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <LogoAvatar 
                        producer={currentProducer}
                        size="md"
                        variant="social"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{currentProducer?.name || 'Mi Productora'}</p>
                        <p className="text-gray-400 text-xs">hace 2 min</p>
                      </div>
                    </div>
                    <div className="border border-gray-600 rounded-lg overflow-hidden">
                      <div className="aspect-[1.91] bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-3 bg-[#242526]">
                        <p className="text-blue-400 text-xs mb-1">{websiteUrl.replace('https://', '').toUpperCase()}</p>
                        <h6 className="text-white text-sm font-medium mb-1 line-clamp-2">
                          {settings.seoTitle || `${currentProducer?.name || 'Mi Productora'} - Perfil de Productor`}
                        </h6>
                        <p className="text-gray-300 text-xs line-clamp-2">
                          {settings.seoDescription || `Conoce el perfil completo de ${currentProducer?.name || 'nuestro productor'} y su trayectoria.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {previewPlatform === 'twitter' && (
                  <div className="bg-black rounded-lg p-4 max-w-sm">
                    <div className="flex gap-2 mb-2">
                      <LogoAvatar 
                        producer={currentProducer}
                        size="md"
                        variant="social"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-white text-sm font-bold">{currentProducer?.name || 'Mi Productora'}</span>
                          <span className="text-gray-500 text-sm">@{currentProducer?.name?.toLowerCase().replace(/\s+/g, '') || 'miproductora'}</span>
                          <span className="text-gray-500 text-sm">·</span>
                          <span className="text-gray-500 text-sm">2m</span>
                        </div>
                        <p className="text-white text-sm mb-3">Conoce mi perfil completo de productor 🎬✨</p>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded-2xl overflow-hidden ml-10">
                      <div className="aspect-[1.91] bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-3">
                        <h6 className="text-white text-sm font-medium mb-1 line-clamp-2">
                          {settings.seoTitle || `${currentProducer?.name || 'Mi Productora'} - Perfil de Productor`}
                        </h6>
                        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                          {settings.seoDescription || `Conoce el perfil completo de ${currentProducer?.name || 'nuestro productor'} y su trayectoria.`}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {websiteUrl.replace('https://', '')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {previewPlatform === 'google' && (
                  <div className="bg-white rounded-lg p-4 max-w-sm border border-gray-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 mb-2">
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="text-green-700 text-sm">{websiteUrl.replace('https://', '')}</span>
                      </div>
                      <h6 className="text-blue-800 text-lg font-medium hover:underline cursor-pointer line-clamp-1">
                        {settings.seoTitle || `${currentProducer?.name || 'Mi Productora'} - Perfil de Productor`}
                      </h6>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {settings.seoDescription || `Conoce el perfil completo de ${currentProducer?.name || 'nuestro productor'}, su trayectoria, experiencia y próximos proyectos.`}
                      </p>
                      <div className="flex gap-4 text-xs text-blue-800 mt-2">
                        <span className="hover:underline cursor-pointer">Perfil</span>
                        <span className="hover:underline cursor-pointer">Trayectoria</span>
                        <span className="hover:underline cursor-pointer">Proyectos</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-text-secondary bg-surface-elevated p-3 rounded-lg">
                💡 <strong>Tip:</strong> {previewPlatform === 'whatsapp' ? 'WhatsApp usa los meta tags para mostrar el preview' : previewPlatform === 'google' ? 'Google indexa el título y descripción SEO' : previewPlatform === 'facebook' ? 'Facebook lee Open Graph tags automáticamente' : 'Twitter usa Twitter Cards para los previews'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Website Preview Section */}
      <div className="space-y-6">
        <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-medium text-text-primary flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Preview del Website
              </h4>
              <p className="text-text-secondary text-sm">
                Vista previa de componentes con glassmorphism
              </p>
            </div>
            
            {/* Controls Panel */}
            <div className="bg-surface-elevated rounded-lg p-4 space-y-4">
              {/* Theme Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-text-primary" />
                  <span className="text-sm font-medium text-text-primary">Tema</span>
                </div>
                <div className="flex bg-surface-secondary rounded-lg p-1 w-full">
                  <button
                    onClick={() => setSelectedTheme('light')}
                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                      selectedTheme === 'light'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    Light
                  </button>
                  <button
                    onClick={() => setSelectedTheme('dark')}
                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                      selectedTheme === 'dark'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    Dark
                  </button>
                  <button
                    onClick={() => setSelectedTheme('system')}
                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                      selectedTheme === 'system'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary'
                    }`}
                  >
                    <Laptop className="w-3 h-3" />
                    System
                  </button>
                </div>
              </div>

              {/* Background Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-text-primary" />
                  <span className="text-sm font-medium text-text-primary">Fondo Animado</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedBackground('blue')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedBackground === 'blue'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-primary border border-border-secondary'
                    }`}
                  >
                    Gradiente Azul
                  </button>
                  <button
                    onClick={() => setSelectedBackground('redblue')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedBackground === 'redblue'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-primary border border-border-secondary'
                    }`}
                  >
                    Rojo-Azul
                  </button>
                  <button
                    onClick={() => setSelectedBackground('aurora')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedBackground === 'aurora'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-primary border border-border-secondary'
                    }`}
                  >
                    Aurora Boreal
                  </button>
                  <button
                    onClick={() => setSelectedBackground('shader')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedBackground === 'shader'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-primary border border-border-secondary'
                    }`}
                  >
                    Shader Volumétrico
                  </button>
                  <button
                    onClick={() => setSelectedBackground('webgl')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedBackground === 'webgl'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-primary border border-border-secondary'
                    }`}
                  >
                    WebGL Waves
                  </button>
                  <button
                    onClick={() => setSelectedBackground('none')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedBackground === 'none'
                        ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-primary border border-border-secondary'
                    }`}
                  >
                    Sin Fondo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Container */}
          <div className={`relative border border-border-secondary rounded-xl overflow-hidden min-h-[500px] ${selectedBackground === 'none' ? 'bg-surface-elevated' : 'bg-transparent'}`}>
            {/* Background Layer */}
            {selectedBackground === 'blue' && (
              <PreviewAnimatedBlueBackground className="rounded-xl" />
            )}
            {selectedBackground === 'redblue' && (
              <PreviewRaycastRedBlueBackground className="rounded-xl" />
            )}
            {selectedBackground === 'aurora' && (
              <AuroraBackground className="rounded-xl" />
            )}
            {selectedBackground === 'shader' && (
              <AnimatedShaderBackground className="rounded-xl" />
            )}
            {selectedBackground === 'webgl' && (
              <WebGLShaderBackground className="rounded-xl" />
            )}
            
            {/* Content Layer */}
            <div className="relative z-10">
              <>
                {/* Navigation Header Menu */}
                <GlassmorphismContainer className="py-4 rounded-t-lg rounded-b-none">
                  <div className="flex items-center justify-between px-6">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                      <LogoAvatar 
                        producer={currentProducer}
                        size="md"
                        variant="header"
                      />
                      <span className="text-text-primary font-semibold text-sm">
                        {currentProducer?.name || 'Mi Productora'}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <GlassmorphismSkeleton variant="button-secondary" shape="rounded" className="w-20 h-8" />
                      <GlassmorphismSkeleton variant="button-primary" shape="rounded" className="w-24 h-8" />
                    </div>
                  </div>
                </GlassmorphismContainer>

                {/* Profile Header Section */}
                <div className="px-8 pt-6">
                  <GlassmorphismContainer className="overflow-hidden rounded-xl">
                    {/* Banner Section */}
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                      <img 
                        src={`https://db.hunt-tickets.com/storage/v1/object/public/producers/${currentProducer?.id}/logos/logo_banner.png`}
                        alt={`${currentProducer?.name} banner`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://db.hunt-tickets.com/storage/v1/object/public/default/assets/producer_default.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {/* Breadcrumb */}
                      <div className="text-sm text-text-secondary">
                        <span>Panel</span> › <span>Website</span> › <span className="text-text-primary font-medium">{currentProducer?.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Profile Logo */}
                        <div className="w-16 h-16 border border-border-secondary rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-surface-tertiary">
                          <img 
                            src={`https://db.hunt-tickets.com/storage/v1/object/public/producers/${currentProducer?.id}/logos/logo.png`}
                            alt={`${currentProducer?.name} logo`}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <Building2 className="h-8 w-8 text-text-secondary hidden" />
                        </div>
                        
                        {/* Profile Name */}
                        <div>
                          <h1 className="text-3xl font-bold text-text-primary">{currentProducer?.name}</h1>
                          {currentProducer?.description && (
                            <p className="text-text-secondary mt-1">{currentProducer.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassmorphismContainer>
                </div>

                {/* Glassmorphism Hero Section */}
                <div className="px-8 pt-6">
                  <GlassmorphismContainer className="p-8 text-center rounded-lg">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <GlassmorphismSkeleton variant="icon" shape="circle" className="w-16 h-16 flex items-center justify-center">
                        <GlassmorphismSkeleton variant="primary" shape="circle" className="w-8 h-8" />
                      </GlassmorphismSkeleton>
                    </div>
                    <div className="space-y-3">
                      <GlassmorphismSkeleton variant="secondary" shape="rounded" className="w-56 h-8 mx-auto" />
                      <GlassmorphismSkeleton variant="tertiary" shape="rounded" className="w-72 h-4 mx-auto" />
                      <GlassmorphismSkeleton variant="tertiary" shape="rounded" className="w-64 h-4 mx-auto" />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <GlassmorphismSkeleton variant="button-primary" shape="rounded" className="w-32 h-10" />
                      <GlassmorphismSkeleton variant="button-secondary" shape="rounded" className="w-28 h-10" />
                    </div>
                  </div>
                </GlassmorphismContainer>
                </div>

                {/* Main Component Mockup - Single Centered */}
                <div className="flex justify-center px-8">
                  <div className="w-full max-w-md">
                    {/* Skeleton Glassmorphism Card */}
                    <GlassmorphismContainer className="p-8 h-64 rounded-lg">
                      <div className="h-full flex flex-col justify-between">
                        <div className="space-y-4">
                          <GlassmorphismSkeleton variant="secondary" shape="rounded" className="w-12 h-12" />
                          <div className="space-y-2">
                            <GlassmorphismSkeleton variant="primary" shape="rectangle" className="w-32 h-6" />
                            <GlassmorphismSkeleton variant="secondary" shape="rectangle" className="w-28 h-4" />
                          </div>
                          <div className="space-y-2">
                            <GlassmorphismSkeleton variant="tertiary" shape="rectangle" className="w-full h-3" />
                            <GlassmorphismSkeleton variant="tertiary" shape="rectangle" className="w-3/4 h-3" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <div className="flex gap-2">
                            <GlassmorphismSkeleton variant="secondary" shape="circle" className="w-2 h-2" />
                            <GlassmorphismSkeleton variant="secondary" shape="circle" className="w-2 h-2" />
                            <GlassmorphismSkeleton variant="secondary" shape="circle" className="w-2 h-2" />
                          </div>
                          <GlassmorphismSkeleton variant="button-primary" shape="rounded" className="w-24 h-8" />
                        </div>
                      </div>
                    </GlassmorphismContainer>
                  </div>
                </div>

                {/* Skeleton Buttons Section */}
                <div className="flex flex-wrap justify-center gap-4 pt-6 px-8">
                  <GlassmorphismSkeleton variant="button-secondary" shape="rectangle" className="w-36 h-12" />
                  <GlassmorphismSkeleton variant="button-secondary" shape="rectangle" className="w-28 h-10" />
                  <GlassmorphismSkeleton variant="button-secondary" shape="rectangle" className="w-24 h-10" />
                </div>

                {/* Skeleton Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-8 pb-8">
                  <GlassmorphismContainer className="p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <GlassmorphismSkeleton variant="icon" shape="circle" className="w-10 h-10" />
                      <div className="space-y-1">
                        <GlassmorphismSkeleton variant="secondary" shape="rectangle" className="w-20 h-4" />
                        <GlassmorphismSkeleton variant="tertiary" shape="rectangle" className="w-24 h-3" />
                      </div>
                    </div>
                  </GlassmorphismContainer>

                  <GlassmorphismContainer className="p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <GlassmorphismSkeleton variant="icon" shape="circle" className="w-10 h-10" />
                      <div className="space-y-1">
                        <GlassmorphismSkeleton variant="secondary" shape="rectangle" className="w-18 h-4" />
                        <GlassmorphismSkeleton variant="tertiary" shape="rectangle" className="w-20 h-3" />
                      </div>
                    </div>
                  </GlassmorphismContainer>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Website del Productor
            </h3>
            <p className="text-text-secondary">
              Analíticas y configuración de la presencia web de tu productora.
            </p>
          </div>
          
          {/* Sub Tabs */}
          <div className="flex bg-surface-elevated rounded-lg p-1">
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSubTab === 'analytics'
                  ? 'bg-interactive-primary text-text-inverse'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analíticas
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSubTab === 'settings'
                  ? 'bg-interactive-primary text-text-inverse'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeSubTab === 'analytics' ? renderAnalytics() : renderSettings()}
    </div>
  );
}


// Local background components for preview (absolute positioning instead of fixed)
function PreviewAnimatedBlueBackground({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-600/10 to-purple-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute w-32 h-32 bg-blue-500/15 rounded-full blur-xl animate-pulse" 
            style={{ 
              top: '25%', 
              left: '25%',
              animationDelay: '0s',
              animationDuration: '4s'
            }}
          ></div>
          <div 
            className="absolute w-48 h-48 bg-purple-500/12 rounded-full blur-2xl animate-pulse" 
            style={{ 
              bottom: '25%', 
              right: '25%',
              animationDelay: '1s',
              animationDuration: '6s'
            }}
          ></div>
          <div 
            className="absolute w-24 h-24 bg-cyan-500/18 rounded-full blur-lg animate-pulse" 
            style={{ 
              top: '50%', 
              left: '50%',
              animationDelay: '2s',
              animationDuration: '3s'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function PreviewRaycastRedBlueBackground({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/25 via-blue-600/15 to-purple-900/25">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_60%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute w-40 h-40 bg-red-500/12 rounded-full blur-2xl animate-pulse" 
            style={{ 
              top: '33%', 
              left: '16%',
              animationDelay: '0s',
              animationDuration: '8s'
            }}
          ></div>
          <div 
            className="absolute w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse" 
            style={{ 
              bottom: '33%', 
              right: '16%',
              animationDelay: '2s',
              animationDuration: '10s'
            }}
          ></div>
          <div 
            className="absolute w-32 h-32 bg-purple-500/15 rounded-full blur-xl animate-pulse" 
            style={{ 
              top: '66%', 
              left: '66%',
              animationDelay: '4s',
              animationDuration: '6s'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}