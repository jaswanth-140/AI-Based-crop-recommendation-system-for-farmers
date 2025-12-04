/**
 * RecommendationCard Component - Production Ready
 * Displays crop recommendation with match score, ROI, and profitability metrics
 * 
 * Features:
 * - Selectable with visual feedback
 * - Responsive design
 * - Skeleton loading state
 * - Accessibility compliant
 * - Touch-friendly
 */

import React, { useState } from 'react';
import { TrendingUp, Droplets, Calendar, ChevronRight, Check } from 'lucide-react';

export interface RecommendationCardProps {
  crop: string;
  matchScore: number;
  estimatedYield: string;
  cultivationCost: number;
  netProfit: number;
  imageUrl: string;
  season?: string;
  duration?: string;
  waterNeed?: string;
  selected?: boolean;
  onSelect?: () => void;
  onViewDetails?: () => void;
  loading?: boolean;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  crop,
  matchScore,
  estimatedYield,
  cultivationCost,
  netProfit,
  imageUrl,
  season = 'Kharif',
  duration = '3-4 months',
  waterNeed = 'Moderate',
  selected = false,
  onSelect,
  onViewDetails,
  loading = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate ROI percentage
  const roiPercentage = cultivationCost > 0 
    ? ((netProfit / cultivationCost) * 100).toFixed(0)
    : 0;

  // Determine match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-success-600 bg-success-50';
    if (score >= 70) return 'text-primary-700 bg-primary-50';
    if (score >= 50) return 'text-warning-600 bg-warning-50';
    return 'text-neutral-600 bg-neutral-100';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-5 border border-neutral-200 ${className}`}>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      role={onSelect ? 'button' : 'article'}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={selected}
      aria-label={`${crop} crop recommendation. ${matchScore}% match. Estimated profit: ${formatCurrency(netProfit)}.${selected ? ' Selected.' : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`
        bg-white rounded-lg p-5
        border-2 transition-all duration-150
        ${selected 
          ? 'border-primary-600 bg-primary-50 shadow-primary' 
          : 'border-neutral-200 hover:border-primary-300 shadow-sm hover:shadow-md'
        }
        ${onSelect ? 'cursor-pointer hover:-translate-y-1' : ''}
        focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
        ${className}
      `}
    >
      {/* Header with Image and Match Score */}
      <div className="flex gap-4 mb-4">
        {/* Crop Image */}
        <div className="relative flex-shrink-0">
          {imageError ? (
            <div className="w-24 h-24 rounded-lg bg-primary-50 flex items-center justify-center">
              <span className="text-3xl" role="img" aria-label={crop}>🌾</span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={`${crop} crop`}
              className="w-24 h-24 rounded-lg object-cover"
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Selection Indicator */}
          {selected && (
            <div className="
              absolute -top-2 -right-2
              w-6 h-6 rounded-full
              bg-primary-700 text-white
              flex items-center justify-center
              shadow-md
            ">
              <Check className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Crop Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-h4 text-neutral-800 font-semibold truncate">
              {crop}
            </h3>
            <span 
              className={`
                px-3 py-1 rounded-full
                text-xs font-bold
                flex-shrink-0
                ${getMatchScoreColor(matchScore)}
              `}
              aria-label={`${matchScore}% match score`}
            >
              {matchScore}%
            </span>
          </div>

          {/* Yield and Cost */}
          <p className="text-body-sm text-neutral-600 mb-1">
            <span className="font-medium">{estimatedYield}</span>
          </p>
          <p className="text-body-sm text-neutral-500">
            Cost: <span className="font-medium text-neutral-700">{formatCurrency(cultivationCost)}</span>
          </p>
        </div>
      </div>

      {/* Profit and ROI */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gradient-to-r from-warning-50 to-success-50 border border-warning-200">
        <div>
          <div className="text-caption text-neutral-600 mb-0.5">Estimated Profit</div>
          <div className="text-h4 font-bold text-success-700">
            {formatCurrency(netProfit)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-caption text-neutral-600 mb-0.5">ROI</div>
          <div className="flex items-center gap-1 text-lg font-bold text-success-700">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            {roiPercentage}%
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-md bg-neutral-50">
          <Calendar className="w-4 h-4 mx-auto mb-1 text-neutral-600" aria-hidden="true" />
          <div className="text-xs text-neutral-600">{duration}</div>
        </div>
        <div className="text-center p-2 rounded-md bg-neutral-50">
          <Droplets className="w-4 h-4 mx-auto mb-1 text-neutral-600" aria-hidden="true" />
          <div className="text-xs text-neutral-600">{waterNeed}</div>
        </div>
        <div className="text-center p-2 rounded-md bg-neutral-50">
          <div className="text-xs font-medium text-neutral-800 mb-1">{season}</div>
          <div className="text-xs text-neutral-600">Season</div>
        </div>
      </div>

      {/* View Details Button */}
      {onViewDetails && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="
            w-full flex items-center justify-center gap-2
            px-4 py-2.5 rounded-md
            bg-neutral-100 text-neutral-700
            hover:bg-neutral-200
            focus:outline-none focus:ring-2 focus:ring-primary-600
            transition-colors duration-150
            text-sm font-medium
            touch-target
          "
          aria-label={`View details for ${crop}`}
        >
          View Details
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </article>
  );
};

// Skeleton variant for loading states
export const RecommendationCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg p-5 border border-neutral-200 ${className}`}>
    <div className="flex gap-4 mb-4">
      <div className="w-24 h-24 bg-neutral-200 rounded-lg animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-2/3" />
      </div>
    </div>
    <div className="h-20 bg-neutral-100 rounded-lg animate-pulse mb-4" />
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="h-12 bg-neutral-100 rounded animate-pulse" />
      <div className="h-12 bg-neutral-100 rounded animate-pulse" />
      <div className="h-12 bg-neutral-100 rounded animate-pulse" />
    </div>
    <div className="h-10 bg-neutral-100 rounded animate-pulse" />
  </div>
);

export default RecommendationCard;
