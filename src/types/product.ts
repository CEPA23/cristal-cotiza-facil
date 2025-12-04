
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
}

export interface TransformableProduct extends BaseProduct {
  type: 'transformable';
  glassType: string;
  thickness: number; // in mm
  category?: 'Mamparas' | 'Puertas' | 'Ventanas';
  // Campos directos para Puertas/Ventanas (sin configuración Serie 62)
  lockType?: string;
  frameType?: string;
  openingSystem?: string;
  configuration: {
    series: 'serie-62' | 'none';
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
    // Campos para Puertas
    lockType?: string;
    frameType?: string;
    // Campos para Ventanas
    openingSystem?: string;
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

// Tipos de vidrio específicos para mamparas con formato correcto
export const MAMPARA_GLASS_TYPES = [
  { name: 'Vidrio crudo de 3mm', thickness: 3, category: 'mampara' },
  { name: 'Vidrio crudo de 4mm', thickness: 4, category: 'mampara' },
  { name: 'Vidrio crudo de 5mm', thickness: 5, category: 'mampara' },
  { name: 'Vidrio crudo de 6mm', thickness: 6, category: 'mampara' },
  { name: 'Vidrio crudo de 8mm', thickness: 8, category: 'mampara' },
  { name: 'Vidrio crudo de 10mm', thickness: 10, category: 'mampara' },
  { name: 'Vidrio crudo de 12mm', thickness: 12, category: 'mampara' },
  { name: 'Vidrio templado de 3mm', thickness: 3, category: 'mampara' },
  { name: 'Vidrio templado de 4mm', thickness: 4, category: 'mampara' },
  { name: 'Vidrio templado de 5mm', thickness: 5, category: 'mampara' },
  { name: 'Vidrio templado de 6mm', thickness: 6, category: 'mampara' },
  { name: 'Vidrio templado de 8mm', thickness: 8, category: 'mampara' },
  { name: 'Vidrio templado de 10mm', thickness: 10, category: 'mampara' },
  { name: 'Vidrio templado de 12mm', thickness: 12, category: 'mampara' },
  { name: 'Vidrio laminado de 3mm', thickness: 3, category: 'mampara' },
  { name: 'Vidrio laminado de 4mm', thickness: 4, category: 'mampara' },
  { name: 'Vidrio laminado de 5mm', thickness: 5, category: 'mampara' },
  { name: 'Vidrio laminado de 6mm', thickness: 6, category: 'mampara' },
  { name: 'Vidrio laminado de 8mm', thickness: 8, category: 'mampara' },
  { name: 'Vidrio laminado de 10mm', thickness: 10, category: 'mampara' },
  { name: 'Vidrio laminado de 12mm', thickness: 12, category: 'mampara' }
];

// Precios por tipo completo de vidrio para mamparas (en soles por m²)
export const MAMPARA_GLASS_PRICES: Record<string, number> = {
  'Vidrio crudo de 3mm': 45.00,
  'Vidrio crudo de 4mm': 55.00,
  'Vidrio crudo de 5mm': 65.00,
  'Vidrio crudo de 6mm': 75.00,
  'Vidrio crudo de 8mm': 95.00,
  'Vidrio crudo de 10mm': 115.00,
  'Vidrio crudo de 12mm': 135.00,
  'Vidrio templado de 3mm': 85.00,
  'Vidrio templado de 4mm': 95.00,
  'Vidrio templado de 5mm': 105.00,
  'Vidrio templado de 6mm': 115.00,
  'Vidrio templado de 8mm': 135.00,
  'Vidrio templado de 10mm': 155.00,
  'Vidrio templado de 12mm': 175.00,
  'Vidrio laminado de 3mm': 125.00,
  'Vidrio laminado de 4mm': 135.00,
  'Vidrio laminado de 5mm': 145.00,
  'Vidrio laminado de 6mm': 155.00,
  'Vidrio laminado de 8mm': 175.00,
  'Vidrio laminado de 10mm': 195.00,
  'Vidrio laminado de 12mm': 215.00
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
  { name: 'Mampara Serie 62', series: 'serie-62' as const, category: 'Mamparas' },
  { name: 'Puerta de Vidrio', series: 'serie-62' as const, category: 'Puertas' },
  { name: 'Ventana de Vidrio', series: 'serie-62' as const, category: 'Ventanas' }
];

export const TRANSFORMABLE_CATEGORIES = [
  'Mamparas',
  'Puertas',
  'Ventanas'
];

// Opciones para Puertas
export const LOCK_TYPES = [
  'Cerradura de cilindro',
  'Cerradura multipunto',
  'Cerradura eléctrica',
  'Cerradura magnética',
  'Sin cerradura'
];

export const FRAME_TYPES = [
  'Marco de aluminio',
  'Marco de PVC',
  'Marco de acero inoxidable',
  'Sin marco'
];

// Opciones para Ventanas
export const OPENING_SYSTEMS = [
  'Corrediza',
  'Proyectante',
  'Batiente',
  'Pivotante',
  'Fija',
  'Oscilobatiente'
];
