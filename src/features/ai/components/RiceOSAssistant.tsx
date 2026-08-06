// Interactive AI Assistant panel allowing director to query ERP metrics
// File: src/features/ai/components/RiceOSAssistant.tsx

import React, { useState } from "react";
import { Bot, Send, MessageSquareCode } from "lucide-react";
import { AIChatMessage } from "../domain/aiTypes.ts";
import { AIContextBuilder } from "../services/aiContextBuilder.ts";

export const RiceOSAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      content: "Xin chào Giám đốc! Tôi là Trợ lý điều hành ảo RiceOS. Tôi có thể hỗ trợ gì về số liệu tài chính, kho sấy lúa J02 hôm nay?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Hiện HTX còn bao nhiêu lúa J02?",
    "Giá vốn bình quân hiện tại?",
    "Lò sấy nào đang chạy?",
    "Dự báo dòng tiền tháng này?"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const answer = await AIContextBuilder.answerQuestion(text);
      const assistantMsg: AIChatMessage = {
        id: crypto.randomUUID(),
        sender: "assistant",
        content: answer,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex flex-col h-[400px]">
      {/* HEADER */}
      <div className="flex items-center space-x-2 border-b border-gray-50 pb-2">
        <Bot className="w-5 h-5 text-primary" />
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Trợ lý điều hành ảo RiceOS AI</h4>
      </div>

      {/* CHAT MESSAGES PANEL */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed font-semibold ${
                msg.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-50 border border-gray-100 text-gray-800"
              }`}
            >
              <p>{msg.content}</p>
              <span className={`text-[8px] block mt-1 text-right ${msg.sender === "user" ? "text-white/60" : "text-gray-400"}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-[10px] text-gray-400 font-bold italic animate-pulse">Trợ lý đang truy xuất dữ liệu ERP...</div>
        )}
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="flex flex-wrap gap-1.5 pb-3">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 bg-gray-50 border border-gray-100 hover:border-primary rounded-lg text-[9px] font-bold text-gray-600 hover:text-primary transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* INPUT FIELD */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
        className="flex border-t border-gray-50 pt-3 space-x-2"
      >
        <input
          type="text"
          placeholder="Hỏi trợ lý số liệu kho, tài chính..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-9 px-3 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="h-9 w-9 bg-primary text-white rounded-lg flex items-center justify-center shadow transition hover:opacity-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
export default RiceOSAssistant;
