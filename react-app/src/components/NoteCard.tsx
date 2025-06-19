import React from 'react';
import { Trash2, Calendar, Tag } from 'lucide-react';
import type { Note } from '../types/Notes';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group hover:border-gray-600/50">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-100 group-hover:text-blue-400 transition-colors duration-200">
          {note.title}
        </h3>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-900/20"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
        {note.content}
      </p>
      
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700/50 hover:bg-blue-900/70 transition-colors duration-200"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center text-sm text-gray-500">
        <Calendar size={14} className="mr-2" />
        <span>Created {formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};