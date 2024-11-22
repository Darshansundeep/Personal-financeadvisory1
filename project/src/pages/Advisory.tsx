import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../store/financeStore';
import FormLayout from '../components/FormLayout';
import { generatePDF } from '../services/pdfService';
import {
  ShieldCheck,
  TrendingUp,
  PiggyBank,
  Target,
  ChevronRight,
  Home,
  Wallet,
  LineChart,
} from 'lucide-react';

interface Analysis {
  debtToIncome: number;
  savingsRate: number;
  insuranceCoverage: number;
  emergencyFundMonths: number;
  fireNumber: number;
  yearsToFire: number;
  investmentDiversification: number;
  totalPortfolioValue: number;
  monthlyInvestments: number;
}

export default function Advisory() {
  const navigate = useNavigate();
  const data = useFinanceStore((state) => state.data);
  const [analysis, setAnalysis] = useState<Analysis>({
    debtToIncome: 0,
    savingsRate: 0,
    insuranceCoverage: 0,
    emergencyFundMonths: 0,
    fireNumber: 0,
    yearsToFire: 0,
    investmentDiversification: 0,
    totalPortfolioValue: 0,
    monthlyInvestments: 0,
  });
  const [advisoryContent, setAdvisoryContent] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    calculateMetrics();
    getFinancialAdvice();
  }, [data]);

  const calculateMetrics = () => {
    const monthlyIncome = (data.income?.monthlySalary || 0) + (data.income?.additionalIncome || 0);
    const annualIncome = monthlyIncome * 12 + (data.income?.annualBonus || 0);
    const monthlyExpenses = Object.values(data.expenses || {}).reduce((sum, value) => sum + (value || 0), 0);
    const totalMonthlyEMIs = Object.values(data.loans || {}).reduce(
      (sum, loan) => sum + (loan?.emiPerMonth || 0),
      0
    );

    const investments = data.investments || {};
    const totalPortfolioValue = Object.values(investments).reduce(
      (sum, inv) => sum + (inv?.value || 0),
      0
    );
    const monthlyInvestments = Object.values(investments).reduce(
      (sum, inv) => sum + (inv?.monthlyContribution || 0) + (inv?.monthlyIncome || 0),
      0
    );

    const investmentTypes = Object.values(investments).filter(inv => (inv?.value || 0) > 0).length;
    const maxTypes = 6;
    const diversificationScore = (investmentTypes / maxTypes) * 100;

    const currentSavings = data.income?.currentSavings || 0;
    const fireNumber = monthlyExpenses * 12 * 25;
    const yearsToFire = monthlyExpenses > 0 
      ? Math.ceil(
          Math.log(
            fireNumber / (currentSavings + totalPortfolioValue || 1)
          ) / Math.log(1.07)
        )
      : 0;

    setAnalysis({
      debtToIncome: monthlyIncome > 0 ? (totalMonthlyEMIs / monthlyIncome) * 100 : 0,
      savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses - totalMonthlyEMIs) / monthlyIncome) * 100 : 0,
      insuranceCoverage: annualIncome > 0 ? (data.insurance?.life?.coverage || 0) / annualIncome : 0,
      emergencyFundMonths: monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0,
      fireNumber,
      yearsToFire,
      investmentDiversification: diversificationScore,
      totalPortfolioValue,
      monthlyInvestments,
    });
  };

  const getFinancialAdvice = async () => {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setAdvisoryContent('API key not configured. Please set up your GROQ API key.');
        return;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a highly experienced Certified Financial Planner (CFP) with 20 years of expertise in personal finance, wealth management, and FIRE planning. Analyze the client's financial data and provide specific, actionable advice focusing on: 1) Emergency fund adequacy 2) Debt management 3) Insurance coverage 4) Investment strategy 5) FIRE planning. Include specific numbers and clear action items.`
            },
            {
              role: 'user',
              content: `Provide financial advice based on this data: ${JSON.stringify({
                personal: data.personal,
                income: data.income,
                expenses: data.expenses,
                loans: data.loans,
                insurance: data.insurance,
                investments: data.investments,
                analysis: analysis,
              })}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch advice');
      }

      const result = await response.json();
      setAdvisoryContent(result.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setAdvisoryContent('Unable to generate financial advice at this moment. Please try again later.');
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('advisory-content');
    if (element) {
      await generatePDF(element);
    }
  };

  return (
    <FormLayout
      title="Financial Advisory"
      subtitle={`Dear ${data.personal?.fullName}, here are your personalized financial recommendations`}
    >
      <div id="advisory-content" className="space-y-8">
        {/* Financial Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Wallet className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold mb-1">Debt-to-Income Ratio</h4>
                <p className="text-sm">{analysis.debtToIncome.toFixed(1)}% (Target: &lt;40%)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <PiggyBank className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold mb-1">Savings Rate</h4>
                <p className="text-sm">{analysis.savingsRate.toFixed(1)}% (Target: &gt;20%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold mb-1">Investment Portfolio</h4>
                <p className="text-sm">
                  Total Value: {formatCurrency(analysis.totalPortfolioValue)}
                  <br />
                  Monthly Investment: {formatCurrency(analysis.monthlyInvestments)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-amber-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold mb-1">Portfolio Diversification</h4>
                <p className="text-sm">Score: {analysis.investmentDiversification.toFixed(1)}% (Target: &gt;80%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* FIRE Journey Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold mb-1">FIRE Number</h4>
                <p className="text-sm">Target: {formatCurrency(analysis.fireNumber)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Home className="w-8 h-8 text-rose-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold mb-1">Years to FIRE</h4>
                <p className="text-sm">Estimated: {analysis.yearsToFire} years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Financial Advisory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <LineChart className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-semibold">Detailed Financial Summary</h3>
          </div>
          <div className="prose prose-indigo max-w-none">
            {advisoryContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Download as PDF
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
          >
            Submit new profile
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </FormLayout>
  );
}