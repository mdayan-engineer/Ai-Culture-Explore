import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin } from 'lucide-react';

export default function LocalGuide() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([{
    role: 'model',
    text: 'Hello! I am your AI Local Guide. Where are we exploring today, and what would you like to know?'
  }]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', text: m.text })),
          context: context || 'General Travel'
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', text: data.text }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" /> AI Local Guide
          </h2>
          <p className="text-sm text-gray-500">Ask about customs, hidden gems, and safety.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <MapPin className="w-4 h-4 text-gray-400" />
          <input 
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Set destination..."
            className="text-sm outline-none w-32 md:w-48 text-gray-700 bg-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 \${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 \${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-900 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
               <Bot className="w-5 h-5 text-gray-600" />
             </div>
             <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button 
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
