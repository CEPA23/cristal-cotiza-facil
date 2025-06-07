
import { TransformableProduct } from '@/types/product';

export interface TransformableProductConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: TransformableProduct) => void;
  productName: string;
  glassType: string;
  thickness: number;
}
