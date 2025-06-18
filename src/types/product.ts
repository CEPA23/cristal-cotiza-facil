
export interface BaseProduct {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  unitOfMeasure: string;
  type: 'transformable' | 'no-transformable';
}

export interface NonTransformableProduct extends BaseProduct {
  type: 'no-transformable';
  width: number;
  height: number;
  glassType: string;
  thickness: number; // in mm
  glassTypeMultiplier?: number;
}

export interface TransformableProduct extends BaseProduct {
  type: 'transformable';
  glassType: string;
  thickness: number; // in mm
  configuration: {
    series: 'serie-62';
    divisions: number;
    width: number;
    height: number;
    slidingPanels: number;
    area: number;
    components: Serie62Component[];
    laborCost: number;
    profitMargin: number;
    travelExpenses: number;
    glassArea: number;
    glassCostPerM2: number;
    glassTotalCost: number;
    materialsCost: number;
    agreedPrice?: number;
    realProfit?: number;
    realProfitPercentage?: number;
  };
}

export interface Serie62Component {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isSelected: boolean;
  isRequired?: boolean;
  minQuantity?: number;
}

export type Product = NonTransformableProduct | TransformableProduct;

export const SERIE_62_COMPONENTS: Omit<Serie62Component, 'id' | 'isSelected'>[] = [
  { name: 'Marco Doble', price: 45.00, quantity: 1 },
  { name: 'Traslape', price: 25.00, quantity: 1 },
  { name: 'Marco de hoja', price: 35.00, quantity: 1 },
  { name: 'Garrucha simple', price: 15.00, quantity: 4 },
  { name: 'Guía', price: 30.00, quantity: 2 },
  { name: 'Manija redonda', price: 20.00, quantity: 2 },
  { name: 'Cremona', price: 40.00, quantity: 1 },
  { name: 'Silicona', price: 12.00, quantity: 1 },
  { name: 'Felpa (Flo/Fs)', price: 8.00, quantity: 2 },
  { name: 'Ensamblaje', price: 150.00, quantity: 1 },
  { name: 'Ángulos Martinelli', price: 5.00, quantity: 4, minQuantity: 4, isRequired: true }
];

// Tipos de vidrio específicos para mamparas (sin multiplicador)
export const MAMPARA_GLASS_TYPES = [
  { name: 'Vidrio Crudo', category: 'mampara' },
  { name: 'Vidrio Templado', category: 'mampara' },
  { name: 'Vidrio Laminado', category: 'mampara' }
];

// Precios por espesor y tipo de vidrio para mamparas (en soles por m²)
export const MAMPARA_GLASS_PRICES: Record<string, Record<number, number>> = {
  'Vidrio Crudo': {
    3: 45.00,
    4: 55.00,
    5: 65.00,
    6: 75.00,
    8: 95.00,
    10: 115.00,
    12: 135.00
  },
  'Vidrio Templado': {
    3: 85.00,
    4: 95.00,
    5: 105.00,
    6: 115.00,
    8: 135.00,
    10: 155.00,
    12: 175.00
  },
  'Vidrio Laminado': {
    3: 125.00,
    4: 135.00,
    5: 145.00,
    6: 155.00,
    8: 175.00,
    10: 195.00,
    12: 215.00
  }
};

export const GLASS_TYPES = [
  { name: 'Vidrio Crudo', multiplier: 1.0 },
  { name: 'Vidrio Templado', multiplier: 2.0 },
  { name: 'Vidrio Laminado', multiplier: 2.5 },
  { name: 'Espejo', multiplier: 1.3 },
  { name: 'Vidrio Flotado', multiplier: 1.0 },
  { name: 'Doble Vidrio Hermético', multiplier: 3.3 },
  { name: 'Vidrio Acústico', multiplier: 4.2 }
];

export const GLASS_THICKNESS = [
  { thickness: 3, name: '3mm' },
  { thickness: 4, name: '4mm' },
  { thickness: 5, name: '5mm' },
  { thickness: 6, name: '6mm' },
  { thickness: 8, name: '8mm' },
  { thickness: 10, name: '10mm' },
  { thickness: 12, name: '12mm' }
];

export const NON_TRANSFORMABLE_PRODUCTS = [
  { name: 'Vidrio Templado', price: 120.00, unitOfMeasure: 'm2' },
  { name: 'Vidrio Laminado', price: 150.00, unitOfMeasure: 'm2' },
  { name: 'Espejo', price: 80.00, unitOfMeasure: 'm2' },
  { name: 'Vidrio Flotado', price: 60.00, unitOfMeasure: 'm2' },
  { name: 'Doble Vidrio Hermético', price: 200.00, unitOfMeasure: 'm2' },
  { name: 'Vidrio Acústico', price: 250.00, unitOfMeasure: 'm2' }
];

export const TRANSFORMABLE_PRODUCTS = [
  { name: 'Mampara Serie 62', series: 'serie-62' as const, category: 'Mamparas' }
];

export const TRANSFORMABLE_CATEGORIES = [
  'Mamparas',
  'Puertas',
  'Ventanas'
];
