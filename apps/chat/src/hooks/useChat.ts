"use client";

import { useState, useCallback } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Message, ChatAPIResponse } from "../types/chat";

export type Language = "id" | "en";
export type LoadingStep = "parsing" | "simulating" | "guardian" | null;

export function useChat() {
  const account = useCurrentAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(null);
  const [language, setLanguage] = useState<Language>("id");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: Date.now(),
        type: "text",
      };
      addMessage(userMsg);

      // Build message history for API
      const apiMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content },
      ];

      try {
        setLoadingStep("parsing");

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            language,
            walletAddress: account?.address,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: ChatAPIResponse = await response.json();

        setLoadingStep(null);

        // Add AI response
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: data.role,
          content: data.content,
          timestamp: Date.now() + 1,
          type: data.type,
          transactionData: data.transactionData,
        };
        addMessage(aiMsg);
      } catch (error) {
        console.error("Chat API error:", error);
        setLoadingStep(null);

        // Add error message
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            language === "id"
              ? "Maaf, terjadi kesalahan saat memproses permintaan Anda. Pastikan koneksi internet Anda stabil dan coba lagi."
              : "Sorry, an error occurred while processing your request. Please check your internet connection and try again.",
          timestamp: Date.now() + 1,
          type: "text",
        };
        addMessage(errorMsg);
      }
    },
    [addMessage, language, messages, account?.address]
  );

  return {
    messages,
    loadingStep,
    language,
    toggleLanguage,
    sendMessage,
    clearChat,
    isSidebarOpen,
    setIsSidebarOpen,
    isWalletConnected: !!account,
  };
}
