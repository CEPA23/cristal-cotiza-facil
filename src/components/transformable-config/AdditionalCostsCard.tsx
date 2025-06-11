
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

interface AdditionalCostsCardProps {
  laborCost: number;
  profitMarginPercentage: number;
  travelExpenses: number;
  subtotal: number;
  onLaborCostChange: (value: number) => void;
  onProfitMarginPercentageChange: (value: number) => void;
  onTravelExpensesChange: (value: number) => void;
}

export const AdditionalCostsCard: React.FC<AdditionalCostsCardProps> = ({
  laborCost,
  profitMarginPercentage,
  travelExpenses,
  subtotal,
  onLaborCostChange,
  onProfitMarginPercentageChange,
  onTravelExpensesChange
}) => {
  const profitMarginAmount = (subtotal + laborCost + travelExpenses) * (profitMarginPercentage / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-4 w-4 mr-2" />
          Costos Adicionales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="laborCost">Mano de Obra (S/.)</Label>
          <Input
            id="laborCost"
            type="number"
            value={laborCost}
            onChange={(e) => onLaborCostChange(Number(e.target.value))}
            min="0"
            step="10"
          />
        </div>
        
        <div>
          <Label htmlFor="profitMargin">Ganancia (%)</Label>
          <Input
            id="profitMargin"
            type="number"
            value={profitMarginPercentage}
            onChange={(e) => onProfitMarginPercentageChange(Number(e.target.value))}
            min="0"
            max="100"
            step="1"
          />
          <p className="text-sm text-gray-600 mt-1">
            Ganancia calculada: S/. {profitMarginAmount.toFixed(2)}
          </p>
        </div>
        
        <div>
          <Label htmlFor="travelExpenses">Viáticos (S/.)</Label>
          <Input
            id="travelExpenses"
            type="number"
            value={travelExpenses}
            onChange={(e) => onTravelExpensesChange(Number(e.target.value))}
            min="0"
            step="10"
          />
        </div>
      </CardContent>
    </Card>
  );
};
