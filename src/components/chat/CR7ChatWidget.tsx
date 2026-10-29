"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Flame,
  Bot,
  RotateCcw,
  User,
  Zap,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  "Who is the GOAT? 🐐",
  "Best goal ever? ⚽",
  "Give me motivation 🔥",
  "Road to 1,000 goals 🚀",
];

export function CR7ChatWidget() {
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "model",
      text: "Hello my friend! Cristiano is here. Ask me anything about my career, my mindset, or the road to 1,000 goals. Siuuu!",
      time: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Don't render if disabled in admin settings
  if (settings.chat_enabled === "false") {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const botReply =
        data.ok && data.response
          ? data.response
          : "Cristiano is focused on the next match! Stay strong and keep working hard. Siuuu!";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "The internet had a small delay, but Cristiano never stops! Try again my friend. Siuuu!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "intro-reset",
        role: "model",
        text: "Chat cleared! Cristiano is ready for new questions. What is on your mind? Siuuu!",
        time: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white border border-[#FEBE10]/60 shadow-[0_0_25px_rgba(254,190,16,0.35)] hover:shadow-[0_0_35px_rgba(254,190,16,0.55)] hover:border-[#FEBE10] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open The GOAT AI Chat"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#FEBE10]/20 blur-md pointer-events-none group-hover:bg-[#FEBE10]/30 transition-all" />

          {/* Golden Avatar Icon */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#FEBE10] to-[#b3860b] text-black shadow-inner">
            <span className="font-black text-xs tracking-tighter">CR7</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-black" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wider uppercase text-white font-mono flex items-center gap-1">
              <span>The GOAT AI</span>
              <Sparkles className="w-3 h-3 text-[#FEBE10]" />
            </span>
            <span className="text-[10px] font-mono text-[#FEBE10]">Chat with Ronaldo</span>
          </div>
        </button>
      </div>

      {/* 2. Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-zinc-900/80 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#FEBE10] to-[#b3860b] text-black font-black text-sm shadow-[0_0_15px_rgba(254,190,16,0.35)]">
                  CR7
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-900" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                    <span>Cristiano Ronaldo</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30">
                      AI GOAT
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Siuuu Ready
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
              {messages.map((m) => {
                const isBot = m.role === "model";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FEBE10] to-[#b3860b] text-black flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">
                        CR7
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isBot
                          ? "bg-zinc-900/90 text-zinc-100 border border-zinc-800/80 shadow-md"
                          : "bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black font-medium shadow-[0_0_15px_rgba(254,190,16,0.2)]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <span
                        className={`block text-[9px] font-mono mt-1 ${
                          isBot ? "text-zinc-500" : "text-black/60"
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>

                    {!isBot && (
                      <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-700">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FEBE10] to-[#b3860b] text-black flex items-center justify-center font-black text-[10px] shrink-0">
                    CR7
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE10] animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#FEBE10] animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#FEBE10] animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                    <span className="text-[10px] font-mono text-zinc-400 ml-1">Cristiano is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Chips */}
            <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-950/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium whitespace-nowrap bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-[#FEBE10] border border-zinc-800 hover:border-[#FEBE10]/40 transition-colors disabled:opacity-40"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-zinc-800 bg-zinc-900/70 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Cristiano anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FEBE10] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#FEBE10] text-black hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CR7ChatWidget;
