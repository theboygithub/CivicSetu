import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  MapPin, 
  FileText, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Navigation,
  AlertCircle
} from 'lucide-react';
import { samplePresets } from '../data/samplePresets';

const popularLocations = [
  "Jamshedpur, Jharkhand",
  "Ranchi, Jharkhand",
  "Dhanbad, Jharkhand",
  "Kharagpur, West Bengal",
  "Rourkela, Odisha"
];

// Compress & resize image to max 1024px so it never exceeds OpenRouter limits
function compressImage(file, maxDimension = 1024, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ReportProblem({ 
  formData, 
  setFormData, 
  onAnalyze, 
  isLoading 
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }
    setErrorMsg("");

    try {
      const compressedDataUrl = await compressImage(file);
      setFormData(prev => ({
        ...prev,
        image: compressedDataUrl,
        imageName: file.name
      }));
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to basic reader
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result,
          imageName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null, imageName: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDetectLocation = () => {
    const previousLocation = formData.location;

    if (!navigator.geolocation) {
      setErrorMsg("GPS is not available in this browser. Please enter the location manually.");
      return;
    }

    setErrorMsg("");
    setFormData(prev => ({ ...prev, location: "Detecting GPS location..." }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: `GPS coordinates: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        }));
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. Allow location access in your browser and try again.",
          2: "Your location could not be determined. Check your device location settings and try again.",
          3: "GPS detection timed out. Try again or enter the location manually."
        };
        setFormData(prev => ({ ...prev, location: previousLocation }));
        setErrorMsg(messages[error.code] || "GPS detection failed. Please enter the location manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setErrorMsg("Please enter a short description of the problem.");
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg("Please specify the location of the problem.");
      return;
    }
    setErrorMsg("");
    onAnalyze();
  };

  const loadPreset = (preset) => {
    setFormData({
      image: preset.image,
      imageName: preset.title,
      description: preset.description,
      location: preset.location
    });
    setErrorMsg("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Report a Community Problem
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Provide a photo and short details. AI will diagnose the issue and match institutions to solve it.
        </p>
      </div>

      {/* Quick Fill Helper */}
      <div className="mb-6 p-3.5 bg-brand-50/70 border border-brand-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-brand-900 font-medium">
          <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>Quick fill with official demo preset:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {samplePresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p)}
              className="text-xs bg-white hover:bg-brand-100/60 text-slate-700 hover:text-brand-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors shadow-2xs"
            >
              {p.title.split(' ')[1] || p.title}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* 1. Photo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand-600" />
              1. Photo of the Problem
            </span>
            <span className="text-xs font-normal text-slate-400">
              Clear image helps AI identify mechanical/civil damage
            </span>
          </label>

          {!formData.image ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-brand-500 bg-brand-50/50' 
                  : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <UploadCloud className="w-6 h-6 text-brand-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Click to browse or drag and drop photo
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, WEBP (Auto-optimized for AI vision analysis)
              </p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img
                src={formData.image}
                alt="Problem preview"
                className="w-full max-h-72 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-xs font-semibold text-slate-800 rounded-lg shadow-sm"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Short Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-600" />
              2. Problem Description
            </span>
            <span className="text-xs font-normal text-slate-400">
              Explain how it broke and community impact
            </span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="e.g. This handpump has not worked for two months. It supplies drinking water to the local hamlet."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm placeholder:text-slate-400 text-slate-800"
          />
        </div>

        {/* 3. Location */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              3. Location
            </span>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="text-xs text-brand-600 hover:text-brand-800 font-medium inline-flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              Auto-detect GPS
            </button>
          </label>
          
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g. Jamshedpur, Jharkhand or Village Name"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm placeholder:text-slate-400 text-slate-800"
          />

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs text-slate-400">Suggestions:</span>
            {popularLocations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, location: loc }))}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Analyze Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-semibold text-base shadow-md shadow-brand-600/25 transition-all transform active:scale-98"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Analyzing Problem & Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Analyze Problem</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI diagnoses severity, engineering skills needed, and prepares university matches
          </p>
        </div>

      </form>

    </div>
  );
}
