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
    // Calculate financial metrics
    const monthlyIncome = (data.income?.monthlySalary || 0) + (data.income?.additionalIncome || 0);
    const annualIncome = monthlyIncome * 12 + (data.income?.annualBonus || 0);
    const monthlyExpenses = Object.values(data.expenses || {}).reduce((sum, value) => sum + (value || 0), 0);
    const totalMonthlyEMIs = Object.values(data.loans || {}).reduce(
      (sum, loan) => sum + (loan?.emiPerMonth || 0),
      0
    );

    // Calculate investment metrics
    const investments = data.investments || {};
    const totalPortfolioValue = Object.values(investments).reduce(
      (sum, inv) => sum + (inv?.value || 0),
      0
    );
    const monthlyInvestments = Object.values(investments).reduce(
      (sum, inv) => sum + (inv?.monthlyContribution || 0) + (inv?.monthlyIncome || 0),
      0
    );

    // Calculate investment diversification score (0-100)
    const investmentTypes = Object.values(investments).filter(inv => (inv?.value || 0) > 0).length;
    const maxTypes = 6; // Maximum number of investment types
    const diversificationScore = (investmentTypes / maxTypes) * 100;

    setAnalysis({
      debtToIncome: (totalMonthlyEMIs / monthlyIncome) * 100,
      savingsRate: ((monthlyIncome - monthlyExpenses - totalMonthlyEMIs) / monthlyIncome) * 100,
      insuranceCoverage: (data.insurance?.life?.coverage || 0) / annualIncome,
      emergencyFundMonths: (data.income?.currentSavings || 0) / monthlyExpenses,
      fireNumber: monthlyExpenses * 12 * 25,
      yearsToFire: Math.ceil(
        Math.log(
          (monthlyExpenses * 12 * 25) /
            ((data.income?.currentSavings || 1) + totalPortfolioValue)
        ) / Math.log(1.07)
      ),
      investmentDiversification: diversificationScore,
      totalPortfolioValue,
      monthlyInvestments,
    });

    // Get AI-powered financial advice
    getFinancialAdvice();
  }, [data]);

  const getFinancialAdvice = async () => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a highly experienced Certified Financial Planner (CFP) with 20 years of expertise in personal finance, wealth management, and FIRE (Financial Independence, Retire Early) planning. Your communication style is professional yet approachable, focused on explaining complex financial concepts in simple terms.`
            },
            {
              role: 'user',
              content: `Provide financial advice based on the following details: ${JSON.stringify(data)}`
            },
          ],
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
                <p className="text-sm">{analysis.debtToIncome.toFixed(1)}% (Target: {'<'}40%)</p>
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
                <p className="text-sm">{analysis.savingsRate.toFixed(1)}% (Target: {'>'}20%)</p>
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
                <p className="text-sm">Score: {analysis.investmentDiversification.toFixed(1)}% (Target: {'>'}80%)</p>
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