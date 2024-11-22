import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onBack?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
}

export default function FormLayout({
  children,
  title,
  subtitle,
  onBack,
  onNext,
  isLastStep = false,
}: FormLayoutProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>

          <div className="space-y-6">
            {children}

            <div className="flex justify-between pt-8">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 ml-auto"
                >
                  {isLastStep ? 'Submit' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}