export default function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  const isFunction = msg.role === "function";

  if (isFunction) {
    return (
      <div className="flex justify-start mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 max-w-[90%] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-xu-silver animate-pulse" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              System Process: {msg.fnName}
            </p>
          </div>
          <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {msg.content}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-8 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-12 h-12 skeuo-inset rounded-full flex-shrink-0 mr-3 self-end p-1 shadow-md">
          <img
            src="/xu.jpg"
            alt="XU"
            className="w-full h-full object-contain rounded-full bg-white shadow-inner"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="hidden w-full h-full rounded-full bg-xu-blue border-2 border-xu-silver items-center justify-center text-white font-bold text-xs">
            XU
          </div>
        </div>
      )}

      <div
        className={`max-w-[80%] px-6 py-4 text-sm leading-relaxed whitespace-pre-wrap transition-all duration-200 ${
          isUser
            ? "skeuo-bubble-user text-white rounded-[24px_24px_4px_24px] border border-white/10 shadow-lg"
            : "skeuo-bubble-bot text-gray-700 rounded-[24px_24px_24px_4px] border border-white/80 shadow-md"
        }`}
      >
        {msg.content}
        {!isUser && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-xu-silver uppercase tracking-widest opacity-60">
              Registrar Assistant
            </span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-12 h-12 skeuo-inset rounded-full flex-shrink-0 ml-3 self-end p-1 shadow-md flex items-center justify-center text-xu-blue font-black text-sm">
          {/* Default user icon or initial */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

