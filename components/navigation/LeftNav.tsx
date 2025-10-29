'use client';

import { usePricingStore } from '@/lib/store';

type NavSection = 'implementation' | 'ongoing' | 'results';

interface NavItem {
  id: NavSection;
  title: string;
  description: string;
  iconPath: string;
}

const navItems: NavItem[] = [
  {
    id: 'implementation',
    title: 'Implementation',
    description: 'Trade setups & capacity planning',
    iconPath: '/Implementation.svg',
  },
  {
    id: 'ongoing',
    title: 'Ongoing Costs',
    description: 'Customer profile & recurring revenue',
    iconPath: '/ongoing-cost.svg',
  },
  {
    id: 'results',
    title: 'Results & Analysis',
    description: 'P&L and detailed breakdowns',
    iconPath: '/results-analysis.svg',
  },
];

export function LeftNav() {
  const { activeSection, setActiveSection, results } = usePricingStore();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getSectionSummary = (sectionId: NavSection) => {
    switch (sectionId) {
      case 'implementation':
        return formatCurrency(results.implementation?.totalRevenue || 0);
      case 'ongoing':
        return `$${(results.opexPepm || 0).toFixed(2)} PEPM`;
      case 'results':
        return formatCurrency((results.yearlyFinancials?.[0]?.totalRevenue || 0) + (results.implementation?.totalRevenue || 0));
      default:
        return '';
    }
  };

  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="/flume-icon.svg"
            alt="Flume Health"
            className="w-8 h-8"
          />
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              Pricing Model
            </h1>
            <p className="text-xs text-gray-500">Flume Health</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full px-6 py-4 text-left transition-colors border-l-4 ${
              activeSection === item.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={item.iconPath}
                alt={item.title}
                className="w-6 h-6 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  activeSection === item.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
                {getSectionSummary(item.id) && (
                  <div className={`text-xs font-semibold mt-2 ${
                    activeSection === item.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {getSectionSummary(item.id)}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}

        {/* Additional Actions */}
        <div className="mt-6 px-6 space-y-2">
          <button className="w-full px-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors text-left">
            Compare to Competitors
          </button>
          <button className="w-full px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50 rounded-md cursor-not-allowed text-left">
            Export to Excel (Coming Soon)
          </button>
        </div>
      </div>
    </nav>
  );
}
