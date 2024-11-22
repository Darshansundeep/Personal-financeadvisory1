import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, LineChart, Shield, Calculator, Mail, Check } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsSubscribed(true);
    setShowSubscribeForm(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-indigo-900 mb-6">
            Welcome to FinanceIQ
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Congratulations on taking your first step towards financial freedom! Let us help you make informed decisions about your money.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/personal')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Start Your Financial Journey
            </button>
            <button
              onClick={() => navigate('/calculators')}
              className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
            >
              Financial Calculators
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <Wallet className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personal Finance</h3>
              <p className="text-gray-600">Get a clear picture of your income and expenses</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <LineChart className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
              <p className="text-gray-600">Receive personalized financial insights</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Planning</h3>
              <p className="text-gray-600">Plan your future with confidence</p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mb-12">
            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-2 text-emerald-600">
                <Check className="w-5 h-5" />
                <span>Thank you for subscribing to our newsletter!</span>
              </div>
            ) : showSubscribeForm ? (
              <form onSubmit={handleSubscribe} className="flex flex-col items-center space-y-3">
                <div className="relative w-full max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      error ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubscribeForm(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowSubscribeForm(true)}
                className="flex items-center justify-center space-x-2 mx-auto bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                <span>Subscribe for Monthly Newsletter</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            Disclaimer: The financial recommendations provided are for informational purposes only and should not be considered as professional financial advice. Past performance does not guarantee future results. Please consult with qualified financial advisors before making any investment or financial decisions. By using this tool, you acknowledge that all financial decisions and associated risks are your responsibility.
          </p>
        </div>
      </div>
    </div>
  );
}