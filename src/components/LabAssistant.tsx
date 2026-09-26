import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

const reply = (question: string) => {
  const text = question.toLowerCase();
  if (text.includes('thingspeak')) return 'ThingSpeak issue? Check Channel ID, Read/Write API key, Wi-Fi connection, and keep updates at least 15 seconds apart.';
  if (text.includes('wifi') || text.includes('serial')) return 'Check the Serial Monitor at 115200 baud. Confirm your Wi-Fi SSID/password and wait until it says connected.';
  if (text.includes('node') || text.includes('upload')) return 'For NodeMCU, select the correct board and COM port, then hold FLASH only if uploading gets stuck.';
  if (text.includes('packet')) return 'For Packet Tracer, check device connections, IP addresses, gateway, and simulation mode events.';
  return 'I can help with NodeMCU, ThingSpeak, Blynk, Packet Tracer, Wi-Fi, serial monitor, files, and lab experiments. Try describing your issue.';
};

export function LabAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>(['Hi! I’m the IIoT Lab Assistant. What problem are you facing?']);
  const send = () => { if (!text.trim()) return; setMessages(items => [...items, `You: ${text}`, `Assistant: ${reply(text)}`]); setText(''); };
  return <div className="fixed right-5 bottom-5 z-[70]">
    {open && <div className="mb-3 w-[min(360px,calc(100vw-40px))] overflow-hidden rounded-3xl border border-white/10 bg-[#151518] shadow-2xl">
      <header className="flex items-center justify-between bg-[#0a84ff] px-4 py-3"><span className="flex items-center gap-2 font-bold"><Bot className="w-4 h-4" />Lab Assistant</span><button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button></header>
      <div className="h-64 space-y-3 overflow-y-auto p-4 text-sm">{messages.map((message, index) => <p key={index} className={message.startsWith('You:') ? 'text-right text-[#93c5fd]' : 'text-[#d1d1d6]'}>{message}</p>)}</div>
      <div className="flex gap-2 border-t border-white/10 p-3"><input value={text} onChange={event => setText(event.target.value)} onKeyDown={event => event.key === 'Enter' && send()} placeholder="Ask a lab question…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /><button onClick={send} className="rounded-xl bg-[#0a84ff] p-2"><Send className="w-4 h-4" /></button></div>
      <footer className="border-t border-white/10 bg-black/15 px-4 py-2 text-center text-[10px] font-semibold tracking-wide text-[#a1a1a6]">© GPTI · Made by SharanJ</footer>
    </div>}
    <button onClick={() => setOpen(!open)} className="rounded-full bg-[#0a84ff] p-4 shadow-xl shadow-[#0a84ff]/30 transition hover:scale-105"><MessageCircle className="w-5 h-5" /></button>
  </div>;
}
