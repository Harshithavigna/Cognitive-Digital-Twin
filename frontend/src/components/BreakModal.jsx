import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Zap, Moon, Battery, CheckCircle2, RefreshCcw } from 'lucide-react';

export default function BreakModal({ isOpen, onClose, reasoning }) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!isOpen || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsComplete(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-12 bg-slate-950/98 backdrop-blur-3xl overflow-y-auto"
                >
                    {/* Cyber Ambient Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[150px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-violet-600/5 rounded-full blur-[150px] animate-pulse delay-1000" />
                        <div className="scanline" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="w-full max-w-2xl text-center relative z-10 p-12 bg-slate-900/40 border border-slate-800 rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.1)] backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ rotate: 180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="inline-flex p-6 rounded-3xl bg-orange-600/10 mb-10 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                        >
                            <Coffee size={48} className="text-orange-500" />
                        </motion.div>

                        <h1 className="text-4xl lg:text-5xl font-black text-white font-display mb-4 uppercase tracking-tighter italic whitespace-nowrap">NEURAL<span className="text-orange-500">_</span>FLUSH</h1>
                        <p className="text-slate-400 text-base mb-8 max-w-md mx-auto leading-relaxed font-medium">
                            {reasoning || "Initiating a system-wide reset to optimize cognitive pathways."}
                        </p>

                        <div className="mb-10 relative">
                            <div className="text-7xl lg:text-8xl font-black font-mono text-white mb-4 tracking-tighter tabular-nums">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="w-64 lg:w-80 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-orange-600 to-amber-400"
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${(timeLeft / 300) * 100}%` }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-10">
                            {[
                                { label: 'Hydration', value: 'Optimize synapses', icon: Battery, color: 'text-blue-400', bg: 'bg-blue-500/5' },
                                { label: 'Oxygenation', value: 'Flush cortex', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/5' }
                            ].map((item, i) => (
                                <div key={i} className={`p-4 lg:p-5 ${item.bg} border border-slate-800 rounded-xl lg:rounded-2xl flex items-center gap-4 lg:gap-5 text-left`}>
                                    <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-slate-900 border border-slate-800 ${item.color}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest font-display mb-0.5">{item.label}</p>
                                        <p className="text-slate-500 text-[8px] lg:text-[10px] font-mono">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <motion.button
                                whileHover={{ scale: isComplete ? 1.02 : 1 }}
                                whileTap={{ scale: isComplete ? 0.98 : 1 }}
                                onClick={onClose}
                                disabled={!isComplete}
                                className={`
                                    w-full py-5 rounded-2xl font-black transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs font-display
                                    ${isComplete
                                        ? 'btn-primary text-white shadow-2xl shadow-blue-500/20 active:shadow-none'
                                        : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800'
                                    }
                                `}
                            >
                                {isComplete ? (
                                    <>
                                        <CheckCircle2 size={18} /> RE-ENTER MATRIX
                                    </>
                                ) : (
                                    <>
                                        <RefreshCcw size={18} className="animate-spin" /> SYNCHRONIZING...
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl font-black border border-slate-800 hover:border-red-500/50 hover:bg-red-500/5 text-slate-500 hover:text-red-400 transition-all uppercase tracking-[0.3em] text-[10px] font-display"
                            >
                                ABORT & RETURN TO HUB
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
