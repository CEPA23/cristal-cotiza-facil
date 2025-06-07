
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, X } from 'lucide-react';
import { QuotePreview } from './QuotePreview';
import { Quote } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';
import { downloadQuotePDF, generateQuotePDF } from '@/services/pdfGenerator';

interface QuoteDetailProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteDetail: React.FC<QuoteDetailProps> = ({ quote, isOpen, onClose }) => {
  const { toast } = useToast();

  if (!quote) return null;

  const handleDownloadPDF = async () => {
    try {
      await downloadQuotePDF({
        customer: quote.customer,
        products: quote.products,
        total: quote.total,
        seller: quote.seller,
        quoteId: quote.id
      });

      toast({
        title: "PDF descargado",
        description: `Se ha descargado la cotización ${quote.id} en formato PDF.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al generar el PDF.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      // Generar el PDF
      const pdfBlob = await generateQuotePDF({
        customer: quote.customer,
        products: quote.products,
        total: quote.total,
        seller: quote.seller,
        quoteId: quote.id
      });

      const file = new File([pdfBlob], `cotizacion-${quote.id}.pdf`, { type: 'application/pdf' });
      
      const message = `Hola ${quote.customer.name}, aquí tienes tu cotización:\n\n` +
        `Cotización: ${quote.id}\n` +
        `Fecha: ${quote.date}\n` +
        `Total: S/. ${quote.total.toFixed(2)}\n\n` +
        `¡Gracias por confiar en nosotros!`;
      
      const phoneNumber = quote.customer.phone.replace(/\D/g, '');
      
      // Verificar si el dispositivo soporta la API de compartir archivos
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Cotización ${quote.id}`,
          text: message,
          files: [file]
        });
        
        toast({
          title: "Cotización compartida",
          description: "Se ha enviado la cotización con el PDF por WhatsApp.",
        });
      } else {
        // Fallback: abrir WhatsApp Web
        const whatsappUrl = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Descargar el PDF por separado
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `cotizacion-${quote.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "WhatsApp abierto",
          description: "Se ha abierto WhatsApp con el mensaje. El PDF se descargó para enviarlo manualmente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al preparar el envío.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
