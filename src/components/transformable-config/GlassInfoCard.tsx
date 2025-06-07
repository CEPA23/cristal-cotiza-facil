
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface GlassInfoCardProps {
  glassType: string;
  thickness: number;
  glassTypeMultiplier: number;
}

export const GlassInfoCard: React.FC<GlassInfoCardProps> = ({
  glassType,
  thickness,
  glassTypeMultiplier
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Vidrio</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tipo de Vidrio</Label>
          <div className="p-2 bg-gray-50 rounded border">
            {glassType} (x{glassTypeMultiplier})
          </div>
        </div>
        <div>
          <Label>Espesor</Label>
          <div className="p-2 bg-gray-50 rounded border">
            {thickness}mm
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
