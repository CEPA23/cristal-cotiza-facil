
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Save, UserPlus } from 'lucide-react';
import { Customer } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface CustomerFormProps {
  onCustomerSelect: (customer: Customer) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onCustomerSelect }) => {
  const [searchDni, setSearchDni] = useState('');
  const [customer, setCustomer] = useState<Customer>({
    dni: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const { toast } = useToast();

  const searchCustomer = () => {
    if (!searchDni) return;

    // Buscar en localStorage
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const foundCustomer = customers.find((c: Customer) => c.dni === searchDni);

    if (foundCustomer) {
      setCustomer(foundCustomer);
      setIsNewCustomer(false);
      onCustomerSelect(foundCustomer);
      toast({
        title: "Cliente encontrado",
        description: `Datos de ${foundCustomer.name} cargados exitosamente.`,
      });
    } else {
      setCustomer({
        dni: searchDni,
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
      });
      setIsNewCustomer(true);
      toast({
        title: "Cliente no encontrado",
        description: "Puedes registrar un nuevo cliente con este DNI/RUC.",
        variant: "destructive"
      });
    }
  };

  const saveCustomer = () => {
    if (!customer.dni || !customer.name || !customer.phone) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa al menos DNI/RUC, nombre y teléfono.",
        variant: "destructive"
      });
      return;
    }

    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const existingIndex = customers.findIndex((c: Customer) => c.dni === customer.dni);

    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }

    localStorage.setItem('customers', JSON.stringify(customers));
    onCustomerSelect(customer);
    setIsNewCustomer(false);

    toast({
      title: "Cliente guardado",
      description: `Datos de ${customer.name} guardados exitosamente.`,
    });
  };

  const handleInputChange = (field: keyof Customer, value: string) => {
    const updatedCustomer = { ...customer, [field]: value };
    setCustomer(updatedCustomer);
    if (!isNewCustomer) {
      onCustomerSelect(updatedCustomer);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="search-dni">Buscar por DNI/RUC</Label>
          <Input
            id="search-dni"
            value={searchDni}
            onChange={(e) => setSearchDni(e.target.value)}
            placeholder="Ingresa DNI o RUC"
            maxLength={11}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={searchCustomer}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {(customer.dni || isNewCustomer) && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dni">DNI/RUC *</Label>
                <Input
                  id="dni"
                  value={customer.dni}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  placeholder="DNI o RUC"
                  maxLength={11}
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={customer.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nombre completo o razón social"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Número de teléfono"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={customer.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input
                  id="company"
                  value={customer.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>

            {isNewCustomer && (
              <Button onClick={saveCustomer} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Guardar Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
