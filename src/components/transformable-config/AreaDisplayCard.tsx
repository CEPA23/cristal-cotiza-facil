
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AreaDisplayCardProps {
  area: number;
}

export const AreaDisplayCard: React.FC<AreaDisplayCardProps> = ({ area }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-600">
            Área total: {area.toFixed(2)} m²
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
