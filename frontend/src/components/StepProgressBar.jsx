import React from 'react';
import { Camera, BrainCircuit, Building2, FileCheck } from 'lucide-react';

const steps = [
  { id: 'report', label: '1. Report Problem', icon: Camera },
  { id: 'analysis', label: '2. AI Analysis', icon: BrainCircuit },
  { id: 'results', label: '3. Matching Institutions', icon: Building2 },
  { id: 'details', label: '4. Institution Details', icon: FileCheck }
];

export default function StepProgressBar({ currentScreen, onNavigate }) {
  const getStepIndex = (screen) => {
    switch (screen) {
      case 'report': return 0;
      case 'analysis': return 1;
      case 'results': return 2;
      case 'details': return 3;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(currentScreen);
  if (currentIndex === -1) return null; // Don't show on home screen

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <React.Fragment key={step.id}>
              <div 
                onClick={() => isCompleted && onNavigate(step.id)}
                className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                  isCurrent 
                    ? 'text-brand-700 font-semibold' 
                    : isCompleted 
                      ? 'text-slate-700 cursor-pointer hover:text-brand-600' 
                      : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                  isCurrent 
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 font-bold' 
                    : isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? '✓' : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </div>

              {idx < steps.length - 1 && (
                <div className={`flex-1 mx-2 sm:mx-4 h-0.5 transition-colors ${
                  idx < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
