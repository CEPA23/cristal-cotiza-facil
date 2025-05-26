
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, User, DollarSign, Eye, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Quote } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

const QuotesManagement = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const updateQuoteStatus = (quoteId: string, newStatus: Quote['status']) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: newStatus } : quote
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
                <h3 className="text-2xl font-bold text-blue-600">{quotes.length}</h3>
                <p className="text-sm text-gray-600">Total Cotizaciones</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{getTotalQuotesByStatus('En espera')}</h3>
                <p className="text-sm text-gray-600">En Espera</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-green-600">{getTotalQuotesByStatus('Aprobado')}</h3>
                <p className="text-sm text-gray-600">Aprobadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="text-2xl font-bold text-red-600">{getTotalQuotesByStatus('Rechazado')}</h3>
                <p className="text-sm text-gray-600">Rechazadas</p>
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
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status}
                    </Badge>
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
                        onValueChange={(newStatus: Quote['status']) => updateQuoteStatus(quote.id, newStatus)}
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
    </div>
  );
};

export default QuotesManagement;
