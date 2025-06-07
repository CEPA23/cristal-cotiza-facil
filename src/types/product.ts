
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
}

export interface TransformableProduct extends BaseProduct {
  type: 'transformable';
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
  { name: 'Vidrio (por plancha)', price: 120.00, quantity: 1 },
  { name: 'Silicona', price: 12.00, quantity: 1 },
  { name: 'Felpa (Flo/Fs)', price: 8.00, quantity: 2 },
  { name: 'Ensamblaje', price: 150.00, quantity: 1 },
  { name: 'Ángulos Martinelli', price: 5.00, quantity: 4, minQuantity: 4, isRequired: true }
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
  { name: 'Mampara Serie 62', series: 'serie-62' as const }
];
