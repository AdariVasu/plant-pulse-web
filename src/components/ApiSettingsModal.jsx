import React, { useState, useEffect } from 'react';
import { Key, X, CheckCircle2, Shield, Eye, EyeOff, Activity, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { testGeminiConnection, saveServerApiKey } from '../utils/aiVisionEngine';

export default function ApiSettingsModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (apiKey) {
        setKeyInput(apiKey);
      }
      testGeminiConnection(apiKey).then(res => setTestResult(res));
    }
  }, [isOpen, apiKey]);

  if (!isOpen) return null;

  const handleTestConnection = async (overrideKey) => {
    setIsTesting(true);
    setTestResult(null);

    const targetKey = overrideKey !== undefined ? overrideKey : keyInput;
    const res = await testGeminiConnection(targetKey);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSave = async () => {
    const cleanKey = keyInput.trim();
    onSaveApiKey(cleanKey);
    await saveServerApiKey(cleanKey);

    setSavedSuccess(true);
    await handleTestConnection(cleanKey);

    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  const getAuthStatusText = () => {
    if (!testResult) return 'NOT CONFIGURED';
    if (testResult.success || testResult.connected || testResult.status === 'ready' || testResult.status === 'CONNECTED') return 'CONFIGURED';
    if (testResult.status === 'missing_key' || testResult.status === 'NOT_CONFIGURED') return 'NOT CONFIGURED';
    if (testResult.status === 'authentication_error') return 'AUTHENTICATION ERROR';
    if (testResult.status === 'api_error') return 'API ERROR';
    return 'NOT CONFIGURED';
  };

  const getConnectionStatusText = () => {
    if (testResult?.success || testResult?.connected || testResult?.status === 'ready' || testResult?.gemini === 'ready' || testResult?.status === 'CONNECTED') return 'CONNECTED';
    if (testResult?.status === 'missing_key' || testResult?.status === 'NOT_CONFIGURED') return 'NOT CONNECTED';
    if (testResult?.status || testResult?.error) return 'ERROR';
    return 'NOT CONNECTED';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1f14] border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-gray-200">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1a3322]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-[#1c3a25] pb-3 mb-4 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-base uppercase tracking-wider">
            <Key className="w-5 h-5" />
            <span>GOOGLE GEMINI VISION AI</span>
          </div>
          <p className="text-xs text-gray-300">
            Configure your Google Gemini authentication credential.
          </p>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
          <div className="bg-[#13261a] border border-[#1f3e28] p-2.5 rounded-xl">
            <span className="text-[10px] text-gray-400 block uppercase">Authentication</span>
            <strong className={`text-xs ${
              getAuthStatusText() === 'CONFIGURED' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {getAuthStatusText()}
            </strong>
          </div>

          <div className="bg-[#13261a] border border-[#1f3e28] p-2.5 rounded-xl">
            <span className="text-[10px] text-gray-400 block uppercase">Connection</span>
            <strong className={`text-xs ${
              getConnectionStatusText() === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {getConnectionStatusText()}
            </strong>
          </div>
        </div>

        <div className="space-y-4 text-xs">

          {/* Instruction Card */}
          <div className="bg-[#14261a] border border-[#22442d] p-3.5 rounded-xl space-y-1.5 text-gray-300">
            <div className="flex items-center justify-between font-bold text-emerald-400 text-xs">
              <span>Google Gemini Credential</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:underline text-[11px]"
              >
                <span>Get Credential</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Enter your Google Gemini API credential from Google AI Studio.
            </p>
          </div>

          {/* Key Input Box */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Enter Gemini Authentication Credential:
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Enter your Google Gemini API credential..."
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  setTestResult(null);
                }}
                className="bg-[#14261a] border border-[#20402b] text-white pl-3 pr-10 py-2.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 font-mono text-xs shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                title={showKey ? "Hide credential" : "Show credential"}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTestConnection()}
              disabled={isTesting || !keyInput.trim()}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-[#14261a] hover:bg-[#1a3323] text-gray-200 border border-[#20402b] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Connection</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!keyInput.trim()}
              className="py-2.5 px-3 rounded-xl font-extrabold text-xs bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-black" />
                  <span>Save & Connect</span>
                </>
              )}
            </button>
          </div>

          {/* Test Connection Output Banner */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              (testResult.success || testResult.connected) 
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-red-950/60 border-red-700/60 text-red-300'
            }`}>
              {(testResult.success || testResult.connected) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {(testResult.success || testResult.connected) ? 'Connection Verified' : (testResult.status || testResult.error || 'Authentication Error')}
                </span>
                <span>{testResult.message || testResult.error}</span>
              </div>
            </div>
          )}

          <div className="bg-[#13261a] border border-[#1e3f28] p-3 rounded-xl space-y-1 text-[11px] text-gray-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Shield className="w-4 h-4" />
              <span>Server-Side Security</span>
            </div>
            <p className="text-gray-400 leading-snug">
              Credentials are processed securely server-side and sent directly to Google Gemini API.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
