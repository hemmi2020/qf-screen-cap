'use client';
import { useState } from 'react';
import { Camera, Video, Download, Loader2, Globe, Clock, Layers, Zap } from 'lucide-react';

export default function RecorderTool({ onToolClick, isLoggedIn }) {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [recording, setRecording] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitTime, setWaitTime] = useState(15000);
  const [recordDuration, setRecordDuration] = useState(15000);
  const [multiPage, setMultiPage] = useState(false);
  const [fps, setFps] = useState(30);

  const handleRecord = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      onToolClick();
      return;
    }
    
    setRecordingLoading(true);
    setError('');
    setRecording([]);
    
    try {
      const apiEndpoint = fps === 30 ? '/api/record30' : '/api/record60';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), duration: recordDuration, multiPage })
      });
      const data = await response.json();
      
      if (data.requiresSubscription) {
        setError(data.error + ` (${data.trialCount || 0}/3 trials used)`);
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      
      if (data.success) {
        setRecording(data.video || data.frames || []);
      } else {
        setError(data.error || 'Failed to record');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
    setRecordingLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      onToolClick();
      return;
    }
    
    setLoading(true);
    setError('');
    setScreenshot('');
    
    let cleanUrl = url.trim();
    if (cleanUrl.match(/https?:\/\/.+https?:\/\//)) {
      const match = cleanUrl.match(/^(https?:\/\/[^?]+\?[^&]*)/);
      if (match) cleanUrl = match[1];
    }
    
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl, waitTime })
      });
      const data = await response.json();
      
      if (data.requiresSubscription) {
        setError(data.error + ` (${data.trialCount || 0}/3 trials used)`);
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      
      if (data.success) {
        setScreenshot(data.screenshot);
      } else {
        setError(data.error || 'Failed to capture screenshot');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-8 glow-effect">
        {/* URL Input */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium mb-3">
            <Globe className="w-4 h-4 mr-2 text-[hsl(187_92%_55%)]" />
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full h-14 px-4 text-lg bg-[hsl(222_47%_14%)] border border-[hsl(222_47%_18%)] rounded-xl text-white placeholder-[hsl(215_20%_55%)] input-glow"
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="flex items-center text-sm font-medium mb-3">
              <Clock className="w-4 h-4 mr-2 text-[hsl(187_92%_55%)]" />
              Record Duration
            </label>
            <input
              type="number"
              value={recordDuration}
              onChange={(e) => setRecordDuration(Number(e.target.value))}
              className="w-full h-12 px-4 bg-[hsl(222_47%_14%)] border border-[hsl(222_47%_18%)] rounded-xl text-white input-glow"
              min="5000" max="30000" step="5000"
            />
            <p className="text-xs text-[hsl(215_20%_55%)] mt-2">5-30 seconds</p>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium mb-3">
              <Clock className="w-4 h-4 mr-2 text-[hsl(280_70%_60%)]" />
              Wait Time (ms)
            </label>
            <input
              type="number"
              value={waitTime}
              onChange={(e) => setWaitTime(Number(e.target.value))}
              className="w-full h-12 px-4 bg-[hsl(222_47%_14%)] border border-[hsl(222_47%_18%)] rounded-xl text-white input-glow"
              min="0" step="1000"
            />
            <p className="text-xs text-[hsl(215_20%_55%)] mt-2">For lazy-loaded content</p>
          </div>
        </div>

        {/* FPS Selection */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium mb-3">
            <Zap className="w-4 h-4 mr-2 text-[hsl(187_92%_55%)]" />
            Frame Rate
          </label>
          <div className="flex gap-6">
            {[30, 60].map((rate) => (
              <label key={rate} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="fps"
                    value={rate}
                    checked={fps === rate}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-[hsl(222_47%_18%)] peer-checked:border-[hsl(187_92%_55%)] peer-checked:bg-[hsl(187_92%_55%/0.2)] transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                    <div className="w-2.5 h-2.5 rounded-full bg-[hsl(187_92%_55%)]" />
                  </div>
                </div>
                <span className="text-sm group-hover:text-[hsl(187_92%_55%)] transition-colors">
                  {rate} FPS <span className="text-[hsl(215_20%_55%)]">({rate === 30 ? 'Faster' : 'Smoother'})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Multi-Page Toggle */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={multiPage}
                onChange={(e) => setMultiPage(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-11 h-6 rounded-full bg-[hsl(222_47%_14%)] peer-checked:bg-[hsl(187_92%_55%/0.3)] transition-all" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[hsl(215_20%_55%)] peer-checked:bg-[hsl(187_92%_55%)] peer-checked:translate-x-5 transition-all shadow-sm" />
            </div>
            <div>
              <span className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                Multi-Page Recording
              </span>
              <p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">Records all navigation pages</p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleSubmit}
            disabled={loading || !url}
            className="btn-primary h-16 rounded-xl font-semibold text-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-[hsl(187_92%_55%/0.5)] hover:border-[hsl(187_92%_55%)]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
            {loading ? 'Capturing...' : 'Capture Screenshot'}
          </button>
          <button 
            onClick={handleRecord}
            disabled={recordingLoading || !url}
            className="btn-recording h-16 rounded-xl font-semibold text-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-[hsl(280_70%_60%/0.5)] hover:border-[hsl(280_70%_60%)]"
          >
            {recordingLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Video className="w-6 h-6" />}
            {recordingLoading ? 'Recording...' : 'Record Animation'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 glass-card rounded-xl p-4 border-[hsl(0_84%_60%/0.5)]">
          <p className="text-[hsl(0_84%_60%)] font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {(loading || recordingLoading) && (
        <div className="mt-6 glass-card rounded-xl p-6 border-[hsl(187_92%_55%/0.3)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[hsl(187_92%_55%/0.2)] border-t-[hsl(187_92%_55%)] animate-spin" />
            <div>
              <p className="font-semibold">{loading ? 'Capturing Screenshot...' : 'Recording Animation...'}</p>
              <p className="text-sm text-[hsl(215_20%_55%)]">
                {loading ? 'May take 40-90 seconds for complex pages' : 'Capturing frames...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Result */}
      {recording && typeof recording === 'string' && (
        <div className="mt-6 glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-[hsl(187_92%_55%)]" />
            Screen Recording
          </h2>
          <video src={recording} controls autoPlay className="w-full rounded-lg border border-[hsl(222_47%_18%)]" />
          <a href={recording} download="recording.webm" className="mt-4 inline-flex items-center gap-2 btn-gradient px-4 py-2 rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" /> Download Recording
          </a>
        </div>
      )}

      {/* Screenshot Result */}
      {screenshot && (
        <div className="mt-6 glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[hsl(187_92%_55%)]" />
            Screenshot Result
          </h2>
          <img src={screenshot} alt="Screenshot" className="w-full rounded-lg border border-[hsl(222_47%_18%)]" />
          <a href={screenshot} download="screenshot.png" className="mt-4 inline-flex items-center gap-2 btn-gradient px-4 py-2 rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" /> Download Screenshot
          </a>
        </div>
      )}
    </div>
  );
}
