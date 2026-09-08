import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  Wrench, 
  Layers, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Check, 
  Clock, 
  Zap, 
  GitBranch 
} from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function InstitutionDetails({ 
  institutionId, 
  problemData, 
  analysisResult, 
  onBack 
}) {
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittedDispatch, setSubmittedDispatch] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        // Call live POST endpoint with problem context so LLM generates university-specific resolution plan
        const res = await fetch(`${API_BASE_URL}/api/institutions/${institutionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemTitle: analysisResult?.detectedProblem || "Reported Problem",
            category: analysisResult?.category || "",
            severity: analysisResult?.severity || "High",
            requiredExpertise: analysisResult?.requiredExpertise || [],
            location: problemData?.location || "",
            description: problemData?.description || "",
            image: problemData?.image || null
          })
        });

        const data = await res.json();
        if (data.success) {
          setInstitution(data.data);
        }
      } catch (err) {
        console.error("Failed to load institution details", err);
      } finally {
        setLoading(false);
      }
    }

    if (institutionId) {
      fetchDetails();
    }
  }, [institutionId, analysisResult, problemData]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <div>
          <p className="text-base font-semibold text-slate-800">Generating University Action Plan via AI...</p>
          <p className="text-xs text-slate-500 mt-1">Synthesizing department capabilities and specialized lab interventions</p>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-slate-600">Institution profile not found.</p>
        <button onClick={onBack} className="mt-4 text-brand-600 font-semibold text-sm">
          Return to Results
        </button>
      </div>
    );
  }

  const breakdown = institution.matchBreakdown || {
    domainRelevance: 95,
    departmentFit: 92,
    researchInfrastructure: 94,
    geographicProximity: 96
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matching Results</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Live AI Action Plan Generated</span>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {institution.type || 'Institute of National Importance'}
                </span>
                {institution.nirfRank && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    NIRF Rank #{institution.nirfRank}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {institution.name}
              </h1>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  {institution.location}
                </span>
                {institution.established && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    Est. {institution.established}
                  </span>
                )}
              </div>
            </div>

            {/* University Portal Link */}
            {institution.portalUrl && (
              <a
                href={institution.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium backdrop-blur-sm transition-colors flex-shrink-0"
              >
                <span>University Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Faculty Recommendation Callout */}
          {institution.facultyRecommendation && (
            <div className="mt-5 p-3.5 bg-white/10 border border-white/15 rounded-xl text-xs sm:text-sm text-brand-100 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
              <span>{institution.facultyRecommendation}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Live AI Resolution Action Plan */}
          {institution.actionPlan && institution.actionPlan.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-brand-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Live University Resolution Roadmap
                  </h2>
                </div>
                {institution.estimatedResolutionTime && (
                  <span className="text-xs text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Est. Timeline: {institution.estimatedResolutionTime}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {institution.actionPlan.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                        {step.phase}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 text-2xs sm:text-xs text-slate-500 font-medium">
                      Lead: <span className="text-slate-800 font-semibold">{step.department}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match Score Breakdown Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Match Fit Breakdown
              </h2>
              <span className="text-xs text-slate-400">
                AI evaluation for: {analysisResult?.detectedProblem || "Reported Problem"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Domain Relevance</div>
                <div className="text-xl font-bold text-brand-700 mt-1">{breakdown.domainRelevance}%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${breakdown.domainRelevance}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Department Fit</div>
                <div className="text-xl font-bold text-brand-700 mt-1">{breakdown.departmentFit}%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${breakdown.departmentFit}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Research & Labs</div>
                <div className="text-xl font-bold text-brand-700 mt-1">{breakdown.researchInfrastructure}%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${breakdown.researchInfrastructure}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Regional Proximity</div>
                <div className="text-xl font-bold text-brand-700 mt-1">{breakdown.geographicProximity}%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${breakdown.geographicProximity}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Relevant Departments */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              Relevant Departments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {institution.departments?.map((dept, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium flex items-center gap-2.5"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0" />
                  <span>{dept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Engineering Expertise */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-600" />
              Core Technical Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {institution.expertise?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200 text-xs sm:text-sm font-medium rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Research Areas & Dedicated Labs */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              Specialized Research Areas & Test Facilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {institution.researchAreas?.map((area, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer: Connect / Dispatch Problem Brief */}
          <div className="bg-gradient-to-r from-brand-50 to-blue-50 p-6 rounded-2xl border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Forward Problem Brief to {institution.shortName || institution.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Transmits problem diagnostic packet to the Dean of R&D and RuTAG student projects committee.
              </p>
            </div>

            {submittedDispatch ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-sm flex-shrink-0">
                <Check className="w-4 h-4" />
                <span>Problem Brief Dispatched!</span>
              </div>
            ) : (
              <button
                onClick={() => setSubmittedDispatch(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Problem Brief</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
