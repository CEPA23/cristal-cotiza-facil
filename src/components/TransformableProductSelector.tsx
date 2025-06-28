
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { TRANSFORMABLE_PRODUCTS, TRANSFORMABLE_CATEGORIES, MAMPARA_GLASS_TYPES, MAMPARA_GLASS_PRICES } from '@/types/product';

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
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const filteredProducts = selectedCategory 
    ? TRANSFORMABLE_PRODUCTS.filter(product => product.category === selectedCategory)
    : TRANSFORMABLE_PRODUCTS;

  // Determinar qué tipos de vidrio mostrar según la categoría
  const availableGlassTypes = selectedCategory === 'Mamparas' 
    ? MAMPARA_GLASS_TYPES 
    : [];

  // Obtener el precio por m² del vidrio seleccionado
  const getGlassPrice = () => {
    if (selectedCategory === 'Mamparas' && selectedGlassType) {
      return MAMPARA_GLASS_PRICES[selectedGlassType] || 0;
    }
    return 0;
  };

  // Extraer el espesor del nombre del vidrio
  const getThicknessFromGlassType = (glassType: string): number => {
    const thicknessMatch = glassType.match(/(\d+)mm/);
    return thicknessMatch ? parseInt(thicknessMatch[1]) : 6;
  };

  const handleContinue = () => {
    if (selectedProduct && selectedGlassType) {
      const thickness = getThicknessFromGlassType(selectedGlassType);
      onProductSelect(selectedProduct, selectedGlassType, thickness);
      onClose();
      // Reset form
      setSelectedCategory('');
      setSelectedProduct('');
      setSelectedGlassType('');
      setWidth(0);
      setHeight(0);
    }
  };

  const handleGlassTypeChange = (glassTypeName: string) => {
    console.log('Glass type selected:', glassTypeName);
    setSelectedGlassType(glassTypeName);
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

          {/* Selector de productos */}
          {selectedCategory && (
            <div>
              <Label htmlFor="product">Producto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.map((product) => (
                    <SelectItem key={product.name} value={product.name}>
                      {product.name} - Serie: {product.series}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector de tipo de vidrio */}
          {selectedCategory && availableGlassTypes.length > 0 && (
            <div>
              <Label htmlFor="glassType">Tipo de vidrio</Label>
              <Select value={selectedGlassType} onValueChange={handleGlassTypeChange}>
                <SelectTrigger id="glassType">
                  <SelectValue placeholder="Seleccionar tipo de vidrio..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {availableGlassTypes.map((glass) => (
                    <SelectItem key={glass.name} value={glass.name}>
                      {glass.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Precio y dimensiones */}
          {selectedGlassType && (
            <div className="space-y-4">
              {/* Mostrar precio por m² */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Precio: S/. {getGlassPrice().toFixed(2)} por m²
                </p>
              </div>

              {/* Dimensiones */}
              <div>
                <Label className="text-base font-medium">Dimensiones</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="width">Ancho (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.01"
                      min="0"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Alto (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      min="0"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                {/* Mostrar área y precio total */}
                {width > 0 && height > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Área:</span> {(width * height).toFixed(2)} m²</p>
                      <p><span className="font-medium">Precio total:</span> S/. {(width * height * getGlassPrice()).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!selectedProduct || !selectedGlassType || width <= 0 || height <= 0}
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
