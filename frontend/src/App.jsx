import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StepProgressBar from './components/StepProgressBar';

import Home from './pages/Home';
import ReportProblem from './pages/ReportProblem';
import AIAnalysis from './pages/AIAnalysis';
import InstitutionResults from './pages/InstitutionResults';
import InstitutionDetails from './pages/InstitutionDetails';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home | report | analysis | results | details
  
  // Form input state
  const [formData, setFormData] = useState({
    image: null,
    imageName: '',
    description: '',
    location: ''
  });

  // AI Analysis result state & API metadata
  const [analysisResult, setAnalysisResult] = useState(null);
  const [apiMeta, setApiMeta] = useState(null);

  // Matched institutions state
  const [matchedInstitutions, setMatchedInstitutions] = useState([]);
  
  // Selected institution for details screen
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  // Reset to Home / Start new report
  const handleReset = () => {
    setFormData({
      image: null,
      imageName: '',
      description: '',
      location: ''
    });
    setAnalysisResult(null);
    setApiMeta(null);
    setMatchedInstitutions([]);
    setSelectedInstitutionId(null);
    setCurrentScreen('home');
  };

  // 1-Click Preset Selection from Home
  const handleSelectPreset = (preset) => {
    setFormData({
      image: preset.image,
      imageName: preset.title,
      description: preset.description,
      location: preset.location
    });
    setCurrentScreen('report');
  };

  // Submit problem for AI analysis
  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: formData.image,
          description: formData.description,
          location: formData.location
        })
      });

      const json = await res.json();
      if (json.success) {
        setAnalysisResult(json.data);
        setApiMeta({
          source: json.source,
          model: json.model,
          apiError: json.apiError
        });
        setCurrentScreen('analysis');
      } else {
        alert("Analysis failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Analysis network error:", err);
      alert("Could not connect to the backend server. Check the deployment API URL and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Find institutions with LIVE LLM + image context
  const handleFindInstitutions = async () => {
    if (!analysisResult) return;

    try {
      setIsMatching(true);
      const res = await fetch(`${API_BASE_URL}/api/institutions/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: formData.image, // Pass photo to live LLM vision for institution matching
          problemTitle: analysisResult.detectedProblem || '',
          category: analysisResult.category || '',
          severity: analysisResult.severity || '',
          requiredExpertise: analysisResult.requiredExpertise || [],
          location: formData.location || '',
          description: formData.description || '',
          suggestedRankings: analysisResult.suggestedRankings || []
        })
      });

      const json = await res.json();
      if (json.success) {
        setMatchedInstitutions(json.data || []);
        setCurrentScreen('results');
      } else {
        alert("Institution matching failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Matching error:", err);
      alert("Failed to match institutions from server.");
    } finally {
      setIsMatching(false);
    }
  };

  // View details of a specific institution
  const handleSelectInstitution = (id) => {
    setSelectedInstitutionId(id);
    setCurrentScreen('details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Top Navigation */}
      <Navbar onReset={handleReset} currentScreen={currentScreen} />

      {/* Step Progress Bar (shown on sub-pages) */}
      <StepProgressBar 
        currentScreen={currentScreen} 
        onNavigate={(screen) => setCurrentScreen(screen)} 
      />

      {/* Main Screen View */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <Home 
            onStartReport={() => setCurrentScreen('report')} 
            onSelectPreset={handleSelectPreset}
          />
        )}

        {currentScreen === 'report' && (
          <ReportProblem 
            formData={formData}
            setFormData={setFormData}
            onAnalyze={handleAnalyze}
            isLoading={isAnalyzing}
          />
        )}

        {currentScreen === 'analysis' && (
          <AIAnalysis 
            formData={formData}
            analysisResult={analysisResult}
            apiMeta={apiMeta}
            onFindInstitutions={handleFindInstitutions}
            onBack={() => setCurrentScreen('report')}
            isMatching={isMatching}
          />
        )}

        {currentScreen === 'results' && (
          <InstitutionResults 
            matchedInstitutions={matchedInstitutions}
            problemTitle={analysisResult?.detectedProblem || "Reported Problem"}
            onSelectInstitution={handleSelectInstitution}
            onBack={() => setCurrentScreen('analysis')}
          />
        )}

        {currentScreen === 'details' && (
          <InstitutionDetails 
            institutionId={selectedInstitutionId}
            problemData={formData}
            analysisResult={analysisResult}
            onBack={() => setCurrentScreen('results')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
