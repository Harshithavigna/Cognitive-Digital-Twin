import React, { useState, useEffect, useRef } from 'react';
import {
    Activity,
    Brain,
    Clock,
    TrendingUp,
    AlertCircle,
    Coffee,
    CheckCircle2,
    ChevronRight,
    MessageSquare,
    Send,
    X,
    Sparkles,
    Zap
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import QuizModal from './QuizModal';
import BreakModal from './BreakModal';

const GlassCard = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6 }}
        className={`glass-panel rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
    </motion.div>
);

const Gauge = ({ value, label, icon: Icon, color, delay = 0 }) => (
    <div className="flex flex-col items-center justify-center p-4 group">
        <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                    className="text-slate-900 stroke-current"
                    strokeWidth="4"
                    fill="transparent"
                    r="44"
                    cx="50"
                    cy="50"
                />
                <motion.circle
                    className={`${color} stroke-current`}
                    strokeWidth="4"
                    strokeDasharray={276.5}
                    initial={{ strokeDashoffset: 276.5 }}
                    animate={{ strokeDashoffset: 276.5 - (276.5 * value) }}
                    transition={{ duration: 2, delay, ease: "circOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                    r="44"
                    cx="50"
                    cy="50"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Icon size={24} className={`${color.replace('stroke-', 'text-')} opacity-80 group-hover:opacity-100 transition-opacity`} />
                </motion.div>
                <span className="text-2xl font-black font-display tracking-tighter mt-1">{(value * 100).toFixed(0)}</span>
            </div>
        </div>
        <span className="mt-3 text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] font-display">{label}</span>
    </div>
);

export default function Dashboard() {
    const [telemetry, setTelemetry] = useState([]);
    const [currentSignals, setCurrentSignals] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const [activeQuiz, setActiveQuiz] = useState({ open: false, topic: '', questions: [] });
    const [activeBreak, setActiveBreak] = useState({ open: false, reasoning: '' });

    // Theater Mode Active if Chat, Quiz, or Break is open
    const isOverlayActive = isChatOpen || activeQuiz.open || activeBreak.open;

    const ws = useRef(null);
    const chatEndRef = useRef(null);
    const chatInputRef = useRef(null);

    useEffect(() => {
        connectWS();
        return () => ws.current?.close();
    }, []);

    const connectWS = () => {
        ws.current = new WebSocket('ws://localhost:8000/ws');
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setCurrentSignals(data);
            setTelemetry(prev => [...prev.slice(-40), {
                time: new Date().toLocaleTimeString([], { hour12: false }),
                retention: data.retention_probability * 100,
                fatigue: data.fatigue_probability * 100,
                plateau: data.plateau_probability * 100
            }]);
        };
        ws.current.onclose = () => {
            setTimeout(connectWS, 3000);
        };
    };

    // Auto-focus chat input when opened
    useEffect(() => {
        if (isChatOpen) {
            const timer = setTimeout(() => {
                chatInputRef.current?.focus();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isChatOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    const handleSendDoubt = async () => {
        if (!chatMessage.trim() || activeQuiz.open || activeBreak.open) return;

        const userMsg = { role: 'user', content: chatMessage };
        setChats(prev => [...prev, userMsg]);
        setChatMessage("");
        setIsTyping(true);

        try {
            const response = await axios.post('http://localhost:8000/doubt', { text: chatMessage });
            const botMsg = {
                role: 'bot',
                content: response.data.final_answer,
                explanation: response.data.explanation,
                recap: response.data.recap
            };
            setTimeout(() => {
                setChats(prev => [...prev, botMsg]);
                setIsTyping(false);
            }, 800);
        } catch (error) {
            setChats(prev => [...prev, { role: 'bot', content: "Lost connection to Cognitive Engine. Please check your backend." }]);
            setIsTyping(false);
        }
    };

    const startAdaptiveQuiz = () => {
        if (isOverlayActive) return;
        const questions = [
            {
                text: `Orchestrator Analysis: Based on your current mastery of ${currentSignals?.topic}, evaluate the impact of wavelength on particle probability density.`,
                options: ["Directly proportional", "Inversely proportional", "Exponential decay", "Square of amplitude"],
                answer: "Square of amplitude"
            },
            {
                text: "Predicted Cognitive Load: Why does the system suggest an active recall challenge during a plateau?",
                options: ["To slow down learning", "To re-engage neural pathways", "To test memory only", "To reduce session time"],
                answer: "To re-engage neural pathways"
            }
        ];
        setActiveQuiz({ open: true, topic: currentSignals?.topic || 'Core Concept Mastery', questions });
    };

    const triggerBreak = () => {
        if (isOverlayActive) return;
        setActiveBreak({
            open: true,
            reasoning: "Critical neural fatigue detected (70%+). Initiating a system-mandated recovery sequence to prevent cognitive overwhelm and ensure optimal memory consolidation."
        });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-['Inter'] relative overflow-hidden selection:bg-blue-500/30">
            {/* 1. Global Background (Always Underneath) */}
            <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="scanline z-30 pointer-events-none" />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[160px] animate-pulse delay-1000" />
            </div>

            {/* 2. Main Dashboard (Theater Mode Aware) */}
            <motion.div
                animate={{
                    opacity: isOverlayActive ? 0 : 1,
                    scale: isOverlayActive ? 0.95 : 1,
                    filter: isOverlayActive ? 'blur(20px)' : 'blur(0px)',
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`p-6 lg:p-12 min-h-screen relative z-10 ${isOverlayActive ? 'pointer-events-none' : ''}`}
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                            <div className="relative p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center">
                                <Brain className="text-blue-400 group-hover:rotate-12 transition-transform" size={40} />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight leading-none uppercase truncate">
                                COGNITIVE<span className="text-blue-500">_</span>EXPLORER
                            </h1>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] font-mono">Neural Simulation Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 shrink-0">
                        <GlassCard className="py-3 px-8 border-l-4 border-l-blue-500 hover:scale-105">
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-display">System Rank</p>
                                    <p className="font-display text-2xl font-black text-white whitespace-nowrap">LEVEL 14</p>
                                </div>
                                <div className="w-px h-10 bg-slate-800" />
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-display">Session XP</p>
                                    <p className="font-mono text-2xl font-black text-blue-400 whitespace-nowrap">{(currentSignals?.mastery_score * 1250 || 0).toFixed(0)}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                    {/* Analytics Hub */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <GlassCard className="grid grid-cols-2 gap-2 border-t-2 border-t-blue-500/30 overflow-visible">
                            <h3 className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 font-display flex items-center gap-2">
                                <Sparkles size={14} className="text-blue-400" /> Bio-Metric Telemetry
                            </h3>
                            <Gauge value={currentSignals?.retention_probability || 0} label="Retention" icon={Brain} color="stroke-blue-500" delay={0.2} />
                            <Gauge value={currentSignals?.fatigue_probability || 0} label="Fatigue" icon={Activity} color="stroke-orange-500" delay={0.4} />
                            <Gauge value={currentSignals?.plateau_probability || 0} label="Plateau" icon={TrendingUp} color="stroke-violet-500" delay={0.6} />
                            <Gauge value={currentSignals?.mastery_score || 0} label="Mastery" icon={CheckCircle2} color="stroke-emerald-500" delay={0.8} />
                        </GlassCard>

                        <GlassCard className="border-l-2 border-l-violet-500/30">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 font-display flex items-center gap-2">
                                <Clock size={16} className="text-violet-400" /> Session Manifest
                            </h3>
                            <div className="space-y-7">
                                {[
                                    { label: 'Active Subject', value: currentSignals?.subject, icon: Brain, color: 'text-blue-400' },
                                    { label: 'Neural Focus', value: currentSignals?.topic, icon: Zap, color: 'text-violet-400' },
                                    { label: 'Uptime', value: `${currentSignals?.session_time || 0}m`, icon: Clock, color: 'text-emerald-400' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4 group cursor-default">
                                        <div className="flex items-center gap-3 shrink-0">
                                            <item.icon size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <span className={`text-sm font-tech tracking-tighter ${item.color} group-hover:scale-110 transition-transform truncate text-right lowercase`}>
                                            {item.value || 'SEARCHING...'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Cognitive Visualization */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <GlassCard className="h-[460px] border-b-2 border-b-blue-500/20">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-display flex items-center gap-3">
                                    <Activity size={18} className="text-blue-400 animate-pulse" /> Live Neural Activity
                                </h3>
                                <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] font-display">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" /> Retention</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_#f97316]" /> Fatigue</div>
                                </div>
                            </div>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="glowBlue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                                borderRadius: '12px',
                                                fontFamily: 'JetBrains Mono',
                                                fontSize: '10px'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <XAxis dataKey="time" hide />
                                        <Area
                                            type="step"
                                            dataKey="retention"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#glowBlue)"
                                            isAnimationActive={false}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="fatigue"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            fill="transparent"
                                            strokeDasharray="4 4"
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>

                        {/* Intervention Deck */}
                        <GlassCard className="bg-slate-900/40 border-slate-800/80">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-display flex items-center gap-2">
                                    <AlertCircle size={16} className="text-amber-400" /> Digital Twin Signals
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence>
                                    {currentSignals?.fatigue_probability > 0.7 && (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                            className="p-6 bg-slate-950/60 border border-orange-500/20 rounded-3xl relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                                <Coffee size={60} />
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                                    <Coffee size={24} />
                                                </div>
                                                <h4 className="font-display font-black text-sm tracking-tight text-white">RECOVERY REQUIRED</h4>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Thermal CPU load high. Initiating system-wide neural flush protocol.</p>
                                            <button
                                                onClick={triggerBreak}
                                                disabled={isOverlayActive}
                                                className="btn-primary w-full py-3.5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Initialize Flush
                                            </button>
                                        </motion.div>
                                    )}

                                    {currentSignals?.plateau_probability > 0.6 && (
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                            className="p-6 bg-slate-950/60 border border-violet-500/20 rounded-3xl relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                                <TrendingUp size={60} />
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                                    <Zap size={24} />
                                                </div>
                                                <h4 className="font-display font-black text-sm tracking-tight text-white">PLATEAU TRIGGER</h4>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Learning velocity normalized. Switching to recursive active recall.</p>
                                            <button
                                                onClick={startAdaptiveQuiz}
                                                disabled={isOverlayActive}
                                                className="btn-primary w-full py-3.5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-violet-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Begin Recursion
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {!currentSignals?.fatigue_probability && (
                                <div className="py-12 text-center opacity-30">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Cognitive Core...</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </motion.div>

            {/* 3. Theater Mode Backdrop (Now Higher Priority) */}
            <AnimatePresence>
                {isOverlayActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[100]"
                    />
                )}
            </AnimatePresence>

            {/* 4. Floating Chat Trigger */}
            {!isOverlayActive && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-12 right-12 p-6 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-[2rem] shadow-[0_0_40px_rgba(59,130,246,0.4)] z-50 group"
                >
                    <MessageSquare size={32} className="text-white group-hover:scale-110 transition-transform" />
                </motion.button>
            )}

            {/* 5. Chat Overlay (Highest z-index sibling) */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        className="fixed right-0 top-0 bottom-0 w-full lg:max-w-3xl bg-slate-950 border-l border-slate-800 shadow-2xl z-[200] flex flex-col"
                    >
                        {/* Chat Header */}
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                            <div>
                                <h3 className="text-2xl font-black font-display text-white uppercase tracking-tighter">Doubt_Engine</h3>
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.4em] font-mono mt-1">Analytical Core v4 // Cognitive Link Active</p>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-colors"
                            >
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth">
                            {chats.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-12">
                                    <Sparkles size={64} className="mb-6 text-blue-500" />
                                    <p className="font-display text-sm font-bold uppercase tracking-widest leading-loose">System Ready. Awaiting Neural Input.</p>
                                </div>
                            )}
                            {chats.map((chat, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[85%] p-8 rounded-3xl 
                                        ${chat.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                                            : 'bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-bl-none'
                                        }
                                    `}>
                                        <p className="text-base font-medium leading-relaxed">{chat.content}</p>
                                        {chat.explanation && (
                                            <div className="mt-8 space-y-6">
                                                <div className="grid grid-cols-1 gap-3">
                                                    {chat.explanation.map((step, si) => (
                                                        <div key={si} className="flex gap-4 p-5 bg-slate-950/50 border border-slate-800 rounded-2xl font-mono text-[11px] text-slate-400 transition-colors hover:border-blue-500/30">
                                                            <span className="text-blue-500 font-black">0{si + 1}</span>
                                                            <p className="leading-relaxed">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-900/20 to-violet-900/20 p-6 rounded-2xl border border-blue-500/10 relative group">
                                                    <p className="text-[10px] text-blue-400 font-black font-display uppercase tracking-widest mb-2">Cognitive Recap</p>
                                                    <p className="text-xs text-slate-400 italic font-medium">{chat.recap}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/50 p-6 rounded-3xl rounded-bl-none flex gap-2">
                                        {[1, 2, 3].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${d * 100}ms` }} />)}
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-10 bg-slate-900/80 border-t border-slate-800">
                            <div className="relative max-w-4xl mx-auto">
                                <input
                                    ref={chatInputRef}
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendDoubt()}
                                    placeholder="Input conceptual query..."
                                    className="w-full !bg-[#020617] !text-blue-400 border border-slate-800 rounded-[2rem] py-6 pl-10 pr-24 text-base font-mono focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-700"
                                    style={{ color: '#60A5FA', backgroundColor: '#020617' }}
                                />
                                <button
                                    onClick={handleSendDoubt}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg transition-transform active:scale-95"
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <QuizModal
                isOpen={activeQuiz.open}
                onClose={() => setActiveQuiz({ ...activeQuiz, open: false })}
                topic={activeQuiz.topic}
                questions={activeQuiz.questions}
            />
            <BreakModal
                isOpen={activeBreak.open}
                onClose={() => setActiveBreak({ ...activeBreak, open: false })}
                reasoning={activeBreak.reasoning}
            />
        </div>
    );
}
