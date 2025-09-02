
import { Indicator } from '../types';

export const INDICATORS: Indicator[] = [
  // Dimensión Técnica
  { id: 'tech_1', dimension: 'Técnica', question: 'Cobertura vegetal', type: 'scale' },
  { id: 'tech_2', dimension: 'Técnica', question: 'Tipo de labranza', type: 'scale' },
  { id: 'tech_3', dimension: 'Técnica', question: 'Prácticas de erosión', type: 'scale' },
  { id: 'tech_4', dimension: 'Técnica', question: '% semillas propias', type: 'scale' },
  { id: 'tech_5', dimension: 'Técnica', question: '% especies criollas', type: 'scale' },
  { id: 'tech_6', dimension: 'Técnica', question: 'Bioinsumos líquidos', type: 'scale' },
  { id: 'tech_7', dimension: 'Técnica', question: '¿Cuáles bioinsumos líquidos?', type: 'text' },
  { id: 'tech_8', dimension: 'Técnica', question: 'Bioinsumos sólidos', type: 'scale' },
  { id: 'tech_9', dimension: 'Técnica', question: '¿Cuáles bioinsumos sólidos?', type: 'text' },
  { id: 'tech_10', dimension: 'Técnica', question: 'Frecuencia de bioinsumos', type: 'text' },
  { id: 'tech_11', dimension: 'Técnica', question: 'Control biológico de insectos', type: 'scale' },

  // Dimensión Ecológica
  { id: 'eco_1', dimension: 'Ecológica', question: 'Diversidad de cultivos', type: 'scale' },
  { id: 'eco_2', dimension: 'Ecológica', question: 'Arreglos espaciales', type: 'text' },
  { id: 'eco_3', dimension: 'Ecológica', question: 'Rotación de cultivos', type: 'scale' },
  { id: 'eco_4', dimension: 'Ecológica', question: 'Especies espontáneas', type: 'scale' },
  { id: 'eco_5', dimension: 'Ecológica', question: 'Integración de árboles nativos', type: 'scale' },
  { id: 'eco_6', dimension: 'Ecológica', question: 'Áreas de conservación', type: 'scale' },

  // Dimensión Social
  { id: 'social_1', dimension: 'Social', question: 'Tiempo de transición', type: 'scale' },
  { id: 'social_2', dimension: 'Social', question: 'Saberes tradicionales', type: 'scale' },
  { id: 'social_3', dimension: 'Social', question: 'Participación en redes', type: 'scale' },
  { id: 'social_4', dimension: 'Social', question: 'Capacitaciones', type: 'scale' },
  { id: 'social_5', dimension: 'Social', question: 'Conciencia ecológica', type: 'scale' },
];
