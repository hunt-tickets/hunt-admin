export interface Country {
  id: string;
  code: string;
  name: string;
  phone_prefix: string;
  default_currency_id: string | null;
  is_active: boolean;
}

export interface Currency {
  id: string;
  code: string;
  name: {
    en: string;
    es: string;
  };
  symbol: string;
  decimal_places: number;
  is_active: boolean;
}

export interface EventType {
  en: string;
  es: string;
}

export interface EventFormData {
  name: string;
  description: string;
  short_description: string;
  country_id: string;
  timezone: string;
  currency_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  privacy: 'public' | 'private';
  frequency: 'single' | 'recurring';
}

export const EVENT_TYPES: EventType[] = [
  { en: "Appearance or Signing", es: "Aparicion o Firma" },
  { en: "Attraction", es: "Atraccion" },
  { en: "Camp, Trip or Retreat", es: "Campamento, Viaje o Retiro" },
  { en: "Class, Training or Workshop", es: "Clase, Entrenamiento o Taller" },
  { en: "Concert or Performance", es: "Concierto o Presentacion" },
  { en: "Conference", es: "Conferencia" },
  { en: "Convention", es: "Convencion" },
  { en: "Dinner or Gala", es: "Cena o Gala" },
  { en: "Festival or Fair", es: "Festival o Feria" },
  { en: "Game or Competition", es: "Juego o Competencia" },
  { en: "Meeting or Networking Event", es: "Reunion o Evento de Networking" },
  { en: "Party or Social Gathering", es: "Fiesta o Reunion Social" },
  { en: "Race or Endurance Event", es: "Carrera o Evento de Resistencia" },
  { en: "Rally", es: "Rally" },
  { en: "Screening", es: "Proyeccion" },
  { en: "Seminar or Talk", es: "Seminario o Charla" },
  { en: "Tour", es: "Tour" },
  { en: "Tournament", es: "Torneo" },
  { en: "Trade Show, Consumer Show or Expo", es: "Feria Comercial, Feria de Consumo o Expo" },
  { en: "Other", es: "Otro" }
];

export const COMMON_TIMEZONES = [
  { value: 'America/Bogota', label: 'Colombia (GMT-5)' },
  { value: 'America/Mexico_City', label: 'México (GMT-6)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8/-7)' },
  { value: 'America/Chicago', label: 'Chicago (GMT-6/-5)' },
  { value: 'America/Denver', label: 'Denver (GMT-7/-6)' },
  { value: 'America/Lima', label: 'Lima (GMT-5)' },
  { value: 'America/Santiago', label: 'Santiago (GMT-4/-3)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1/+2)' },
  { value: 'Europe/London', label: 'Londres (GMT+0/+1)' }
];