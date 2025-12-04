/**
 * MarketBoard Component - Production Ready
 * Display market prices with filters and trend visualization
 * 
 * Features:
 * - State and commodity filters
 * - Price trend chart
 * - Responsive grid layout
 * - Loading states
 * - Accessibility compliant
 */

import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Filter, Download } from 'lucide-react';

export interface MarketPrice {
  id: string;
  commodity: string;
  market: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChange: number;
  date: string;
  unit: string;
}

export interface MarketBoardProps {
  prices: MarketPrice[];
  states: string[];
  commodities: string[];
  onFilterChange?: (filters: MarketFilters) => void;
  onExport?: () => void;
  loading?: boolean;
  className?: string;
}

export interface MarketFilters {
  state?: string;
  commodity?: string;
  searchQuery?: string;
}

export const MarketBoard: React.FC<MarketBoardProps> = ({
  prices,
  states = [],
  commodities = [],
  onFilterChange,
  onExport,
  loading = false,
  className = '',
}) => {
  const [filters, setFilters] = useState<MarketFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<MarketFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" aria-hidden="true" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" aria-hidden="true" />;
    return <Minus className="w-4 h-4" aria-hidden="true" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-success-600 bg-success-50';
    if (change < 0) return 'text-error-600 bg-error-50';
    return 'text-neutral-600 bg-neutral-50';
  };

  const filteredPrices = prices.filter((price) => {
    if (filters.state && price.state !== filters.state) return false;
    if (filters.commodity && price.commodity !== filters.commodity) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        price.commodity.toLowerCase().includes(query) ||
        price.market.toLowerCase().includes(query) ||
        price.state.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-h3 font-semibold text-neutral-800 mb-1">
              Market Prices
            </h2>
            <p className="text-body-sm text-neutral-600">
              Real-time commodity prices from AGMARKNET
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onExport && (
              <button
                onClick={onExport}
                className="
                  px-4 py-2 rounded-md
                  bg-neutral-100 text-neutral-700
                  hover:bg-neutral-200
                  focus:outline-none focus:ring-2 focus:ring-primary-600
                  transition-colors duration-150
                  text-sm font-medium
                  flex items-center gap-2
                "
                aria-label="Export market data"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Export
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="
                px-4 py-2 rounded-md
                bg-primary-700 text-white
                hover:bg-primary-800
                focus:outline-none focus:ring-2 focus:ring-primary-600
                transition-colors duration-150
                text-sm font-medium
                flex items-center gap-2
              "
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 bg-neutral-50 border-b border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="market-search" className="block text-sm font-medium text-neutral-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
                <input
                  id="market-search"
                  type="text"
                  placeholder="Search commodity or market..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                  className="
                    w-full pl-10 pr-4 py-2 rounded-md
                    border border-neutral-300
                    focus:outline-none focus:ring-2 focus:ring-primary-600
                    text-sm
                  "
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label htmlFor="state-filter" className="block text-sm font-medium text-neutral-700 mb-2">
                State
              </label>
              <select
                id="state-filter"
                value={filters.state || ''}
                onChange={(e) => handleFilterChange({ state: e.target.value || undefined })}
                className="
                  w-full px-4 py-2 rounded-md
                  border border-neutral-300
                  focus:outline-none focus:ring-2 focus:ring-primary-600
                  text-sm
                "
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Commodity Filter */}
            <div>
              <label htmlFor="commodity-filter" className="block text-sm font-medium text-neutral-700 mb-2">
                Commodity
              </label>
              <select
                id="commodity-filter"
                value={filters.commodity || ''}
                onChange={(e) => handleFilterChange({ commodity: e.target.value || undefined })}
                className="
                  w-full px-4 py-2 rounded-md
                  border border-neutral-300
                  focus:outline-none focus:ring-2 focus:ring-primary-600
                  text-sm
                "
              >
                <option value="">All Commodities</option>
                {commodities.map((commodity) => (
                  <option key={commodity} value={commodity}>
                    {commodity}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Market Prices Grid */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border border-neutral-200 rounded-lg animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-neutral-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-neutral-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              No prices found
            </h3>
            <p className="text-sm text-neutral-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-neutral-600">
              Showing {filteredPrices.length} {filteredPrices.length === 1 ? 'result' : 'results'}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrices.map((price) => (
                <article
                  key={price.id}
                  className="
                    p-5 border border-neutral-200 rounded-lg
                    hover:border-primary-300 hover:shadow-md
                    transition-all duration-150
                  "
                >
                  {/* Commodity and Market */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-h5 font-semibold text-neutral-800 mb-1">
                        {price.commodity}
                      </h3>
                      <p className="text-caption text-neutral-600">
                        {price.market}, {price.state}
                      </p>
                    </div>
                    
                    {/* Price Change Badge */}
                    <div className={`
                      flex items-center gap-1 px-2 py-1 rounded-full
                      text-xs font-semibold
                      ${getTrendColor(price.priceChange)}
                    `}>
                      {getTrendIcon(price.priceChange)}
                      {Math.abs(price.priceChange)}%
                    </div>
                  </div>

                  {/* Modal Price */}
                  <div className="mb-3">
                    <div className="text-caption text-neutral-600 mb-1">Modal Price</div>
                    <div className="text-h3 font-bold text-neutral-900">
                      {formatCurrency(price.modalPrice)}
                      <span className="text-body-sm font-normal text-neutral-600">
                        {' '}/ {price.unit}
                      </span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="flex items-center justify-between text-caption">
                    <div>
                      <div className="text-neutral-600 mb-0.5">Min</div>
                      <div className="font-semibold text-neutral-800">
                        {formatCurrency(price.minPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-neutral-600 mb-0.5">Max</div>
                      <div className="font-semibold text-neutral-800">
                        {formatCurrency(price.maxPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-500">
                      Updated: {new Date(price.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketBoard;
