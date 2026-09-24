import React, { useState } from 'react';
import { X, UploadCloud, Video, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentSubmissionUrl = '',
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(currentSubmissionUrl || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url || !url.trim()) {
      setError('Please provide a submission URL');
      return;
    }

    try {
      new URL(url); // basic URL validity
    } catch {
      setError('Please enter a valid web URL starting with https://');
      return;
    }

    try {
      await onSubmit(url);
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to submit entry');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Your Dance Entry</h3>
              <p className="text-[11px] text-slate-500">Video submission for evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guidelines */}
        <div className="bg-cyan-50/60 border border-cyan-100 rounded-xl p-3 text-[11px] text-cyan-900 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <Video className="w-3.5 h-3.5" /> Supported Links:
          </p>
          <ul className="list-disc list-inside text-[10px] space-y-0.5 text-cyan-800">
            <li>YouTube (Public or Unlisted video)</li>
            <li>Google Drive (Link set to "Anyone with link can view")</li>
            <li>Vimeo / Instagram Reel link</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Video Link URL
            </label>
            <input
              type="url"
              required
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-600 font-mono"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-800 hover:to-teal-700 active:scale-98 text-white font-extrabold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Entry...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Video Submission</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
