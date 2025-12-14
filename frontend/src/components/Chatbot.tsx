import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink, FileText, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QAMode = "grounded" | "related" | "hybrid";

interface Source {
  title: string;
  url: string;
  type: "document" | "general";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  mode?: QAMode;
}

const modeInfo: Record<QAMode, { label: string; description: string; icon: React.ReactNode }> = {
  grounded: {
    label: "Grounded",
    description: "Answers only from your document",
    icon: <FileText className="w-4 h-4" />,
  },
  related: {
    label: "Related",
    description: "General medical knowledge",
    icon: <Globe className="w-4 h-4" />,
  },
  hybrid: {
    label: "Hybrid",
    description: "Document first, then general",
    icon: <Sparkles className="w-4 h-4" />,
  },
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<QAMode>("hybrid");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your MedEase AI assistant. I can help you understand medical terms, explain your documents, or answer health-related questions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSourcesForMode = (currentMode: QAMode, keyword: string): Source[] => {
    const documentSources: Source[] = [
      { title: "Your uploaded document", url: "#", type: "document" },
      { title: "Document section 2.3", url: "#", type: "document" },
    ];
    
    const generalSources: Source[] = [
      { title: "Mayo Clinic - Patient Education", url: "#", type: "general" },
      { title: "NIH Health Information", url: "#", type: "general" },
    ];

    switch (currentMode) {
      case "grounded":
        return documentSources;
      case "related":
        return generalSources;
      case "hybrid":
        return [...documentSources.slice(0, 1), ...generalSources.slice(0, 1)];
      default:
        return [];
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response based on mode
    setTimeout(() => {
      let responseContent = "";
      
      if (mode === "grounded") {
        if (input.toLowerCase().includes("copd") || input.toLowerCase().includes("breathing")) {
          responseContent = "Based on your document: The patient shows signs of COPD with temporary worsening. The document mentions hypoxemia (low oxygen) and recommends bronchodilator therapy along with supplemental oxygen.";
        } else {
          responseContent = "I couldn't find specific information about that in your uploaded document. Try asking about the conditions, treatments, or terms mentioned in your document.";
        }
      } else if (mode === "related") {
        if (input.toLowerCase().includes("copd")) {
          responseContent = "COPD (Chronic Obstructive Pulmonary Disease) is a chronic lung condition that makes breathing difficult. It includes emphysema and chronic bronchitis. Common treatments include bronchodilators, steroids, and pulmonary rehabilitation.";
        } else if (input.toLowerCase().includes("pneumonia")) {
          responseContent = "Pneumonia is a lung infection that can be caused by bacteria, viruses, or fungi. Symptoms include cough, fever, and difficulty breathing. Bacterial pneumonia is typically treated with antibiotics.";
        } else {
          responseContent = "Based on general medical knowledge: This topic relates to common health conditions. For specific guidance about your situation, please consult with your healthcare provider.";
        }
      } else {
        // Hybrid mode
        if (input.toLowerCase().includes("copd") || input.toLowerCase().includes("breathing")) {
          responseContent = "From your document: Your condition involves COPD with signs of infection (pneumonia). The treatment plan includes antibiotics and breathing support.\n\nAdditional context: COPD is a chronic condition that can have periodic flare-ups. Managing triggers and following your treatment plan helps prevent complications.";
        } else {
          responseContent = "I didn't find direct information in your document, so here's some general guidance: This is a common topic in healthcare. For personalized advice, please consult your doctor.";
        }
      }

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        sources: getSourcesForMode(mode, input),
        mode: mode,
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-float flex items-center justify-center hover:bg-primary-hover transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100 animate-bounce-soft"
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-float flex flex-col overflow-hidden z-50 transition-all duration-300 ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">
                MedEase Assistant
              </h3>
              <p className="text-xs text-primary-foreground/80">
                Always here to help
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-4 py-3 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Mode:</span>
            <Select value={mode} onValueChange={(value: QAMode) => setMode(value)}>
              <SelectTrigger className="h-8 text-xs flex-1 rounded-lg bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-[100]">
                {(Object.keys(modeInfo) as QAMode[]).map((key) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    <div className="flex items-center gap-2">
                      {modeInfo[key].icon}
                      <div>
                        <span className="font-medium">{modeInfo[key].label}</span>
                        <span className="text-muted-foreground ml-1">— {modeInfo[key].description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-slide-up ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-chat-user text-primary-foreground rounded-tr-md"
                      : "bg-chat-bot text-foreground rounded-tl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>

                {/* Sources with type indicators */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground px-1 flex items-center gap-1">
                      Sources used:
                      {message.mode && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary text-xs">
                          {modeInfo[message.mode].icon}
                          {modeInfo[message.mode].label}
                        </span>
                      )}
                    </p>
                    {message.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        className="flex items-center gap-1.5 text-xs px-1 hover:underline"
                      >
                        {source.type === "document" ? (
                          <FileText className="w-3 h-3 text-primary" />
                        ) : (
                          <Globe className="w-3 h-3 text-accent" />
                        )}
                        <span className={source.type === "document" ? "text-primary" : "text-accent"}>
                          {source.title}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="bg-chat-bot rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 rounded-xl"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-xl w-10 h-10"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;