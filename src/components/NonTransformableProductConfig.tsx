
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Save } from 'lucide-react';
import { NonTransformableProduct, NON_TRANSFORMABLE_PRODUCTS } from '@/types/product';

interface NonTransformableProductConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: NonTransformableProduct) => void;
}

export const NonTransformableProductConfig: React.FC<NonTransformableProductConfigProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [unitOfMeasure, setUnitOfMeasure] = useState('');

  const handleProductSelect = (productName: string) => {
    const product = NON_TRANSFORMABLE_PRODUCTS.find(p => p.name === productName);
    if (product) {
      setSelectedProduct(productName);
      setPrice(product.price);
      setUnitOfMeasure(product.unitOfMeasure);
    }
  };

  const handleSave = () => {
    if (!selectedProduct) return;

    const product: NonTransformableProduct = {
      id: `non-transform-${Date.now()}`,
      name: selectedProduct,
      basePrice: price,
      quantity,
      unitOfMeasure,
      type: 'no-transformable'
    };

    onSave(product);
    onClose();
    
    // Reset form
    setSelectedProduct('');
    setPrice(0);
    setQuantity(1);
    setUnitOfMeasure('');
  };

  const total = price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Añadir Producto No Transformable
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="product-select">Producto</Label>
            <Select value={selectedProduct} onValueChange={handleProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto..." />
              </SelectTrigger>
              <SelectContent>
                {NON_TRANSFORMABLE_PRODUCTS.map((product) => (
                  <SelectItem key={product.name} value={product.name}>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        S/. {product.price} por {product.unitOfMeasure}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Precio Unitario (S/.)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              disabled={!selectedProduct}
            />
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              disabled={!selectedProduct}
            />
          </div>

          {selectedProduct && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    S/. {total.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {quantity} {unitOfMeasure} × S/. {price.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!selectedProduct}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Añadir Producto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
