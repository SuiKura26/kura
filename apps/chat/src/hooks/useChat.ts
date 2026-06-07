"use client";

import { useState, useCallback } from "react";
import { Message, TransactionData } from "../types/chat";
import { MOCK_SWAP_TRANSACTION, MOCK_HIGH_RISK_TRANSACTION } from "../data/mockData";

export type Language = "id" | "en";
export type LoadingStep = "parsing" | "simulating" | "guardian" | null;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(null);
  const [language, setLanguage] = useState<Language>("id");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === "id" ? "en" : "id");
  }, []);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: Date.now(),
      type: "text"
    };
    addMessage(userMsg);

    // Simulate flow
    setLoadingStep("parsing");
    await new Promise(r => setTimeout(r, 1000));
    
    setLoadingStep("simulating");
    await new Promise(r => setTimeout(r, 1500));
    
    setLoadingStep("guardian");
    await new Promise(r => setTimeout(r, 1200));
    
    setLoadingStep(null);

    // Determine which mock to use
    let txData = MOCK_SWAP_TRANSACTION;
    if (content.toLowerCase().includes("meme") || content.toLowerCase().includes("high risk")) {
      txData = MOCK_HIGH_RISK_TRANSACTION;
    } else if (content.toLowerCase().includes("hello") || content.toLowerCase().includes("halo")) {
      // Just a text response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "id" 
          ? "Halo! Saya Kura, asisten DeFi Anda di jaringan Sui. Apa yang ingin Anda lakukan hari ini?"
          : "Hello! I am Kura, your DeFi assistant on the Sui network. What would you like to do today?",
        timestamp: Date.now() + 1,
        type: "text"
      };
      addMessage(aiMsg);
      return;
    }

    // Add AI response with transaction card
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: language === "id"
        ? "Ini adalah rincian transaksi Anda. Harap tinjau laporan risiko Guardian sebelum mengeksekusi."
        : "Here are your transaction details. Please review the Guardian risk report before executing.",
      timestamp: Date.now() + 1,
      type: "transaction",
      transactionData: txData
    };
    addMessage(aiMsg);
  }, [addMessage, language]);

  return {
    messages,
    loadingStep,
    language,
    toggleLanguage,
    sendMessage,
    clearChat,
    isSidebarOpen,
    setIsSidebarOpen
  };
}
