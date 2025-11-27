import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, Calendar, User, Phone, Mail, MapPin, Truck, UserCheck, Car } from 'lucide-react';
import { Customer } from '@/pages/Index';
import { Product } from '@/types/product';

interface QuotePreviewProps {
  customer: Customer | null;
  products: Product[];
  total: number;
  shippingService?: string;
  shippingCost?: number;
  travelExpenses?: number;
  seller?: string;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ 
  customer, 
  products, 
  total, 
  shippingService, 
  shippingCost = 0,
  travelExpenses = 0,
  seller = "Carlos Porras"
}) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const calculateProductPrice = (product: Product) => {
    if (product.type === 'transformable') {
      // For transformable products, the total cost is already calculated in the configuration
      return product.configuration.materialsCost + product.configuration.laborCost + product.configuration.profitMargin + product.configuration.travelExpenses;
    }
    // For non-transformable products, calculate based on area
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

  const subtotal = products.reduce((sum, product) => sum + calculateProductPrice(product), 0);

  return (
    <div className="space-y-4 text-sm print:bg-white print:shadow-none">
      {/* Header - Mejorado para impresión */}
      <div className="text-center border-b-2 border-blue-600 pb-6 print:border-black print:pb-4">
        <div className="flex items-center justify-center mb-3 print:mb-2">
          <Building2 className="h-10 w-10 text-blue-600 mr-3 print:text-black" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 print:text-black print:text-xl">VIDRIERÍA PROFESIONAL</h2>
            <p className="text-sm text-gray-600 print:text-black">Especialistas en Vidrio y Cristal</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 print:text-black print:text-xs">
          <div>
            <p><strong>Dirección:</strong> Av. Principal 123 - Lima, Perú</p>
            <p><strong>Teléfono:</strong> (01) 234-5678</p>
          </div>
          <div>
            <p><strong>Email:</strong> ventas@vidrieria.pe</p>
            <p><strong>RUC:</strong> 20123456789</p>
          </div>
        </div>
      </div>

      {/* Date, Quote Info and Seller */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
        <div className="flex items-center text-gray-600 print:text-black">
          <Calendar className="h-4 w-4 mr-2 print:h-3 print:w-3" />
          <div>
            <p className="font-semibold">Fecha:</p>
            <p className="text-xs">{currentDate}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-blue-600 print:text-black">COTIZACIÓN</p>
          <p className="text-sm text-gray-500 print:text-black">COT-{Date.now().toString().slice(-6)}</p>
        </div>
        <div className="flex items-center justify-end text-gray-600 print:text-black print:justify-start">
          <UserCheck className="h-4 w-4 mr-2 print:h-3 print:w-3" />
          <div>
            <p className="font-semibold">Vendedor:</p>
            <p className="text-xs">{seller}</p>
          </div>
        </div>
      </div>

      <Separator className="print:border-black" />

      {/* Customer Info - Mejorado para impresión */}
      {customer && (
        <div className="print:break-inside-avoid">
          <h3 className="font-semibold mb-3 flex items-center text-blue-600 print:text-black">
            <User className="h-4 w-4 mr-2" />
            DATOS DEL CLIENTE
          </h3>
          <div className="bg-gray-50 p-4 rounded border print:bg-white print:border print:border-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2 print:gap-2">
              <div>
                <p className="print:text-xs"><strong>Nombre:</strong> {customer.name}</p>
                <p className="print:text-xs"><strong>DNI/RUC:</strong> {customer.dni}</p>
                {customer.company && <p className="print:text-xs"><strong>Empresa:</strong> {customer.company}</p>}
              </div>
              <div>
                {customer.phone && (
                  <div className="flex items-center print:text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center print:text-xs">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center print:text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products - Mejorado para impresión */}
      {products.length > 0 && (
        <div className="print:break-inside-avoid">
          <h3 className="font-semibold mb-3 text-blue-600 print:text-black">DETALLE DE PRODUCTOS</h3>
          <div className="space-y-2">
            {products.map((product, index) => {
              const productTotal = calculateProductPrice(product);
              
              return (
                <div key={product.id} className="border rounded p-3 bg-white print:border-black print:rounded-none">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium print:text-sm">{product.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 print:text-black mt-1">
                        {product.type === 'transformable' ? (
                          <>
                            <p>Tipo: Transformable</p>
                            <p>Cantidad: {product.quantity} unidad{product.quantity > 1 ? 'es' : ''}</p>
                            <p>Dimensiones: {product.configuration.width}m × {product.configuration.height}m</p>
                            <p>Área: {product.configuration.area.toFixed(2)}m²</p>
                            <p>Tipo de vidrio: {product.glassType}</p>
                            <p>Espesor: {product.thickness}mm</p>
                            <p className="font-semibold text-blue-600 print:text-black">
                              Total: S/. {productTotal.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Dimensiones: {product.width}m × {product.height}m = {(product.width * product.height).toFixed(2)}m²</p>
                            <p>Cantidad: {product.quantity} unidad{product.quantity > 1 ? 'es' : ''}</p>
                            <p>Precio base: S/. {product.basePrice}/m²</p>
                            <p className="font-semibold text-blue-600 print:text-black">
                              Total: S/. {productTotal.toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shipping Services */}
      {shippingService && (
        <div className="print:break-inside-avoid">
          <h3 className="font-semibold mb-3 flex items-center text-blue-600 print:text-black">
            <Truck className="h-4 w-4 mr-2" />
            SERVICIO DE ENVÍO
          </h3>
          <div className="bg-gray-50 p-3 rounded border print:bg-white print:border print:border-black">
            <div className="flex justify-between items-center">
              <span className="print:text-sm">{shippingService}</span>
              <span className="font-semibold print:text-sm">S/. {shippingCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Travel Expenses */}
      {travelExpenses > 0 && (
        <div className="print:break-inside-avoid">
          <h3 className="font-semibold mb-3 flex items-center text-blue-600 print:text-black">
            <Car className="h-4 w-4 mr-2" />
            VIÁTICOS
          </h3>
          <div className="bg-gray-50 p-3 rounded border print:bg-white print:border print:border-black">
            <div className="flex justify-between items-center">
              <span className="print:text-sm">Gastos de viaje</span>
              <span className="font-semibold print:text-sm">S/. {travelExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Total - Mejorado para impresión */}
      {products.length > 0 && (
        <div className="print:break-inside-avoid">
          <Separator className="print:border-black" />
          <div className="space-y-2 bg-blue-50 p-4 rounded print:bg-white print:border print:border-black">
            <div className="flex justify-between items-center print:text-sm">
              <span>Subtotal:</span>
              <span>S/. {subtotal.toFixed(2)}</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between items-center print:text-sm">
                <span>Envío:</span>
                <span>S/. {shippingCost.toFixed(2)}</span>
              </div>
            )}
            {travelExpenses > 0 && (
              <div className="flex justify-between items-center print:text-sm">
                <span>Viáticos:</span>
                <span>S/. {travelExpenses.toFixed(2)}</span>
              </div>
            )}
            <Separator className="print:border-black" />
            <div className="flex justify-between items-center text-xl font-bold border-t pt-2 text-blue-600 print:text-black print:text-lg">
              <span>TOTAL:</span>
              <span>S/. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Mejorado para impresión */}
      <div className="text-xs text-gray-500 pt-4 border-t space-y-1 print:text-black print:border-black print:text-xs">
        <p>• Esta cotización tiene validez de 30 días calendario.</p>
        <p>• Los precios incluyen IGV (18%).</p>
        <p>• Tiempo de entrega: 7 a 15 días hábiles desde la confirmación del pedido.</p>
        <p>• Se requiere adelanto del 50% para iniciar producción.</p>
        <p>• Garantía de 12 meses en productos y 6 meses en instalación.</p>
        <div className="mt-4 pt-2 border-t print:border-black">
          <p className="font-semibold">Atendido por: {seller}</p>
          <p>¡Gracias por confiar en nosotros!</p>
        </div>
      </div>
    </div>
  );
};
