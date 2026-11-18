import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { Trophy, Calendar, Users, Award, ShieldCheck } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function TeacherCompetitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await api.get('/competitions');
      setCompetitions(res.data.data || []);
    } catch (err) {
      console.error('Failed to load competitions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Competition Supervision</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor scholastic tournaments, team registration status, and upcoming deadlines.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading competitions..." />
      ) : competitions.length === 0 ? (
        <EmptyState
          title="No Competitions"
          description="There are currently no active competitions scheduled."
          icon={Trophy}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {competitions.map((comp) => (
            <div
              key={comp._id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="amber">{comp.mode?.toUpperCase()}</Badge>
                  <span className="text-xs text-slate-500 font-semibold">
                    Starts: {new Date(comp.competitionStartDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{comp.title}</h3>
                <p className="text-xs text-brand-600 font-bold mb-3">{comp.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{comp.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800">
                  {comp.totalRegistered || 0} Registered
                </span>
                <span>Max: {comp.maxParticipants}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
