
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { Product } from '@/pages/Index';

const PRODUCT_TYPES = [
  { id: 'templado', name: 'Vidrio Templado', basePrice: 45 },
  { id: 'laminado', name: 'Vidrio Laminado', basePrice: 55 },
  { id: 'espejo', name: 'Espejo', basePrice: 35 },
  { id: 'flotado', name: 'Vidrio Flotado', basePrice: 25 },
  { id: 'doble', name: 'Doble Vidrio Hermético', basePrice: 85 },
  { id: 'acustico', name: 'Vidrio Acústico', basePrice: 95 },
];

const PRESET_SIZES = [
  { label: '1.0 x 1.0 m', width: 1.0, height: 1.0 },
  { label: '1.5 x 1.0 m', width: 1.5, height: 1.0 },
  { label: '2.0 x 1.5 m', width: 2.0, height: 1.5 },
  { label: '2.5 x 2.0 m', width: 2.5, height: 2.0 },
  { label: 'Medidas personalizadas', width: 0, height: 0 },
];

interface ProductSelectorProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ products, onProductsChange }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [quantity, setQuantity] = useState('1');

  const addProduct = () => {
    if (!selectedType || !selectedSize) return;

    const productType = PRODUCT_TYPES.find(p => p.id === selectedType);
    if (!productType) return;

    let width, height;
    if (selectedSize === 'custom') {
      width = parseFloat(customWidth);
      height = parseFloat(customHeight);
      if (!width || !height) return;
    } else {
      const size = PRESET_SIZES.find(s => s.label === selectedSize);
      if (!size) return;
      width = size.width;
      height = size.height;
    }

    const newProduct: Product = {
      id: `${Date.now()}-${Math.random()}`,
      name: productType.name,
      basePrice: productType.basePrice,
      width,
      height,
      quantity: parseInt(quantity),
      customSize: selectedSize === 'custom'
    };

    onProductsChange([...products, newProduct]);
    
    // Reset form
    setSelectedType('');
    setSelectedSize('');
    setCustomWidth('');
    setCustomHeight('');
    setQuantity('1');
  };

  const removeProduct = (id: string) => {
    onProductsChange(products.filter(p => p.id !== id));
  };

  const calculateProductPrice = (product: Product) => {
    const area = product.width * product.height;
    return product.basePrice * area * product.quantity;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-type">Tipo de Producto</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} - S/. {type.basePrice}/m²
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size">Tamaño</Label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tamaño" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_SIZES.map(size => (
                <SelectItem key={size.label} value={size.label === 'Medidas personalizadas' ? 'custom' : size.label}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSize === 'custom' && (
          <>
            <div>
              <Label htmlFor="width">Ancho (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                placeholder="Ej: 1.5"
              />
            </div>
            <div>
              <Label htmlFor="height">Alto (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                placeholder="Ej: 2.0"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={addProduct} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Añadir Producto
          </Button>
        </div>
      </div>

      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Productos Añadidos:</h3>
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {product.width}m x {product.height}m | Cantidad: {product.quantity}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      S/. {calculateProductPrice(product).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
