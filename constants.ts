import { ExamOption } from './types';
import { HeartbeatIcon } from './components/icons/HeartbeatIcon';
import { LungsIcon } from './components/icons/LungsIcon';

export const EXAM_OPTIONS: ExamOption[] = [
  {
    id: 'integral',
    title: 'Chequeo Integral',
    description: 'Peso, Presión, O2, Glucemia, Espirómetro',
    icon: HeartbeatIcon,
  },
  {
    id: 'rapido',
    title: 'Chequeo Rápido',
    description: 'Presión y O2',
    icon: HeartbeatIcon,
  },
  {
    id: 'respiratorio',
    title: 'Módulo Respiratorio',
    description: 'Prueba de Espirómetro Única',
    icon: LungsIcon,
  },
  {
    id: 'pulmonar',
    title: 'Chequeo Pulmonar',
    description: 'Espirómetro y O2',
    icon: LungsIcon,
  },
];
