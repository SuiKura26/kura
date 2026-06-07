"use client";

import { MessageSquarePlus, History, Wallet, Languages, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import { Language } from "@/hooks/useChat";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface SidebarProps {
  language: Language;
  toggleLanguage: () => void;
  onNewChat: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ language, toggleLanguage, onNewChat, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    id: {
      newChat: "Obrolan Baru",
      history: "Riwayat",
      wallet: "Hubungkan Wallet",
    },
    en: {
      newChat: "New Chat",
      history: "History",
      wallet: "Connect Wallet",
    }
  };

  const text = t[language];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center p-1">
                <Image
                  src="/kura-logo-dark-mode.png"
                  alt="Kura"
                  width={24}
                  height={24}
                  className="hidden dark:block object-contain"
                />
                <Image
                  src="/kura-logo-light-mode.png"
                  alt="Kura"
                  width={24}
                  height={24}
                  className="block dark:hidden object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">Kura</span>
            </div>
            
            <button 
              className="md:hidden p-1 rounded-md hover:bg-accent text-muted-foreground"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Action */}
          <button 
            onClick={() => {
              onNewChat();
              setIsMobileOpen(false);
            }}
            className="flex items-center space-x-2 w-full p-3 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium mb-6"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{text.newChat}</span>
          </button>

          {/* History placeholder */}
          <div className="flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center">
              <History className="w-3 h-3 mr-2" />
              {text.history}
            </div>
            {/* Mock history items */}
            <div className="space-y-1">
              <button className="w-full text-left p-2 text-sm rounded-md hover:bg-accent truncate text-foreground/80">
                Swap USDC to SUI
              </button>
              <button className="w-full text-left p-2 text-sm rounded-md hover:bg-accent truncate text-foreground/80">
                Stake SUI
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t space-y-2 mt-auto">
            {/* Wallet Connect (Placeholder) */}
            <button className="flex items-center justify-between w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium">
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                {text.wallet}
              </div>
            </button>

            <div className="flex space-x-2">
              <button 
                onClick={toggleLanguage}
                className="flex-1 flex items-center justify-center p-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm"
                title="Toggle Language"
              >
                <Languages className="w-4 h-4 mr-2" />
                <span className="uppercase font-semibold text-xs">{language}</span>
              </button>
              
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 flex items-center justify-center p-2 rounded-lg border bg-background hover:bg-accent transition-colors"
                title="Toggle Theme"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
