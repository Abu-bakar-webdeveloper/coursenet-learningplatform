"use client"

import { cn } from "@/lib/utils"
import { useChat, Message } from "ai/react"
import { Bot, SendHorizontal, Trash, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AiChatBoxProps {
  open: boolean
  onClose: () => void
}

export default function AiChatBox({ open, onClose }: AiChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat()

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user"

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-50 w-full max-w-[500px] p-4 xl:right-36",
        open ? "block" : "hidden"
      )}
    >
      <div className="flex flex-col rounded-lg border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">AI Chat</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-grow p-4" ref={scrollRef}>
          {messages.length === 0 && !error && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Bot className="h-8 w-8 text-muted-foreground" />
              <p className="text-lg font-medium">Send a message to start the AI Chat</p>
              <p className="text-sm text-muted-foreground">
                You can ask the chatbot anything related to the website
              </p>
            </div>
          )}
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setMessages([])}
              aria-label="Clear chat"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              ref={inputRef}
            />
            <Button type="submit" size="icon" disabled={isLoading || input.length === 0}>
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAiMessage = role === "assistant"

  return (
    <div
      className={cn(
        "mb-4 flex items-start",
        isAiMessage ? "justify-start" : "justify-end"
      )}
    >
      {isAiMessage && <Bot className="mr-2 h-5 w-5 flex-none" />}
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[80%]",
          isAiMessage
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <Link
                {...props}
                href={props.href ?? ""}
                className="text-blue-400 hover:underline"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="mt-3 first:mt-0" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="mt-3 list-inside list-disc first:mt-0" />
            ),
            li: ({ node, ...props }) => <li {...props} className="mt-1" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}