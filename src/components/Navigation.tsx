import React from 'react';
import {
  Home,
  BookOpen,
  CalendarCheck,
  Clock,
  CheckSquare,
  CalendarDays,
  FileText,
  GraduationCap,
  TrendingUp,
  Target,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  RotateCcw,
} from 'lucide-react';

export type NavTabId =
  | 'home'
  | 'subjects'
  | 'daily'
  | 'weekly'
  | 'tasks'
  | 'calendar'
  | 'notes'
  | 'exams'
  | 'progress'
  | 'goals';

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // pastel tab color
  textColor: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, color: '#FCE4EC', textColor: '#6A2B3C' },
  { id: 'subjects', label: 'My Subjects', icon: BookOpen, color: '#E8F0EC', textColor: '#2D4B39' },
  { id: 'daily', label: 'Daily Planner', icon: CalendarCheck, color: '#FFE8DC', textColor: '#6B3C26' },
  { id: 'weekly', label: 'Weekly Timetable', icon: Clock, color: '#E5ECF6', textColor: '#26426B' },
  { id: 'tasks', label: 'My Tasks', icon: CheckSquare, color: '#FDF2D9', textColor: '#6B501A' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, color: '#F3E8F9', textColor: '#4F2B63' },
  { id: 'notes', label: 'Study Notes', icon: FileText, color: '#E5F4EC', textColor: '#225239' },
  { id: 'exams', label: 'Exam Prep', icon: GraduationCap, color: '#FCE7EB', textColor: '#6D2534' },
  { id: 'progress', label: 'Study Progress', icon: TrendingUp, color: '#EAE6DF', textColor: '#4A3D34' },
  { id: 'goals', label: 'Study Goals', icon: Target, color: '#FFF0D4', textColor: '#6B4A19' },
];

interface NavigationProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenInspiration: () => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  mobileMenuOpen,
  setMobileMenuOpen,
  soundEnabled,
  onToggleSound,
  onOpenInspiration,
  onResetData,
  onExportData,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8DCCF] px-4 sm:px-6 py-3 transition-shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onTabChange('home')}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F8BBD0] via-[#FCE4EC] to-[#FFF1F5] border border-[#F48FB1] flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                🌸
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg sm:text-xl text-[#3E2723] tracking-tight flex items-center gap-1.5 leading-none">
                  <span>My Study Planner</span>
                  <span className="text-sm font-normal text-[#D87093] font-handwriting">journal</span>
                </h1>
                <p className="text-[11px] text-[#8D6E63] font-medium hidden sm:block">
                  Plan Your Study, Achieve Your Dreams
                </p>
              </div>
            </button>
          </div>

          {/* Center / Action toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Inspiration photo preview button */}
            <button
              type="button"
              onClick={onOpenInspiration}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF2EB] hover:bg-[#F3E5D8] border border-[#E5D2C0] text-xs font-medium text-[#6B5344] transition-all"
              title="View Journal Design Inspiration Photo"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D87093]" />
              <span className="hidden md:inline">Journal Inspiration</span>
              <span className="md:hidden">Inspo</span>
            </button>

            {/* Sound toggle button */}
            <button
              type="button"
              onClick={onToggleSound}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#FAF2EB] hover:bg-[#F3E5D8] border border-[#E5D2C0] text-xs font-medium text-[#6B5344] transition-all flex items-center gap-1"
              title={soundEnabled ? 'Mute study sounds' : 'Enable study chimes'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#5B7B6D]" />
                  <span className="hidden lg:inline text-[11px]">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#A0887A]" />
                  <span className="hidden lg:inline text-[11px]">Muted</span>
                </>
              )}
            </button>

            {/* Data backup button */}
            <button
              type="button"
              onClick={onExportData}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#FAF2EB] hover:bg-[#F3E5D8] border border-[#E5D2C0] text-xs font-medium text-[#6B5344] transition-all flex items-center gap-1"
              title="Export Planner Data (JSON backup)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Backup</span>
            </button>

            {/* Reset to sample data */}
            <button
              type="button"
              onClick={onResetData}
              className="p-1.5 rounded-lg bg-[#FAF2EB] hover:bg-[#F8E0E5] border border-[#E5D2C0] text-[#8D6E63] hover:text-[#9C324E] transition-all"
              title="Reset to Sample Planner Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#FAF2EB] border border-[#E5D2C0] text-[#4E342E] hover:bg-[#F3E5D8] transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Aesthetic Planner Tabs (styled like index divider tabs of a real study journal!) */}
        <div className="hidden lg:block max-w-7xl mx-auto mt-2.5 pt-1 overflow-x-auto no-scrollbar">
          <nav className="flex items-end gap-1.5 border-b border-[#D8C7B5]">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  style={{
                    backgroundColor: isActive ? '#FFFDF9' : item.color,
                    color: isActive ? item.textColor : '#6D5B50',
                    borderColor: '#D8C7B5',
                  }}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-all duration-150 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-b-2 border-b-transparent -mb-[1px] shadow-sm font-bold z-10 translate-y-0'
                      : 'opacity-85 hover:opacity-100 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#D87093]' : 'text-[#8D6E63] group-hover:text-[#4E342E]'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D87093] ml-0.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#FFFDF9] border-l border-[#E5D7C5] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E5D8] mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌸</span>
                  <span className="font-serif font-bold text-base text-[#4E342E]">Study Journal</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#8D6E63] hover:bg-[#F3E5D8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        backgroundColor: isActive ? item.color : 'transparent',
                        color: isActive ? item.textColor : '#4E342E',
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive ? 'shadow-xs border border-[#E0D0C0]' : 'hover:bg-[#FAF4ED]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#D87093]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer footer */}
            <div className="pt-4 border-t border-[#F0E5D8] text-xs text-[#8D6E63] space-y-2">
              <p className="font-handwriting text-base text-[#D87093]">Plan Your Study, Achieve Your Dreams ✨</p>
              <p className="text-[11px]">All data saved automatically in your browser.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
