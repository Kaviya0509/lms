import React from 'react';
import { Star, Users, Monitor, Globe } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import StatusBadge from '../../../components/common/StatusBadge';
import BatchColumn from './BatchColumn';
import { getInitials } from '../../../utils/helpers';
import { mockEnrollments } from '../../../services/mockData';
import type { Course, Batch } from '../../../types';

interface Props {
  course: Course | null;
  batches: Batch[];
  onClose: () => void;
}

const CourseDetailModal: React.FC<Props> = ({ course, batches, onClose }) => {
  if (!course) return null;

  const courseBatches  = batches.filter(b => b.courseId === course.id);
  const onlineBatches  = courseBatches.filter(b => !b.locationId);
  const offlineBatches = courseBatches.filter(b => !!b.locationId);
  const onlineAttendees = mockEnrollments.filter(
    e => e.courseId === course.id && e.courseMode === 'online'
  );
  const showOnlineSection = course.mode === 'online' || course.mode === 'both';

  return (
    <Modal isOpen={!!course} onClose={onClose} title="Course Details" size="xl">
      <div className="space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md uppercase tracking-wider">{course.code}</span>
              <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md capitalize">{course.level}</span>
              <StatusBadge status={course.status} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">{course.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{course.category}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 self-start md:self-auto">
            <div className="text-center border-r border-slate-200/80 pr-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{course.duration}h</p>
            </div>
            <div className="text-center pr-4 border-r border-slate-200/80">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Rating</p>
              <p className="text-sm font-semibold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                <Star size={13} fill="currentColor" /> {course.rating || '—'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Enrolled</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{course.enrolledCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
          <p className="text-slate-700 text-sm leading-relaxed">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning Objectives</h4>
            <ul className="space-y-1.5">
              {course.objectives.map((obj, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 bg-slate-50/50 border border-slate-100 rounded-xl p-4">
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Assigned Trainer</h5>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                  {getInitials(course.trainerName || 'Trainer')}
                </span>
                {course.trainerName || 'Unassigned'}
              </p>
            </div>
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Skills Covered</h5>
              <div className="flex flex-wrap gap-1.5">
                {course.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-white border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded-md font-medium">{skill}</span>
                ))}
              </div>
            </div>
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Prerequisites</h5>
                <p className="text-xs text-slate-600">{course.prerequisites.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-800">Batch Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BatchColumn
              label="Online Batches"
              icon={<Monitor size={15} />}
              batches={onlineBatches}
              emptyMessage="No online batches configured"
              accentColor="primary"
            />
            <BatchColumn
              label="Offline Batches"
              icon={<Globe size={15} />}
              batches={offlineBatches}
              emptyMessage="No offline batches configured"
              accentColor="emerald"
            />
          </div>
        </div>

        {showOnlineSection && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary-600" />
              <h4 className="font-bold text-slate-800 text-sm">
                Online Course Attended People ({onlineAttendees.length})
              </h4>
            </div>
            {onlineAttendees.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium">No attendees registered for online sessions yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {onlineAttendees.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(att.traineeName)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{att.traineeName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{att.traineeEmail}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3 space-y-1">
                      <StatusBadge status={att.status} dot />
                      <p className="text-[10px] font-semibold text-primary-600">{att.progress}% Done</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CourseDetailModal;
