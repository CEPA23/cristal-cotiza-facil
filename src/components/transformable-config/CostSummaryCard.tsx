
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CostSummaryCardProps {
  componentsSubtotal: number;
  laborCost: number;
  profitMargin: number;
  travelExpenses: number;
  glassTypeMultiplier: number;
  total: number;
}

export const CostSummaryCard: React.FC<CostSummaryCardProps> = ({
  componentsSubtotal,
  laborCost,
  profitMargin,
  travelExpenses,
  glassTypeMultiplier,
  total
}) => {
  return (
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
        <div className="flex justify-between">
          <span>Viáticos:</span>
          <span>S/. {travelExpenses.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Multiplicador Vidrio:</span>
          <span>x{glassTypeMultiplier}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold text-blue-600">
          <span>Total:</span>
          <span>S/. {(total * glassTypeMultiplier).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
