import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InputField from '../InputField';

interface InterestData {
  year: number;
  amount: number;
  interest: number;
  contributions: number;
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [time, setTime] = useState('10');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [compoundingFrequency, setCompoundingFrequency] = useState('12');
  const [data, setData] = useState<InterestData[]>([]);

  const calculateCompoundInterest = () => {
    const p = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(time);
    const m = Number(monthlyContribution);
    const n = Number(compoundingFrequency);

    const newData: InterestData[] = [];
    let totalContributions = p;
    let previousAmount = p;

    for (let year = 1; year <= t; year++) {
      const yearlyContributions = m * 12;
      totalContributions += yearlyContributions;

      const amount = (p + (m * 12 * year)) * Math.pow(1 + r/n, n * year);
      const interest = amount - totalContributions;

      newData.push({
        year,
        amount,
        interest,
        contributions: totalContributions,
      });

      previousAmount = amount;
    }

    setData(newData);
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, rate, time, monthlyContribution, compoundingFrequency]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Input Fields - 5 columns */}
        <div className="col-span-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Initial Investment"
              type="number"
              value={principal}
              onChange={setPrincipal}
              min={0}
              step="1000"
              required
            />
            <InputField
              label="Monthly Addition"
              type="number"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={0}
              step="100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Interest Rate (%)"
              type="number"
              value={rate}
              onChange={setRate}
              min={0}
              step="0.1"
              required
            />
            <InputField
              label="Years"
              type="number"
              value={time}
              onChange={setTime}
              min={1}
              max={50}
              required
            />
          </div>
          <select
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="1">Annually</option>
            <option value="2">Semi-annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </select>
        </div>

        {/* Summary - 3 columns */}
        <div className="col-span-3 bg-gray-50 p-3 rounded-lg text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Invested:</span>
              <span className="font-medium">
                {formatCurrency(data[data.length - 1]?.contributions || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Earned:</span>
              <span className="font-medium">
                {formatCurrency(data[data.length - 1]?.interest || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Final Balance:</span>
              <span className="font-medium">
                {formatCurrency(data[data.length - 1]?.amount || 0)}
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
                tickFormatter={(value) => `Y${value}`}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                width={60}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="amount"
                name="Balance"
                stroke="#4F46E5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="contributions"
                name="Invested"
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