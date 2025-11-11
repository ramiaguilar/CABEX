
import React from 'react';

export type Screen = 'splash' | 'welcome' | 'identification' | 'selection' | 'instructions' | 'in_progress' | 'results' | 'history' | 'reminder' | 'ticket_dispensing' | 'survey' | 'help';

export type ExamType = 'integral' | 'rapido' | 'respiratorio' | 'pulmonar';

export interface ExamOption {
  id: ExamType;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type ResultStatus = 'Normal' | 'Atención' | 'Peligro';

export interface Results {
  pressure: string;
  pressureStatus: ResultStatus;
  oxygen: string;
  oxygenStatus: ResultStatus;
}

export interface HistoricResult extends Results {
  date: string;
  examTitle: string;
}

export type ReminderFrequency = 'monthly' | 'quarterly' | 'biannually' | 'annually';

export interface Reminder {
  frequency: ReminderFrequency;
  nextDate: string;
}
