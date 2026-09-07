import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setExplanation('');

    try {
      const res = await fetch('http://localhost:5000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      setExplanation(data.explanation || data.error);
    } catch (err) {
      setExplanation('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center text-cyan-400">
          AI Code Explainer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Language (Optional)</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. JavaScript, C++, Python"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Code Snippet</label>
            <textarea
              required
              rows={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 font-mono text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded transition cursor-pointer"
          >
            {loading ? 'Explaining...' : 'Explain Code'}
          </button>
        </form>

        {explanation && (
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg relative">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg text-cyan-400">Explanation</h2>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-cyan-300 transition cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy Explanation'}
              </button>
            </div>

            <div className="text-slate-200 text-sm space-y-2">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}