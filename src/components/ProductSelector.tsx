import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Settings, Package } from 'lucide-react';
import { Product, GLASS_TYPES } from '@/types/product';
import { TransformableProductConfig } from './TransformableProductConfig';
import { NonTransformableProductConfig } from './NonTransformableProductConfig';
import { TransformableProductSelector } from './TransformableProductSelector';

interface ProductSelectorProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ products, onProductsChange }) => {
  const [showTransformableSelector, setShowTransformableSelector] = useState(false);
  const [showTransformableConfig, setShowTransformableConfig] = useState(false);
  const [showNonTransformableConfig, setShowNonTransformableConfig] = useState(false);
  const [selectedTransformableData, setSelectedTransformableData] = useState<{
    productName: string;
    glassType: string;
    thickness: number;
  } | null>(null);

  const handleTransformableProductSelect = (productName: string, glassType: string, thickness: number) => {
    setSelectedTransformableData({ productName, glassType, thickness });
    setShowTransformableConfig(true);
  };

  const handleSaveTransformableProduct = (product: Product) => {
    onProductsChange([...products, product]);
  };

  const handleSaveNonTransformableProduct = (product: Product) => {
    onProductsChange([...products, product]);
  };

  const removeProduct = (id: string) => {
    onProductsChange(products.filter(p => p.id !== id));
  };

  const calculateProductPrice = (product: Product) => {
    if (product.type === 'transformable') {
      // For transformable products, the total cost is already calculated in the configuration
      return product.configuration.materialsCost + product.configuration.laborCost + product.configuration.profitMargin + product.configuration.travelExpenses;
    }
    const area = product.width * product.height;
    const glassMultiplier = product.glassTypeMultiplier || 1;
    return product.basePrice * area * product.quantity * glassMultiplier;
  };

  const transformableProducts = products.filter(p => p.type === 'transformable');
  const nonTransformableProducts = products.filter(p => p.type === 'no-transformable');

  return (
    <div className="space-y-6">
      {/* Botones para añadir productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
          <div className="text-center space-y-2">
            <Settings className="h-8 w-8 mx-auto text-blue-600" />
            <h3 className="font-medium">Productos Transformables</h3>
            <p className="text-xs text-gray-500 mb-3">Mamparas, puertas configurables</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransformableSelector(true)}
              className="w-full"
            >
              Seleccionar Producto
            </Button>
          </div>
        </Card>

        <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
          <div className="text-center space-y-2">
            <Package className="h-8 w-8 mx-auto text-green-600" />
            <h3 className="font-medium">Productos No Transformables</h3>
            <p className="text-xs text-gray-500 mb-3">Vidrios, espejos estándar</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNonTransformableConfig(true)}
              className="w-full"
            >
              Añadir Producto
            </Button>
          </div>
        </Card>
      </div>

      {/* Lista de productos añadidos */}
      {products.length > 0 && (
        <div className="space-y-4">
          {/* Productos Transformables */}
          {transformableProducts.length > 0 && (
            <div>
              <h3 className="font-semibold text-blue-600 mb-3 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Productos Transformables
              </h3>
              <div className="space-y-3">
                {transformableProducts.map(product => (
                  <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          {product.type === 'transformable' && (
                            <div className="text-sm text-gray-600 mt-1">
                              <p>Serie: {product.configuration.series}</p>
                              <p>Dimensiones: {product.configuration.width}m × {product.configuration.height}m</p>
                              <p>Área: {product.configuration.area.toFixed(2)}m²</p>
                              <p>Tipo de vidrio: {product.glassType}</p>
                              <p>Espesor: {product.thickness}mm</p>
                              <p>Componentes: {product.configuration.components.length}</p>
                              <p>Mano de obra: S/. {product.configuration.laborCost.toFixed(2)}</p>
                              <p>Ganancia: S/. {product.configuration.profitMargin.toFixed(2)}</p>
                            </div>
                          )}
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            S/. {calculateProductPrice(product).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Productos No Transformables */}
          {nonTransformableProducts.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-600 mb-3 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Productos No Transformables
              </h3>
              <div className="space-y-3">
                {nonTransformableProducts.map(product => (
                  <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Dimensiones: {product.width}m × {product.height}m | Cantidad: {product.quantity} {product.unitOfMeasure}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tipo de vidrio: {product.glassType} | Espesor: {product.thickness}mm
                          </p>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            S/. {calculateProductPrice(product).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
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
    </div>
  );
};
