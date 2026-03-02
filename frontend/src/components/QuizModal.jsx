import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Brain, Trophy } from 'lucide-react';

export default function QuizModal({ isOpen, onClose, topic, questions }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    if (!questions || questions.length === 0) return null;

    const handleOptionSelect = (option) => {
        if (selectedOption !== null) return;

        setSelectedOption(option);
        const correct = option === questions[currentQuestion].answer;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

                        {!showResult ? (
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] font-display">Recursive Challenge</span>
                                        <h2 className="text-2xl font-black text-white font-display mt-2 uppercase tracking-tight">{topic}</h2>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest font-display">Iteration</span>
                                        <p className="text-xl font-black text-white font-mono mt-1">{currentQuestion + 1}/{questions.length}</p>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <h3 className="text-xl text-slate-200 font-medium leading-relaxed font-display tracking-tight">
                                        {questions[currentQuestion].text}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {questions[currentQuestion].options.map((option, index) => (
                                        <motion.button
                                            whileHover={{ scale: 1.01, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            key={index}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`
                        group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300
                        ${selectedOption === option
                                                    ? (isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400')
                                                    : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-blue-500/50 hover:bg-slate-800 hover:text-white'
                                                }
                      `}
                                        >
                                            <span className="font-bold text-sm tracking-tight">{option}</span>
                                            {selectedOption === option && (
                                                isCorrect ? <CheckCircle2 size={24} className="animate-bounce" /> : <XCircle size={24} className="animate-shake" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-16 text-center">
                                <motion.div
                                    initial={{ rotate: -20, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="inline-flex p-6 rounded-[2rem] bg-blue-600/10 mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                                >
                                    <Trophy size={64} className="text-blue-500" />
                                </motion.div>
                                <h2 className="text-4xl font-black text-white font-display mb-4 uppercase tracking-tighter">Evaluation Complete</h2>
                                <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Recursive memory consolidation successful. Mastery indices updated.</p>

                                <div className="flex justify-center gap-16 mb-12">
                                    <div className="text-center">
                                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest font-display mb-2">Accuracy</p>
                                        <p className="text-5xl font-black text-white font-display tracking-tighter">{((score / questions.length) * 100).toFixed(0)}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest font-display mb-2">Sync Delta</p>
                                        <p className="text-5xl font-black text-emerald-500 font-display tracking-tighter">+{((score / questions.length) * 10).toFixed(1)}</p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="btn-primary w-full py-5 text-white font-black rounded-2xl shadow-2xl uppercase tracking-[0.3em] text-xs font-display"
                                >
                                    Return to Matrix
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
