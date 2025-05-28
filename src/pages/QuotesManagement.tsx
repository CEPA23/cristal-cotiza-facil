import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, User, DollarSign, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Quote } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';
import { QuoteDetail } from '@/components/QuoteDetail';

const QuotesManagement = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [quoteToReject, setQuoteToReject] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [quotes, statusFilter]);

  const loadQuotes = () => {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    setQuotes(storedQuotes);
  };

  const filterQuotes = () => {
    if (statusFilter === 'all') {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter(quote => quote.status === statusFilter));
    }
  };

  const updateQuoteStatus = (quoteId: string, newStatus: Quote['status'], reason?: string) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === quoteId ? { 
        ...quote, 
        status: newStatus,
        rejectionReason: newStatus === 'Rechazado' ? reason : undefined
      } : quote
    );
    
    setQuotes(updatedQuotes);
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
    
    toast({
      title: "Estado actualizado",
      description: `Cotización ${quoteId} marcada como ${newStatus.toLowerCase()}.`,
    });

    if (newStatus === 'Aprobado') {
      toast({
        title: "Cotización aprobada",
        description: "Los datos están listos para la fase de producción.",
      });
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'En espera': return 'bg-yellow-100 text-yellow-800';
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalQuotesByStatus = (status: Quote['status']) => {
    return quotes.filter(quote => quote.status === status).length;
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

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedQuote(null);
  };

  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    if (newStatus === 'Rechazado') {
      setQuoteToReject(quoteId);
      setIsRejectionDialogOpen(true);
    } else {
      updateQuoteStatus(quoteId, newStatus);
    }
  };

  const handleRejectQuote = () => {
    if (!quoteToReject || !rejectionReason.trim()) return;
    
    updateQuoteStatus(quoteToReject, 'Rechazado', rejectionReason);
    setIsRejectionDialogOpen(false);
    setRejectionReason('');
    setQuoteToReject(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Cotizaciones</h1>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          {/* Filter */}
          <div className="flex justify-between items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las cotizaciones</SelectItem>
                <SelectItem value="En espera">En espera</SelectItem>
                <SelectItem value="Aprobado">Aprobadas</SelectItem>
                <SelectItem value="Rechazado">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Quotes List */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <p>No hay cotizaciones que mostrar.</p>
                <Link to="/">
                  <Button className="mt-4">
                    Crear Nueva Cotización
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map(quote => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quote.id}</CardTitle>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {quote.date}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {quote.customer.name}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          S/. {quote.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleViewQuote(quote)}
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Resumen
                      </Button>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p><strong>Cliente:</strong> {quote.customer.name}</p>
                      <p><strong>DNI/RUC:</strong> {quote.customer.dni}</p>
                      <p><strong>Productos:</strong> {quote.products.length} item{quote.products.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Select
                        value={quote.status}
                        onValueChange={(newStatus: Quote['status']) => handleStatusChange(quote.id, newStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En espera">En espera</SelectItem>
                          <SelectItem value="Aprobado">Aprobado</SelectItem>
                          <SelectItem value="Rechazado">Rechazado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Products Summary */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Productos cotizados:</h4>
                    <div className="space-y-1">
                      {quote.products.map((product, index) => (
                        <div key={index} className="text-sm text-gray-600 flex justify-between">
                          <span>{product.name} ({product.width}m × {product.height}m)</span>
                          <span>Cant: {product.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {quote.status === 'Rechazado' && quote.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Motivo del rechazo:</strong> {quote.rejectionReason}
                      </p>
                    </div>
                  )}

                  {quote.status === 'Aprobado' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        ✅ <strong>Cotización aprobada</strong> - Lista para fase de producción
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <QuoteDetail 
        quote={selectedQuote}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo del Rechazo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">
                Por favor, especifique el motivo del rechazo:
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ej: Precio muy alto, producto no disponible, especificaciones incorrectas..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectionDialogOpen(false);
                  setRejectionReason('');
                  setQuoteToReject(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectQuote}
                disabled={!rejectionReason.trim()}
              >
                Rechazar Cotización
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesManagement;
