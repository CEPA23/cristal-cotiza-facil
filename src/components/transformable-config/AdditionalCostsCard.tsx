
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdditionalCostsCardProps {
  laborCost: number;
  profitMargin: number;
  travelExpenses: number;
  onLaborCostChange: (value: number) => void;
  onProfitMarginChange: (value: number) => void;
  onTravelExpensesChange: (value: number) => void;
}

export const AdditionalCostsCard: React.FC<AdditionalCostsCardProps> = ({
  laborCost,
  profitMargin,
  travelExpenses,
  onLaborCostChange,
  onProfitMarginChange,
  onTravelExpensesChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Costos Adicionales</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="labor-cost">Mano de Obra (S/.)</Label>
          <Input
            id="labor-cost"
            type="number"
            step="0.01"
            min="0"
            value={laborCost}
            onChange={(e) => onLaborCostChange(parseFloat(e.target.value) || 0)}
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
            onChange={(e) => onProfitMarginChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor="travel-expenses">Viáticos (S/.)</Label>
          <Input
            id="travel-expenses"
            type="number"
            step="0.01"
            min="0"
            value={travelExpenses}
            onChange={(e) => onTravelExpensesChange(parseFloat(e.target.value) || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
