import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Customer } from '@/pages/Index';
import { Product } from '@/types/product';

export interface QuoteData {
  customer: Customer;
  products: Product[];
  total: number;
  shippingService?: string;
  shippingCost?: number;
  travelExpenses?: number;
  seller?: string;
  quoteId?: string;
}

export const generateQuotePDF = async (quoteData: QuoteData): Promise<Blob> => {
  const { customer, products, total, shippingService, shippingCost = 0, travelExpenses = 0, seller = "Carlos Porras", quoteId } = quoteData;
  
  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const calculateProductPrice = (product: Product) => {
    if (product.type === 'transformable') {
      return product.basePrice;
    }
    // For non-transformable products, calculate based on area
    const area = product.width * product.height;
    return product.basePrice * area * product.quantity;
  };

  const subtotal = products.reduce((sum, product) => sum + calculateProductPrice(product), 0);

  // Crear el contenido HTML para el PDF
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; color: #333;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
          <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px;">V</div>
          <div>
            <h1 style="margin: 0; font-size: 28px; color: #1f2937;">VIDRIERÍA PROFESIONAL</h1>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Especialistas en Vidrio y Cristal</p>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; color: #6b7280;">
          <div style="text-align: left;">
            <p><strong>Dirección:</strong> Av. Principal 123 - Lima, Perú</p>
            <p><strong>Teléfono:</strong> (01) 234-5678</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Email:</strong> ventas@vidrieria.pe</p>
            <p><strong>RUC:</strong> 20123456789</p>
          </div>
        </div>
      </div>

      <!-- Date, Quote Info and Seller -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 12px;">
        <div>
          <p style="margin: 0; font-weight: bold; color: #374151;">Fecha:</p>
          <p style="margin: 5px 0 0 0; color: #6b7280;">${currentDate}</p>
        </div>
        <div style="text-align: center;">
          <p style="margin: 0; font-weight: bold; font-size: 18px; color: #2563eb;">COTIZACIÓN</p>
          <p style="margin: 5px 0 0 0; color: #6b7280;">${quoteId || `COT-${Date.now().toString().slice(-6)}`}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-weight: bold; color: #374151;">Vendedor:</p>
          <p style="margin: 5px 0 0 0; color: #6b7280;">${seller}</p>
        </div>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">DATOS DEL CLIENTE</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 12px;">
            <div>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${customer.name}</p>
              <p style="margin: 5px 0;"><strong>DNI/RUC:</strong> ${customer.dni}</p>
              ${customer.company ? `<p style="margin: 5px 0;"><strong>Empresa:</strong> ${customer.company}</p>` : ''}
            </div>
            <div>
              ${customer.phone ? `<p style="margin: 5px 0;"><strong>Teléfono:</strong> ${customer.phone}</p>` : ''}
              ${customer.email ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${customer.email}</p>` : ''}
              ${customer.address ? `<p style="margin: 5px 0;"><strong>Dirección:</strong> ${customer.address}</p>` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">DETALLE DE PRODUCTOS</h3>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Producto</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Especificaciones</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Cantidad</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Precio</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((product, index) => {
                const productTotal = calculateProductPrice(product);
                const isTransformable = product.type === 'transformable';
                
                return `
                  <tr style="${index % 2 === 0 ? 'background: #ffffff;' : 'background: #f9fafb;'}">
                    <td style="padding: 12px; font-size: 11px; border-bottom: 1px solid #f3f4f6;">${product.name}</td>
                    <td style="padding: 12px; text-align: center; font-size: 11px; border-bottom: 1px solid #f3f4f6;">
                      ${isTransformable ? 
                        'Configuración personalizada' : 
                        `${product.width}m × ${product.height}m<br><small style="color: #6b7280;">(${(product.width * product.height).toFixed(2)}m²)</small><br><small style="color: #6b7280;">${product.glassType} - ${product.thickness}mm</small>`
                      }
                    </td>
                    <td style="padding: 12px; text-align: center; font-size: 11px; border-bottom: 1px solid #f3f4f6;">${product.quantity}</td>
                    <td style="padding: 12px; text-align: center; font-size: 11px; border-bottom: 1px solid #f3f4f6;">
                      ${isTransformable ? 'Personalizado' : `S/. ${product.basePrice}`}
                    </td>
                    <td style="padding: 12px; text-align: right; font-size: 11px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #f3f4f6;">S/. ${productTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Additional Costs -->
      ${(shippingService || travelExpenses > 0) ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">COSTOS ADICIONALES</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${shippingService ? `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 10px;">
                <span>🚚 ${shippingService}</span>
                <span style="font-weight: bold;">S/. ${shippingCost.toFixed(2)}</span>
              </div>
            ` : ''}
            ${travelExpenses > 0 ? `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <span>🚗 Viáticos</span>
                <span style="font-weight: bold;">S/. ${travelExpenses.toFixed(2)}</span>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Total -->
      <div style="background: #f0f9ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px;">
          <span>Subtotal:</span>
          <span>S/. ${subtotal.toFixed(2)}</span>
        </div>
        ${shippingCost > 0 ? `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px;">
            <span>Envío:</span>
            <span>S/. ${shippingCost.toFixed(2)}</span>
          </div>
        ` : ''}
        ${travelExpenses > 0 ? `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px;">
            <span>Viáticos:</span>
            <span>S/. ${travelExpenses.toFixed(2)}</span>
          </div>
        ` : ''}
        <hr style="border: none; border-top: 1px solid #2563eb; margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: bold; color: #2563eb;">
          <span>TOTAL:</span>
          <span>S/. ${total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Footer -->
      <div style="font-size: 10px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; line-height: 1.5;">
        <p style="margin: 5px 0;">• Esta cotización tiene validez de 30 días calendario.</p>
        <p style="margin: 5px 0;">• Los precios incluyen IGV (18%).</p>
        <p style="margin: 5px 0;">• Tiempo de entrega: 7 a 15 días hábiles desde la confirmación del pedido.</p>
        <p style="margin: 5px 0;">• Se requiere adelanto del 50% para iniciar producción.</p>
        <p style="margin: 5px 0;">• Garantía de 12 meses en productos y 6 meses en instalación.</p>
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <p style="font-weight: bold; margin: 0;">Atendido por: ${seller}</p>
          <p style="margin: 5px 0 0 0;">¡Gracias por confiar en nosotros!</p>
        </div>
      </div>
    </div>
  `;

  // Crear un elemento temporal para renderizar el HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '800px';
  document.body.appendChild(tempDiv);

  try {
    // Capturar el elemento como imagen
    const canvas = await html2canvas(tempDiv, {
      width: 800,
      height: tempDiv.scrollHeight,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Crear el PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Añadir la primera página
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Añadir páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Convertir a blob
    const pdfBlob = pdf.output('blob');
    
    return pdfBlob;
  } finally {
    // Limpiar el elemento temporal
    document.body.removeChild(tempDiv);
  }
};

export const downloadQuotePDF = async (quoteData: QuoteData, filename?: string) => {
  try {
    const pdfBlob = await generateQuotePDF(quoteData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `cotizacion-${quoteData.quoteId || Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};
