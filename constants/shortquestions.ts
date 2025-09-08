
import { Indicator } from '../types';

export const SHORT_INDICATORS: Indicator[] = [
  // Dimensión Técnica
  { id: 'tech_1', dimension: 'Técnica', question: 'C.Vegetal', type: 'scale' },
  { id: 'tech_2', dimension: 'Técnica', question: 'T.Labranza', type: 'scale' },
  { id: 'tech_3', dimension: 'Técnica', question: 'P.Erosión', type: 'scale' },
  { id: 'tech_4', dimension: 'Técnica', question: 'S.Propias', type: 'scale' },
  { id: 'tech_5', dimension: 'Técnica', question: 'E.Criollas', type: 'scale' },
  { id: 'tech_6', dimension: 'Técnica', question: 'B.Líquidos', type: 'scale' },
  { id: 'tech_7', dimension: 'Técnica', question: 'C.B.Líquidos', type: 'text' },
  { id: 'tech_8', dimension: 'Técnica', question: 'B.Sólidos', type: 'scale' },
  { id: 'tech_9', dimension: 'Técnica', question: 'C.B.Sólidos', type: 'text' },
  { id: 'tech_10', dimension: 'Técnica', question: 'F.Bioinsumos', type: 'text' },
  { id: 'tech_11', dimension: 'Técnica', question: 'C.B.Insectos', type: 'scale' },

  // Dimensión Ecológica
  { id: 'eco_1', dimension: 'Ecológica', question: 'D.Cultivos', type: 'scale' },
  { id: 'eco_2', dimension: 'Ecológica', question: 'A.Espaciales', type: 'text' },
  { id: 'eco_3', dimension: 'Ecológica', question: 'R.Cultivos', type: 'scale' },
  { id: 'eco_4', dimension: 'Ecológica', question: 'E.Espontáneas', type: 'scale' },
  { id: 'eco_5', dimension: 'Ecológica', question: 'I.Árboles N.', type: 'scale' },
  { id: 'eco_6', dimension: 'Ecológica', question: 'A.Con', type: 'scale' },

  // Dimensión Social
  { id: 'social_1', dimension: 'Social', question: 'T.Tran', type: 'scale' },
  { id: 'social_2', dimension: 'Social', question: 'S.Trad', type: 'scale' },
  { id: 'social_3', dimension: 'Social', question: 'P.Redes', type: 'scale' },
  { id: 'social_4', dimension: 'Social', question: 'Capacitaciones', type: 'scale' },
  { id: 'social_5', dimension: 'Social', question: 'C.Ecológica', type: 'scale' },
];
