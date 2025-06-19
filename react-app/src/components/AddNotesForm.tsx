import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3 } from 'lucide-react';
import type { NoteFormData, Note } from '../types/Notes';
import { TagAutocomplete } from './TagAutocomplete';

interface AddNoteFormProps {
  onAddNote: (note: NoteFormData) => void;
  onEditNote?: (note: { id: string } & NoteFormData) => void;
  editingNote?: Note | null;
  onCancelEdit?: () => void;
  availableTags: string[];
}

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ 
  onAddNote, 
  onEditNote,
  editingNote,
  onCancelEdit,
  availableTags
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    tags: []
  });

  const isEditing = !!editingNote;

  // Set form data when editing
  useEffect(() => {
    if (editingNote) {
      setFormData({
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags
      });
      setIsOpen(true);
    }
  }, [editingNote]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }
    
    if (isEditing && editingNote && onEditNote) {
      onEditNote({ id: editingNote.id, ...formData });
    } else {
      onAddNote(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', tags: [] });
    setIsOpen(false);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const closeModal = () => {
    resetForm();
  };

  const handleTagsChange = (newTags: string[]) => {
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  return (
    <>
      {/* Add Note Button - Only show if not editing */}
      {!isEditing && (
        <div className="mb-8">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Note
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${isEditing ? 'from-green-500 to-blue-600' : 'from-blue-500 to-purple-600'} rounded-lg`}>
                    {isEditing ? <Edit3 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
                  </div>
                  {isEditing ? 'Edit Note' : 'Create New Note'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/50"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-gray-100 placeholder-gray-400 text-lg"
                  placeholder="Enter note title..."
                  required
                  autoFocus
                />
              </div>
              
              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Content
                  <span className="text-xs text-gray-500 ml-2">
                    (Supports Markdown formatting)
                  </span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-gray-100 placeholder-gray-400 resize-none font-mono text-sm"
                  placeholder="Write your note content... 

You can use Markdown formatting:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
`inline code`
- List item
1. Numbered list
> Blockquote
[Link](https://example.com)"
                  rows={12}
                  required
                />
              </div>
              
              {/* Tags Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tags
                </label>
                <TagAutocomplete
                  tags={formData.tags}
                  availableTags={availableTags}
                  onTagsChange={handleTagsChange}
                  placeholder="Add tags to organize your note..."
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-700/50">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r ${
                    isEditing 
                      ? 'from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' 
                      : 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  } text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-lg`}
                >
                  {isEditing ? 'Update Note' : 'Create Note'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-colors duration-200 text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};