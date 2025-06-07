
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, Save } from 'lucide-react';
import { TransformableProduct, SERIE_62_COMPONENTS } from '@/types/product';

interface TransformableProductConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: TransformableProduct) => void;
  productName: string;
}

export const TransformableProductConfig: React.FC<TransformableProductConfigProps> = ({
  isOpen,
  onClose,
  onSave,
  productName
}) => {
  const [divisions, setDivisions] = useState(2);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [slidingPanels, setSlidingPanels] = useState(2);
  const [laborCost, setLaborCost] = useState(200);
  const [profitMargin, setProfitMargin] = useState(300);
  const [components, setComponents] = useState(
    SERIE_62_COMPONENTS.map((comp, index) => ({
      ...comp,
      id: `comp-${index}`,
      isSelected: comp.isRequired || false
    }))
  );

  const area = width * height;
  const componentsSubtotal = components
    .filter(comp => comp.isSelected)
    .reduce((sum, comp) => sum + (comp.price * comp.quantity), 0);
  const total = componentsSubtotal + laborCost + profitMargin;

  const handleComponentChange = (id: string, field: string, value: any) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const handleSave = () => {
    const product: TransformableProduct = {
      id: `transform-${Date.now()}`,
      name: productName,
      basePrice: total,
      quantity: 1,
      unitOfMeasure: 'unidad',
      type: 'transformable',
      configuration: {
        series: 'serie-62',
        divisions,
        width,
        height,
        slidingPanels,
        area,
        components: components.filter(comp => comp.isSelected),
        laborCost,
        profitMargin
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
          {/* Configuración básica */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración Básica</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </CardContent>
          </Card>

          {/* Área calculada */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">
                  Área total: {area.toFixed(2)} m²
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Componentes */}
          <Card>
            <CardHeader>
              <CardTitle>Componentes Serie 62</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {components.map((component) => (
                  <div key={component.id} className="flex items-center space-x-4 p-3 border rounded">
                    <Checkbox
                      checked={component.isSelected}
                      disabled={component.isRequired}
                      onCheckedChange={(checked) => 
                        handleComponentChange(component.id, 'isSelected', checked)
                      }
                    />
                    <div className="flex-1">
                      <p className="font-medium">{component.name}</p>
                      {component.isRequired && (
                        <p className="text-xs text-gray-500">(Requerido)</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`price-${component.id}`}>Precio:</Label>
                      <Input
                        id={`price-${component.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={component.price}
                        onChange={(e) => 
                          handleComponentChange(component.id, 'price', parseFloat(e.target.value) || 0)
                        }
                        className="w-20"
                        disabled={!component.isSelected}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`qty-${component.id}`}>Cant:</Label>
                      <Input
                        id={`qty-${component.id}`}
                        type="number"
                        min={component.minQuantity || 1}
                        value={component.quantity}
                        onChange={(e) => 
                          handleComponentChange(component.id, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className="w-16"
                        disabled={!component.isSelected}
                      />
                    </div>
                    <div className="w-20 text-right font-medium">
                      {component.isSelected ? `S/. ${(component.price * component.quantity).toFixed(2)}` : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Costos adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Costos Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="labor-cost">Mano de Obra (S/.)</Label>
                <Input
                  id="labor-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="profit-margin">Ganancia/Margen (S/.)</Label>
                <Input
                  id="profit-margin"
                  type="number"
                  step="0.01"
                  min="0"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal Componentes:</span>
                <span>S/. {componentsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mano de Obra:</span>
                <span>S/. {laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ganancia:</span>
                <span>S/. {profitMargin.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>S/. {total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
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
