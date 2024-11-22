import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { User, Wallet, Building2, Shield, TrendingUp } from 'lucide-react';
import FormLayout from '../components/FormLayout';
import { useFinanceStore } from '../store/financeStore';

export default function Summary() {
  const navigate = useNavigate();
  const data = useFinanceStore((state) => state.data);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthlyIncome = (data.income?.monthlySalary || 0) +
    (data.income?.additionalIncome || 0) +
    ((data.income?.annualBonus || 0) / 12);

  const monthlyExpenses = (data.expenses?.housing || 0) +
    (data.expenses?.utilities || 0) +
    (data.expenses?.groceries || 0) +
    (data.expenses?.transportation || 0) +
    (data.expenses?.entertainment || 0) +
    (data.expenses?.miscellaneous || 0);

  const totalEMIs = (data.loans?.personal?.emiPerMonth || 0) +
    (data.loans?.home?.emiPerMonth || 0) +
    (data.loans?.vehicle?.emiPerMonth || 0);

  const monthlySavings = monthlyIncome - monthlyExpenses - totalEMIs;

  const expenseBreakdown = [
    { name: 'Housing', value: data.expenses?.housing || 0 },
    { name: 'Utilities', value: data.expenses?.utilities || 0 },
    { name: 'Groceries', value: data.expenses?.groceries || 0 },
    { name: 'Transport', value: data.expenses?.transportation || 0 },
    { name: 'Entertainment', value: data.expenses?.entertainment || 0 },
    { name: 'Misc', value: data.expenses?.miscellaneous || 0 },
  ].filter(item => item.value > 0);

  const monthlyBreakdown = [
    { name: 'Income', amount: monthlyIncome, type: 'income' },
    { name: 'Expenses', amount: monthlyExpenses, type: 'expense' },
    { name: 'EMIs', amount: totalEMIs, type: 'expense' },
    { name: 'Savings', amount: monthlySavings, type: 'expense' },
  ];

  const investmentBreakdown = [
    { name: 'Stocks', value: data.investments?.stocks?.value || 0 },
    { name: 'Mutual Funds', value: data.investments?.mutualFunds?.value || 0 },
    { name: 'Bonds', value: data.investments?.bonds?.value || 0 },
    { name: 'Real Estate', value: data.investments?.realEstate?.value || 0 },
    { name: 'Retirement', value: data.investments?.retirement?.value || 0 },
    { name: 'Crypto', value: data.investments?.crypto?.value || 0 },
  ].filter(item => item.value > 0);

  const monthlyInvestments = [
    { name: 'Stocks', value: data.investments?.stocks?.monthlyContribution || 0 },
    { name: 'Mutual Funds', value: data.investments?.mutualFunds?.monthlyContribution || 0 },
    { name: 'Bonds', value: data.investments?.bonds?.monthlyContribution || 0 },
    { name: 'Real Estate', value: data.investments?.realEstate?.monthlyIncome || 0 },
    { name: 'Retirement', value: data.investments?.retirement?.monthlyContribution || 0 },
    { name: 'Crypto', value: data.investments?.crypto?.monthlyContribution || 0 },
  ].filter(item => item.value > 0);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const CHART_COLORS = {
    income: '#22C55E',
    expense: '#EF4444',
  };

  const insuranceCoverage = [
    { name: 'Health', value: data.insurance?.health?.coverage || 0 },
    { name: 'Life', value: data.insurance?.life?.coverage || 0 },
    { name: 'Vehicle', value: data.insurance?.vehicle?.coverage || 0 },
  ];

  const handleBack = () => navigate('/insurance');
  const handleNext = () => navigate('/advisory');

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <FormLayout
      title="Financial Summary"
      subtitle="Review your financial information"
      onBack={handleBack}
      onNext={handleNext}
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Info Card */}
        <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <User className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-lg">{data.personal?.fullName}</h3>
              <p className="text-gray-600">
                {data.personal?.age} years • {data.personal?.occupation} • 
                {data.personal?.dependents === 0 
                  ? ' No dependents'
                  : ` ${data.personal?.dependents} dependent${data.personal?.dependents === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Wallet className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Monthly Overview</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBreakdown} layout="vertical">
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {monthlyBreakdown.map((entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[entry.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Expense Breakdown</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={true}
                  label={CustomPieLabel}
                >
                  {expenseBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Investment Portfolio */}
        <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Investment Portfolio</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Current Value</h4>
              <div className="space-y-2">
                {investmentBreakdown.map((investment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{investment.name}</span>
                    <span className="font-medium">{formatCurrency(investment.value)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Portfolio Value</span>
                    <span>{formatCurrency(investmentBreakdown.reduce((sum, { value }) => sum + value, 0))}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monthly Contributions</h4>
              <div className="space-y-2">
                {monthlyInvestments.map((investment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{investment.name}</span>
                    <span className="font-medium">{formatCurrency(investment.value)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Monthly Investment</span>
                    <span>{formatCurrency(monthlyInvestments.reduce((sum, { value }) => sum + value, 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance & Loans Summary */}
        <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Insurance & Loans</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Insurance Coverage</h4>
              <div className="space-y-2">
                {insuranceCoverage.map((insurance, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{insurance.name}</span>
                    <span className="font-medium">{formatCurrency(insurance.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monthly EMIs</h4>
              <div className="space-y-2">
                {Object.entries(data.loans || {}).map(([type, loan]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{type}</span>
                    <span className="font-medium">{formatCurrency(loan?.emiPerMonth || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}