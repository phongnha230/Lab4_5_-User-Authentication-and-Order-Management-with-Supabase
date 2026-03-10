import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatInterface = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // ... (useEffect for history and realtime stays the same)

  // Load chat history
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) console.error('Error fetching messages:', error);
      else setMessages(data || []);
    };

    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel(`chat:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Avoid duplicate messages if optimistic update already added it
            if (prev.find((msg) => msg.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      const productsContext = `
      Danh sách sản phẩm TechStore (Sử dụng ảnh nội bộ):
      1. iPhone 11: 10.990.000đ. Ảnh: /product/iphone11.png
      2. iPhone 14: 16.099.000đ. Ảnh: /product/iphone14.png
      3. iPhone 11 Hong: 10.999.000đ. Ảnh: /product/iphone11_hong.png
      4. iPhone 15 Hong: 15.000.000đ. Ảnh: /product/iphone15hong.png
      5. iPhone 17 Pro: 30.000.000đ. Ảnh: /product/iphone17pro.png
      6. iPhone 15 Pro: 23.000.000đ. Ảnh: /product/iphone15pro.png
      7. iPhone 13 128G: 13.000.000đ. Ảnh: /product/iphone13_128.png
      8. iPhone 15: 14.000.000đ. Ảnh: /product/iphone15.png
      9. iPhone 13: 13.000.000đ. Ảnh: /product/iphone13.png
      10. iPhone Xs Max: 6.000.000đ. Ảnh: /product/xsmax.png
      `;

      const prompt = `Bạn là trợ lý ảo của TechStore. 
      Nhiệm vụ: Trả lời câu hỏi khách hàng về sản phẩm một cách đầy đủ và chính xác.
      Dữ liệu sản phẩm: ${productsContext}
      
      QUY TẮC PHẢI TUÂN THỦ:
      1. Nếu khách hàng hỏi về một dòng sản phẩm (ví dụ: "iPhone 11", "iPhone 15"), bạn phải liệt kê TẤT CẢ các phiên bản liên quan có trong dữ liệu (ví dụ: cả bản thường, bản Pro, bản màu khác nhau...). KHÔNG ĐƯỢC chỉ nói về một cái duy nhất.
      2. Với mỗi sản phẩm được liệt kê, hãy HIỂN THỊ ẢNH của nó bằng cú pháp Markdown: ![tên](url).
      3. Trình bày danh sách bằng bullet points hoặc bảng để dễ nhìn.
      4. Luôn trả lời bằng tiếng Việt lịch sự, thân thiện.
      5. Nếu khách hỏi sản phẩm không có trong dữ liệu, hãy xin lỗi và gợi ý các dòng máy tương tự đang có sẵn.
      
      Câu hỏi khách hàng: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const aiContent = result.response.text();

      const { error } = await supabase.from('messages').insert([
        {
          user_id: user.id,
          content: aiContent,
          sender_type: 'ai',
        },
      ]);

      if (error) console.error('Error saving AI message:', error);
    } catch (err) {
      console.error('Gemini Error:', err);
      // Fallback
      await supabase.from('messages').insert([
        {
          user_id: user.id,
          content: "Xin lỗi, tôi gặp trục trặc kỹ thuật. Vui lòng thử lại sau!",
          sender_type: 'ai',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userContent = input.trim();
    setInput('');
    setIsLoading(true);

    const { error } = await supabase.from('messages').insert([
      {
        user_id: user.id,
        content: userContent,
        sender_type: 'user',
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      generateAIResponse(userContent);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm">TechStore AI</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-[10px] text-indigo-100">Sẵn sàng hỗ trợ</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full h-8 w-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      {/* Message List */}
      <ScrollArea ref={scrollRef} className="flex-1 p-3 space-y-4 bg-slate-50/50">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <Bot className="w-10 h-10 mx-auto opacity-20" />
              <p className="text-xs">Chào bạn! Tôi có thể giúp gì cho bạn?</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2 ${
                msg.sender_type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-7 h-7 border border-slate-200">
                {msg.sender_type === 'user' ? (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-[10px]">U</AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-blue-600 text-white text-[10px]">AI</AvatarFallback>
                )}
              </Avatar>
              
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] shadow-sm transition-all ${
                  msg.sender_type === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.sender_type === 'ai' ? (
                  <div className="prose prose-xs prose-slate max-w-none prose-p:leading-snug prose-img:rounded-lg">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <Avatar className="w-7 h-7 border border-slate-200">
                <AvatarFallback className="bg-blue-600 text-white text-[10px]">AI</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về sản phẩm..."
            className="flex-1 rounded-xl h-10 text-sm border-slate-200 focus:ring-1 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 w-10 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
