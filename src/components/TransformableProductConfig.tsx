
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calculator, Save } from 'lucide-react';
import { TransformableProduct, SERIE_62_COMPONENTS, GLASS_TYPES } from '@/types/product';
import { TransformableProductConfigProps } from './transformable-config/TransformableProductConfigProps';
import { GlassInfoCard } from './transformable-config/GlassInfoCard';
import { BasicConfigCard } from './transformable-config/BasicConfigCard';
import { AreaDisplayCard } from './transformable-config/AreaDisplayCard';
import { ComponentsSelectionCard } from './transformable-config/ComponentsSelectionCard';
import { AdditionalCostsCard } from './transformable-config/AdditionalCostsCard';
import { CostSummaryCard } from './transformable-config/CostSummaryCard';

export const TransformableProductConfig: React.FC<TransformableProductConfigProps> = ({
  isOpen,
  onClose,
  onSave,
  productName,
  glassType,
  thickness
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
  const glassTypeMultiplier = GLASS_TYPES.find(gt => gt.name === glassType)?.multiplier || 1;
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
      glassType,
      thickness,
      glassTypeMultiplier,
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
          <GlassInfoCard 
            glassType={glassType}
            thickness={thickness}
            glassTypeMultiplier={glassTypeMultiplier}
          />

          <BasicConfigCard
            divisions={divisions}
            width={width}
            height={height}
            slidingPanels={slidingPanels}
            onDivisionsChange={setDivisions}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            onSlidingPanelsChange={setSlidingPanels}
          />

          <AreaDisplayCard area={area} />

          <ComponentsSelectionCard
            components={components}
            onComponentChange={handleComponentChange}
          />

          <AdditionalCostsCard
            laborCost={laborCost}
            profitMargin={profitMargin}
            onLaborCostChange={setLaborCost}
            onProfitMarginChange={setProfitMargin}
          />

          <CostSummaryCard
            componentsSubtotal={componentsSubtotal}
            laborCost={laborCost}
            profitMargin={profitMargin}
            glassTypeMultiplier={glassTypeMultiplier}
            total={total}
          />

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
