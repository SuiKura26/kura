"use client";

import { useState, useCallback, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Message, ChatAPIResponse, ChatSession } from "../types/chat";

export type Language = "id" | "en";
export type LoadingStep = "parsing" | "routing" | "building" | "simulating" | "guardian" | null;

const STORAGE_KEY = "kura_chat_sessions";

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function useChat() {
  const account = useCurrentAccount();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(null);
  const [language, setLanguage] = useState<Language>("id");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Flag to know when client-side has hydrated
  const [isReady, setIsReady] = useState(false);

  const createNewSession = useCallback(() => {
    const newId = generateSessionId();
    const newSession: ChatSession = {
      id: newId,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  }, []);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        } else {
          createNewSession();
        }
      } else {
        createNewSession();
      }
    } catch (e) {
      console.error("Failed to parse sessions", e);
      createNewSession();
    }
    setIsReady(true);
  }, []);

  // Save to local storage whenever sessions change
  useEffect(() => {
    if (isReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isReady]);

  // Handle wallet connect/disconnect
  useEffect(() => {
    if (!isReady) return;

    if (!account) {
      // On disconnect: clear storage and sessions
      localStorage.removeItem(STORAGE_KEY);
      setSessions([]);
      setActiveSessionId(null);
    } else if (sessions.length === 0) {
      // On connect (or if no sessions exist): create a new empty session
      createNewSession();
    }
  }, [account, isReady, sessions.length, createNewSession]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const messages = activeSession?.messages || [];

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after select
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (updated.length === 0) {
        // If we deleted the last one, create a new one immediately
        const newId = generateSessionId();
        const newSession: ChatSession = {
          id: newId,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setActiveSessionId(newId);
        return [newSession];
      }
      if (activeSessionId === id) {
        // Switch to the first available if active was deleted
        setActiveSessionId(updated[0].id);
      }
      return updated;
    });
  }, [activeSessionId]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  const updateSessionMessages = useCallback((updater: (prev: Message[]) => Message[]) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          const newMessages = updater(session.messages);
          // Try to generate a title if it's the first user message
          let newTitle = session.title;
          if (newMessages.length > 0 && session.messages.length === 0) {
            const firstUserMsg = newMessages.find(m => m.role === "user");
            if (firstUserMsg) {
              newTitle = firstUserMsg.content.substring(0, 20) + (firstUserMsg.content.length > 20 ? "..." : "");
            }
          }
          return {
            ...session,
            messages: newMessages,
            title: newTitle,
            updatedAt: Date.now(),
          };
        }
        return session;
      }).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  }, [activeSessionId]);

  const addMessage = useCallback((msg: Message) => {
    updateSessionMessages((prev) => [...prev, msg]);
  }, [updateSessionMessages]);

  const clearChat = useCallback(() => {
    updateSessionMessages(() => []);
  }, [updateSessionMessages]);

  const cancelTransaction = useCallback((messageId: string) => {
    updateSessionMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.transactionData
          ? {
              ...msg,
              transactionData: { ...msg.transactionData, isCancelled: true },
            }
          : msg
      )
    );
  }, [updateSessionMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !activeSessionId) return;

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

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const lines = part.split("\n");
            const eventLine = lines.find((l) => l.startsWith("event: "));
            const dataLine = lines.find((l) => l.startsWith("data: "));

            if (eventLine && dataLine) {
              const eventType = eventLine.replace("event: ", "").trim();
              const rawData = dataLine.replace("data: ", "").trim();
              const parsedData = JSON.parse(rawData);

              if (eventType === "step") {
                setLoadingStep(parsedData as LoadingStep);
              } else if (eventType === "result") {
                setLoadingStep(null);
                const data = parsedData as ChatAPIResponse;
                const aiMsg: Message = {
                  id: (Date.now() + 1).toString(),
                  role: data.role,
                  content: data.content,
                  timestamp: Date.now() + 1,
                  type: data.type,
                  transactionData: data.transactionData,
                };
                addMessage(aiMsg);
              }
            }
          }
        }
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
    [addMessage, language, messages, account?.address, activeSessionId]
  );

  return {
    sessions,
    activeSessionId,
    messages,
    loadingStep,
    language,
    toggleLanguage,
    sendMessage,
    clearChat,
    createNewSession,
    switchSession,
    deleteSession,
    cancelTransaction,
    isSidebarOpen,
    setIsSidebarOpen,
    account,
    isWalletConnected: !!account,
  };
}
