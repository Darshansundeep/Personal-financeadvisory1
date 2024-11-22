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

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('25000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [loanTerm, setLoanTerm] = useState('3');
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);

  const calculateLoan = () => {
    const principal = Number(loanAmount);
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

      newSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance,
      });
    }

    setSchedule(newSchedule);
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Personal Loan Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
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
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            step="0.1"
            required
          />
          <InputField
            label="Loan Term (years)"
            type="number"
            value={loanTerm}
            onChange={setLoanTerm}
            min={1}
            max={7}
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal Amount:</span>
              <span className="font-medium">{formatCurrency(Number(loanAmount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Payment:</span>
              <span className="font-medium">{formatCurrency(schedule[0]?.payment || 0)}</span>
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
                  Number(loanAmount) +
                  schedule.reduce((sum, { interest }) => sum + interest, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={schedule}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Months', position: 'bottom' }} 
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={100}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Month ${label}`}
            />
            <Legend />
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
              name="Monthly Payment"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}