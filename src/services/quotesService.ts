import { supabase } from '@/integrations/supabase/client';
import { Quote, Customer } from '@/pages/Index';
import { Product } from '@/types/product';

export const quotesService = {
  async createQuote(quote: Quote): Promise<{ error: Error | null }> {
    try {
      // Primero, crear o buscar el cliente
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('dni', quote.customer.dni)
        .maybeSingle();

      let customerId: string;

      if (existingCustomer) {
        customerId = existingCustomer.id;
        // Actualizar información del cliente
        await supabase
          .from('customers')
          .update({
            name: quote.customer.name,
            email: quote.customer.email,
            phone: quote.customer.phone,
            address: quote.customer.address,
            company: quote.customer.company
          })
          .eq('id', customerId);
      } else {
        // Crear nuevo cliente
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            dni: quote.customer.dni,
            name: quote.customer.name,
            email: quote.customer.email,
            phone: quote.customer.phone,
            address: quote.customer.address,
            company: quote.customer.company
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Crear la cotización
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert({
          id: quote.id,
          customer_id: customerId,
          date: quote.date,
          total: quote.total,
          status: quote.status,
          rejection_reason: quote.rejectionReason,
          seller: quote.seller
        });

      if (quoteError) throw quoteError;

      // Crear los productos de la cotización
      const productInserts = quote.products.map(product => ({
        quote_id: quote.id,
        product_data: product as any
      }));

      const { error: productsError } = await supabase
        .from('quote_products')
        .insert(productInserts);

      if (productsError) throw productsError;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getAllQuotes(): Promise<{ data: Quote[] | null; error: Error | null }> {
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Obtener los productos de cada cotización
      const quotes: Quote[] = await Promise.all(
        quotesData.map(async (quoteData) => {
          const { data: productsData } = await supabase
            .from('quote_products')
            .select('product_data')
            .eq('quote_id', quoteData.id);

          const products = productsData?.map(p => p.product_data as any as Product) || [];

          return {
            id: quoteData.id,
            customer: {
              dni: quoteData.customer.dni,
              name: quoteData.customer.name,
              email: quoteData.customer.email || '',
              phone: quoteData.customer.phone || '',
              address: quoteData.customer.address || '',
              company: quoteData.customer.company || ''
            },
            products,
            date: quoteData.date,
            total: Number(quoteData.total),
            status: quoteData.status as Quote['status'],
            rejectionReason: quoteData.rejection_reason || undefined,
            seller: quoteData.seller || undefined
          };
        })
      );

      return { data: quotes, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async updateQuoteStatus(
    quoteId: string,
    status: Quote['status'],
    rejectionReason?: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status,
          rejection_reason: status === 'Rechazado' ? rejectionReason : null
        })
        .eq('id', quoteId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async updateQuote(quote: Quote): Promise<{ error: Error | null }> {
    try {
      // Actualizar cliente
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('dni', quote.customer.dni)
        .single();

      if (customerData) {
        await supabase
          .from('customers')
          .update({
            name: quote.customer.name,
            email: quote.customer.email,
            phone: quote.customer.phone,
            address: quote.customer.address,
            company: quote.customer.company
          })
          .eq('id', customerData.id);
      }

      // Actualizar cotización
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({
          date: quote.date,
          total: quote.total,
          status: quote.status,
          rejection_reason: quote.rejectionReason,
          seller: quote.seller
        })
        .eq('id', quote.id);

      if (quoteError) throw quoteError;

      // Eliminar productos existentes
      await supabase
        .from('quote_products')
        .delete()
        .eq('quote_id', quote.id);

      // Insertar nuevos productos
      const productInserts = quote.products.map(product => ({
        quote_id: quote.id,
        product_data: product as any
      }));

      const { error: productsError } = await supabase
        .from('quote_products')
        .insert(productInserts);

      if (productsError) throw productsError;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
};
