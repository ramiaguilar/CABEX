import React from 'react';
import { ResultStatus } from '../types';
import { CheckShieldIcon } from './icons/CheckShieldIcon';
import { WarningIcon } from './icons/WarningIcon';
import { DangerIcon } from './icons/DangerIcon';

interface RecommendationCardProps {
  overallStatus: ResultStatus;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ overallStatus }) => {
  switch(overallStatus) {
    case 'Normal':
      return (
        <div className="p-4 rounded-lg mb-4 bg-green-50 border border-green-200">
          <div className="flex items-center gap-4">
            <div><CheckShieldIcon className="h-10 w-10 text-green-500" /></div>
            <div className="flex-1">
              <h3 className="font-extrabold text-lg text-green-800">¡Excelentes Noticias!</h3>
              <p className="text-sm text-green-700">Sus resultados están dentro de los rangos normales. ¡Siga así!</p>
            </div>
          </div>
        </div>
      );
    case 'Atención':
      return (
        <div className="p-4 rounded-lg mb-4 bg-orange-100 border-2 border-orange-400">
          <div className="flex items-center gap-4">
            <div><WarningIcon className="h-10 w-10 text-orange-500" /></div>
            <div className="flex-1">
              <h3 className="font-extrabold text-lg text-orange-800">¡Atención!</h3>
              <p className="text-sm text-orange-700">
                <strong>Sus resultados indican valores fuera del rango normal. Es importante que consulte a su médico.</strong>
              </p>
              <p className="text-sm text-orange-700 mt-1">
                  Utilice el botón "COMPARTIR CON MI MÉDICO" para enviarle estos resultados fácilmente.
              </p>
            </div>
          </div>
        </div>
      );
    case 'Peligro':
      return (
        <div className="p-4 rounded-lg mb-4 bg-red-100 border-2 border-red-500 shadow-lg animate-pulse">
          <div className="flex items-start gap-4">
            <div><DangerIcon className="h-12 w-12 text-red-600" /></div>
            <div className="flex-1">
              <h3 className="font-extrabold text-xl text-red-900">¡Resultados Críticos!</h3>
              <p className="text-base text-red-800 mt-2">
                <strong>Sus mediciones están en un rango peligroso y requieren ATENCIÓN MÉDICA INMEDIATA.</strong>
              </p>
              <div className="mt-3 text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                <p className="font-bold mb-1">Pasos a seguir:</p>
                 <ul className="list-disc list-inside space-y-1">
                  <li><strong>Comparta</strong> estos resultados con su médico de confianza ahora mismo.</li>
                  <li><strong>Contacte</strong> a un servicio de emergencias si se siente mal.</li>
                  <li><strong>No ignore</strong> esta advertencia. Su salud es la prioridad.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    default:
        return null;
  }
};

export default RecommendationCard;
