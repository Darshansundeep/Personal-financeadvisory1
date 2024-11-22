import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../components/FormLayout';
import InputField from '../components/InputField';
import AddCustomField from '../components/AddCustomField';
import { useFinanceStore } from '../store/financeStore';

interface CustomField {
  label: string;
  value: string;
}

export default function IncomeDetailsForm() {
  const navigate = useNavigate();
  const setIncomeDetails = useFinanceStore((state) => state.setIncomeDetails);
  const existingData = useFinanceStore((state) => state.data.income);

  const [formData, setFormData] = useState({
    monthlySalary: existingData?.monthlySalary || '',
    additionalIncome: existingData?.additionalIncome || '',
    annualBonus: existingData?.annualBonus || '',
    currentSavings: existingData?.currentSavings || '',
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleBack = () => navigate('/personal');
  
  const handleSubmit = () => {
    const customData = customFields.reduce((acc, field) => ({
      ...acc,
      [field.label.toLowerCase().replace(/\s+/g, '_')]: Number(field.value),
    }), {});

    setIncomeDetails({
      monthlySalary: Number(formData.monthlySalary),
      additionalIncome: Number(formData.additionalIncome),
      annualBonus: Number(formData.annualBonus),
      currentSavings: Number(formData.currentSavings),
      ...customData,
    });
    navigate('/expenses');
  };

  const handleAddCustomField = (label: string) => {
    setCustomFields([...customFields, { label, value: '' }]);
  };

  const isValid = formData.monthlySalary && formData.currentSavings;

  return (
    <FormLayout
      title="Income Details"
      subtitle="Tell us about your income sources and savings"
      onBack={handleBack}
      onNext={isValid ? handleSubmit : undefined}
    >
      <InputField
        label="Monthly Salary"
        type="number"
        value={formData.monthlySalary}
        onChange={(value) => setFormData({ ...formData, monthlySalary: value })}
        required
        min={0}
        step="0.01"
        placeholder="5000.00"
      />
      <InputField
        label="Additional Monthly Income"
        type="number"
        value={formData.additionalIncome}
        onChange={(value) => setFormData({ ...formData, additionalIncome: value })}
        min={0}
        step="0.01"
        placeholder="1000.00"
      />
      <InputField
        label="Expected Annual Bonus"
        type="number"
        value={formData.annualBonus}
        onChange={(value) => setFormData({ ...formData, annualBonus: value })}
        min={0}
        step="0.01"
        placeholder="10000.00"
      />
      <InputField
        label="Current Savings"
        type="number"
        value={formData.currentSavings}
        onChange={(value) => setFormData({ ...formData, currentSavings: value })}
        required
        min={0}
        step="0.01"
        placeholder="25000.00"
      />

      {customFields.map((field, index) => (
        <InputField
          key={index}
          label={field.label}
          type="number"
          value={field.value}
          onChange={(value) => {
            const updatedFields = [...customFields];
            updatedFields[index].value = value;
            setCustomFields(updatedFields);
          }}
          min={0}
          step="0.01"
          placeholder="0.00"
        />
      ))}

      <AddCustomField onAdd={handleAddCustomField} />
    </FormLayout>
  );
}