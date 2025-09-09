export interface EventAccessibility {
  id: string;
  event_id: string;
  contact_name?: string;
  contact_prefix?: string;
  contact_number?: string;
  contact_email?: string;
  entry_instructions?: string;
  after_entry_instructions?: string;
  hazards_information?: string;
  toilet_directions?: string;
  accessible_parking?: string;
  extra_information: Record<string, any>;
  features: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AccessibilityFormData {
  contact_name: string;
  contact_prefix: string;
  contact_number: string;
  contact_email: string;
  entry_instructions: string;
  after_entry_instructions: string;
  hazards_information: string;
  toilet_directions: string;
  accessible_parking: string;
  wheelchair_accessible: boolean;
  hearing_loop: boolean;
  sign_language_interpreter: boolean;
  audio_description: boolean;
  large_print_materials: boolean;
  braille_materials: boolean;
  accessible_restrooms: boolean;
  service_animals_welcome: boolean;
  closed_captioning: boolean;
}

export const PHONE_PREFIXES = [
  { value: '+1', label: '+1 (US/CA)', country: 'Estados Unidos/Canadá' },
  { value: '+52', label: '+52 (MX)', country: 'México' },
  { value: '+57', label: '+57 (CO)', country: 'Colombia' },
  { value: '+51', label: '+51 (PE)', country: 'Perú' },
  { value: '+56', label: '+56 (CL)', country: 'Chile' },
  { value: '+54', label: '+54 (AR)', country: 'Argentina' },
  { value: '+34', label: '+34 (ES)', country: 'España' },
  { value: '+44', label: '+44 (UK)', country: 'Reino Unido' }
];

import { 
  CircleUserRound, 
  Volume2, 
  Hand, 
  Headphones, 
  FileText, 
  Fingerprint, 
  Type, 
  Users, 
  Dog 
} from 'lucide-react';

export const ACCESSIBILITY_FEATURES = [
  { 
    key: 'wheelchair_accessible', 
    label: 'Wheelchair Accessibility', 
    subtitle: 'Accesible en Silla de Ruedas',
    description: 'Indica acceso para personas con movilidad limitada, incluyendo usuarios de sillas de ruedas. Recuerda que una entrada con rampa no es completamente accesible si no hay bordillos rebajados, y un ascensor no es accesible si solo se puede llegar a él por escalones.',
    icon: CircleUserRound
  },
  { 
    key: 'audio_description', 
    label: 'Audio Description', 
    subtitle: 'Audiodescripción',
    description: 'Las personas ciegas o con baja visión pueden disfrutar de artes escénicas, artes visuales, televisión, videos y películas que ofrecen comentarios en vivo o narración (a través de auriculares) y una breve transmisión de elementos visuales proporcionada por un Audiodescritor capacitado.',
    icon: Volume2
  },
  { 
    key: 'sign_language_interpreter', 
    label: 'Sign Language Interpretation', 
    subtitle: 'Intérprete de Lengua de Señas',
    description: 'Este símbolo indica que se proporciona interpretación en lengua de señas para una conferencia, tour, película, actuación, conferencia u otro programa.',
    icon: Hand
  },
  { 
    key: 'hearing_loop', 
    label: 'Assistive Listening Systems', 
    subtitle: 'Sistemas de Asistencia Auditiva',
    description: 'Estos sistemas transmiten sonido amplificado a través de audífonos, auriculares u otros dispositivos.',
    icon: Headphones
  },
  { 
    key: 'large_print_materials', 
    label: 'Accessible Print (18 pt. or Larger)', 
    subtitle: 'Materiales en Letra Grande',
    description: 'La letra grande se indica con las palabras "Letra Grande" impresas en texto de 18 pt. o más grande. Además de identificar versiones de letra grande de libros, folletos, guías de museos y programas de teatro, puedes usar este símbolo en formularios de conferencias o membresías con letra grande.',
    icon: FileText
  },
  { 
    key: 'braille_materials', 
    label: 'Braille Symbol', 
    subtitle: 'Materiales en Braille',
    description: 'Este símbolo indica que el material impreso está disponible en Braille, incluyendo etiquetado de exhibiciones, publicaciones y señalización.',
    icon: Fingerprint
  },
  { 
    key: 'closed_captioning', 
    label: 'Closed Captioning (CC)', 
    subtitle: 'Subtítulos Ocultos',
    description: 'Los subtítulos ocultos (CC) comúnmente conocidos como subtítulos permiten a las personas sordas o con dificultades auditivas leer una transcripción de la parte de audio de un video, película, exhibición u otra presentación.',
    icon: Type
  },
  { 
    key: 'accessible_restrooms', 
    label: 'Access', 
    subtitle: 'Acceso General',
    description: 'Este símbolo indica acceso para personas que son ciegas o tienen baja visión, sordas, con dificultades auditivas, o que usan sillas de ruedas. Úsalo como símbolo general de accesibilidad en museos e instituciones culturales.',
    icon: Users
  },
  { 
    key: 'service_animals_welcome', 
    label: 'Service Animals Welcome', 
    subtitle: 'Animales de Servicio Bienvenidos',
    description: 'Este símbolo indica que los animales de servicio son bienvenidos y están acomodados en el lugar.',
    icon: Dog
  }
];