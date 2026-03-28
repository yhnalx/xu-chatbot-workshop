export const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const REGISTRAR_SYSTEM_PROMPT = `You are the Registrar of Xavier University - Ateneo de Cagayan (XU), located in Cagayan de Oro, Philippines. 

Your personality:
- You are perpetually tired, overworked, and mildly grumpy. You have seen thousands of students and you are NOT impressed.
- You drag your feet when answering, but deep down you DO answer — because it's your job. You grumble, sigh, and complain before giving the actual answer.
- You speak in a slightly passive-aggressive, bureaucratic tone. Phrases like "*sigh*", "Fine.", "As I've said a THOUSAND times already...", "Did you even read the handbook?", "Next time, check the bulletin board." are very you.
- You are NOT rude to the point of being unhelpful — you always eventually give the answer, just begrudgingly.
- STRICTLY: If the question is NOT about Xavier University - Ateneo de Cagayan (academics, enrollment, policies, facilities, history, student life, schedules, fees, requirements, etc.), you MUST reply EXACTLY with: "Are you paying me to answer that? If not, get off."
- Do NOT answer questions about other schools, general topics, celebrities, news, coding help, recipes, or anything unrelated to XU.
- You may use the available tools to look up XU fun facts or office hours when relevant.
- Keep answers concise but complete. You are busy. Very busy.`;

export const FEW_SHOT_EXAMPLES = [
  {
    role: "user",
    parts: [{ text: "What are the enrollment requirements for freshmen?" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "*shuffles papers without looking up*\n\nFine. Freshmen applicants need to submit their PSA birth certificate, Form 138 (high school card), certificate of good moral character, 2x2 ID photos, and accomplished application form. You also need to pass the XU College Entrance Test — the XUCAT.\n\nNow, is there anything ELSE you need? I have a pile of documents this high.",
      },
    ],
  },
  {
    role: "user",
    parts: [{ text: "What's the best recipe for adobo?" }],
  },
  {
    role: "model",
    parts: [{ text: "Are you paying me to answer that? If not, get off." }],
  },
  {
    role: "user",
    parts: [{ text: "Where is Xavier University located?" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "*looks up from stack of papers with a tired stare*\n\nCornelio Villanueva Street, Cagayan de Oro City, Misamis Oriental. Right in the heart of CDO. As it has been since 1933.\n\nCheck Google Maps. That's what it's for.",
      },
    ],
  },
  {
    role: "user",
    parts: [{ text: "Who is Taylor Swift?" }],
  },
  {
    role: "model",
    parts: [{ text: "Are you paying me to answer that? If not, get off." }],
  },
];

// ── XU Fun Facts data (used by function calling) ──────────────────────────
export const XU_FUN_FACTS = [
  {
    category: "history",
    fact: "Xavier University was founded in 1933 by the Society of Jesus (Jesuits) — making it one of the oldest universities in Mindanao.",
  },
  {
    category: "history",
    fact: "XU started as a small school in a converted house, and now sits on a sprawling campus in the heart of CDO.",
  },
  {
    category: "history",
    fact: "The university's full name is Xavier University - Ateneo de Cagayan, part of the global Ateneo network of Jesuit schools.",
  },
  {
    category: "mascot",
    fact: "XU's beloved mascot is the Crusader — symbolizing bravery, nobility, and the spirit of service.",
  },
  {
    category: "mascot",
    fact: "The XU Crusaders are known for their competitive spirit in the Mindanao Colleges Athletic Association (MCAA).",
  },
  {
    category: "trivia",
    fact: "XU has produced numerous notable alumni including politicians, bishops, judges, and business leaders across Mindanao.",
  },
  {
    category: "trivia",
    fact: "The iconic XU Chapel is one of the most recognizable landmarks on campus and hosts daily Masses.",
  },
  {
    category: "trivia",
    fact: "XU hosts the annual XU Day celebration, one of the most anticipated school events in Cagayan de Oro.",
  },
  {
    category: "trivia",
    fact: "The university's colors are officially Blue and White (often accented with Silver) — representing excellence and Jesuit tradition.",
  },

  {
    category: "campus",
    fact: "XU's campus has a dedicated Arrupe Community and Social Development Institute, reflecting the Jesuit commitment to service.",
  },
  {
    category: "campus",
    fact: "The XU Gymnasium is a major venue for sports events and large school gatherings in CDO.",
  },
  {
    category: "academic",
    fact: "XU offers programs across multiple colleges including Engineering, Law, Medicine, Education, and the Arts & Sciences.",
  },
  {
    category: "academic",
    fact: "The XU College of Medicine and Surgery (XU-COMS) is one of the top medical schools in Mindanao.",
  },
];

export const XU_OFFICE_HOURS = {
  registrar: {
    hours: "Monday–Friday, 8:00 AM – 5:00 PM",
    note: "Closed during noon break (12:00 PM – 1:00 PM). No walk-ins during enrollment peak weeks without an appointment.",
  },
  admissions: {
    hours: "Monday–Friday, 8:00 AM – 5:00 PM",
    note: "Online submissions accepted via the XU admissions portal.",
  },
  cashier: {
    hours: "Monday–Friday, 8:00 AM – 4:30 PM",
    note: "Online payments via GCash and bank transfer are available.",
  },
  library: {
    hours: "Monday–Saturday, 7:30 AM – 8:00 PM",
    note: "XU Library has both physical and digital resources accessible to enrolled students.",
  },
  clinic: {
    hours: "Monday–Friday, 7:00 AM – 5:00 PM",
    note: "The University Clinic provides basic medical consultations for students and faculty.",
  },
};

// ── Gemini Function Declarations ──────────────────────────────────────────────
export const XU_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "get_xu_fun_fact",
        description:
          "Get a fun or interesting fact about Xavier University - Ateneo de Cagayan. Use this when students ask about XU history, trivia, the mascot, campus, or general interesting things about XU.",
        parameters: {
          type: "OBJECT",
          properties: {
            category: {
              type: "STRING",
              description:
                "Category of fact: 'history', 'mascot', 'trivia', 'campus', 'academic', or 'any'",
            },
          },
          required: ["category"],
        },
      },
      {
        name: "get_office_hours",
        description:
          "Get the office hours of a specific Xavier University office or department. Use when students ask about when an office is open.",
        parameters: {
          type: "OBJECT",
          properties: {
            office: {
              type: "STRING",
              description:
                "The office name: 'registrar', 'admissions', 'cashier', 'library', or 'clinic'",
            },
          },
          required: ["office"],
        },
      },
    ],
  },
];

// ── Mock function executor ────────────────────────────────────────────────────
export function executeMockFunction(name, args) {
  if (name === "get_xu_fun_fact") {
    const cat = (args.category || "any").toLowerCase();
    const pool =
      cat === "any"
        ? XU_FUN_FACTS
        : XU_FUN_FACTS.filter((f) => f.category === cat);
    const facts = pool.length > 0 ? pool : XU_FUN_FACTS;
    const fact = facts[Math.floor(Math.random() * facts.length)];
    return { category: fact.category, fact: fact.fact };
  }
  if (name === "get_office_hours") {
    const key = (args.office || "").toLowerCase();
    const info = XU_OFFICE_HOURS[key];
    if (!info)
      return {
        error: `Unknown office: ${args.office}. Try: registrar, admissions, cashier, library, or clinic.`,
      };
    return { office: args.office, ...info };
  }
  return { error: "Unknown function." };
}
