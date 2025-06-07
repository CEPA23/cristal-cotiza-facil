
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicConfigCardProps {
  divisions: number;
  width: number;
  height: number;
  slidingPanels: number;
  onDivisionsChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onSlidingPanelsChange: (value: number) => void;
}

export const BasicConfigCard: React.FC<BasicConfigCardProps> = ({
  divisions,
  width,
  height,
  slidingPanels,
  onDivisionsChange,
  onWidthChange,
  onHeightChange,
  onSlidingPanelsChange
}) => {
  return (
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
            onChange={(e) => onDivisionsChange(parseInt(e.target.value) || 1)}
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
            onChange={(e) => onWidthChange(parseFloat(e.target.value) || 0)}
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
            onChange={(e) => onHeightChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor="sliding-panels">Hojas Corredizas</Label>
          <Input
            id="sliding-panels"
            type="number"
            min="1"
            value={slidingPanels}
            onChange={(e) => onSlidingPanelsChange(parseInt(e.target.value) || 1)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
