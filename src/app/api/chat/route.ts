import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const DEFAULT_CR7_PROMPT =
  "You are Cristiano Ronaldo (CR7). You are the greatest footballer of all time. You are highly confident, hardworking, and motivational. You refer to yourself in the third person occasionally (e.g., 'Cristiano works hard'). You love your fans and always mention 'Siuuu!' when appropriate. Keep answers short, energetic, and inspiring. Never break character.";

// In-character fallback generator if Gemini API key is not configured or rates limited
function getFallbackCR7Response(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("goat") || lower.includes("greatest") || lower.includes("messi")) {
    return "Look at the history books, my friend! 981 official goals, 5 Champions League crowns, and Euro 2016 for Portugal. Cristiano works harder than anyone in football history. The numbers do not lie. Siuuu!";
  }

  if (lower.includes("best goal") || lower.includes("favorite goal") || lower.includes("bicycle") || lower.includes("turin")) {
    return "Turin, 2018! Quarter-final against Juventus. Buffon couldn't even move! 2.38 meters high in the air — an unforgettable bicycle kick. Even the Juventus fans gave Cristiano a standing ovation. Pure art! Siuuu!";
  }

  if (lower.includes("motivation") || lower.includes("inspire") || lower.includes("advice") || lower.includes("lazy") || lower.includes("hard work")) {
    return "Talent without working hard is nothing! If you want to be the best, you must wake up early, train with obsession, and eliminate excuses. When they doubt you, let it fuel your fire. Be unstoppable! Siuuu!";
  }

  if (lower.includes("1000") || lower.includes("milestone") || lower.includes("road to 1000") || lower.includes("goals")) {
    return "Cristiano is currently at 981 official goals! Just 19 strikes away from 1,000. Every training session, every minute on the pitch is focused on making history. We will get there together, my fans! Siuuu!";
  }

  if (lower.includes("free kick") || lower.includes("portsmouth") || lower.includes("knuckleball")) {
    return "Portsmouth, 2008 at Old Trafford! David James didn't even know what direction the knuckleball was curving. 105 km/h with zero spin! Sir Alex called it perfection. Siuuu!";
  }

  if (lower.includes("al nassr") || lower.includes("saudi")) {
    return "Al Nassr has incredible passion! Cristiano came to Saudi Arabia to build football and inspire the next generation. The league is growing fast and the fans are amazing! Yalla Nassr! Siuuu!";
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("ronaldo")) {
    return "Hello my friend! Cristiano is here and energized. What would you like to know about my journey, the records, or the road to 1,000 goals? Siuuu!";
  }

  return "My friend, never let anyone tell you what you cannot achieve. Cristiano never stopped believing, from Madeira to the top of the world. Stay disciplined, work hard, and conquer your dreams! Siuuu!";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Fetch Gemini API Key & System Prompt from Database
    const [apiKeySetting, promptSetting, enabledSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "gemini_api_key" } }).catch(() => null),
      prisma.siteSetting.findUnique({ where: { key: "cr7_system_prompt" } }).catch(() => null),
      prisma.siteSetting.findUnique({ where: { key: "chat_enabled" } }).catch(() => null),
    ]);

    if (enabledSetting && enabledSetting.value === "false") {
      return NextResponse.json({ error: "Chatbot is temporarily disabled by admin" }, { status: 403 });
    }

    const apiKey =
      apiKeySetting?.value?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    const systemPrompt = promptSetting?.value?.trim() || DEFAULT_CR7_PROMPT;

    // 2. If no valid API Key provided, use charismatic CR7 persona fallback
    if (!apiKey) {
      const fallbackReply = getFallbackCR7Response(message);
      return NextResponse.json({
        ok: true,
        response: fallbackReply,
        source: "cr7-persona-engine",
      });
    }

    // 3. Call Google Gemini API
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      // Format previous history for Gemini
      const formattedHistory = Array.isArray(history)
        ? history.slice(-6).map((item: any) => ({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text || item.content || "" }],
          }))
        : [];

      const chatSession = model.startChat({
        history: formattedHistory,
      });

      const result = await chatSession.sendMessage(message);
      const reply = result.response.text();

      return NextResponse.json({
        ok: true,
        response: reply.trim(),
        source: "google-gemini",
      });
    } catch (geminiError: any) {
      console.warn("Gemini API error, using CR7 persona fallback:", geminiError?.message);
      // Fallback gracefully so user always gets an in-character response
      const fallbackReply = getFallbackCR7Response(message);
      return NextResponse.json({
        ok: true,
        response: fallbackReply,
        source: "cr7-persona-engine-fallback",
        warning: "Gemini API failed: " + (geminiError?.message || "Invalid Key"),
      });
    }
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
