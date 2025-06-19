import React, { useState, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import type { NoteFormData } from '../types/Notes';

interface AddNoteFormProps {
  onAddNote: (note: NoteFormData) => void;
}

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAddNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
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
    
    onAddNote(formData);
    setFormData({ title: '', content: '', tags: [] });
    setTagInput('');
    setIsOpen(false);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset form when closing
    setFormData({ title: '', content: '', tags: [] });
    setTagInput('');
  };

  return (
    <>
      {/* Add Note Button */}
      <div className="mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Note
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Plus size={20} className="text-white" />
                  </div>
                  Create New Note
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
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-gray-100 placeholder-gray-400 resize-none"
                  placeholder="Write your note content..."
                  rows={6}
                  required
                />
              </div>
              
              {/* Tags Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tags
                </label>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-gray-100 placeholder-gray-400"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <Tag size={16} />
                    Add
                  </button>
                </div>
                
                {/* Tags Display */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700/50 hover:bg-blue-900/70 transition-colors duration-200"
                      >
                        <Tag size={12} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-400 hover:text-blue-200 transition-colors duration-200 hover:bg-blue-800/50 rounded-full p-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-700/50">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-lg"
                >
                  Create Note
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