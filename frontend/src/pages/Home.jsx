import React from 'react';
import { ArrowRight, Sparkles, Building2, UploadCloud, CheckCircle2, ChevronRight } from 'lucide-react';
import { samplePresets } from '../data/samplePresets';

export default function Home({ onStartReport, onSelectPreset }) {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold border border-brand-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>CivicSetu • Community Problem Resolution Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Connect Local Community Problems with <span className="text-brand-600">University Innovators</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have a broken handpump, waterlogged road, or failing community grid? Upload a photo and let AI diagnose the required engineering expertise and match you with top Indian universities equipped to solve it.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg shadow-brand-600/25 transition-all transform active:scale-95 text-base"
            >
              <span>Report a Problem</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="pt-6 grid grid-cols-3 max-w-lg mx-auto divide-x divide-slate-200 text-center text-xs sm:text-sm text-slate-600">
            <div>
              <div className="font-bold text-slate-900 text-lg sm:text-xl">1-Click</div>
              <div>AI Diagnosis</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg sm:text-xl">500+</div>
              <div>Academic Labs</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg sm:text-xl">94%+</div>
              <div>Match Accuracy</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3-Step Flow Diagram */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How It Works</h2>
          <p className="text-sm text-slate-500 mt-1">From a photo on your phone to university research deployment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-brand-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-bold text-lg">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">Step 1</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Upload Problem</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Take or upload a photo of the civic issue, describe what went wrong, and pinpoint your locality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-brand-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold text-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Step 2</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">AI Diagnosis & Skills</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              AI categorizes the failure, estimates severity, and determines the specialized engineering and research disciplines needed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-brand-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold text-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Step 3</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Find Institutions</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              The matching engine ranks top colleges and institutes (NITs, IITs, universities) with the exact labs and faculty to solve it.
            </p>
          </div>

        </div>
      </section>

      {/* Preset Problem Scenarios for 1-Click Testing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 uppercase tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant Evaluation Demos</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Try a Real-World Scenario
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Click any scenario below to test the full pipeline immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {samplePresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                        {preset.badge}
                      </span>
                      <span className="text-xs text-slate-400">{preset.location}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Matches: <strong className="text-slate-800">{preset.expectedInstitutions}</strong>
                  </span>
                  <span className="inline-flex items-center text-brand-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Test this <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
