import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../api/axios.js';
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      const calendarFormatted = (res.data.data || []).map((ev) => ({
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

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white pt-16 pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="blue" className="mb-4">Schedule & Deadlines</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Academic & Event Calendar
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Stay updated with upcoming quiz start times, competition submission deadlines, and
            inter-institutional scholastic workshops.
          </p>

          {/* Color Legend */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-600" /> Quiz Schedules
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600" /> Competitions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600" /> Registration Deadlines
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600" /> Workshops & Summits
            </span>
          </div>
        </div>
      </section>

      {/* Calendar Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          {loading ? (
            <Loader text="Loading schedule calendar..." />
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek',
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              dayMaxEvents={3}
            />
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
            <div className="flex items-center gap-2">
              <Badge variant="blue">
                {selectedEvent.category?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="slate">
                Visibility: {selectedEvent.visibility?.toUpperCase()}
              </Badge>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedEvent.description || 'No detailed description specified for this event.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Starts:</strong> {new Date(selectedEvent.start).toLocaleString()}
                </span>
              </div>
              {selectedEvent.end && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong>Ends:</strong> {new Date(selectedEvent.end).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Venue:</strong> {selectedEvent.location || 'Online'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
