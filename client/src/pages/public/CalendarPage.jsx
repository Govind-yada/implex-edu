import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../api/axios.js';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Tag,
  ListFilter,
  Grid,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'agenda'

  useEffect(() => {
    fetchEvents();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      const data = res.data.data || [];
      setRawEvents(data);

      const calendarFormatted = data.map((ev) => ({
        id: ev._id,
        title: ev.title,
        start: ev.startDate,
        end: ev.endDate,
        allDay: ev.allDay,
        extendedProps: {
          description: ev.description,
          category: ev.category,
          location: ev.location,
          visibility: ev.visibility,
        },
        backgroundColor: getCategoryColor(ev.category),
        borderColor: getCategoryColor(ev.category),
      }));
      setEvents(calendarFormatted);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'quiz':
        return '#2563EB'; // brand blue
      case 'competition':
        return '#D97706'; // amber
      case 'registration_deadline':
        return '#E11D48'; // rose
      case 'workshop':
        return '#7C3AED'; // purple
      default:
        return '#0D9488'; // teal
    }
  };

  const getCategoryBadgeVariant = (cat) => {
    switch (cat) {
      case 'quiz':
        return 'blue';
      case 'competition':
        return 'amber';
      case 'registration_deadline':
        return 'rose';
      case 'workshop':
        return 'purple';
      default:
        return 'teal';
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      ...info.event.extendedProps,
    });
    setDetailsModalOpen(true);
  };

  const handleRawEventClick = (ev) => {
    setSelectedEvent({
      id: ev._id,
      title: ev.title,
      start: ev.startDate,
      end: ev.endDate,
      description: ev.description,
      category: ev.category,
      location: ev.location,
      visibility: ev.visibility,
    });
    setDetailsModalOpen(true);
  };

  // Sort upcoming events for the agenda list view
  const upcomingEvents = [...rawEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 sm:pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white pt-10 sm:pt-16 pb-10 sm:pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="blue" className="mb-3">
            Schedule & Deadlines
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Academic & Event Calendar
          </h1>
          <p className="text-xs sm:text-base text-slate-600 mt-3 sm:mt-4 leading-relaxed max-w-2xl mx-auto">
            Stay updated with upcoming quiz start times, competition submission deadlines, and
            inter-institutional scholastic workshops.
          </p>

          {/* Color Legend (Mobile Responsive) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shrink-0" />
              <span>Quiz Schedules</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
              <span>Competitions</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
              <span>Registration Deadlines</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
              <span>Workshops & Summits</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Calendar / Agenda Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 border border-slate-200/80 shadow-card">
          {/* View Mode Toggle Header (Especially powerful for mobile screens) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {viewMode === 'calendar' ? 'Monthly Schedule View' : 'Upcoming Events Agenda'}
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  {rawEvents.length} events scheduled in current academic term
                </p>
              </div>
            </div>

            {/* Segmented Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-white text-brand-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Calendar Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('agenda')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'agenda'
                    ? 'bg-white text-brand-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Agenda List</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-700 text-[10px]">
                  {rawEvents.length}
                </span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16">
              <Loader text="Loading schedule calendar..." />
            </div>
          ) : viewMode === 'calendar' ? (
            /* Responsive FullCalendar Container */
            <div className="calendar-responsive-wrapper overflow-x-auto">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={
                  isMobile
                    ? {
                        left: 'prev,next',
                        center: 'title',
                        right: 'today',
                      }
                    : {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek',
                      }
                }
                dayHeaderFormat={isMobile ? { weekday: 'narrow' } : { weekday: 'short' }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                dayMaxEvents={isMobile ? 2 : 3}
              />
            </div>
          ) : (
            /* Mobile-First Agenda / Upcoming Events List */
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
                  No upcoming events scheduled right now. Check back soon!
                </div>
              ) : (
                upcomingEvents.map((ev) => {
                  const evDate = new Date(ev.startDate);
                  const monthName = evDate.toLocaleDateString('en-US', { month: 'short' });
                  const dayNum = evDate.getDate();
                  const weekday = evDate.toLocaleDateString('en-US', { weekday: 'short' });
                  const color = getCategoryColor(ev.category);

                  return (
                    <div
                      key={ev._id}
                      onClick={() => handleRawEventClick(ev)}
                      className="group p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-brand-300 bg-white hover:bg-slate-50/60 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      {/* Left: Date Badge */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shrink-0 shadow-xs font-bold leading-none"
                          style={{ backgroundColor: color }}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
                            {monthName}
                          </span>
                          <span className="text-base font-black mt-0.5">{dayNum}</span>
                        </div>

                        {/* Middle: Event Info */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs"
                              style={{ backgroundColor: color }}
                            >
                              {ev.category?.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                              {weekday}
                            </span>
                          </div>

                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                            {ev.title}
                          </h3>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1 truncate">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{new Date(ev.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                            {ev.location && (
                              <span className="hidden sm:flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{ev.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Chevron Action */}
                      <div className="shrink-0 flex items-center text-slate-400 group-hover:text-brand-600 transition-colors">
                        <span className="text-[11px] font-bold hidden sm:inline mr-1">Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* Event Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedEvent?.title || 'Event Details'}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: getCategoryColor(selectedEvent.category) }}
              >
                {selectedEvent.category?.replace('_', ' ').toUpperCase()}
              </span>
              <Badge variant="slate">
                Visibility: {selectedEvent.visibility?.toUpperCase() || 'PUBLIC'}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedEvent.description || 'No detailed description specified for this event.'}
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Starts:</strong> {new Date(selectedEvent.start).toLocaleString()}
                </span>
              </div>
              {selectedEvent.end && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Ends:</strong> {new Date(selectedEvent.end).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Venue:</strong> {selectedEvent.location || 'Online Session / Web Portal'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
