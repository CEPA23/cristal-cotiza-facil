
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, Save } from 'lucide-react';
import { TransformableProduct, SERIE_62_COMPONENTS, MAMPARA_GLASS_PRICES, FRAME_TYPES, OPENING_SYSTEMS } from '@/types/product';
import { TransformableProductConfigProps } from './transformable-config/TransformableProductConfigProps';
import { ComponentsSelectionCard } from './transformable-config/ComponentsSelectionCard';

export const TransformableProductConfig: React.FC<TransformableProductConfigProps> = ({
  isOpen,
  onClose,
  onSave,
  productName,
  glassType,
  thickness,
  category,
  extraConfig
}) => {
  const [divisions, setDivisions] = useState(2);
  const [width, setWidth] = useState(extraConfig?.width || 0);
  const [height, setHeight] = useState(extraConfig?.height || 0);
  const [slidingPanels, setSlidingPanels] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [laborCost, setLaborCost] = useState(extraConfig?.laborCost || (category === 'Ventanas' ? 0 : 200));
  const [profitMarginPercentage, setProfitMarginPercentage] = useState(category === 'Ventanas' ? 0 : 20);
  const [travelExpenses, setTravelExpenses] = useState(extraConfig?.travelCost || 0);
  const [agreedPrice, setAgreedPrice] = useState<number>(0);

  // Actualizar dimensiones cuando cambie extraConfig
  useEffect(() => {
    if (extraConfig?.width) setWidth(extraConfig.width);
    if (extraConfig?.height) setHeight(extraConfig.height);
    if (extraConfig?.laborCost) setLaborCost(extraConfig.laborCost);
    if (extraConfig?.travelCost) setTravelExpenses(extraConfig.travelCost);
  }, [extraConfig?.width, extraConfig?.height, extraConfig?.laborCost, extraConfig?.travelCost]);

  const [components, setComponents] = useState(
    SERIE_62_COMPONENTS.map((comp, index) => ({
      ...comp,
      id: `comp-${index}`,
      isSelected: comp.isRequired || false
    }))
  );

  // Cálculos automáticos
  const glassArea = width * height;
  const glassCostPerM2 = MAMPARA_GLASS_PRICES[glassType] || 0;
  const glassTotalCost = glassArea * glassCostPerM2;
  
  // Para Ventanas: usar precios de marco y sistema de apertura
  const framePrice = category === 'Ventanas' 
    ? (FRAME_TYPES.find(f => f.name === extraConfig?.frameType)?.price || 0)
    : 0;
  const openingSystemPrice = category === 'Ventanas'
    ? (OPENING_SYSTEMS.find(s => s.name === extraConfig?.openingSystem)?.price || 0)
    : 0;
  
  // Cálculo de componentes solo para mamparas
  const componentsSubtotal = category === 'Mamparas'
    ? components.filter(comp => comp.isSelected).reduce((sum, comp) => sum + (comp.price * comp.quantity), 0)
    : 0;
  
  // Para Ventanas: vidrio + marco + sistema
  // Para Mamparas: componentes + vidrio
  const materialsCost = category === 'Ventanas'
    ? glassTotalCost + framePrice + openingSystemPrice
    : componentsSubtotal + glassTotalCost;
  
  // Costo base sin ganancia (materiales + mano de obra + viáticos)
  const baseCostWithoutProfit = materialsCost + laborCost + travelExpenses;
  
  // Calcular ganancia basada en el costo base total
  const profitMarginAmount = baseCostWithoutProfit * (profitMarginPercentage / 100);
  
  const totalWithProfit = baseCostWithoutProfit + profitMarginAmount;
  
  // Precio por unidad y total por cantidad
  const pricePerUnit = agreedPrice > 0 ? agreedPrice : totalWithProfit;
  const totalForQuantity = pricePerUnit * quantity;
  
  // Cálculo de ganancia real corregido
  const realProfit = agreedPrice > 0 ? agreedPrice - baseCostWithoutProfit : 0;
  const realProfitPercentage = baseCostWithoutProfit > 0 && agreedPrice > 0 
    ? (realProfit / baseCostWithoutProfit) * 100 
    : 0;

  // Determinar si hay pérdida
  const isLoss = agreedPrice > 0 && realProfit < 0;

  const handleComponentChange = (id: string, field: string, value: any) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const handleSave = () => {
    const product: TransformableProduct = {
      id: `transform-${Date.now()}`,
      name: productName,
      basePrice: pricePerUnit,
      quantity,
      unitOfMeasure: 'unidad',
      type: 'transformable',
      glassType,
      thickness,
      category,
      configuration: {
        series: 'serie-62',
        divisions,
        width,
        height,
        slidingPanels,
        area: glassArea,
        components: components.filter(comp => comp.isSelected),
        laborCost,
        profitMargin: profitMarginAmount,
        travelExpenses,
        glassArea,
        glassCostPerM2,
        glassTotalCost,
        materialsCost,
        agreedPrice: agreedPrice > 0 ? agreedPrice : undefined,
        realProfit: agreedPrice > 0 ? realProfit : undefined,
        realProfitPercentage: agreedPrice > 0 ? realProfitPercentage : undefined,
        lockType: extraConfig?.lockType,
        frameType: extraConfig?.frameType,
        openingSystem: extraConfig?.openingSystem
      }
    };

    onSave(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Configuración: {productName} - Serie 62
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Vidrio */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Vidrio</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Vidrio</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  {glassType}
                </div>
              </div>
              <div>
                <Label>Precio por m²</Label>
                <div className="p-2 bg-blue-50 rounded border font-medium">
                  S/. {glassCostPerM2.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración Básica</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="divisions">Divisiones</Label>
                <Input
                  id="divisions"
                  type="number"
                  min="1"
                  value={divisions}
                  onChange={(e) => setDivisions(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="width">Ancho (m)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  min="0"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
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
                />
              </div>
              <div>
                <Label htmlFor="sliding-panels">Hojas Corredizas</Label>
                <Input
                  id="sliding-panels"
                  type="number"
                  min="1"
                  value={slidingPanels}
                  onChange={(e) => setSlidingPanels(parseInt(e.target.value) || 1)}
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
                />
              </div>
            </CardContent>
          </Card>

          {/* Cálculo de Vidrio */}
          <Card>
            <CardHeader>
              <CardTitle>Cálculo del Vidrio</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label>Área Total</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  {glassArea.toFixed(2)} m²
                </div>
              </div>
              <div>
                <Label>Precio por m²</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  S/. {glassCostPerM2.toFixed(2)}
                </div>
              </div>
              <div>
                <Label>Costo Total del Vidrio</Label>
                <div className="p-2 bg-blue-50 rounded border font-medium">
                  S/. {glassTotalCost.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Componentes - Solo para Mamparas */}
          {category === 'Mamparas' && (
            <ComponentsSelectionCard
              components={components}
              onComponentChange={handleComponentChange}
            />
          )}

          {/* Costos Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Costos Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="labor-cost">Mano de Obra (S/.)</Label>
                <Input
                  id="labor-cost"
                  type="number"
                  min="0"
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="profit-margin">Ganancia (%)</Label>
                <Input
                  id="profit-margin"
                  type="number"
                  min="0"
                  max="100"
                  value={profitMarginPercentage}
                  onChange={(e) => setProfitMarginPercentage(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculado sobre el total general
                </p>
              </div>
              <div>
                <Label htmlFor="travel-expenses">Viáticos (S/.)</Label>
                <Input
                  id="travel-expenses"
                  type="number"
                  min="0"
                  value={travelExpenses}
                  onChange={(e) => setTravelExpenses(parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Costos */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {category === 'Mamparas' && (
                  <div className="flex justify-between">
                    <span>Componentes:</span>
                    <span>S/. {Math.round(componentsSubtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Vidrio:</span>
                  <span>S/. {Math.round(glassTotalCost)}</span>
                </div>
                {category === 'Ventanas' && (
                  <>
                    <div className="flex justify-between">
                      <span>Marco ({extraConfig?.frameType}):</span>
                      <span>S/. {framePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sistema ({extraConfig?.openingSystem}):</span>
                      <span>S/. {openingSystemPrice}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-medium">
                  <span>Total Materiales:</span>
                  <span>S/. {Math.round(materialsCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mano de Obra:</span>
                  <span>S/. {laborCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Viáticos:</span>
                  <span>S/. {travelExpenses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ganancia ({profitMarginPercentage}%):</span>
                  <span>S/. {Math.round(profitMarginAmount)}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Costo Base (sin ganancia):</span>
                  <span>S/. {Math.round(baseCostWithoutProfit)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>Precio por Unidad:</span>
                  <span>S/. {Math.round(pricePerUnit)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-green-600 bg-green-50 p-3 rounded-lg">
                  <span>Total por {quantity} unidad{quantity > 1 ? 'es' : ''}:</span>
                  <span>S/. {Math.round(totalForQuantity)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descuento */}
          <Card>
            <CardHeader>
              <CardTitle>Descuento (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agreed-price">Precio con Descuento (S/.)</Label>
                <Input
                  id="agreed-price"
                  type="number"
                  min="0"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(parseInt(e.target.value) || 0)}
                  placeholder="Dejar en blanco para usar el total general"
                />
              </div>
              
              {agreedPrice > 0 && (
                <div className={`p-4 rounded-lg border ${isLoss ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <h4 className={`font-medium mb-2 ${isLoss ? 'text-red-800' : 'text-yellow-800'}`}>
                    Análisis de {isLoss ? 'Pérdida' : 'Ganancia'} Real
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Costo Base (sin ganancia):</span>
                      <span>S/. {baseCostWithoutProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio con Descuento:</span>
                      <span>S/. {agreedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Descuento aplicado:</span>
                      <span>S/. {(totalWithProfit - agreedPrice).toFixed(2)} ({((totalWithProfit - agreedPrice) / totalWithProfit * 100).toFixed(1)}%)</span>
                    </div>
                    <div className={`flex justify-between font-medium ${isLoss ? 'text-red-700' : 'text-green-700'}`}>
                      <span>{isLoss ? 'Pérdida' : 'Ganancia'} Real:</span>
                      <span>S/. {realProfit.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between font-medium ${isLoss ? 'text-red-800' : 'text-yellow-800'}`}>
                      <span>Porcentaje Real:</span>
                      <span>{realProfitPercentage.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
