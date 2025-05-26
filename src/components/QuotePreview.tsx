
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, Calendar, User, Phone, Mail, MapPin } from 'lucide-react';
import { Customer, Product } from '@/pages/Index';

interface QuotePreviewProps {
  customer: Customer | null;
  products: Product[];
  total: number;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ customer, products, total }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const calculateProductPrice = (product: Product) => {
    const area = product.width * product.height;
    return product.basePrice * area * product.quantity;
  };

  if (!customer && products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Complete los datos del cliente y añada productos para ver la vista previa</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <div className="flex items-center justify-center mb-2">
          <Building2 className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">VIDRIERÍA PROFESIONAL</h2>
        </div>
        <p className="text-gray-600">Av. Principal 123 - Lima, Perú</p>
        <p className="text-gray-600">Tel: (01) 234-5678 | Email: ventas@vidrieria.pe</p>
      </div>

      {/* Date and Quote Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Fecha: {currentDate}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold">COTIZACIÓN</p>
          <p className="text-xs text-gray-500">COT-{Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      <Separator />

      {/* Customer Info */}
      {customer && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            DATOS DEL CLIENTE
          </h3>
          <div className="bg-gray-50 p-3 rounded space-y-2">
            <p><strong>Nombre:</strong> {customer.name}</p>
            <p><strong>DNI/RUC:</strong> {customer.dni}</p>
            {customer.company && <p><strong>Empresa:</strong> {customer.company}</p>}
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{customer.address}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">DETALLE DE PRODUCTOS</h3>
          <div className="space-y-2">
            {products.map((product, index) => {
              const area = product.width * product.height;
              const productTotal = calculateProductPrice(product);
              
              return (
                <Card key={product.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">
                          Dimensiones: {product.width}m × {product.height}m = {area.toFixed(2)}m²
                        </p>
                        <p className="text-xs text-gray-600">
                          Cantidad: {product.quantity} unidad{product.quantity > 1 ? 'es' : ''}
                        </p>
                        <p className="text-xs text-gray-600">
                          Precio unitario: S/. {product.basePrice}/m²
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">
                          S/. {productTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      {products.length > 0 && (
        <>
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>TOTAL:</span>
            <span className="text-blue-600">S/. {total.toFixed(2)}</span>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-500 pt-4 border-t">
        <p>• Esta cotización tiene validez de 30 días.</p>
        <p>• Los precios incluyen IGV.</p>
        <p>• Tiempo de entrega: 7 a 15 días hábiles.</p>
        <p>• Se requiere adelanto del 50% para iniciar producción.</p>
      </div>
    </div>
  );
};
