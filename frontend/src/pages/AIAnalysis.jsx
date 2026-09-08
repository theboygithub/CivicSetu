import React from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  BookOpen, 
  Layers,
  Zap,
  Info
} from 'lucide-react';

export default function AIAnalysis({ 
  formData, 
  analysisResult, 
  apiMeta,
  onFindInstitutions, 
  onBack,
  isMatching 
}) {
  if (!analysisResult) return null;

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Bar with Back Link and Model Source Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Problem Details</span>
        </button>

        <div className="flex items-center gap-2">
          {apiMeta?.source === 'openrouter' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live OpenRouter: {apiMeta.model}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{apiMeta?.source === 'openrouter_error_fallback' ? 'Fallback Analysis Engine' : 'Mock Analysis Engine'}</span>
            </div>
          )}
        </div>
      </div>

      {/* API Notice / Error if any */}
      {apiMeta?.apiError && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">OpenRouter Status: </span>
            <span>{apiMeta.apiError}</span>
          </div>
        </div>
      )}

      {/* Main Analysis Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 p-6 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(analysisResult.severity)}`}>
              Severity: {analysisResult.severity || 'High'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
              Category: {analysisResult.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {analysisResult.detectedProblem}
          </h1>
          <p className="text-brand-100 text-xs sm:text-sm flex items-center gap-1.5 mt-2">
            <MapPin className="w-3.5 h-3.5 text-brand-300 flex-shrink-0" />
            <span>Reported at {formData.location}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Two Column Section: Image Preview + Citizen Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Uploaded Image Preview */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Evidence Photo
              </label>
              {formData.image ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <img
                    src={formData.image}
                    alt="Problem photo"
                    className="w-full h-52 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400">
                  No image attached
                </div>
              )}
            </div>

            {/* Citizen Context */}
            <div className="md:col-span-7 space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Citizen Statement
              </label>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-700 italic leading-relaxed">
                "{formData.description}"
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100">
                  <div className="text-xs text-brand-700 font-medium">Domain Category</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{analysisResult.category}</div>
                </div>
                <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100">
                  <div className="text-xs text-brand-700 font-medium">Impact Urgency</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{analysisResult.severity} Urgency</div>
                </div>
              </div>
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* Required Expertise Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">
                Required Academic & Engineering Expertise
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              The AI determined that effectively resolving this issue requires specialized capabilities in:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {analysisResult.requiredExpertise?.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs"
                >
                  <Wrench className="w-3.5 h-3.5 text-brand-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Possible Solution Areas */}
          {analysisResult.possibleSolutions && analysisResult.possibleSolutions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Possible Solution & Innovation Areas
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Actionable engineering intervention pathways for university research teams:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {analysisResult.possibleSolutions.map((sol, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{sol}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA: Find Matching Institutions */}
          <div className="pt-4 p-5 bg-gradient-to-r from-brand-50 via-blue-50 to-indigo-50 rounded-xl border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Ready to find colleges equipped to solve this?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Our algorithm will match departments, research facilities, and proximity.
              </p>
            </div>

            <button
              onClick={onFindInstitutions}
              disabled={isMatching}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex-shrink-0"
            >
              {isMatching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Matching Institutions...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4" />
                  <span>Find Institutions</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
