
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
  { id: 'templado', name: 'Vidrio Templado', basePrice: 120, unitOfMeasure: 'm2' },
  { id: 'laminado', name: 'Vidrio Laminado', basePrice: 150, unitOfMeasure: 'm2' },
  { id: 'espejo', name: 'Espejo', basePrice: 80, unitOfMeasure: 'm2' },
  { id: 'flotado', name: 'Vidrio Flotado', basePrice: 60, unitOfMeasure: 'm2' },
  { id: 'doble', name: 'Doble Vidrio Hermético', basePrice: 200, unitOfMeasure: 'm2' },
  { id: 'acustico', name: 'Vidrio Acústico', basePrice: 250, unitOfMeasure: 'm2' },
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
  const [customProductName, setCustomProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [price, setPrice] = useState('');

  const handleProductSelect = (productType: typeof PRODUCT_TYPES[0]) => {
    setSelectedType(productType.id);
    setSelectedTypeName(productType.name);
    setCustomProductName(productType.name);
    setPrice(productType.basePrice.toString());
    setUnitOfMeasure(productType.unitOfMeasure);
    setOpen(false);
  };

  const handleCustomProductNameChange = (value: string) => {
    setCustomProductName(value);
    setSelectedTypeName(value);
    
    // Si coincide con un producto predefinido, cargar sus datos
    const matchedProduct = PRODUCT_TYPES.find(p => 
      p.name.toLowerCase().includes(value.toLowerCase()) || 
      value.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (matchedProduct && value.length > 3) {
      setPrice(matchedProduct.basePrice.toString());
      setUnitOfMeasure(matchedProduct.unitOfMeasure);
    }
  };

  const addProduct = () => {
    if (!customProductName.trim() || !unitOfMeasure || !price) return;

    const newProduct: Product = {
      id: `${Date.now()}-${Math.random()}`,
      name: customProductName.trim(),
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
    setCustomProductName('');
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
                className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300 transition-all duration-200"
              >
                {customProductName || "Seleccionar o escribir producto..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white shadow-lg border border-gray-200">
              <Command>
                <CommandInput 
                  placeholder="Buscar o escribir producto..." 
                  value={customProductName}
                  onValueChange={handleCustomProductNameChange}
                />
                <CommandList>
                  <CommandEmpty>
                    {customProductName && (
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setSelectedTypeName(customProductName);
                            setOpen(false);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Crear "{customProductName}"
                        </Button>
                      </div>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {PRODUCT_TYPES.map((type) => (
                      <CommandItem
                        key={type.id}
                        value={type.name}
                        onSelect={() => handleProductSelect(type)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedType === type.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">
                            S/. {type.basePrice} por {UNIT_OF_MEASURE.find(u => u.id === type.unitOfMeasure)?.name}
                          </div>
                        </div>
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
                className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300 transition-all duration-200"
              >
                {unitOfMeasure ? UNIT_OF_MEASURE.find(u => u.id === unitOfMeasure)?.name : "Seleccionar unidad..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white shadow-lg border border-gray-200">
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
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-end">
        <Button 
          onClick={addProduct} 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Añadir Producto
        </Button>
      </div>

      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Productos Añadidos:</h3>
          {products.map(product => (
            <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Cantidad: {product.quantity} | {UNIT_OF_MEASURE.find(u => u.id === product.unitOfMeasure)?.name}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      S/. {calculateProductPrice(product).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
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
