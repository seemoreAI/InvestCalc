import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Percent, Euro, BarChart3 } from 'lucide-react';
import { InstallPrompt } from './components/InstallPrompt';

interface CalculationResult {
  monthlyInvestment: number;
  totalInvested: number;
  initialCapital: number;
  totalProfit: number;
  yearlyBreakdown: Array<{
    year: number;
    totalValue: number;
    totalInvested: number;
    initialCapital: number;
    profit: number;
  }>;
}

function App() {
  const [years, setYears] = useState<number>(20);
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [annualReturn, setAnnualReturn] = useState<number>(10);
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateInvestment = () => {
    if (years <= 0 || targetAmount <= 0 || annualReturn < 0 || initialCapital < 0) {
      setResult(null);
      return;
    }

    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Calculate future value of initial capital
    const futureValueOfInitial = initialCapital * Math.pow(1 + monthlyRate, totalMonths);
    
    // Remaining amount needed from monthly investments
    const remainingAmount = targetAmount - futureValueOfInitial;
    
    // Calculate monthly payment needed using Future Value of Annuity formula
    // PMT = (FV - PV*(1+r)^n) / [((1 + r)^n - 1) / r]
    const monthlyInvestment = remainingAmount > 0 
      ? remainingAmount / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate))
      : 0;
      
    const totalInvested = monthlyInvestment * totalMonths;
    const totalProfit = targetAmount - totalInvested - initialCapital;

    // Calculate yearly breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= years; year++) {
      const monthsElapsed = year * 12;
      const investedSoFar = monthlyInvestment * monthsElapsed;
      const futureValueOfInitialAtYear = initialCapital * Math.pow(1 + monthlyRate, monthsElapsed);
      const futureValueOfMonthlyAtYear = monthlyInvestment * (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate));
      const totalValue = futureValueOfInitialAtYear + futureValueOfMonthlyAtYear;
      const profit = totalValue - investedSoFar - initialCapital;
      
      yearlyBreakdown.push({
        year,
        totalValue,
        totalInvested: investedSoFar,
        initialCapital,
        profit
      });
    }

    setResult({
      monthlyInvestment,
      totalInvested,
      initialCapital,
      totalProfit,
      yearlyBreakdown
    });
  };

  useEffect(() => {
    calculateInvestment();
  }, [years, targetAmount, annualReturn, initialCapital]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyPrecise = (amount: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">S&P 500 Инвестиционен Калкулатор</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Планирай своето <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">финансово бъдеще</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Изчисли колко трябва да инвестираш месечно, за да постигнеш финансовите си цели с инвестиции в S&P 500
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Параметри за изчисление
            </h2>

            <div className="space-y-6">
              {/* Initial Capital Input */}
              <div>
                <label className="flex items-center gap-2 text-slate-300 font-medium mb-3">
                  <Euro className="w-5 h-5 text-purple-400" />
                  Начален капитал (вече инвестирани средства)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={initialCapital}
                    onChange={(e) => {
                      const value = e.target.value;
                     // Remove leading zeros
                     const cleanValue = value.replace(/^0+(?=\d)/, '');
                      const numValue = value === '' ? 0 : Number(value);
                      setInitialCapital(Math.min(Math.max(numValue, 0), 10000000));
                    }}
                   onFocus={(e) => {
                     if (e.target.value === '0') {
                       e.target.select();
                     }
                   }}
                    onWheel={(e) => e.currentTarget.blur()}
                    min="0"
                    max="10000000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="100000"
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Сумата, която вече имаш инвестирана в началото на периода
                </p>
              </div>

              {/* Years Input */}
              <div>
                <label className="flex items-center gap-2 text-slate-300 font-medium mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Инвестиционен период (години)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => {
                    const value = e.target.value;
                   // Remove leading zeros
                   const cleanValue = value.replace(/^0+(?=\d)/, '');
                    const numValue = value === '' ? 0 : Number(value);
                    setYears(Math.min(Math.max(numValue, 0), 50));
                  }}
                 onFocus={(e) => {
                   if (e.target.value === '0') {
                     e.target.select();
                   }
                 }}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="1"
                  max="50"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="20"
                />
              </div>

              {/* Target Amount Input */}
              <div>
                <label className="flex items-center gap-2 text-slate-300 font-medium mb-3">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Желана сума в края на периода
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                     // Remove leading zeros
                     const cleanValue = value.replace(/^0+(?=\d)/, '');
                      const numValue = value === '' ? 0 : Number(value);
                      setTargetAmount(Math.min(Math.max(numValue, 0), 50000000));
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    min="1000"
                    max="50000000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="1000000"
                  />
                </div>
              </div>

              {/* Annual Return Input */}
              <div>
                <label className="flex items-center gap-2 text-slate-300 font-medium mb-3">
                  <Percent className="w-5 h-5 text-yellow-400" />
                  Очаквана годишна доходност (%)
                </label>
                <input
                  type="number"
                  value={annualReturn}
                  onChange={(e) => {
                    const value = e.target.value;
                   // Remove leading zeros
                   const cleanValue = value.replace(/^0+(?=\d)/, '');
                    const numValue = value === '' ? 0 : Number(value);
                    setAnnualReturn(Math.min(Math.max(numValue, 0), 30));
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="0"
                  max="30"
                  step="0.1"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="10"
                />
                <p className="text-slate-400 text-sm mt-2">
                  Историческата средна доходност на S&P 500 е около 10% годишно (максимум 30%)
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Monthly Investment Card */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    {result.monthlyInvestment > 0 ? 'Месечна инвестиция' : 'Началният капитал е достатъчен!'}
                  </h3>
                  {result.monthlyInvestment > 0 ? (
                    <>
                      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
                        {formatCurrencyPrecise(result.monthlyInvestment)}
                      </div>
                      <p className="text-slate-300">
                        Трябва да инвестираш месечно за {years} години
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
                        {formatCurrencyPrecise(0)}
                      </div>
                      <p className="text-slate-300">
                        Началният ти капитал ще нарасне до целевата сума за {years} години
                      </p>
                    </>
                  )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h4 className="text-slate-300 font-medium mb-2">Начален капитал</h4>
                    <div className="text-2xl font-bold text-purple-400">
                      {formatCurrency(result.initialCapital)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h4 className="text-slate-300 font-medium mb-2">Общо инвестирано</h4>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(result.totalInvested)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h4 className="text-slate-300 font-medium mb-2">Очаквана печалба</h4>
                    <div className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(result.totalProfit)}
                    </div>
                  </div>
                </div>

                {/* Yearly Breakdown */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-6">Прогноза по години</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {result.yearlyBreakdown.map((item) => (
                      <div key={item.year} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 font-semibold text-sm">{item.year}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">Година {item.year}</div>
                            <div className="text-slate-400 text-sm">
                              Инвестирано: {formatCurrency(item.totalInvested + item.initialCapital)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">
                            {formatCurrency(item.totalValue)}
                          </div>
                          <div className="text-emerald-400 text-sm">
                            +{formatCurrency(item.profit)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>Важно:</strong> Това са теоретични изчисления базирани на историческа средна доходност. 
                    Реалните резултати могат да варират значително. Инвестициите винаги носят риск от загуби.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-300 text-sm">
                <span>Разработено от</span>
                <span className="font-semibold text-blue-400">seemore</span>
                <span>• Безплатно за ползване</span>
              </div>
              
              <div className="text-slate-400 text-xs max-w-2xl mx-auto leading-relaxed">
                <p className="mb-2">
                  <strong className="text-yellow-400">Отказ от отговорност:</strong> Това приложение е експериментално и се предлага "както е" без никакви гаранции. 
                  Използвате го на ваша собствена отговорност. Резултатите са теоретични изчисления и не представляват инвестиционни съвети.
                </p>
                <p className="mb-2">
                  Приложението няма да бъде активно поддържано или ъпдейтвано. Реалните инвестиционни резултати могат да се различават значително от прогнозите.
                </p>
                <p>
                  Изходният код е достъпен на: 
                  <a 
                    href="https://github.com/seemoreAI/InvestCalc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline ml-1 transition-colors"
                  >
                    https://github.com/seemoreAI/InvestCalc
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InstallPrompt />
    </div>
  );
}

export default App;