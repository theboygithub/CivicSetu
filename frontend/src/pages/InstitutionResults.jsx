import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  Search, 
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';

export default function InstitutionResults({ 
  matchedInstitutions = [], 
  problemTitle = "", 
  onSelectInstitution, 
  onBack 
}) {
  const [filterState, setFilterState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique states for quick filtering
  const states = ['All', ...new Set(matchedInstitutions.map(i => i.state).filter(Boolean))];

  const filtered = matchedInstitutions.filter(inst => {
    const matchesState = filterState === 'All' || inst.state === filterState;
    const matchesQuery = !searchQuery.trim() || 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesQuery;
  });

  const getMatchBadgeStyle = (percentage) => {
    if (percentage >= 90) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
        ring: 'text-emerald-600'
      };
    } else if (percentage >= 80) {
      return {
        badge: 'bg-brand-50 text-brand-700 border-brand-200',
        bar: 'bg-brand-600',
        ring: 'text-brand-600'
      };
    } else {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        bar: 'bg-amber-500',
        ring: 'text-amber-600'
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AI Analysis</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Top Matching Institutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Colleges & universities best equipped to resolve: <strong className="text-slate-800">{problemTitle}</strong>
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          Found <strong className="text-brand-600 text-sm">{matchedInstitutions.length}</strong> qualified institutions
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by institute name, department, or city..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {states.map(st => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                filterState === st 
                  ? 'bg-brand-600 text-white font-medium' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Institution Cards List */}
      <div className="space-y-4">
        {filtered.map((inst, index) => {
          const style = getMatchBadgeStyle(inst.matchPercentage);

          return (
            <div
              key={inst.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Left details */}
                <div className="space-y-2 flex-1">
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Rank #{index + 1}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {inst.location}
                    </span>
                    {inst.nirfRank && (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium inline-flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        NIRF #{inst.nirfRank}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-600">
                    {inst.name}
                  </h2>

                  {/* Why they match reasons */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                      <span>Why Recommended?</span>
                    </div>
                    <ul className="space-y-1.5">
                      {inst.whyMatch?.map((reason, rIdx) => (
                        <li key={rIdx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Departments chip preview */}
                  <div className="pt-3 flex flex-wrap gap-1.5">
                    {inst.departments?.slice(0, 3).map((dept, dIdx) => (
                      <span 
                        key={dIdx}
                        className="text-2xs sm:text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded"
                      >
                        {dept}
                      </span>
                    ))}
                    {inst.departments?.length > 3 && (
                      <span className="text-2xs sm:text-xs text-slate-400 px-1 py-0.5">
                        +{inst.departments.length - 3} more
                      </span>
                    )}
                  </div>

                </div>

                {/* Right Match Percentage & View Details Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  
                  {/* Match Percentage Badge */}
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${style.badge} min-w-[110px]`}>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {inst.matchPercentage}%
                    </div>
                    <div className="text-2xs font-bold uppercase tracking-wider mt-0.5">
                      Match Fit
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectInstitution(inst.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No institutions matched your query</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter or searching for another department.</p>
          </div>
        )}
      </div>

    </div>
  );
}
