import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, BookOpen } from 'lucide-react';
import { Subject } from '../types';

interface PomodoroTimerProps {
  subjects: Subject[];
  onLogSession: (subjectId: string, minutes: number, topic: string) => void;
  soundEnabled: boolean;
}

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ subjects, onLogSession, soundEnabled }) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [sessionTopic, setSessionTopic] = useState<string>('Focused Study Session');
  const [completedSessionsToday, setCompletedSessionsToday] = useState<number>(3);
  const [showLogPrompt, setShowLogPrompt] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (soundEnabled && typeof window !== 'undefined' && (window as any).StudyPlannerAudio) {
        (window as any).StudyPlannerAudio.playChime();
      }
      if (mode === 'pomodoro') {
        setCompletedSessionsToday((c) => c + 1);
        setShowLogPrompt(true);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, soundEnabled]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const handleConfirmLog = () => {
    if (selectedSubjectId) {
      onLogSession(selectedSubjectId, 25, sessionTopic || 'Pomodoro Study');
      setShowLogPrompt(false);
      handleModeChange('shortBreak');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalTime = MODE_TIMES[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="relative bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm overflow-hidden">
      {/* Decorative Washi header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <h3 className="font-serif text-lg font-bold text-[#4E342E]">Study Timer</h3>
        </div>
        <div className="text-xs font-medium text-[#7D6B62] flex items-center gap-1.5 bg-[#FAF2EB] px-2.5 py-1 rounded-full border border-[#E8DACB]">
          <span>🌸</span>
          <span>{completedSessionsToday} pomodoros today</span>
        </div>
      </div>

      {/* Mode selection buttons */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4EFE6] rounded-xl mb-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => handleModeChange('pomodoro')}
          className={`py-1.5 rounded-lg transition-all ${
            mode === 'pomodoro' ? 'bg-[#FFFDF9] text-[#7A3E4E] shadow-xs' : 'text-[#7D6B62] hover:text-[#4E342E]'
          }`}
        >
          Study (25m)
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('shortBreak')}
          className={`py-1.5 rounded-lg transition-all ${
            mode === 'shortBreak' ? 'bg-[#FFFDF9] text-[#2C4A3A] shadow-xs' : 'text-[#7D6B62] hover:text-[#4E342E]'
          }`}
        >
          Short (5m)
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('longBreak')}
          className={`py-1.5 rounded-lg transition-all ${
            mode === 'longBreak' ? 'bg-[#FFFDF9] text-[#344E5B] shadow-xs' : 'text-[#7D6B62] hover:text-[#4E342E]'
          }`}
        >
          Long (15m)
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="relative flex flex-col items-center justify-center my-2 py-3">
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#EFE6DA" strokeWidth="6" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={mode === 'pomodoro' ? '#F4ACB7' : mode === 'shortBreak' ? '#A3B899' : '#B8D8D8'}
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold tracking-tight text-[#3E2723]">{formattedTime}</span>
            <span className="text-[11px] font-handwriting text-[#8D6E63] text-sm mt-0.5">
              {isRunning ? 'Keep blooming ✨' : 'Ready to study'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm shadow-sm transition-all transform active:scale-95 ${
              isRunning
                ? 'bg-[#E5D4C0] hover:bg-[#D9C4AC] text-[#4E342E]'
                : 'bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28]'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Timer"
            className="p-2.5 rounded-full bg-[#FAF2EB] hover:bg-[#EFE6DA] text-[#6D5A50] border border-[#E8DACB] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Subject Selector for Study Mode */}
      {mode === 'pomodoro' && (
        <div className="mt-3 pt-3 border-t border-[#F0E6D8] text-xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-[#6D5A50]">
            <BookOpen className="w-3.5 h-3.5 text-[#A3B899]" />
            <span className="font-medium">Studying for:</span>
          </div>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full bg-[#FAF5EE] border border-[#E0D3C5] rounded-lg px-2.5 py-1.5 text-xs text-[#4A3B32] focus:outline-none focus:border-[#A3B899]"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Completion Modal / Prompt */}
      {showLogPrompt && (
        <div className="absolute inset-0 bg-[#FFFDF9]/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 animate-fade-in">
          <span className="text-3xl mb-1">🎉🌸</span>
          <h4 className="font-serif font-bold text-base text-[#4E342E]">Great focus session!</h4>
          <p className="text-xs text-[#6D5A50] mt-1 mb-3">Log 25 minutes to your study progress?</p>
          <input
            type="text"
            value={sessionTopic}
            onChange={(e) => setSessionTopic(e.target.value)}
            placeholder="Topic (e.g. Chapter 4 review)"
            className="w-full text-xs px-2.5 py-1.5 border border-[#D8C7B5] rounded-lg bg-white mb-3 text-center"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmLog}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-[#A3B899] text-white text-xs font-semibold rounded-lg hover:bg-[#8DA382]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Log & Take Break</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLogPrompt(false)}
              className="px-3 py-1.5 bg-[#EFE6DA] text-[#6D5A50] text-xs font-medium rounded-lg hover:bg-[#E5D7C5]"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
