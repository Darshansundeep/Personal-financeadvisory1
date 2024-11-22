import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../components/FormLayout';
import CurrencyInput from '../components/CurrencyInput';
import AddCustomField from '../components/AddCustomField';
import { useFinanceStore } from '../store/financeStore';

interface CustomField {
  label: string;
  value: string;
}

export default function ExpenseDetailsForm() {
  const navigate = useNavigate();
  const setExpenseDetails = useFinanceStore((state) => state.setExpenseDetails);
  const existingData = useFinanceStore((state) => state.data.expenses);

  const [formData, setFormData] = useState({
    housing: existingData?.housing || '',
    utilities: existingData?.utilities || '',
    groceries: existingData?.groceries || '',
    transportation: existingData?.transportation || '',
    entertainment: existingData?.entertainment || '',
    miscellaneous: existingData?.miscellaneous || '',
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleBack = () => navigate('/income');
  
  const handleSubmit = () => {
    const customData = customFields.reduce((acc, field) => ({
      ...acc,
      [field.label.toLowerCase().replace(/\s+/g, '_')]: Number(field.value),
    }), {});

    setExpenseDetails({
      housing: Number(formData.housing),
      utilities: Number(formData.utilities),
      groceries: Number(formData.groceries),
      transportation: Number(formData.transportation),
      entertainment: Number(formData.entertainment),
      miscellaneous: Number(formData.miscellaneous),
      ...customData,
    });
    navigate('/loans');
  };

  const handleAddCustomField = (label: string) => {
    setCustomFields([...customFields, { label, value: '' }]);
  };

  const isValid = formData.housing && formData.utilities && formData.groceries;

  return (
    <FormLayout
      title="Monthly Expenses"
      subtitle="Let's break down your monthly expenses"
      onBack={handleBack}
      onNext={isValid ? handleSubmit : undefined}
    >
      <CurrencyInput
        label="Housing (Rent/Mortgage)"
        value={formData.housing}
        onChange={(value) => setFormData({ ...formData, housing: value })}
        required
        placeholder="1500.00"
      />
      <CurrencyInput
        label="Utilities"
        value={formData.utilities}
        onChange={(value) => setFormData({ ...formData, utilities: value })}
        required
        placeholder="200.00"
      />
      <CurrencyInput
        label="Groceries"
        value={formData.groceries}
        onChange={(value) => setFormData({ ...formData, groceries: value })}
        required
        placeholder="400.00"
      />
      <CurrencyInput
        label="Transportation"
        value={formData.transportation}
        onChange={(value) => setFormData({ ...formData, transportation: value })}
        placeholder="300.00"
      />
      <CurrencyInput
        label="Entertainment"
        value={formData.entertainment}
        onChange={(value) => setFormData({ ...formData, entertainment: value })}
        placeholder="200.00"
      />
      <CurrencyInput
        label="Miscellaneous"
        value={formData.miscellaneous}
        onChange={(value) => setFormData({ ...formData, miscellaneous: value })}
        placeholder="150.00"
      />

      {customFields.map((field, index) => (
        <CurrencyInput
          key={index}
          label={field.label}
          value={field.value}
          onChange={(value) => {
            const updatedFields = [...customFields];
            updatedFields[index].value = value;
            setCustomFields(updatedFields);
          }}
          placeholder="0.00"
        />
      ))}

      <AddCustomField onAdd={handleAddCustomField} />
    </FormLayout>
  );
}