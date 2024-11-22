import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InputField from '../InputField';

interface InterestData {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('5');
  const [data, setData] = useState<InterestData[]>([]);

  const calculateInterest = () => {
    const p = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(time);

    const newData: InterestData[] = [];
    for (let year = 1; year <= t; year++) {
      const interest = p * r * year;
      newData.push({
        year,
        principal: p,
        interest,
        total: p + interest,
      });
    }

    setData(newData);
  };

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Simple Interest Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField
            label="Principal Amount"
            type="number"
            value={principal}
            onChange={setPrincipal}
            min={0}
            step="1000"
            required
          />
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
            label="Time (years)"
            type="number"
            value={time}
            onChange={setTime}
            min={1}
            max={30}
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal Amount:</span>
              <span className="font-medium">{formatCurrency(Number(principal))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-medium">
                {formatCurrency(data[data.length - 1]?.interest || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Final Amount:</span>
              <span className="font-medium">
                {formatCurrency(data[data.length - 1]?.total || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Years', position: 'bottom' }} 
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={100}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Bar dataKey="principal" name="Principal" fill="#4F46E5" stackId="a" />
            <Bar dataKey="interest" name="Interest" fill="#10B981" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}