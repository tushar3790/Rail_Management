import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrainIcon, SendIcon, Paperclip, MicIcon, VideoIcon, ImageIcon, User } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      content: { type: "text", content: "Hello! How can I assist you with your railway-related query today?" },
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef(null)
  const fileInputRef = useRef(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      sendMessage({ type: "text", content: input })
      setInput("")
    }
  }

  const sendMessage = (content) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { content, isBot: false, timestamp }])
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: { type: "text", content: "Thank you for reaching out. We are looking into your request." },
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ])
    }, 1000)
  }

  const renderMessage = (message) => {
    switch (message.content.type) {
      case "image": return <img src={message.content.content} className="max-w-[240px] rounded-md shadow-sm" />;
      case "audio": return <audio controls src={message.content.content} className="w-full max-w-[200px]" />;
      case "video": return <video controls src={message.content.content} className="max-w-[240px] rounded-md" />;
      default: return <p className="text-sm leading-relaxed">{message.content.content}</p>;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-[500px] h-[700px] flex flex-col shadow-2xl border-none overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-[#8B0000] text-white py-4 shadow-md z-10">
          <CardTitle className="flex items-center gap-3 text-lg font-bold">
            <div className="bg-white/20 p-2 rounded-full">
              <TrainIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span>RailMadad AI</span>
              <span className="text-[10px] font-normal text-white/70 uppercase tracking-widest">Official Assistant</span>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Chat Area */}
        <CardContent className="flex-grow p-0 bg-white">
          <ScrollArea ref={scrollRef} className="h-[520px] px-4 py-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-end gap-2 mb-6 ${message.isBot ? "justify-start" : "justify-end"}`}>
                {message.isBot && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/rail-logo.png" />
                    <AvatarFallback className="bg-red-100 text-red-800"><TrainIcon size={14}/></AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div className={`p-3 shadow-sm ${
                    message.isBot 
                      ? "bg-slate-100 text-slate-800 rounded-2xl rounded-bl-none" 
                      : "bg-[#8B0000] text-white rounded-2xl rounded-br-none"
                  }`}>
                    {renderMessage(message)}
                  </div>
                  <span className={`text-[10px] text-muted-foreground px-1 ${!message.isBot && "text-right"}`}>
                    {message.timestamp}
                  </span>
                </div>

                {!message.isBot && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-slate-200"><User size={14}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <CardFooter className="border-t bg-slate-50 p-3">
          <div className="flex w-full items-center gap-2 bg-white border rounded-full px-2 py-1 shadow-inner">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-slate-500">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" className="w-44 p-2 flex flex-col gap-1">
                <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs" onClick={() => fileInputRef.current?.click()}><ImageIcon size={14}/> Image</Button>
                <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs" onClick={() => fileInputRef.current?.click()}><MicIcon size={14}/> Voice</Button>
                <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs" onClick={() => fileInputRef.current?.click()}><VideoIcon size={14}/> Video</Button>
              </PopoverContent>
            </Popover>

            <Input
              placeholder="How can we help?"
              className="border-none focus-visible:ring-0 shadow-none bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            
            <Button 
              onClick={handleSend}
              size="icon" 
              className="rounded-full bg-[#8B0000] hover:bg-[#a00000] transition-all shrink-0"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <input type="file" hidden ref={fileInputRef} />
    </div>
  )
}