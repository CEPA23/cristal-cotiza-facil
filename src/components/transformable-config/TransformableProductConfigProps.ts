
import { TransformableProduct } from '@/types/product';

export interface TransformableProductConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: TransformableProduct) => void;
  productName: string;
  glassType: string;
  thickness: number;
  category?: 'Mamparas' | 'Puertas' | 'Ventanas';
  extraConfig?: {
    lockType?: string;
    frameType?: string;
    openingSystem?: string;
    width?: number;
    height?: number;
    glassPrice?: number;
  };
}
