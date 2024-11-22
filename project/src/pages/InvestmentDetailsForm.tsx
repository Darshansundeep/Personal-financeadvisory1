import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../components/FormLayout';
import InputField from '../components/InputField';
import AddCustomField from '../components/AddCustomField';
import { useFinanceStore } from '../store/financeStore';

interface CustomInvestment {
  name: string;
  value: string;
  monthlyContribution: string;
}

export default function InvestmentDetailsForm() {
  const navigate = useNavigate();
  const setInvestmentDetails = useFinanceStore((state) => state.setInvestmentDetails);
  const existingData = useFinanceStore((state) => state.data.investments);

  const [formData, setFormData] = useState({
    stocks: {
      value: existingData?.stocks?.value || '',
      monthlyContribution: existingData?.stocks?.monthlyContribution || '',
    },
    mutualFunds: {
      value: existingData?.mutualFunds?.value || '',
      monthlyContribution: existingData?.mutualFunds?.monthlyContribution || '',
    },
    bonds: {
      value: existingData?.bonds?.value || '',
      monthlyContribution: existingData?.bonds?.monthlyContribution || '',
    },
    realEstate: {
      value: existingData?.realEstate?.value || '',
      monthlyIncome: existingData?.realEstate?.monthlyIncome || '',
    },
    retirement: {
      value: existingData?.retirement?.value || '',
      monthlyContribution: existingData?.retirement?.monthlyContribution || '',
    },
    crypto: {
      value: existingData?.crypto?.value || '',
      monthlyContribution: existingData?.crypto?.monthlyContribution || '',
    },
  });

  const [customInvestments, setCustomInvestments] = useState<CustomInvestment[]>([]);

  const handleBack = () => navigate('/loans');

  const handleSubmit = () => {
    const customData = customInvestments.reduce((acc, investment) => ({
      ...acc,
      [investment.name.toLowerCase().replace(/\s+/g, '_')]: {
        value: Number(investment.value),
        monthlyContribution: Number(investment.monthlyContribution),
      },
    }), {});

    setInvestmentDetails({
      stocks: {
        value: Number(formData.stocks.value),
        monthlyContribution: Number(formData.stocks.monthlyContribution),
      },
      mutualFunds: {
        value: Number(formData.mutualFunds.value),
        monthlyContribution: Number(formData.mutualFunds.monthlyContribution),
      },
      bonds: {
        value: Number(formData.bonds.value),
        monthlyContribution: Number(formData.bonds.monthlyContribution),
      },
      realEstate: {
        value: Number(formData.realEstate.value),
        monthlyIncome: Number(formData.realEstate.monthlyIncome),
      },
      retirement: {
        value: Number(formData.retirement.value),
        monthlyContribution: Number(formData.retirement.monthlyContribution),
      },
      crypto: {
        value: Number(formData.crypto.value),
        monthlyContribution: Number(formData.crypto.monthlyContribution),
      },
      ...customData,
    });
    navigate('/insurance');
  };

  const handleAddCustomInvestment = (label: string) => {
    setCustomInvestments([
      ...customInvestments,
      { name: label, value: '', monthlyContribution: '' },
    ]);
  };

  return (
    <FormLayout
      title="Investment Details"
      subtitle="Tell us about your investment portfolio"
      onBack={handleBack}
      onNext={handleSubmit}
    >
      <div className="space-y-6">
        {/* Stocks */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Stocks</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Value"
              type="number"
              value={formData.stocks.value}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  stocks: { ...formData.stocks, value: value },
                })
              }
              min={0}
              step="100"
            />
            <InputField
              label="Monthly Contribution"
              type="number"
              value={formData.stocks.monthlyContribution}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  stocks: { ...formData.stocks, monthlyContribution: value },
                })
              }
              min={0}
              step="10"
            />
          </div>
        </div>

        {/* Mutual Funds */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Mutual Funds</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Value"
              type="number"
              value={formData.mutualFunds.value}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  mutualFunds: { ...formData.mutualFunds, value: value },
                })
              }
              min={0}
              step="100"
            />
            <InputField
              label="Monthly Contribution"
              type="number"
              value={formData.mutualFunds.monthlyContribution}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  mutualFunds: { ...formData.mutualFunds, monthlyContribution: value },
                })
              }
              min={0}
              step="10"
            />
          </div>
        </div>

        {/* Bonds */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Bonds</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Value"
              type="number"
              value={formData.bonds.value}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  bonds: { ...formData.bonds, value: value },
                })
              }
              min={0}
              step="100"
            />
            <InputField
              label="Monthly Contribution"
              type="number"
              value={formData.bonds.monthlyContribution}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  bonds: { ...formData.bonds, monthlyContribution: value },
                })
              }
              min={0}
              step="10"
            />
          </div>
        </div>

        {/* Real Estate */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Real Estate</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Value"
              type="number"
              value={formData.realEstate.value}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  realEstate: { ...formData.realEstate, value: value },
                })
              }
              min={0}
              step="1000"
            />
            <InputField
              label="Monthly Rental Income"
              type="number"
              value={formData.realEstate.monthlyIncome}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  realEstate: { ...formData.realEstate, monthlyIncome: value },
                })
              }
              min={0}
              step="100"
            />
          </div>
        </div>

        {/* Retirement Accounts */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Retirement Accounts</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Value"
              type="number"
              value={formData.retirement.value}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  retirement: { ...formData.retirement, value: value },
                })
              }
              min={0}
              step="100"
            />
            <InputField
              label="Monthly Contribution"
              type="number"
              value={formData.retirement.monthlyContribution}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  retirement: { ...formData.retirement, monthlyContribution: value },
                })
              }
              min={0}
              step="10"
            />
          </div>
        </div>

        {/* Cryptocurrency */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Cryptocurrency</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Value"
              type="number"
              value={formData.crypto.value}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  crypto: { ...formData.crypto, value: value },
                })
              }
              min={0}
              step="100"
            />
            <InputField
              label="Monthly Contribution"
              type="number"
              value={formData.crypto.monthlyContribution}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  crypto: { ...formData.crypto, monthlyContribution: value },
                })
              }
              min={0}
              step="10"
            />
          </div>
        </div>

        {/* Custom Investments */}
        {customInvestments.map((investment, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{investment.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Current Value"
                type="number"
                value={investment.value}
                onChange={(value) => {
                  const updated = [...customInvestments];
                  updated[index].value = value;
                  setCustomInvestments(updated);
                }}
                min={0}
                step="100"
              />
              <InputField
                label="Monthly Contribution"
                type="number"
                value={investment.monthlyContribution}
                onChange={(value) => {
                  const updated = [...customInvestments];
                  updated[index].monthlyContribution = value;
                  setCustomInvestments(updated);
                }}
                min={0}
                step="10"
              />
            </div>
          </div>
        ))}

        <AddCustomField onAdd={handleAddCustomInvestment} />
      </div>
    </FormLayout>
  );
}