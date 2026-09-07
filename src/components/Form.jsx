import { useState } from "react";

function Form() {
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setExplanation("");

    try {
      const response = await fetch("http://localhost:5000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      setExplanation(data.explanation || data.error);
    } catch (err) {
      setExplanation("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Language (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. JavaScript, C++, Python"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Code Snippet
          </label>
          <textarea
            rows="8"
            required
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Explaining..." : "Explain Code"}
        </button>
      </form>

      {explanation && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-2">
          <h2 className="text-xl font-bold text-indigo-400">Explanation</h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;