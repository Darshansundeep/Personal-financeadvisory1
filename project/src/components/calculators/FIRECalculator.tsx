import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InputField from '../InputField';

interface FIREData {
  year: number;
  portfolio: number;
  contributions: number;
  withdrawals: number;
}

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState('30');
  const [currentSavings, setCurrentSavings] = useState('100000');
  const [annualIncome, setAnnualIncome] = useState('80000');
  const [annualExpenses, setAnnualExpenses] = useState('50000');
  const [savingsRate, setSavingsRate] = useState('30');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [withdrawalRate, setWithdrawalRate] = useState('4');
  const [data, setData] = useState<FIREData[]>([]);

  const calculateFIRE = () => {
    const initialSavings = Number(currentSavings);
    const yearlyContribution = (Number(annualIncome) * Number(savingsRate)) / 100;
    const yearlyExpenses = Number(annualExpenses);
    const returnRate = Number(expectedReturn) / 100;
    const withdrawalRateDecimal = Number(withdrawalRate) / 100;

    // Calculate FIRE number (25x annual expenses by default - 4% rule)
    const fireNumber = yearlyExpenses / withdrawalRateDecimal;

    const newData: FIREData[] = [];
    let currentPortfolio = initialSavings;
    let year = 0;
    const maxYears = 50; // Prevent infinite loop

    while (currentPortfolio < fireNumber && year < maxYears) {
      year++;
      const investment = yearlyContribution;
      const returns = currentPortfolio * returnRate;
      currentPortfolio = currentPortfolio + returns + investment;

      newData.push({
        year: year + Number(currentAge),
        portfolio: currentPortfolio,
        contributions: initialSavings + yearlyContribution * year,
        withdrawals: yearlyExpenses,
      });
    }

    // Add 10 more years of retirement phase
    const retirementYears = 10;
    const retirementAge = year + Number(currentAge);
    
    for (let i = 1; i <= retirementYears; i++) {
      const withdrawals = yearlyExpenses;
      const returns = currentPortfolio * returnRate;
      currentPortfolio = currentPortfolio + returns - withdrawals;

      newData.push({
        year: retirementAge + i,
        portfolio: currentPortfolio,
        contributions: newData[newData.length - 1].contributions,
        withdrawals: yearlyExpenses,
      });
    }

    setData(newData);
  };

  useEffect(() => {
    calculateFIRE();
  }, [currentAge, currentSavings, annualIncome, annualExpenses, savingsRate, expectedReturn, withdrawalRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const yearsToFI = data.findIndex(
    (d) => d.portfolio >= Number(annualExpenses) / (Number(withdrawalRate) / 100)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Input Fields - 5 columns */}
        <div className="col-span-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Current Age"
              type="number"
              value={currentAge}
              onChange={setCurrentAge}
              min={18}
              max={90}
              required
            />
            <InputField
              label="Current Savings"
              type="number"
              value={currentSavings}
              onChange={setCurrentSavings}
              min={0}
              step="1000"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Annual Income"
              type="number"
              value={annualIncome}
              onChange={setAnnualIncome}
              min={0}
              step="1000"
              required
            />
            <InputField
              label="Annual Expenses"
              type="number"
              value={annualExpenses}
              onChange={setAnnualExpenses}
              min={0}
              step="1000"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <InputField
              label="Savings Rate (%)"
              type="number"
              value={savingsRate}
              onChange={setSavingsRate}
              min={1}
              max={90}
              required
            />
            <InputField
              label="Return Rate (%)"
              type="number"
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={1}
              max={15}
              required
            />
            <InputField
              label="Withdrawal Rate (%)"
              type="number"
              value={withdrawalRate}
              onChange={setWithdrawalRate}
              min={2}
              max={10}
              step="0.1"
              required
            />
          </div>
        </div>

        {/* Summary - 3 columns */}
        <div className="col-span-3 bg-gray-50 p-3 rounded-lg text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">FIRE Number:</span>
              <span className="font-medium">
                {formatCurrency(Number(annualExpenses) / (Number(withdrawalRate) / 100))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Years to FIRE:</span>
              <span className="font-medium">
                {yearsToFI === -1 ? 'N/A' : yearsToFI} years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FIRE Age:</span>
              <span className="font-medium">
                {yearsToFI === -1 ? 'N/A' : Number(currentAge) + yearsToFI}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Savings:</span>
              <span className="font-medium">
                {formatCurrency((Number(annualIncome) * Number(savingsRate)) / 100 / 12)}
              </span>
            </div>
          </div>
        </div>

        {/* Chart - 4 columns */}
        <div className="col-span-4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 15, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 11 }}
                label={{ value: 'Age', position: 'bottom', fontSize: 11 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                width={60}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Age ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="Portfolio"
                stroke="#4F46E5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="contributions"
                name="Contributions"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}