

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, UserPlus, AlertCircle } from 'lucide-react';
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
  const [errors, setErrors] = useState<{ dni?: string; email?: string; phone?: string }>({});
  const { toast } = useToast();

  // Validaciones
  const validateDni = (value: string): string | undefined => {
    if (value && !/^\d+$/.test(value)) {
      return 'Solo se permiten números';
    }
    if (value && value.length > 11) {
      return 'Máximo 11 dígitos';
    }
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (value && !value.endsWith('@gmail.com')) {
      return 'El correo debe terminar en @gmail.com';
    }
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    if (value && !/^\d+$/.test(value)) {
      return 'Solo se permiten números';
    }
    if (value && value.length !== 9 && value.length > 0) {
      return 'Debe tener exactamente 9 dígitos';
    }
    return undefined;
  };

  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 9);
    const error = validatePhone(cleanValue);
    setErrors(prev => ({ ...prev, phone: error }));
    handleInputChange('phone', cleanValue);
  };

  const handleDniChange = (value: string) => {
    // Solo permitir números y máximo 11 dígitos
    const cleanValue = value.replace(/\D/g, '').slice(0, 11);
    setSearchDni(cleanValue);
    setErrors(prev => ({ ...prev, dni: validateDni(cleanValue) }));
  };

  const handleCustomerDniChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 11);
    const error = validateDni(cleanValue);
    setErrors(prev => ({ ...prev, dni: error }));
    handleInputChange('dni', cleanValue);
  };

  const handleEmailChange = (value: string) => {
    const error = validateEmail(value);
    setErrors(prev => ({ ...prev, email: error }));
    handleInputChange('email', value);
  };

  const searchCustomer = () => {
    if (!searchDni) return;

    const dniError = validateDni(searchDni);
    if (dniError) {
      toast({
        title: "Error de validación",
        description: dniError,
        variant: "destructive"
      });
      return;
    }

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

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
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

    // Validar email si está presente
    if (customer.email) {
      const emailError = validateEmail(customer.email);
      if (emailError) {
        toast({
          title: "Error de validación",
          description: emailError,
          variant: "destructive"
        });
        return;
      }
    }

    // Validar teléfono
    const phoneError = validatePhone(customer.phone);
    if (phoneError) {
      toast({
        title: "Error de validación",
        description: phoneError,
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
            onChange={(e) => handleDniChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, searchCustomer)}
            placeholder="Ingresa DNI o RUC (máx. 11 dígitos)"
            maxLength={11}
          />
          {errors.dni && (
            <p className="text-xs text-red-500 mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.dni}
            </p>
          )}
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
                  onChange={(e) => handleCustomerDniChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveCustomer)}
                  placeholder="DNI o RUC (máx. 11 dígitos)"
                  maxLength={11}
                />
                {errors.dni && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.dni}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={customer.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveCustomer)}
                  placeholder="Nombre completo o razón social"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={customer.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveCustomer)}
                  placeholder="9 dígitos"
                  maxLength={9}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveCustomer)}
                  placeholder="correo@gmail.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={customer.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveCustomer)}
                  placeholder="Dirección completa"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input
                  id="company"
                  value={customer.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, saveCustomer)}
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
