import { useState } from "react";
import { GEMINI_API_BASE } from "../constants/xu";

export function useGemini(apiKey) {
  const [loading, setLoading] = useState(false);

  const sendMessage = async ({
    systemPrompt,
    contents,
    tools,
    generationConfig = {},
  }) => {
    if (!apiKey) throw new Error("API key missing.");
    setLoading(true);
    try {
      const body = {
        contents,
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 512,
          ...generationConfig,
        },
      };
      if (systemPrompt)
        body.system_instruction = { parts: [{ text: systemPrompt }] };
      if (tools) body.tools = tools;

      const res = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error)
        throw new Error(data.error.message || JSON.stringify(data.error));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const extractText = (data) =>
    data?.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ?? "";

  const extractFunctionCall = (data) =>
    data?.candidates?.[0]?.content?.parts?.find((p) => p.functionCall)
      ?.functionCall ?? null;

  return { sendMessage, extractText, extractFunctionCall, loading };
}
