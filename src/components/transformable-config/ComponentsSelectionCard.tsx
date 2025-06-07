
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Serie62Component } from '@/types/product';

interface ComponentsSelectionCardProps {
  components: Serie62Component[];
  onComponentChange: (id: string, field: string, value: any) => void;
}

export const ComponentsSelectionCard: React.FC<ComponentsSelectionCardProps> = ({
  components,
  onComponentChange
}) => {
  return (
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
                  onComponentChange(component.id, 'isSelected', checked)
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
                    onComponentChange(component.id, 'price', parseFloat(e.target.value) || 0)
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
                    onComponentChange(component.id, 'quantity', parseInt(e.target.value) || 1)
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
  );
};
