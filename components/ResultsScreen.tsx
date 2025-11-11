import React, { useEffect, useState } from 'react';
import { Results, ResultStatus } from '../types';
import { PrinterIcon } from './icons/PrinterIcon';
import { ArgentinaIcon } from './icons/ArgentinaIcon';
import { PdfIcon } from './icons/PdfIcon';
import { ShareIcon } from './icons/ShareIcon';
import { PressureIcon } from './icons/PressureIcon';
import { OxygenIcon } from './icons/OxygenIcon';
import RecommendationCard from './RecommendationCard';

declare global {
  interface Window {
    jspdf: any;
  }
}

interface ResultsScreenProps {
  results: Results | null;
  onFinish: () => void;
  examTitle: string;
  onSaveAndShowHistory: () => void;
  onPrintTicket: () => void;
  isVoiceControlActive: boolean;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onFinish, examTitle, onSaveAndShowHistory, onPrintTicket, isVoiceControlActive }) => {
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    let message = "Resultados Listos. Sus mediciones se muestran en pantalla. Puede imprimir, guardar o compartir sus resultados.";
    if (isVoiceControlActive) {
      message += " Diga el número de la acción que desea realizar, por ejemplo, 'Uno' para imprimir. Diga 'Finalizar' para salir."
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    const timer = setTimeout(() => {
      setCardsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [isVoiceControlActive]);
  
  const getOverallStatus = (currentResults: Results | null): ResultStatus => {
    if (!currentResults) return 'Normal';
    if (currentResults.pressureStatus === 'Peligro' || currentResults.oxygenStatus === 'Peligro') {
      return 'Peligro';
    }
    if (currentResults.pressureStatus === 'Atención' || currentResults.oxygenStatus === 'Atención') {
      return 'Atención';
    }
    return 'Normal';
  };

  const overallStatus = getOverallStatus(results);

  if (!results) {
    return (
      <div className="text-center">
        <p>No se encontraron resultados.</p>
        <button onClick={onFinish} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Empezar de Nuevo
        </button>
      </div>
    );
  }
  
  const handleShare = async () => {
    if (!results) return;
    
    const title = `Resultados de mi chequeo Cabex`;
    const text = `Hola,\n\nEstos son los resultados de mi ${examTitle} realizado en Cabex el ${new Date().toLocaleDateString('es-ES')}:\n\n- Presión: ${results.pressure} (${results.pressureStatus})\n- Oxígeno en Sangre: ${results.oxygen} (${results.oxygenStatus})\n\nResultados generados por Cabex.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      // Fallback para navegadores que no soportan la Web Share API
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
    }
  };

  const getRecommendationForPdf = (status: ResultStatus) => {
    switch(status) {
      case 'Normal':
        return {
          title: '¡Excelentes Noticias!',
          description: 'Sus resultados están dentro de los rangos normales. ¡Siga así!',
          color: { r: 21, g: 128, b: 61 }, // text-green-700
          bgColor: { r: 240, g: 253, b: 244 }, // bg-green-50
        };
      case 'Atención':
        return {
          title: '¡Atención!',
          description: 'Sus resultados indican valores fuera del rango normal. Es importante que consulte a su médico. Utilice la función de compartir para enviarle estos resultados fácilmente.',
          color: { r: 194, g: 65, b: 12 }, // text-orange-700
          bgColor: { r: 255, g: 247, b: 237 }, // bg-orange-100
        };
      case 'Peligro':
        return {
          title: '¡Resultados Críticos!',
          description: 'Sus mediciones están en un rango peligroso y requieren ATENCIÓN MÉDICA INMEDIATA.',
          steps: [
            '- Comparta estos resultados con su médico de confianza ahora mismo.',
            '- Contacte a un servicio de emergencias si se siente mal.',
            '- No ignore esta advertencia. Su salud es la prioridad.'
          ],
          color: { r: 185, g: 28, b: 28 }, // text-red-800
          bgColor: { r: 254, g: 242, b: 242 }, // bg-red-100
        };
      default:
        return null;
    }
  }


  const handleDownloadPdf = () => {
    if (!results) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Resultados del Chequeo - Cabex', 105, 20, { align: 'center' });
    
    // Sub-header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(examTitle, 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Fecha: ${date}`, 105, 38, { align: 'center' });

    // Results Section
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Sus Mediciones', 20, 55);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Presión Arterial:', 25, 65);
    doc.text('Oxígeno en Sangre (SpO2):', 25, 75);

    doc.setFont('helvetica', 'bold');
    doc.text(`${results.pressure}`, 100, 65);
    doc.text(`${results.oxygen}`, 100, 75);
    
    // Status badges (simulation)
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(results.pressureStatus.toLowerCase() === 'normal' ? 34 : 200, results.pressureStatus.toLowerCase() === 'normal' ? 139 : 80, results.pressureStatus.toLowerCase() === 'normal' ? 34 : 0);
    doc.text(`(${results.pressureStatus})`, 130, 65);
    doc.setTextColor(results.oxygenStatus.toLowerCase() === 'normal' ? 34 : 200, results.oxygenStatus.toLowerCase() === 'normal' ? 139 : 80, results.oxygenStatus.toLowerCase() === 'normal' ? 34 : 0);
    doc.text(`(${results.oxygenStatus})`, 130, 75);
    doc.setTextColor(0);

    // Recommendation Section
    doc.line(20, 85, 190, 85);
    const recommendation = getRecommendationForPdf(overallStatus);
    let currentY = 95;

    if (recommendation) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendaciones', 20, currentY);
      currentY += 8;

      const textLines = doc.splitTextToSize(recommendation.description, 160);
      let boxHeight = 15 + (textLines.length * 5);
      if (recommendation.steps) {
          boxHeight += (recommendation.steps.length * 5) + 10;
      }
      
      doc.setFillColor(recommendation.bgColor.r, recommendation.bgColor.g, recommendation.bgColor.b);
      doc.rect(20, currentY, 170, boxHeight, 'F');
      
      currentY += 7;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(recommendation.color.r, recommendation.color.g, recommendation.color.b);
      doc.text(recommendation.title, 25, currentY);
      currentY += 7;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50);
      doc.text(textLines, 25, currentY);
      currentY += textLines.length * 5;

      if (recommendation.steps) {
        currentY += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Pasos a seguir:', 25, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        recommendation.steps.forEach(step => {
            doc.text(step, 30, currentY);
            currentY += 5;
        });
      }
    }

    // Footer
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Este es un reporte generado automáticamente. Consulte a su médico para una interpretación profesional.', 105, 280, { align: 'center' });

    doc.save('resultados-cabex.pdf');
  };

  const ActionButton: React.FC<{onClick:()=>void, className: string, icon: React.ReactNode, text: string, index?: number}> = ({onClick, className, icon, text, index}) => (
     <button 
          onClick={onClick}
          className={`w-full flex items-center justify-center gap-3 font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${className}`}
        >
          {isVoiceControlActive && index && <span className="text-lg">{index}.</span>}
          {icon}
          {text}
      </button>
  );

  const ResultCard: React.FC<{
      icon: React.ReactNode;
      label: string;
      value: string;
      status: ResultStatus;
      isVisible: boolean;
      delay: string;
    }> = ({ icon, label, value, status, isVisible, delay }) => {
      const getStatusStyles = (status: ResultStatus) => {
        switch (status) {
          case 'Normal': return 'border-green-300 bg-green-50/50';
          case 'Atención': return 'border-orange-300 bg-orange-50/50';
          case 'Peligro': return 'border-red-400 bg-red-100/50';
          default: return 'border-gray-200 bg-gray-50/50';
        }
      };
      
      const getStatusBadgeStyles = (status: ResultStatus) => {
        switch(status) {
          case 'Normal': return 'bg-green-100 text-green-800';
          case 'Atención': return 'bg-orange-100 text-orange-800';
          case 'Peligro': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };
      
      return (
        <div 
          className={`p-4 rounded-xl border-2 ${getStatusStyles(status)} flex items-center gap-4 transition-all duration-500 ease-out hover:shadow-md hover:border-blue-300 hover:scale-105 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} 
          style={{ transitionDelay: delay }}
        >
          <div className="flex-shrink-0 text-slate-500">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
          <div className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeStyles(status)}`}>
            {status}
          </div>
        </div>
      );
    };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Sus Resultados</h2>
      
      <div className="space-y-3 mb-4">
        <ResultCard 
            icon={<PressureIcon className="h-7 w-7" />}
            label="Presión Arterial"
            value={results.pressure}
            status={results.pressureStatus}
            isVisible={cardsVisible}
            delay="100ms"
        />
        <ResultCard 
            icon={<OxygenIcon className="h-7 w-7" />}
            label="Oxígeno en Sangre"
            value={results.oxygen}
            status={results.oxygenStatus}
            isVisible={cardsVisible}
            delay="200ms"
        />
      </div>
      
      <RecommendationCard overallStatus={overallStatus} />

      <div className="space-y-3 mt-auto">
        <ActionButton onClick={onPrintTicket} className="bg-blue-600 text-white hover:bg-blue-700" icon={<PrinterIcon className="h-5 w-5" />} text="IMPRIMIR TICKET EN CABINA" index={1} />
        <ActionButton onClick={onSaveAndShowHistory} className="bg-sky-500 text-white hover:bg-sky-600" icon={<ArgentinaIcon className="h-5 w-5" />} text="AÑADIR A MI HISTORIA CLÍNICA" index={2} />
        <ActionButton onClick={handleDownloadPdf} className="bg-green-500 text-white hover:bg-green-600" icon={<PdfIcon className="h-5 w-5" />} text="DESCARGAR PDF EN ESTE MÓVIL" index={3} />
        <ActionButton onClick={handleShare} className="bg-gray-700 text-white hover:bg-gray-800" icon={<ShareIcon className="h-5 w-5" />} text="COMPARTIR CON MI MÉDICO" index={4} />

         <button 
            onClick={onFinish}
            className="w-full mt-4 text-center text-gray-500 hover:text-gray-700 font-semibold"
        >
          Finalizar y Salir
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;