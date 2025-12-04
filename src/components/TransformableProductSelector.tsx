
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { 
  TRANSFORMABLE_PRODUCTS, 
  TRANSFORMABLE_CATEGORIES, 
  MAMPARA_GLASS_TYPES, 
  MAMPARA_GLASS_PRICES,
  LOCK_TYPES,
  FRAME_TYPES,
  OPENING_SYSTEMS
} from '@/types/product';

interface TransformableProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (productName: string, glassType: string, thickness: number, category: string, extraConfig?: {
    lockType?: string;
    frameType?: string;
    openingSystem?: string;
    width?: number;
    height?: number;
    glassPrice?: number;
  }) => void;
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
  
  // Campos para Puertas
  const [lockType, setLockType] = useState('');
  const [frameType, setFrameType] = useState('');
  
  // Campos para Ventanas
  const [openingSystem, setOpeningSystem] = useState('');

  const filteredProducts = selectedCategory 
    ? TRANSFORMABLE_PRODUCTS.filter(product => product.category === selectedCategory)
    : TRANSFORMABLE_PRODUCTS;

  // Determinar qué tipos de vidrio mostrar según la categoría
  const availableGlassTypes = MAMPARA_GLASS_TYPES;

  // Obtener el precio por m² del vidrio seleccionado
  const getGlassPrice = () => {
    if (selectedGlassType) {
      return MAMPARA_GLASS_PRICES[selectedGlassType] || 0;
    }
    return 0;
  };

  // Extraer el espesor del nombre del vidrio
  const getThicknessFromGlassType = (glassType: string): number => {
    const thicknessMatch = glassType.match(/(\d+)mm/);
    return thicknessMatch ? parseInt(thicknessMatch[1]) : 6;
  };

  const canContinue = () => {
    if (!selectedProduct || !selectedGlassType || width <= 0 || height <= 0) {
      return false;
    }
    
    // Validaciones específicas por categoría
    if (selectedCategory === 'Puertas' && (!lockType || !frameType)) {
      return false;
    }
    
    if (selectedCategory === 'Ventanas' && (!frameType || !openingSystem)) {
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (canContinue()) {
      const thickness = getThicknessFromGlassType(selectedGlassType);
      const glassPrice = getGlassPrice();
      
      const extraConfig: {
        lockType?: string;
        frameType?: string;
        openingSystem?: string;
        width?: number;
        height?: number;
        glassPrice?: number;
      } = {
        width,
        height,
        glassPrice
      };
      
      if (selectedCategory === 'Puertas') {
        extraConfig.lockType = lockType;
        extraConfig.frameType = frameType;
      }
      
      if (selectedCategory === 'Ventanas') {
        extraConfig.frameType = frameType;
        extraConfig.openingSystem = openingSystem;
      }
      
      onProductSelect(selectedProduct, selectedGlassType, thickness, selectedCategory, extraConfig);
      onClose();
      // Reset form
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedProduct('');
    setSelectedGlassType('');
    setWidth(0);
    setHeight(0);
    setLockType('');
    setFrameType('');
    setOpeningSystem('');
  };

  const handleGlassTypeChange = (glassTypeName: string) => {
    console.log('Glass type selected:', glassTypeName);
    setSelectedGlassType(glassTypeName);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct('');
    setSelectedGlassType('');
    setLockType('');
    setFrameType('');
    setOpeningSystem('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector de tipo de vidrio - para todas las categorías */}
          {selectedCategory && (
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

          {/* Campos específicos para PUERTAS */}
          {selectedCategory === 'Puertas' && (
            <>
              <div>
                <Label htmlFor="lockType">Cerradura</Label>
                <Select value={lockType} onValueChange={setLockType}>
                  <SelectTrigger id="lockType">
                    <SelectValue placeholder="Seleccionar tipo de cerradura..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCK_TYPES.map((lock) => (
                      <SelectItem key={lock} value={lock}>
                        {lock}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frameType">Marco</Label>
                <Select value={frameType} onValueChange={setFrameType}>
                  <SelectTrigger id="frameType">
                    <SelectValue placeholder="Seleccionar tipo de marco..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAME_TYPES.map((frame) => (
                      <SelectItem key={frame} value={frame}>
                        {frame}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Campos específicos para VENTANAS */}
          {selectedCategory === 'Ventanas' && (
            <>
              <div>
                <Label htmlFor="frameTypeWindow">Tipo de marco</Label>
                <Select value={frameType} onValueChange={setFrameType}>
                  <SelectTrigger id="frameTypeWindow">
                    <SelectValue placeholder="Seleccionar tipo de marco..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAME_TYPES.map((frame) => (
                      <SelectItem key={frame} value={frame}>
                        {frame}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="openingSystem">Sistema de apertura</Label>
                <Select value={openingSystem} onValueChange={setOpeningSystem}>
                  <SelectTrigger id="openingSystem">
                    <SelectValue placeholder="Seleccionar sistema de apertura..." />
                  </SelectTrigger>
                  <SelectContent>
                    {OPENING_SYSTEMS.map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
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
              disabled={!canContinue()}
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
