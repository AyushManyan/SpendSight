import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Sparkles, Calendar, TrendingUp, Target, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import AIInsight from '../../components/AIInsight';

const Insights = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [insight, setInsight] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState('spending_patterns');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const calendarRef = useRef(null);

  const handleGenerateInsight = async () => {
    if (!dateRange.start || !dateRange.end) return;

    setIsAnalyzing(true);

    try {
      const result = await axiosInstance.get(API_PATHS.INSIGHTS.GET_INSIGHTS, {
        params: {
          start_date: dateRange.start,
          end_date: dateRange.end,
        },
        timeout: 60000
      });

    console.log("insight ", result.data.insight);
    
      setInsight(result.data.insight);
    } catch (error) {
      console.error("Failed to fetch insights", error);
    } finally {
      setIsAnalyzing(false);
    }
  };


  // Check if a date is in the future
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date); // ✅ CLONE, do not mutate
    checkDate.setHours(0, 0, 0, 0);

    return checkDate > today;
  };


  // Generate calendar dates
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    const daysInMonth = lastDay.getDate();
    const days = [];

    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isInRange: false,
        isFuture: isFutureDate(date)
      });
    }

    // Current month's days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const isStart = dateString === dateRange.start;
      const isEnd = dateString === dateRange.end;
      const isInRange = dateRange.start && dateRange.end &&
        dateString >= dateRange.start && dateString <= dateRange.end;
      const isFuture = isFutureDate(date);

      days.push({
        date,
        isCurrentMonth: true,
        isInRange,
        isStart,
        isEnd,
        isFuture
      });
    }

    // Next month's days
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isInRange: false,
        isFuture: isFutureDate(date)
      });
    }

    return days;
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Fix off-by-one: always set end date as the selected date, and display range inclusively
  const handleDateClick = (dayData) => {
    if (dayData.isFuture) return;
    const dateString = formatDate(dayData.date);
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: dateString, end: '' });
      setDragStart(dayData.date);
      setDragEnd(null);
    } else if (dateRange.start && !dateRange.end) {
      // Always set the end as the selected date, swap if needed
      if (new Date(dateString) >= new Date(dateRange.start)) {
        setDateRange(prev => ({ ...prev, end: dateString }));
      } else {
        setDateRange({ start: dateString, end: dateRange.start });
      }
      setDragStart(null);
      setDragEnd(null);
    }
  };

  const handleDragStart = (dayData) => {
    if (dayData.isFuture) return;
    setIsDragging(true);
    const dateString = formatDate(dayData.date);
    setDateRange({ start: dateString, end: '' });
    setDragStart(dayData.date);
    setDragEnd(null);
  };

  const handleDragOver = (dayData) => {
    if (!isDragging || !dragStart || dayData.isFuture) return;
    const dateString = formatDate(dayData.date);
    if (dateString !== dragEnd?.toISOString().split('T')[0]) {
      setDragEnd(dayData.date);
      if (dayData.date >= dragStart) {
        setDateRange({ start: formatDate(dragStart), end: dateString });
      } else {
        setDateRange({ start: dateString, end: formatDate(dragStart) });
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragStart && dragEnd) {
      const start = formatDate(dragStart);
      const end = formatDate(dragEnd);
      setDateRange(new Date(start) <= new Date(end) ? { start, end } : { start: end, end: start });
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);

      // Don't allow navigating to future months
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

      if (newMonthStart > today) {
        return new Date(today.getFullYear(), today.getMonth(), 1);
      }

      return newDate;
    });
  };

  const days = getCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Format date display
  const displayDateRange = dateRange.start && dateRange.end
    ? `${new Date(dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Select a date range';

  

  return (
    <DashboardLayout active="Insights">
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-6 px-2 sm:px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Modern Header with Gradient */}
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Financial Insights
              </h1>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              Select a date range to analyze your financial patterns. Click or drag on the calendar to choose dates.
            </p>
          </header>

          <div className="space-y-8">
            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-slate-100">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Select Date Range
                </h3>
                <p className="text-xs text-slate-500">
                  Click a date to start, then click another to complete. Or click and drag to select a range.
                </p>
              </div>

              {/* Selected Range Display */}
              <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded border border-indigo-100">
                <div className="text-xs font-medium text-slate-600 mb-0.5">Selected Range</div>
                <div className="text-base font-semibold text-slate-900">{displayDateRange}</div>
                {dateRange.start && dateRange.end && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    {Math.floor((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24)) + 1} days selected
                  </div>
                )}
              </div>

              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <h4 className="text-base font-semibold text-slate-900">{monthYear}</h4>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div
                ref={calendarRef}
                className="select-none"
                onMouseLeave={() => isDragging && handleDragEnd()}
              >
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {weekdays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-0.5">
                  {days.map((dayData, index) => {
                    const dateString = formatDate(dayData.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isToday = formatDate(today) === dateString;
                    const isSelected = dateString === dateRange.start || dateString === dateRange.end;
                    const isInRange = dayData.isInRange;
                    const isDisabled = dayData.isFuture;

                    return (
                      <div
                        key={index}
                        className={`relative h-8 flex items-center justify-center text-xs rounded transition-all duration-200
                          ${isDisabled ? 'text-slate-300 cursor-default font-medium' : dayData.isCurrentMonth ? 'font-medium text-slate-700' : 'font-normal text-slate-400 opacity-60'}
                          ${isToday && !isSelected && !isDisabled ? 'bg-blue-50 border border-blue-200' : ''}
                          ${isSelected && !isDisabled ? 'bg-indigo-600 text-white shadow-sm z-10 font-semibold' : ''}
                          ${isInRange && !isSelected && !isDisabled ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}
                          ${!isDisabled && dayData.isCurrentMonth ? 'hover:bg-slate-100 cursor-pointer' : ''}
                          ${!isDisabled && !dayData.isCurrentMonth ? 'hover:bg-slate-100/50 cursor-pointer' : ''}
                        `}
                        onClick={() => handleDateClick(dayData)}
                        onMouseDown={() => handleDragStart(dayData)}
                        onMouseEnter={() => handleDragOver(dayData)}
                        onMouseUp={handleDragEnd}
                      >
                        <span className={`relative z-20 ${isSelected ? 'font-semibold' : ''}`}>
                          {dayData.date.getDate()}
                        </span>

                        {/* Start/End indicators */}
                        {dayData.isStart && !isDisabled && (
                          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-indigo-500 rounded-l -z-10" />
                        )}
                        {dayData.isEnd && !isDisabled && (
                          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-indigo-500 rounded-r -z-10" />
                        )}

                        {/* Future date overlay */}
                        {dayData.isFuture && (
                          <div className="absolute inset-0 bg-white/50 rounded z-30"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>
                      <span className="text-xs">Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-indigo-100 rounded-sm"></div>
                      <span className="text-xs">In Range</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-blue-50 border border-blue-200 rounded-sm"></div>
                      <span className="text-xs">Today</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-white/50 border border-slate-200 rounded-sm"></div>
                      <span className="text-xs">Future Date</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Selection Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900 mb-1">Quick Select</h4>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: 'Last 7 Days', days: 7 },
                    { label: 'Last 30 Days', days: 30 },
                    { label: 'Last Quarter', days: 90 },
                    { label: 'Year to Date', days: 'ytd' },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        if (option.days === 'ytd') {
                          start.setMonth(0, 1);
                          start.setHours(0, 0, 0, 0);
                        } else {
                          start.setDate(end.getDate() - option.days);
                        }
                        setDateRange({
                          start: formatDate(start),
                          end: formatDate(end)
                        });
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-5">
                {/* Generate Button */}
                <button
                  onClick={handleGenerateInsight}
                  disabled={!dateRange.start || !dateRange.end || isAnalyzing}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded font-medium text-sm transition-all duration-300
                    ${(!dateRange.start || !dateRange.end || isAnalyzing)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-indigo-700 hover:to-purple-700 hover:shadow-md'
                    }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Analyzing {dateRange.start} to {dateRange.end}...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs">Generate AI Insights</span>
                    </div>
                  )}
                </button>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded p-2.5">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-800">
                        <span className="font-medium">Note:</span> Future dates are disabled. Select a historical date range to analyze your transaction patterns. The AI analyzes spending, identifies savings opportunities, and provides personalized recommendations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                {insight && (
                    <AIInsight insight={insight} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;