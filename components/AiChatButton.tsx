"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import AiChatBox from "./AiChatBox";

export default function AiChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <button onClick={() => setChatBoxOpen(true)}>
        <Bot size={24} />
      </button>
      <AiChatBox open={chatBoxOpen} onclose={() => setChatBoxOpen(false)}/>
    </>
  );
}
