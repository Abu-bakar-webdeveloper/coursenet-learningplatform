import { cn } from "@/lib/utils";
import { useChat, Message } from "ai/react";
import { Bot, XCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface AiChatBoxProps {
  open: boolean;
  onclose: () => void;
}

export default function AiChatBox({ open, onclose }: AiChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-50 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <button onClick={onclose} className="mb-1 ms-auto block">
        <XCircle size={30} className="rounded-full bg-background" />
      </button>
      <div className="flex h-[500px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3">
           {
            messages.map(message => (
                <ChatMessage message={message} key={message.id}/>
            ))
           }
           {
            !error && messages.length === 0 && (
                <div className="flex flex-col h-full items-center justify-center gap-3 text-center mx-8">
                    <Bot size={28}/>
                    <p className="text-lg font-medium">
                        sent a message to start AI Chat
                    </p>
                    <p>
                        you can ask the chatbot anything related to website
                    </p>
                </div>
            )
           }
        </div>
      </div>
    </div>
  );
}

interface ChatMessageProps{
    message: Message
}

function ChatMessage( {message: {role, content}}: ChatMessageProps) {
    const isAiMessage = role === 'assistant';

    return <div className={cn("mb-3 flex items-start",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end"
    )}>
        {isAiMessage && <Bot className="mr-2 flex-none" /> }
        <div
        className={cn("rounded-md border px-3 py-2",
            isAiMessage ? "bg-background" : "bg-foreground text-background"
        )}
        >
            <ReactMarkdown
            components={{
                a: ({node, ref, ...props}) => (
                    <Link 
                        {...props}
                        href={props.href ?? ""}
                        className="text-blue-400 hover:underline"
                    />
                ),
                p: ({node, ...props}) => (
                    <p {...props} className="mt-3 first:mt-0"/>
                ),
                ul: ({node, ...props}) => (
                    <ul 
                    {...props}
                    className="mt-3 list-inside list-disc first:mt-0"
                    />
                ),
                li: ({node, ...props}) => (
                    <li
                    {...props}
                    className="mt-1"
                    />
                )
            }}
            >
                {content}
            </ReactMarkdown>
        </div>
    </div>
}

