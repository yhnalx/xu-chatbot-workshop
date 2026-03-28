import { useState, useRef, useEffect } from "react";
import ChatBubble from "../../components/ChatBubble";
import { useGemini } from "../../hooks/useGemini";
import {
  REGISTRAR_SYSTEM_PROMPT,
  FEW_SHOT_EXAMPLES,
  XU_TOOLS,
  executeMockFunction,
} from "../../constants/xu";

const INITIAL_MESSAGE = {
  role: "model",
  content:
    "*bangs a heavy metal stapler onto a stack of carbon-copy forms and sighs deeply*\n\nLook at this desk. Do you see the height of these documents? I have 47 requests pending and the printer is jammed again.\n\nMake it quick. If it's not about Xavier University - Ateneo de Cagayan, don't even think about wasting my ink.",
};

const SUGGESTED_QUESTIONS = [
  "What are the enrollment requirements?",
  "Tell me a fun fact about XU",
  "When is the Registrar's office open?",
  "What is XU's mascot?",
  "How do I request a transcript?",
  "What is Ateneo de Cagayan?",
];

export default function ChatPage({ apiKey }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [fewShot, setFewShot] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage, extractText, extractFunctionCall, loading } =
    useGemini(apiKey);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const buildContents = (history) => {
    const base = fewShot ? [...FEW_SHOT_EXAMPLES] : [];
    const convo = history
      .filter((_, i) => i > 0)
      .filter((m) => m.role === "user" || m.role === "model")
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));
    return [...base, ...convo];
  };

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userText },
        {
          role: "model",
          content:
            "I apologize, but there is no API key configured. Please set the Gemini API key in the settings to proceed.",
        },
      ]);
      setInput("");
      return;
    }

    const userMsg = { role: "user", content: userText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");

    try {
      const contents = buildContents(newMsgs);

      const data = await sendMessage({
        systemPrompt: REGISTRAR_SYSTEM_PROMPT,
        contents,
        tools: XU_TOOLS,
        generationConfig: { temperature: 0.9, maxOutputTokens: 512 },
      });

      const fnCall = extractFunctionCall(data);
      const textReply = extractText(data);

      if (fnCall) {
        const { name, args } = fnCall;
        const mockResult = executeMockFunction(name, args);

        const fnMsg = {
          role: "function",
          fnName: name,
          content: JSON.stringify(mockResult, null, 2),
        };

        const data2 = await sendMessage({
          systemPrompt: REGISTRAR_SYSTEM_PROMPT,
          contents: [
            ...contents,
            { role: "model", parts: [{ functionCall: { name, args } }] },
            {
              role: "user",
              parts: [{ functionResponse: { name, response: mockResult } }],
            },
          ],
          generationConfig: { temperature: 0.9, maxOutputTokens: 512 },
        });

        const finalReply = extractText(data2);
        setMessages([
          ...newMsgs,
          fnMsg,
          {
            role: "model",
            content:
              finalReply ||
              "I've processed your request. Here is the information I found.",
          },
        ]);
      } else {
        setMessages([...newMsgs, { role: "model", content: textReply }]);
      }
    } catch (e) {
      setMessages([
        ...newMsgs,
        {
          role: "model",
          content: `An error occurred while processing your request: ${e.message}`,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-xu-bg text-gray-800 font-sans">
      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/xu.jpg"
              alt="Xavier Ateneo Logo"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            {/* Fallback Seal if xu.jpg is missing */}
            <div
              className="hidden w-12 h-12 rounded-full bg-xu-blue border-2 border-xu-gold items-center justify-center flex-shrink-0"
              title="XU Seal Fallback"
            >
              <span className="text-white font-bold text-sm">XU</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-xu-blue leading-tight uppercase tracking-tight">
                Xavier University
              </h1>
              <p className="text-xs font-semibold text-xu-gold uppercase tracking-wider">
                Ateneo de Cagayan · Virtual Registrar
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-xu-blue transition-colors rounded-full hover:bg-gray-100"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Settings drawer ── */}
      {showSettings && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-6 transition-all duration-300">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-xu-blue"
                />
                {apiKey && (
                  <span className="absolute right-3 top-2.5 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => setFewShot(!fewShot)}
                className={`
      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full 
      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-xu-blue/20
      ${fewShot ? "bg-blue-200" : "bg-slate-200"}
    `}
              >
                <span
                  className={`
        pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white 
        shadow-md transition duration-200 ease-in-out
        ${fewShot ? "translate-x-6" : "translate-x-1"}
      `}
                />
              </button>

              <div className="flex flex-col">
                <button
                  onClick={() => setFewShot(!fewShot)}
                  className="text-left text-sm font-bold text-slate-800 hover:text-xu-blue transition-colors"
                >
                  Enhanced Context Mode
                </button>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  When enabled, the assistant provides more precise and branded
                  responses based on university guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat area ── */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-6 py-8 bg-pattern scrollbar-thin"
      >
        <div className="max-w-4xl mx-auto">
          {messages.map((m, i) => (
            <ChatBubble key={i} msg={m} />
          ))}

          {loading && (
            <div className="flex justify-start mb-6">
              <div className="w-10 h-10 rounded-full flex-shrink-0 mr-3 self-end shadow-sm">
                <img
                  src="/xu.jpg"
                  alt="R"
                  className="w-full h-full object-contain rounded-full bg-white border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden w-full h-full rounded-full bg-xu-blue border-2 border-xu-gold items-center justify-center text-white font-bold text-xs">
                  XU
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex gap-2 items-center shadow-sm">
                <span className="w-2 h-2 rounded-full bg-xu-blue/40 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-xu-blue/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-xu-blue animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer / Input ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Suggested questions */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="flex-shrink-0 text-xs px-4 py-2 bg-gray-50 hover:bg-xu-blue hover:text-white border border-gray-200 hover:border-xu-blue rounded-full transition-all duration-200 font-medium whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex-1 relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-xu-blue/20 focus-within:border-xu-blue transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="How can the Registrar's Office help you today?"
                className="flex-1 bg-transparent py-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="ml-2 p-2 bg-xu-blue hover:bg-xu-blueLight disabled:bg-gray-300 text-white rounded-xl transition-colors shadow-md shadow-xu-blue/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 rotate-90"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
            Official Xavier University – Ateneo de Cagayan Portal
          </p>
        </div>
      </div>
    </div>
  );
}
