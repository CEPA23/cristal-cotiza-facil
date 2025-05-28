
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, X } from 'lucide-react';
import { QuotePreview } from './QuotePreview';
import { Quote } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface QuoteDetailProps {
  quote: Quote | null;
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

export const QuoteDetail: React.FC<QuoteDetailProps> = ({ quote, isOpen, onClose, onBack }) => {
  const { toast } = useToast();

  if (!quote) return null;

  const handleClose = () => {
    if (onBack) {
      onBack();
    } else if (onClose) {
      onClose();
    }
  };

  const handleDownloadPDF = () => {
    // Aquí se implementaría la generación del PDF
    toast({
      title: "PDF generado",
      description: `Se ha descargado la cotización ${quote.id} en formato PDF.`,
    });
  };

  const handleSendWhatsApp = () => {
    const message = `Hola ${quote.customer.name}, aquí tienes tu cotización:\n\n` +
      `Cotización: ${quote.id}\n` +
      `Fecha: ${quote.date}\n` +
      `Total: S/. ${quote.total.toFixed(2)}\n\n` +
      `¡Gracias por confiar en nosotros!`;
    
    const phoneNumber = quote.customer.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp abierto",
      description: "Se ha abierto WhatsApp con el mensaje de la cotización.",
    });
  };

  // If onBack is provided, render without Dialog wrapper (for QuotesManagement)
  if (onBack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button onClick={onBack} variant="outline" size="sm" className="mr-4">
                <X className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">Resumen de Cotización - {quote.id}</h1>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleDownloadPDF} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button onClick={handleSendWhatsApp} size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar por WhatsApp
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <QuotePreview 
              customer={quote.customer} 
              products={quote.products} 
              total={quote.total} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Default Dialog mode (for modal usage)
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Resumen de Cotización - {quote.id}</DialogTitle>
          <div className="flex space-x-2">
            <Button onClick={handleDownloadPDF} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={handleSendWhatsApp} size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar por WhatsApp
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <QuotePreview 
            customer={quote.customer} 
            products={quote.products} 
            total={quote.total} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
