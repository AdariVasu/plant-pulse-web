import React, { useRef, useState } from 'react';
import { Upload, Camera, RefreshCw, X, Sparkles, Image as ImageIcon, Eye } from 'lucide-react';
import { PLANT_DISEASES_DATABASE } from '../data/plantDatabase';

export default function ImageUploader({ 
  selectedImage, 
  onImageSelect, 
  onSelectSample, 
  onStartAnalyze, 
  onStartAnalysis,
  isAnalyzing,
  selectedCropId = 'auto',
  onSelectCrop,
  selectedSymptom = 'auto',
  onSelectSymptom
}) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const startAnalysisHandler = onStartAnalyze || onStartAnalysis;

  const CROP_OPTIONS = [
    { id: 'auto', label: '⚡ Auto-Detect Plant' },
    { id: 'rice', label: '🌾 Rice / Paddy' },
    { id: 'cotton', label: '☁️ Cotton' },
    { id: 'wheat', label: '🌾 Wheat' },
    { id: 'tomato', label: '🍅 Tomato' },
    { id: 'potato', label: '🥔 Potato' },
    { id: 'maize', label: '🌽 Maize / Corn' },
    { id: 'mango', label: '🥭 Mango' },
    { id: 'grape', label: '🍇 Grape' },
    { id: 'apple', label: '🍎 Apple' },
    { id: 'chilli', label: '🌶️ Chilli' },
    { id: 'rose', label: '🌹 Rose' }
  ];

  const SYMPTOM_OPTIONS = [
    { id: 'auto', label: '⚡ Auto-Detect Symptoms' },
    { id: 'spots', label: '🟤 Leaf Spots & Rings' },
    { id: 'blight', label: '🍂 Blight & Rot' },
    { id: 'mildew', label: '⚪ Powdery Mildew' },
    { id: 'rust', label: '🟠 Rust Pustules' },
    { id: 'yellowing', label: '🟡 Yellowing / Curl' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      alert("Camera access denied or unavailable. Please upload an image file instead.");
      setShowWebcam(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setShowWebcam(false);
      onImageSelect(dataUrl);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowWebcam(false);
  };

  return (
    <div className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-5 shadow-xl relative space-y-3.5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Upload className="w-5 h-5 text-emerald-400" />
          <span>Upload Plant Image</span>
        </div>
        <span className="text-[11px] text-gray-400 font-mono bg-[#14261a] border border-[#1f3d28] px-2 py-0.5 rounded">
          JPG, PNG, WEBP
        </span>
      </div>

      {/* Target Crop Selector */}
      <div className="bg-[#09150d] p-2.5 rounded-xl border border-[#1a3824]">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[11px] font-bold text-gray-300">1. Target Plant / Crop:</span>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
            {selectedCropId === 'auto' ? '⚡ Auto-Detecting' : `Selected: ${selectedCropId.toUpperCase()}`}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-800">
          {CROP_OPTIONS.map((c) => {
            const isSelected = (selectedCropId || 'auto') === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCrop) onSelectCrop(c.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md font-black'
                    : 'bg-[#122417] text-gray-300 hover:text-white border-[#1d3d27]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptom Pattern Selector */}
      <div className="bg-[#09150d] p-2.5 rounded-xl border border-[#1a3824]">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            2. Symptom Pattern:
          </span>
          <span className="text-[10px] text-teal-400 font-mono font-semibold">
            {selectedSymptom === 'auto' ? '⚡ Visual Colorimetry' : `Pattern: ${selectedSymptom.toUpperCase()}`}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-800">
          {SYMPTOM_OPTIONS.map((s) => {
            const isSelected = (selectedSymptom || 'auto') === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectSymptom) onSelectSymptom(s.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500 text-black border-teal-400 shadow-md font-black'
                    : 'bg-[#122417] text-gray-300 hover:text-white border-[#1d3d27]'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Upload Zone or Preview */}
      {!selectedImage && !showWebcam && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[240px] ${
            isDragOver 
              ? 'border-emerald-400 bg-emerald-950/30' 
              : 'border-[#1e3e27] hover:border-emerald-500/60 bg-[#112217]/50 hover:bg-[#13261a]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <ImageIcon className="w-8 h-8" />
          </div>

          <h4 className="text-white font-semibold text-sm mb-1">
            Drag &amp; drop plant leaf image here
          </h4>
          <p className="text-xs text-gray-400 mb-4 max-w-xs">
            or click to browse from computer / phone storage
          </p>

          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Browse Files
            </button>
            <button
              onClick={startCamera}
              className="bg-[#18301f] hover:bg-[#20402a] text-emerald-300 border border-[#274f32] font-medium text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              Use Camera
            </button>
          </div>
        </div>
      )}

      {/* Webcam View */}
      {showWebcam && (
        <div className="relative rounded-xl overflow-hidden bg-black border border-emerald-500/40 min-h-[250px] flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-[250px] object-cover" />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 px-4">
            <button
              onClick={capturePhoto}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2 rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="bg-gray-800/90 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-full border border-gray-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Preview State */}
      {selectedImage && !showWebcam && (
        <div className="relative rounded-xl overflow-hidden border border-[#22442b] bg-[#09140c] min-h-[230px] max-h-[280px] flex items-center justify-center group">
          <img
            src={selectedImage}
            alt="Leaf Preview"
            className="w-full h-[240px] object-contain bg-black/40"
          />

          <button
            onClick={() => onImageSelect(null)}
            className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-500 text-white p-1.5 rounded-full shadow-lg transition-all cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Action Button */}
      {selectedImage && (
        <button
          onClick={startAnalysisHandler}
          disabled={isAnalyzing}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
            isAnalyzing
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 cursor-wait'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-extrabold shadow-emerald-950/60 hover:shadow-emerald-500/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Analyzing Leaf Pathology &amp; Extraction...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>Analyze Plant &amp; Find Remedies</span>
            </>
          )}
        </button>
      )}

      {/* Sample Crop Presets */}
      <div className="pt-2 border-t border-[#183320]">
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test with Verified Sample Crops:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PLANT_DISEASES_DATABASE.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample && onSelectSample(sample)}
              className="flex items-center gap-2 bg-[#122417] hover:bg-[#193320] border border-[#1f3e28] hover:border-emerald-500/40 text-gray-200 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${
                sample.status === 'INFECTED' ? 'bg-red-400' : 'bg-emerald-400'
              }`} />
              <span className="font-medium">{sample.cropName}</span>
              <span className="text-[10px] text-gray-400">({sample.diseaseName.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
