import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductSelector } from '@/components/ProductSelector';
import { CustomerForm } from '@/components/CustomerForm';
import { QuotePreview } from '@/components/QuotePreview';
import { useToast } from '@/hooks/use-toast';
import { Building2, Download, Printer, MessageSquare } from 'lucide-react';
import { downloadQuotePDF, generateQuotePDF } from '@/services/pdfGenerator';
import { Product } from '@/types/product';

export interface Customer {
  dni: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
}

export interface Quote {
  id: string;
  customer: Customer;
  products: Product[];
  date: string;
  total: number;
  status: 'En espera' | 'Aprobado' | 'Rechazado';
  rejectionReason?: string;
  seller?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [shippingService, setShippingService] = useState('');
  const [shippingCost, setShippingCost] = useState('0');
  const [travelExpenses, setTravelExpenses] = useState('0');
  const [seller, setSeller] = useState('Carlos Porras');
  const { toast } = useToast();

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      if (product.type === 'transformable') {
        return total + product.basePrice;
      }
      return total + (product.basePrice * product.quantity);
    }, 0);
  };

  const getQuotesSummary = () => {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]') as Quote[];
    const approved = quotes.filter(q => q.status === 'Aprobado').length;
    const pending = quotes.filter(q => q.status === 'En espera').length;
    const totalSales = quotes
      .filter(q => q.status === 'Aprobado')
      .reduce((sum, q) => sum + q.total, 0);
    
    return {
      total: quotes.length,
      approved,
      pending,
      totalSales
    };
  };

  const summary = getQuotesSummary();

  const generatePDFContent = () => {
    // Crear un elemento temporal para capturar el contenido de la cotización
    const printContent = document.querySelector('.quote-preview-content');
    if (!printContent) return null;

    const blob = new Blob([printContent.innerHTML], { type: 'text/html' });
    return blob;
  };

  const handleGenerateQuote = async () => {
    if (!customer || products.length === 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa los datos del cliente y añade al menos un producto.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    
    // Simular generación de PDF
    setTimeout(() => {
      const quote: Quote = {
        id: `COT-${Date.now()}`,
        customer,
        products,
        date: new Date().toLocaleDateString('es-PE'),
        total: calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0'),
        status: 'En espera',
        seller
      };

      // Guardar en localStorage - newest first
      const existingQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
      localStorage.setItem('quotes', JSON.stringify([quote, ...existingQuotes]));

      toast({
        title: "Cotización generada",
        description: `Cotización ${quote.id} creada exitosamente.`,
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
            onClick={() => window.location.href = '/quotes'}
          >
            Ver Cotizaciones
          </Button>
        ),
      });

      // Clear form data
      setProducts([]);
      setCustomer(null);
      setShippingService('');
      setShippingCost('0');
      setTravelExpenses('0');
      setIsGeneratingPDF(false);
    }, 2000);
  };

  const handleDownloadPDF = async () => {
    if (!customer || products.length === 0) {
      toast({
        title: "Datos incompletos",
        description: "Complete los datos del cliente y añada productos para descargar el PDF.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      await downloadQuotePDF({
        customer,
        products,
        total: calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0'),
        shippingService,
        shippingCost: parseFloat(shippingCost || '0'),
        travelExpenses: parseFloat(travelExpenses || '0'),
        seller,
        quoteId: `COT-${Date.now().toString().slice(-6)}`
      });

      toast({
        title: "PDF descargado",
        description: "La cotización se ha descargado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al generar el PDF.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrintPDF = async () => {
    if (!customer || products.length === 0) {
      toast({
        title: "Datos incompletos",
        description: "Complete los datos del cliente y añada productos para imprimir.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generar el PDF y abrirlo en una nueva ventana para imprimir
      const pdfBlob = await generateQuotePDF({
        customer,
        products,
        total: calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0'),
        shippingService,
        shippingCost: parseFloat(shippingCost || '0'),
        travelExpenses: parseFloat(travelExpenses || '0'),
        seller,
        quoteId: `COT-${Date.now().toString().slice(-6)}`
      });

      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al preparar la impresión.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async () => {
    if (!customer) return;

    const quoteId = `COT-${Date.now().toString().slice(-6)}`;
    
    try {
      // Generar el PDF
      const pdfBlob = await generateQuotePDF({
        customer,
        products,
        total: calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0'),
        shippingService,
        shippingCost: parseFloat(shippingCost || '0'),
        travelExpenses: parseFloat(travelExpenses || '0'),
        seller,
        quoteId
      });

      // Crear un archivo temporal para el PDF
      const file = new File([pdfBlob], `cotizacion-${quoteId}.pdf`, { type: 'application/pdf' });
      
      // Mensaje para WhatsApp
      const message = `¡Hola ${customer.name}! 👋

Te envío la cotización de vidriería que solicitaste:

📄 *Cotización:* ${quoteId}
📅 *Fecha:* ${new Date().toLocaleDateString('es-PE')}
👤 *Vendedor:* ${seller}
💰 *Total:* S/. ${(calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0')).toFixed(2)}

📋 *Productos cotizados:*
${products.map(p => `• ${p.name} - Cantidad: ${p.quantity}`).join('\n')}

${shippingService ? `🚚 *Envío:* ${shippingService} - S/. ${shippingCost}` : ''}
${parseFloat(travelExpenses || '0') > 0 ? `🚗 *Viáticos:* S/. ${travelExpenses}` : ''}

📞 Para cualquier consulta, no dudes en contactarme.

¡Gracias por confiar en nosotros! 😊

📎 *Adjunto encontrarás el PDF detallado de la cotización.*`;

      const phoneNumber = customer.phone.replace(/\D/g, '');
      
      // Verificar si el dispositivo soporta la API de compartir archivos
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // Usar la API nativa de compartir
        await navigator.share({
          title: `Cotización ${quoteId}`,
          text: message,
          files: [file]
        });
      } else {
        // Fallback: abrir WhatsApp Web con el mensaje (sin archivo)
        const url = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        // Descargar el PDF por separado
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `cotizacion-${quoteId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "WhatsApp abierto",
          description: "Se ha abierto WhatsApp con el mensaje. El PDF se descargó para que puedas enviarlo manualmente.",
        });
        return;
      }

      toast({
        title: "Cotización compartida",
        description: "Se ha enviado la cotización con el PDF por WhatsApp.",
      });
    } catch (error) {
      console.error('Error al enviar por WhatsApp:', error);
      
      // Fallback: solo enviar el mensaje de texto
      const simpleMessage = `¡Hola ${customer.name}! 👋

Te envío la cotización de vidriería:

📄 *Cotización:* ${quoteId}
💰 *Total:* S/. ${(calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0')).toFixed(2)}

📞 Para más detalles, contáctame.

¡Gracias por confiar en nosotros! 😊`;

      const phoneNumber = customer.phone.replace(/\D/g, '');
      const url = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(simpleMessage)}`;
      window.open(url, '_blank');

      toast({
        title: "WhatsApp abierto",
        description: "Se ha enviado el mensaje básico. Descarga el PDF por separado desde el botón Descargar.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Sistema de Cotización</h1>
          </div>
          <p className="text-xl text-gray-600">Vidriería</p>
          <div className="mt-4">
            <Button 
              onClick={() => window.location.href = '/quotes'}
              variant="outline" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Ver Cotizaciones
            </Button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">{summary.total}</h3>
              <p className="text-sm text-gray-600">Total Cotizaciones</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">{summary.approved}</h3>
              <p className="text-sm text-gray-600">Aprobadas</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-yellow-600">{summary.pending}</h3>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-purple-600">S/. {summary.totalSales.toFixed(2)}</h3>
              <p className="text-sm text-gray-600">Total Ventas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Datos del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerForm onCustomerSelect={setCustomer} key={customer?.dni || 'empty'} />
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Selección de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSelector 
                  products={products} 
                  onProductsChange={setProducts} 
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Información del Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="seller">Nombre del Vendedor</Label>
                  <Input
                    id="seller"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    placeholder="Nombre del vendedor"
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Costos Adicionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shipping-service">Tipo de Envío</Label>
                  <Input
                    id="shipping-service"
                    value={shippingService}
                    onChange={(e) => setShippingService(e.target.value)}
                    placeholder="Ej: Delivery, Recojo en tienda, Envío a domicilio"
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping-cost">Costo de Envío (S/.)</Label>
                    <Input
                      id="shipping-cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      placeholder="0.00"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel-expenses">Viáticos (S/.)</Label>
                    <Input
                      id="travel-expenses"
                      type="number"
                      step="0.01"
                      min="0"
                      value={travelExpenses}
                      onChange={(e) => setTravelExpenses(e.target.value)}
                      placeholder="0.00"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Vista Previa de Cotización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="quote-preview-content">
                  <QuotePreview 
                    customer={customer}
                    products={products}
                    total={calculateTotal() + parseFloat(shippingCost || '0') + parseFloat(travelExpenses || '0')}
                    shippingService={shippingService}
                    shippingCost={parseFloat(shippingCost || '0')}
                    travelExpenses={parseFloat(travelExpenses || '0')}
                    seller={seller}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateQuote}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? 'Generando...' : 'Generar Cotización'}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={!customer || products.length === 0 || isGeneratingPDF}
                    className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {isGeneratingPDF ? 'Generando...' : 'Descargar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrintPDF}
                    disabled={!customer || products.length === 0}
                    className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSendWhatsApp}
                    disabled={!customer || products.length === 0}
                    className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 transition-all duration-200 hover:shadow-md"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
