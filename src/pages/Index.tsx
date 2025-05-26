
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductSelector } from '@/components/ProductSelector';
import { CustomerForm } from '@/components/CustomerForm';
import { QuotePreview } from '@/components/QuotePreview';
import { useToast } from '@/hooks/use-toast';
import { Building2, Download, Printer, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  width: number;
  height: number;
  quantity: number;
  customSize?: boolean;
}

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
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const area = product.width * product.height;
      return total + (product.basePrice * area * product.quantity);
    }, 0);
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
        total: calculateTotal(),
        status: 'En espera'
      };

      // Guardar en localStorage
      const existingQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
      localStorage.setItem('quotes', JSON.stringify([...existingQuotes, quote]));

      toast({
        title: "Cotización generada",
        description: `Cotización ${quote.id} creada exitosamente.`,
      });

      setIsGeneratingPDF(false);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Descargando PDF",
      description: "La cotización se está descargando...",
    });
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const message = `Hola! Te envío la cotización de vidriería. Total: S/. ${calculateTotal().toFixed(2)}`;
    const phoneNumber = customer?.phone.replace(/\D/g, '');
    const url = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Sistema de Cotización</h1>
          </div>
          <p className="text-xl text-gray-600">Vidriería Profesional</p>
          <div className="mt-4">
            <Link to="/quotes">
              <Button variant="outline" className="mr-4">
                Ver Cotizaciones
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerForm onCustomerSelect={setCustomer} />
              </CardContent>
            </Card>

            <Card>
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
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa de Cotización</CardTitle>
              </CardHeader>
              <CardContent>
                <QuotePreview 
                  customer={customer}
                  products={products}
                  total={calculateTotal()}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateQuote}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? 'Generando...' : 'Generar Cotización'}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={!customer || products.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrintPDF}
                    disabled={!customer || products.length === 0}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSendWhatsApp}
                    disabled={!customer || products.length === 0}
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
