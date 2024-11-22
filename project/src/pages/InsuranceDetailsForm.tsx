import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../components/FormLayout';
import InputField from '../components/InputField';
import AddCustomField from '../components/AddCustomField';
import { useFinanceStore } from '../store/financeStore';

interface CustomInsurance {
  name: string;
  coverage: string;
  premiumPerMonth: string;
}

export default function InsuranceDetailsForm() {
  const navigate = useNavigate();
  const setInsuranceDetails = useFinanceStore((state) => state.setInsuranceDetails);
  const existingData = useFinanceStore((state) => state.data.insurance);

  const [formData, setFormData] = useState({
    health: {
      coverage: existingData?.health?.coverage || '',
      premiumPerMonth: existingData?.health?.premiumPerMonth || '',
    },
    life: {
      coverage: existingData?.life?.coverage || '',
      premiumPerMonth: existingData?.life?.premiumPerMonth || '',
    },
    vehicle: {
      coverage: existingData?.vehicle?.coverage || '',
      premiumPerMonth: existingData?.vehicle?.premiumPerMonth || '',
    },
  });

  const [customInsurances, setCustomInsurances] = useState<CustomInsurance[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({});

  const handleBack = () => navigate('/investments');

  const validateForm = () => {
    const errors: { [key: string]: boolean } = {};
    let hasValues = false;

    // Check main insurance types
    Object.entries(formData).forEach(([type, details]) => {
      if (details.coverage || details.premiumPerMonth) {
        hasValues = true;
        if (!details.coverage || !details.premiumPerMonth) {
          errors[type] = true;
        }
      }
    });

    // Check custom insurances
    customInsurances.forEach((insurance, index) => {
      if (insurance.coverage || insurance.premiumPerMonth) {
        hasValues = true;
        if (!insurance.coverage || !insurance.premiumPerMonth) {
          errors[`custom_${index}`] = true;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const customData = customInsurances.reduce((acc, insurance) => ({
      ...acc,
      [insurance.name.toLowerCase().replace(/\s+/g, '_')]: {
        coverage: Number(insurance.coverage),
        premiumPerMonth: Number(insurance.premiumPerMonth),
      },
    }), {});

    setInsuranceDetails({
      health: {
        coverage: Number(formData.health.coverage),
        premiumPerMonth: Number(formData.health.premiumPerMonth),
      },
      life: {
        coverage: Number(formData.life.coverage),
        premiumPerMonth: Number(formData.life.premiumPerMonth),
      },
      vehicle: {
        coverage: Number(formData.vehicle.coverage),
        premiumPerMonth: Number(formData.vehicle.premiumPerMonth),
      },
      ...customData,
    });
    navigate('/summary');
  };

  const handleAddCustomInsurance = (label: string) => {
    setCustomInsurances([
      ...customInsurances,
      { name: label, coverage: '', premiumPerMonth: '' },
    ]);
  };

  return (
    <FormLayout
      title="Insurance Details"
      subtitle="Tell us about your insurance coverage (optional, but if providing insurance details, all fields for that insurance are required)"
      onBack={handleBack}
      onNext={handleSubmit}
    >
      <div className="space-y-6">
        {/* Health Insurance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Health Insurance</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Coverage Amount"
              type="number"
              value={formData.health.coverage}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  health: { ...formData.health, coverage: value },
                })
              }
              min={0}
              step="1000"
              error={formErrors.health ? "Both fields must be filled if one is provided" : ""}
            />
            <InputField
              label="Premium per Month"
              type="number"
              value={formData.health.premiumPerMonth}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  health: { ...formData.health, premiumPerMonth: value },
                })
              }
              min={0}
              step="10"
              error={formErrors.health ? "Both fields must be filled if one is provided" : ""}
            />
          </div>
        </div>

        {/* Life Insurance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Life Insurance</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Coverage Amount"
              type="number"
              value={formData.life.coverage}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  life: { ...formData.life, coverage: value },
                })
              }
              min={0}
              step="1000"
              error={formErrors.life ? "Both fields must be filled if one is provided" : ""}
            />
            <InputField
              label="Premium per Month"
              type="number"
              value={formData.life.premiumPerMonth}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  life: { ...formData.life, premiumPerMonth: value },
                })
              }
              min={0}
              step="10"
              error={formErrors.life ? "Both fields must be filled if one is provided" : ""}
            />
          </div>
        </div>

        {/* Vehicle Insurance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Vehicle Insurance</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Coverage Amount"
              type="number"
              value={formData.vehicle.coverage}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  vehicle: { ...formData.vehicle, coverage: value },
                })
              }
              min={0}
              step="1000"
              error={formErrors.vehicle ? "Both fields must be filled if one is provided" : ""}
            />
            <InputField
              label="Premium per Month"
              type="number"
              value={formData.vehicle.premiumPerMonth}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  vehicle: { ...formData.vehicle, premiumPerMonth: value },
                })
              }
              min={0}
              step="10"
              error={formErrors.vehicle ? "Both fields must be filled if one is provided" : ""}
            />
          </div>
        </div>

        {/* Custom Insurances */}
        {customInsurances.map((insurance, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{insurance.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Coverage Amount"
                type="number"
                value={insurance.coverage}
                onChange={(value) => {
                  const updated = [...customInsurances];
                  updated[index].coverage = value;
                  setCustomInsurances(updated);
                }}
                min={0}
                step="1000"
                error={formErrors[`custom_${index}`] ? "Both fields must be filled if one is provided" : ""}
              />
              <InputField
                label="Premium per Month"
                type="number"
                value={insurance.premiumPerMonth}
                onChange={(value) => {
                  const updated = [...customInsurances];
                  updated[index].premiumPerMonth = value;
                  setCustomInsurances(updated);
                }}
                min={0}
                step="10"
                error={formErrors[`custom_${index}`] ? "Both fields must be filled if one is provided" : ""}
              />
            </div>
          </div>
        ))}

        <AddCustomField onAdd={handleAddCustomInsurance} />
      </div>
    </FormLayout>
  );
}