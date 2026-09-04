'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  fetchSchedule,
  createScheduleItemApi,
  updateScheduleItemApi,
  deleteScheduleItemApi,
  ScheduleItem,
} from '@/lib/api';
import { Calendar, Plus, Edit, Trash2, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [dayOrDate, setDayOrDate] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchSchedule();
      setSchedule(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load schedule items.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchSchedule()
      .then((items) => {
        if (isMounted) {
          setSchedule(items);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to load schedule items.';
          setError(msg);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDayOrDate('');
    setSpeaker('');
    setDescription('');
    const maxOrder = schedule.length > 0 ? Math.max(...schedule.map((s) => s.order)) : 0;
    setOrder(maxOrder + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ScheduleItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDayOrDate(item.dayOrDate);
    setSpeaker(item.speaker);
    setDescription(item.description);
    setOrder(item.order);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        title,
        dayOrDate,
        speaker,
        description,
        order: Number(order),
      };

      if (editingItem) {
        await updateScheduleItemApi(editingItem.id, payload);
        setSuccessMsg('Schedule session updated successfully!');
      } else {
        await createScheduleItemApi(payload);
        setSuccessMsg('New schedule session created successfully!');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed. Please check your inputs.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteScheduleItemApi(deleteTarget.id);
      setSuccessMsg(`Deleted session '${deleteTarget.title}' successfully.`);
      setDeleteTarget(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete schedule item.';
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Schedule Management">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Curriculum Schedule Items</h2>
            <p className="text-xs text-gray-400 font-mono">
              Manage the logical ordering and content of live bootcamp sessions
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 text-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Session
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error notification">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white" aria-label="Dismiss success notification">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Table / Card List */}
        {loading ? (
          <div className="p-8 rounded-2xl bg-gray-900/60 border border-gray-800 text-center animate-pulse space-y-4">
            <div className="h-6 bg-gray-800 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto" />
          </div>
        ) : schedule.length === 0 ? (
          <div className="p-12 rounded-2xl bg-gray-900/60 border border-gray-800 text-center space-y-4">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Schedule Items Found</h3>
            <p className="text-xs text-gray-400">Click &quot;Add New Session&quot; to create your first session.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-gray-950">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800 font-mono">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Day / Date</th>
                  <th className="px-6 py-4">Session Title</th>
                  <th className="px-6 py-4">Speaker</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {schedule.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">#{item.order}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-300">{item.dayOrDate}</td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-300">{item.speaker}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-700 hover:border-cyan-500 text-cyan-400 transition-colors"
                        title="Edit Session"
                        aria-label={`Edit schedule session: ${item.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-700 hover:border-red-500 text-red-400 transition-colors"
                        title="Delete Session"
                        aria-label={`Delete schedule session: ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Schedule Session' : 'Add New Schedule Session'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block font-bold text-gray-300">Order Position (Number)</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                  min="1"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-300">Session Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js App Router Architecture"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-300">Day / Date Label</label>
                <input
                  type="text"
                  value={dayOrDate}
                  onChange={(e) => setDayOrDate(e.target.value)}
                  placeholder="e.g. Week 2 — Day 1"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-300">Instructor / Speaker</label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Jasveer Singh"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief session overview..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Session' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Confirm Session Deletion</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">&apos;{deleteTarget.title}&apos;</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 text-xs shadow-lg disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
