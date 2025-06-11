
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Quote, Customer } from '@/pages/Index';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { TransformableProductSelector } from './TransformableProductSelector';
import { TransformableProductConfig } from './TransformableProductConfig';
import { NonTransformableProductConfig } from './NonTransformableProductConfig';

interface QuoteEditorProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuote: Quote) => void;
}

export const QuoteEditor: React.FC<QuoteEditorProps> = ({
  quote,
  isOpen,
  onClose,
  onSave
}) => {
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    dni: '',
    phone: '',
    email: '',
    address: '',
    company: ''
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [showTransformableSelector, setShowTransformableSelector] = useState(false);
  const [showTransformableConfig, setShowTransformableConfig] = useState(false);
  const [showNonTransformableConfig, setShowNonTransformableConfig] = useState(false);
  const [selectedTransformableData, setSelectedTransformableData] = useState<{
    productName: string;
    glassType: string;
    thickness: number;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (quote) {
      setCustomer(quote.customer);
      setProducts([...quote.products]);
    }
  }, [quote]);

  if (!quote) return null;

  const calculateProductPrice = (product: Product) => {
    if (product.type === 'transformable') {
      const glassMultiplier = product.glassTypeMultiplier || 1;
      return product.basePrice * glassMultiplier;
    }
    const area = product.width * product.height;
    const glassMultiplier = product.glassTypeMultiplier || 1;
    return product.basePrice * area * product.quantity * glassMultiplier;
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => sum + calculateProductPrice(product), 0);
  };

  const handleProductQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, quantity: newQuantity } : product
    ));
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleTransformableProductSelect = (productName: string, glassType: string, thickness: number) => {
    setSelectedTransformableData({ productName, glassType, thickness });
    setShowTransformableConfig(true);
  };

  const handleSaveTransformableProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    setShowTransformableConfig(false);
    setSelectedTransformableData(null);
  };

  const handleSaveNonTransformableProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    setShowNonTransformableConfig(false);
  };

  const handleSave = () => {
    if (products.length === 0) {
      toast({
        title: "Error",
        description: "Debe tener al menos un producto en la cotización.",
        variant: "destructive"
      });
      return;
    }

    const updatedQuote: Quote = {
      ...quote,
      customer,
      products,
      total: calculateTotal()
    };

    onSave(updatedQuote);
    onClose();
    
    toast({
      title: "Cotización actualizada",
      description: `La cotización ${quote.id} ha sido actualizada exitosamente.`,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cotización - {quote.id}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nombre</Label>
                  <Input
                    id="customerName"
                    value={customer.name}
                    onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerDni">DNI/RUC</Label>
                  <Input
                    id="customerDni"
                    value={customer.dni}
                    onChange={(e) => setCustomer(prev => ({ ...prev, dni: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Teléfono</Label>
                  <Input
                    id="customerPhone"
                    value={customer.phone}
                    onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Dirección</Label>
                  <Input
                    id="customerAddress"
                    value={customer.address}
                    onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerCompany">Empresa</Label>
                  <Input
                    id="customerCompany"
                    value={customer.company}
                    onChange={(e) => setCustomer(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Products */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Productos</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowTransformableSelector(true)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Producto Transformable
                  </Button>
                  <Button
                    onClick={() => setShowNonTransformableConfig(true)}
                    size="sm"
                    variant="outline"
                    className="text-green-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Producto No Transformable
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mt-2">
                          {product.type === 'transformable' ? (
                            <>
                              <span>Dimensiones: {product.configuration.width}m × {product.configuration.height}m</span>
                              <span>Área: {product.configuration.area.toFixed(2)}m²</span>
                              <span>Vidrio: {product.glassType}</span>
                              <span>Espesor: {product.thickness}mm</span>
                            </>
                          ) : (
                            <>
                              <span>Dimensiones: {product.width}m × {product.height}m</span>
                              <span>Área: {(product.width * product.height).toFixed(2)}m²</span>
                              <span>Vidrio: {product.glassType}</span>
                              <span>Espesor: {product.thickness}mm</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`quantity-${product.id}`}>Cantidad:</Label>
                            <Input
                              id={`quantity-${product.id}`}
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => handleProductQuantityChange(product.id, Number(e.target.value))}
                              className="w-20"
                            />
                          </div>
                          <div className="text-sm font-medium">
                            Total: S/. {calculateProductPrice(product).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total de la Cotización:</span>
                <span className="text-blue-600">S/. {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Selection Dialogs */}
      <TransformableProductSelector
        isOpen={showTransformableSelector}
        onClose={() => setShowTransformableSelector(false)}
        onProductSelect={handleTransformableProductSelect}
      />

      {selectedTransformableData && (
        <TransformableProductConfig
          isOpen={showTransformableConfig}
          onClose={() => {
            setShowTransformableConfig(false);
            setSelectedTransformableData(null);
          }}
          onSave={handleSaveTransformableProduct}
          productName={selectedTransformableData.productName}
          glassType={selectedTransformableData.glassType}
          thickness={selectedTransformableData.thickness}
        />
      )}

      <NonTransformableProductConfig
        isOpen={showNonTransformableConfig}
        onClose={() => setShowNonTransformableConfig(false)}
        onSave={handleSaveNonTransformableProduct}
      />
    </>
  );
};
