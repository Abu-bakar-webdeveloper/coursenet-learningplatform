"use client"

import { useState } from "react"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import AiChatBox from "./AiChatBox"

export default function AiChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setChatBoxOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Open AI Chat"
      >
        <Bot className="h-6 w-6" />
        <span className="sr-only">Open AI Chat</span>
      </Button>
      <AiChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  )
}