
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { TRANSFORMABLE_PRODUCTS, TRANSFORMABLE_CATEGORIES, GLASS_TYPES, GLASS_THICKNESS } from '@/types/product';

interface TransformableProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (productName: string, glassType: string, thickness: number) => void;
}

export const TransformableProductSelector: React.FC<TransformableProductSelectorProps> = ({
  isOpen,
  onClose,
  onProductSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedGlassType, setSelectedGlassType] = useState('');
  const [selectedThickness, setSelectedThickness] = useState<number>(6);

  const filteredProducts = selectedCategory 
    ? TRANSFORMABLE_PRODUCTS.filter(product => product.category === selectedCategory)
    : TRANSFORMABLE_PRODUCTS;

  const handleContinue = () => {
    if (selectedProduct && selectedGlassType) {
      onProductSelect(selectedProduct, selectedGlassType, selectedThickness);
      onClose();
      // Reset form
      setSelectedCategory('');
      setSelectedProduct('');
      setSelectedGlassType('');
      setSelectedThickness(6);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Seleccionar Producto Transformable
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Categoría */}
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría..." />
              </SelectTrigger>
              <SelectContent>
                {TRANSFORMABLE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de productos */}
          <div>
            <Label>Productos disponibles</Label>
            <div className="grid grid-cols-1 gap-3 mt-2">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.name}
                  className={`cursor-pointer transition-colors ${
                    selectedProduct === product.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedProduct(product.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">Serie: {product.series}</p>
                        <p className="text-sm text-gray-600">Categoría: {product.category}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedProduct === product.name 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tipo de vidrio */}
          <div>
            <Label htmlFor="glass-type">Tipo de Vidrio</Label>
            <Select value={selectedGlassType} onValueChange={setSelectedGlassType}>
              <SelectTrigger id="glass-type">
                <SelectValue placeholder="Seleccionar tipo de vidrio..." />
              </SelectTrigger>
              <SelectContent>
                {GLASS_TYPES.map((glass) => (
                  <SelectItem key={glass.name} value={glass.name}>
                    {glass.name} (x{glass.multiplier})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Espesor */}
          <div>
            <Label htmlFor="thickness">Espesor del Vidrio</Label>
            <Select value={selectedThickness.toString()} onValueChange={(value) => setSelectedThickness(Number(value))}>
              <SelectTrigger id="thickness">
                <SelectValue placeholder="Seleccionar espesor..." />
              </SelectTrigger>
              <SelectContent>
                {GLASS_THICKNESS.map((thickness) => (
                  <SelectItem key={thickness.thickness} value={thickness.thickness.toString()}>
                    {thickness.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!selectedProduct || !selectedGlassType}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
