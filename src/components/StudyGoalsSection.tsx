import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Trash2,
  Sparkles,
  Award,
  Clock,
  Check,
  Edit2,
} from 'lucide-react';
import { GoalsData, GoalItem } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/initialData';
import { WashiTape, HexagonBadge, FloralSprigCorner } from './FloralDecorations';

interface StudyGoalsSectionProps {
  goals: GoalsData;
  onUpdateGoals: (goals: GoalsData) => void;
}

export const StudyGoalsSection: React.FC<StudyGoalsSectionProps> = ({
  goals,
  onUpdateGoals,
}) => {
  const [newDailyGoal, setNewDailyGoal] = useState<string>('');
  const [newWeeklyGoal, setNewWeeklyGoal] = useState<string>('');
  const [dailyTargetHours, setDailyTargetHours] = useState<number>(goals.dailyTargetHours || 4);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState<number>(goals.weeklyTargetHours || 24);
  const [editingTargetHours, setEditingTargetHours] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(1);

  // Toggle Daily Goal
  const handleToggleDaily = (id: string) => {
    const updated = goals.dailyGoals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    onUpdateGoals({ ...goals, dailyGoals: updated });
  };

  // Toggle Weekly Goal
  const handleToggleWeekly = (id: string) => {
    const updated = goals.weeklyGoals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    onUpdateGoals({ ...goals, weeklyGoals: updated });
  };

  // Add Daily Goal
  const handleAddDailyGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDailyGoal.trim()) return;
    const newItem: GoalItem = {
      id: `dg-${Date.now()}`,
      title: newDailyGoal.trim(),
      completed: false,
    };
    onUpdateGoals({ ...goals, dailyGoals: [...goals.dailyGoals, newItem] });
    setNewDailyGoal('');
  };

  // Add Weekly Goal
  const handleAddWeeklyGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeeklyGoal.trim()) return;
    const newItem: GoalItem = {
      id: `wg-${Date.now()}`,
      title: newWeeklyGoal.trim(),
      completed: false,
    };
    onUpdateGoals({ ...goals, weeklyGoals: [...goals.weeklyGoals, newItem] });
    setNewWeeklyGoal('');
  };

  // Delete Goal
  const handleDeleteDaily = (id: string) => {
    onUpdateGoals({
      ...goals,
      dailyGoals: goals.dailyGoals.filter((g) => g.id !== id),
    });
  };

  const handleDeleteWeekly = (id: string) => {
    onUpdateGoals({
      ...goals,
      weeklyGoals: goals.weeklyGoals.filter((g) => g.id !== id),
    });
  };

  const handleSaveHours = () => {
    onUpdateGoals({
      ...goals,
      dailyTargetHours: Number(dailyTargetHours),
      weeklyTargetHours: Number(weeklyTargetHours),
    });
    setEditingTargetHours(false);
  };

  const completedDailyCount = goals.dailyGoals.filter((g) => g.completed).length;
  const completedWeeklyCount = goals.weeklyGoals.filter((g) => g.completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <FloralSprigCorner flipped className="opacity-75 -mt-3 -mr-3" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <WashiTape text="Dream Big" variant="peach" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Study Goals & Aspirations
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Set realistic daily intentions, weekly milestones, and target study hours to stay inspired.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditingTargetHours(!editingTargetHours)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FAF2EB] hover:bg-[#F3E5D8] border border-[#E5D2C0] text-xs font-semibold text-[#5C4537] rounded-2xl transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{editingTargetHours ? 'Done Editing Targets' : 'Adjust Study Targets'}</span>
          </button>
        </div>

        {/* Target Hours Controls */}
        {editingTargetHours ? (
          <div className="mt-5 p-4 bg-[#FAF4ED] border border-[#E8DACB] rounded-2xl flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#5C4537]">Daily Target (Hours):</label>
              <input
                type="number"
                value={dailyTargetHours}
                onChange={(e) => setDailyTargetHours(Number(e.target.value))}
                min={1}
                max={16}
                className="w-16 px-2 py-1 rounded-lg border border-[#D8C7B5] bg-white text-xs text-center font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#5C4537]">Weekly Target (Hours):</label>
              <input
                type="number"
                value={weeklyTargetHours}
                onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
                min={5}
                max={100}
                className="w-16 px-2 py-1 rounded-lg border border-[#D8C7B5] bg-white text-xs text-center font-bold"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveHours}
              className="px-4 py-1 bg-[#A3B899] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#8DA382]"
            >
              Save Targets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[#F0E6D8]">
            <div className="flex items-center gap-3">
              <HexagonBadge variant="pink" size="sm">
                <span className="text-xs font-bold">{goals.dailyTargetHours}h</span>
              </HexagonBadge>
              <div>
                <span className="text-xs font-bold text-[#3E2723]">Daily Target Hours</span>
                <span className="block text-[11px] text-[#7D6B62]">
                  {completedDailyCount} / {goals.dailyGoals.length} daily goals completed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <HexagonBadge variant="sage" size="sm">
                <span className="text-xs font-bold">{goals.weeklyTargetHours}h</span>
              </HexagonBadge>
              <div>
                <span className="text-xs font-bold text-[#3E2723]">Weekly Target Hours</span>
                <span className="block text-[11px] text-[#7D6B62]">
                  {completedWeeklyCount} / {goals.weeklyGoals.length} weekly goals completed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Daily Goals & Weekly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Goals Card */}
        <div className="bg-[#FFFDF9] bg-lined-paper border border-[#E8DCCF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8DACB]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">Daily Study Goals</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#D87093]">
                {completedDailyCount} of {goals.dailyGoals.length} completed
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {goals.dailyGoals.map((g) => (
                <div
                  key={g.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    g.completed
                      ? 'bg-[#F9FAF8] border-[#DCE5DC] opacity-75'
                      : 'bg-[#FFFDF9] border-[#E8DACB]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleDaily(g.id)}
                    className="flex items-center gap-3 min-w-0 text-left flex-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        g.completed
                          ? 'bg-[#A3B899] text-white'
                          : 'border-2 border-[#D8C7B5] bg-white'
                      }`}
                    >
                      {g.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        g.completed ? 'line-through text-[#8D7B74]' : 'text-[#3E2723]'
                      }`}
                    >
                      {g.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDaily(g.id)}
                    className="p-1 text-[#A0887A] hover:text-[#9C324E] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Daily Form */}
          <form onSubmit={handleAddDailyGoal} className="mt-5 pt-3 border-t border-[#F0E6D8] flex gap-2">
            <input
              type="text"
              value={newDailyGoal}
              onChange={(e) => setNewDailyGoal(e.target.value)}
              placeholder="Add a new daily goal (e.g. Read 20 pages)..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold rounded-xl shadow-xs shrink-0"
            >
              Add
            </button>
          </form>
        </div>

        {/* Weekly Goals Card */}
        <div className="bg-[#FFFDF9] bg-lined-paper border border-[#E8DCCF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8DACB]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">Weekly Study Goals</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#5B7B6D]">
                {completedWeeklyCount} of {goals.weeklyGoals.length} completed
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {goals.weeklyGoals.map((g) => (
                <div
                  key={g.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    g.completed
                      ? 'bg-[#F9FAF8] border-[#DCE5DC] opacity-75'
                      : 'bg-[#FFFDF9] border-[#E8DACB]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleWeekly(g.id)}
                    className="flex items-center gap-3 min-w-0 text-left flex-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        g.completed
                          ? 'bg-[#A3B899] text-white'
                          : 'border-2 border-[#D8C7B5] bg-white'
                      }`}
                    >
                      {g.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        g.completed ? 'line-through text-[#8D7B74]' : 'text-[#3E2723]'
                      }`}
                    >
                      {g.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteWeekly(g.id)}
                    className="p-1 text-[#A0887A] hover:text-[#9C324E] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Weekly Form */}
          <form onSubmit={handleAddWeeklyGoal} className="mt-5 pt-3 border-t border-[#F0E6D8] flex gap-2">
            <input
              type="text"
              value={newWeeklyGoal}
              onChange={(e) => setNewWeeklyGoal(e.target.value)}
              placeholder="Add weekly milestone (e.g. Master unit 3)..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#A3B899] hover:bg-[#8DA382] text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Motivational Affirmations Box */}
      <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✨</span>
          <div>
            <h4 className="font-serif font-bold text-base text-[#3E2723]">
              Daily Encouragement
            </h4>
            <p className="font-handwriting text-lg text-[#6A4E3D] mt-0.5">
              &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex].quote}&rdquo; — {MOTIVATIONAL_QUOTES[quoteIndex].author}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)}
          className="px-3.5 py-1.5 rounded-xl bg-[#FAF4ED] hover:bg-[#F0E5D8] text-xs font-semibold text-[#6D5A50] shrink-0"
        >
          Shuffle Quote ↻
        </button>
      </div>
    </div>
  );
};
