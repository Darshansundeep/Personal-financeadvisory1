import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InputField from '../InputField';

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('300000');
  const [interestRate, setInterestRate] = useState('3.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [downPayment, setDownPayment] = useState('60000');
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);

  const calculateMortgage = () => {
    const principal = Number(loanAmount) - Number(downPayment);
    const monthlyRate = Number(interestRate) / 100 / 12;
    const numberOfPayments = Number(loanTerm) * 12;
    
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const newSchedule: PaymentSchedule[] = [];
    let balance = principal;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      if (month % 12 === 0) {
        newSchedule.push({
          month: month / 12,
          payment: monthlyPayment * 12,
          principal: principalPayment * 12,
          interest: interestPayment * 12,
          remainingBalance: balance,
        });
      }
    }

    setSchedule(newSchedule);
  };

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm, downPayment]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left column - Input fields */}
      <div className="space-y-3">
        <InputField
          label="Loan Amount"
          type="number"
          value={loanAmount}
          onChange={setLoanAmount}
          min={0}
          step="1000"
          required
        />
        <InputField
          label="Down Payment"
          type="number"
          value={downPayment}
          onChange={setDownPayment}
          min={0}
          step="1000"
          required
        />
        <InputField
          label="Interest Rate (%)"
          type="number"
          value={interestRate}
          onChange={setInterestRate}
          min={0}
          step="0.1"
          required
        />
        <InputField
          label="Term (years)"
          type="number"
          value={loanTerm}
          onChange={setLoanTerm}
          min={1}
          max={30}
          required
        />
      </div>

      {/* Middle column - Summary */}
      <div className="bg-gray-50 p-3 rounded-lg text-sm h-fit">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Principal:</span>
            <span className="font-medium">{formatCurrency(Number(loanAmount) - Number(downPayment))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly:</span>
            <span className="font-medium">{formatCurrency(schedule[0]?.payment / 12 || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Interest:</span>
            <span className="font-medium">
              {formatCurrency(schedule.reduce((sum, { interest }) => sum + interest, 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Cost:</span>
            <span className="font-medium">
              {formatCurrency(
                Number(loanAmount) - Number(downPayment) +
                schedule.reduce((sum, { interest }) => sum + interest, 0)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Right column - Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={schedule} margin={{ top: 5, right: 5, bottom: 15, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `Y${value}`}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={60}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line
              type="monotone"
              dataKey="remainingBalance"
              name="Balance"
              stroke="#4F46E5"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="payment"
              name="Annual Payment"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}