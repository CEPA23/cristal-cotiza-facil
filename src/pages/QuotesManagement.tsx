
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuoteDetail } from '@/components/QuoteDetail';
import { useToast } from '@/hooks/use-toast';
import { Building2, ArrowLeft, Eye, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Quote } from './Index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const QuotesManagement = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showRejectionDialog, setShowRejectionDialog] = useState<Quote | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = () => {
    const savedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as Quote[];
    setQuotes(savedQuotes);
  };

  const updateQuoteStatus = (quoteId: string, status: Quote['status'], reason?: string) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === quoteId 
        ? { ...quote, status, rejectionReason: reason } 
        : quote
    );
    setQuotes(updatedQuotes);
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
    
    toast({
      title: "Estado actualizado",
      description: `Cotización ${status.toLowerCase()}`,
    });
  };

  const handleReject = (quote: Quote) => {
    setShowRejectionDialog(quote);
  };

  const confirmReject = () => {
    if (showRejectionDialog && rejectionReason.trim()) {
      updateQuoteStatus(showRejectionDialog.id, 'Rechazado', rejectionReason);
      setShowRejectionDialog(null);
      setRejectionReason('');
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'Aprobado': return 'bg-green-500';
      case 'Rechazado': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getQuotesSummary = () => {
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

  if (selectedQuote) {
    return <QuoteDetail quote={selectedQuote} onBack={() => setSelectedQuote(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Cotizaciones</h1>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">{summary.total}</h3>
              <p className="text-sm text-gray-600">Total Cotizaciones</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">{summary.approved}</h3>
              <p className="text-sm text-gray-600">Aprobadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-yellow-600">{summary.pending}</h3>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-purple-600">S/. {summary.totalSales.toFixed(2)}</h3>
              <p className="text-sm text-gray-600">Total Ventas</p>
            </CardContent>
          </Card>
        </div>

        {quotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 text-lg">No hay cotizaciones disponibles</p>
              <Link to="/">
                <Button className="mt-4">Crear Primera Cotización</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {quotes.map(quote => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quote.id}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Cliente: {quote.customer.name} | Fecha: {quote.date}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(quote.status)} text-white`}>
                      {quote.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-blue-600">
                        Total: S/. {quote.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Productos: {quote.products.length}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedQuote(quote)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Cotización
                      </Button>
                      {quote.status === 'En espera' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuoteStatus(quote.id, 'Aprobado')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(quote)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      {quote.status === 'Rechazado' && quote.rejectionReason && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Motivo del rechazo",
                              description: quote.rejectionReason,
                            });
                          }}
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Ver Motivo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection Dialog */}
        {showRejectionDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Rechazar Cotización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rejection-reason">Motivo del rechazo</Label>
                  <Textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explica el motivo del rechazo..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectionDialog(null);
                      setRejectionReason('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmReject}
                    disabled={!rejectionReason.trim()}
                  >
                    Rechazar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesManagement;
