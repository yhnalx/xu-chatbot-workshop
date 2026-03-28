import { useState } from "react";
import ChatPage from "./features/chat/ChatPage";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState("");

  const handleSubmit = () => {
    if (draft.trim()) {
      setApiKey(draft.trim());
      setSubmitted(true);
    }
  };

  if (!submitted) {
    return (
      <div className="min-h-screen bg-xu-bg flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          <div className="skeuo-panel rounded-[2rem] p-10">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-28 h-28 flex items-center justify-center overflow-hidden skeuo-inset rounded-full p-2">
                  <img
                    src="/xu.jpg"
                    alt="Xavier Ateneo Logo"
                    className="w-full h-full object-contain drop-shadow-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-20 h-20 rounded-full bg-xu-blue border-2 border-xu-silver items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">XU</span>
                  </div>
                </div>
                {/* Badge - Positioned relative to the logo container */}
                <div className="absolute -bottom-1 -right-1 bg-xu-silver text-xu-blue text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter border-2 border-white shadow-md">
                  Registrar
                </div>
              </div>

              <div className="text-center mt-8">
                <h1 className="text-2xl font-black text-xu-blue leading-none uppercase tracking-tight drop-shadow-sm">
                  Xavier University
                </h1>
                <p className="text-[11px] font-bold text-xu-silver uppercase tracking-[0.25em] mt-3">
                  Ateneo de Cagayan
                </p>
                <div className="h-1.5 w-12 skeuo-silver-trim mx-auto mt-6 rounded-full" />
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Gemini API Key
                </label>
                <div className="skeuo-inset rounded-2xl p-1">
                  <input
                    type="password"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••••••••••••••••••••••"
                    className="w-full bg-transparent px-5 py-4 text-sm font-mono text-gray-700 placeholder-gray-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!draft.trim()}
                className="w-full skeuo-button hover:opacity-90 disabled:opacity-30 text-white font-bold text-sm py-5 rounded-2xl transition-all uppercase tracking-widest active:scale-[0.98] shadow-lg"
              >
                Enter Virtual Desk
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-0.5 skeuo-silver-trim rounded-full opacity-30" />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                  Secure Access
                </p>
                <div className="flex-1 h-0.5 skeuo-silver-trim rounded-full opacity-30" />
              </div>

              <div className="bg-white/50 border border-white rounded-2xl p-4 shadow-inner">
                <p className="text-center text-[11px] text-slate-600 leading-relaxed italic">
                  "Please have your student ID ready. We have{" "}
                  <span className="font-bold text-xu-blue">
                    47 other requests
                  </span>{" "}
                  waiting."
                </p>
              </div>
            </div>
          </div>

          <footer className="text-center mt-12">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold opacity-60">
              Official Registrar Portal
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return <ChatPage apiKey={apiKey} />;
}
