import React, { useEffect, useRef, useState } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function AnalysisVisualizer({ imageSrc, onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Image uploaded & verified', minProgress: 10 },
    { label: 'Calibrating foliage pixel colorimetry', minProgress: 25 },
    { label: 'Detecting botanical leaf margins', minProgress: 45 },
    { label: 'Identifying crop species & phenotype', minProgress: 65 },
    { label: 'Extracting pathogen lesion morphology', minProgress: 85 },
    { label: 'Generating agronomic prescription', minProgress: 100 }
  ];

  useEffect(() => {
    let animationFrame;
    let currentProgress = 0;
    let completed = false;

    const safeComplete = () => {
      if (!completed) {
        completed = true;
        onComplete();
      }
    };

    // Safety fallback timeout: ensure completion in at most 1.6s
    const fallbackTimer = setTimeout(safeComplete, 1600);

    const canvas = canvasRef.current;
    if (!canvas) {
      safeComplete();
      return () => clearTimeout(fallbackTimer);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    const img = new Image();
    if (imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))) {
      img.crossOrigin = "anonymous";
    }
    img.src = imageSrc;

    const startAnimation = (sourceImg) => {
      const drawScan = () => {
        currentProgress += 2.5;
        if (currentProgress > 100) currentProgress = 100;

        const p = Math.floor(currentProgress);
        setProgress(p);

        if (p >= 85) setCurrentStep(5);
        else if (p >= 65) setCurrentStep(4);
        else if (p >= 45) setCurrentStep(3);
        else if (p >= 25) setCurrentStep(2);
        else if (p >= 10) setCurrentStep(1);
        else setCurrentStep(0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (sourceImg) {
          try {
            ctx.drawImage(sourceImg, 0, 0, canvas.width, canvas.height);
          } catch (e) {
            ctx.fillStyle = '#0a160d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }

        // Green matrix grid overlay
        ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Laser scan line
        const scanY = (canvas.height * currentProgress) / 100;
        const gradient = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
        gradient.addColorStop(0, "rgba(16, 185, 129, 0)");
        gradient.addColorStop(0.5, "rgba(52, 211, 153, 0.85)");
        gradient.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 15, canvas.width, 30);

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.stroke();

        if (currentProgress < 100) {
          animationFrame = requestAnimationFrame(drawScan);
        } else {
          setTimeout(safeComplete, 200);
        }
      };

      drawScan();
    };

    img.onload = () => startAnimation(img);
    img.onerror = () => startAnimation(null);

    return () => {
      clearTimeout(fallbackTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [imageSrc, onComplete]);

  return (
    <div className="bg-[#0f1f14] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c3a25] pb-4 mb-4">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
          <Cpu className="w-5 h-5 animate-spin" />
          <span>On-Device AI Scanner Active</span>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2.5 py-1 rounded-md">
          {progress}% COMPLETED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Canvas Visualizer */}
        <div className="relative rounded-xl overflow-hidden border border-emerald-500/50 shadow-inner bg-black flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-[240px] object-cover" />
          
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-[11px] font-mono text-emerald-400 px-2 py-1 rounded border border-emerald-800">
            CLIENT_AI :: SCANNING
          </div>
        </div>

        {/* Step-by-Step Progress Checklist */}
        <div className="space-y-4">
          <div className="w-full bg-[#14281b] h-2.5 rounded-full overflow-hidden border border-[#1f3f2a]">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-2 text-xs">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div 
                  key={idx}
                  className={`flex items-center gap-2.5 transition-colors ${
                    isCompleted ? 'text-emerald-400' : isCurrent ? 'text-white font-semibold' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] ${
                    isCompleted 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' 
                      : isCurrent 
                        ? 'border-emerald-400 text-emerald-300 animate-pulse' 
                        : 'border-gray-700 text-gray-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
