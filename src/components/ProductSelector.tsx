
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, Plus, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/pages/Index';

const PRODUCT_TYPES = [
  { id: 'templado', name: 'Vidrio Templado' },
  { id: 'laminado', name: 'Vidrio Laminado' },
  { id: 'espejo', name: 'Espejo' },
  { id: 'flotado', name: 'Vidrio Flotado' },
  { id: 'doble', name: 'Doble Vidrio Hermético' },
  { id: 'acustico', name: 'Vidrio Acústico' },
];

const UNIT_OF_MEASURE = [
  { id: 'unidad', name: 'Unidad' },
  { id: 'docena', name: 'Docena' },
  { id: 'caja', name: 'Caja' },
  { id: 'm2', name: 'Metro cuadrado (m²)' },
  { id: 'ml', name: 'Metro lineal (ml)' },
  { id: 'kg', name: 'Kilogramo (kg)' },
];

interface ProductSelectorProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ products, onProductsChange }) => {
  const [open, setOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTypeName, setSelectedTypeName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [price, setPrice] = useState('');

  const addProduct = () => {
    if (!selectedType || !unitOfMeasure || !price) return;

    const newProduct: Product = {
      id: `${Date.now()}-${Math.random()}`,
      name: selectedTypeName,
      basePrice: parseFloat(price),
      width: 1,
      height: 1,
      quantity: parseInt(quantity),
      customSize: true,
      unitOfMeasure
    };

    onProductsChange([...products, newProduct]);
    
    // Reset form
    setSelectedType('');
    setSelectedTypeName('');
    setQuantity('1');
    setUnitOfMeasure('');
    setPrice('');
  };

  const removeProduct = (id: string) => {
    onProductsChange(products.filter(p => p.id !== id));
  };

  const calculateProductPrice = (product: Product) => {
    return product.basePrice * product.quantity;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-type">Tipo de Producto</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedTypeName || "Seleccionar producto..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar producto..." />
                <CommandList>
                  <CommandEmpty>No se encontró el producto.</CommandEmpty>
                  <CommandGroup>
                    {PRODUCT_TYPES.map((type) => (
                      <CommandItem
                        key={type.id}
                        value={type.name}
                        onSelect={() => {
                          setSelectedType(type.id);
                          setSelectedTypeName(type.name);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedType === type.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {type.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="unit">Unidad de Medida</Label>
          <Popover open={unitOpen} onOpenChange={setUnitOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
              >
                {unitOfMeasure ? UNIT_OF_MEASURE.find(u => u.id === unitOfMeasure)?.name : "Seleccionar unidad..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar unidad..." />
                <CommandList>
                  <CommandEmpty>No se encontró la unidad.</CommandEmpty>
                  <CommandGroup>
                    {UNIT_OF_MEASURE.map((unit) => (
                      <CommandItem
                        key={unit.id}
                        value={unit.name}
                        onSelect={() => {
                          setUnitOfMeasure(unit.id);
                          setUnitOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            unitOfMeasure === unit.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {unit.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="price">Precio (S/.)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: 45.50"
          />
        </div>
      </div>

      <div className="flex items-end">
        <Button onClick={addProduct} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Producto
        </Button>
      </div>

      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Productos Añadidos:</h3>
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Cantidad: {product.quantity} | {product.unitOfMeasure}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      S/. {calculateProductPrice(product).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
