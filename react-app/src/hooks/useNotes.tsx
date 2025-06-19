import { useState, useEffect } from 'react';
import type { Note, NoteFormData } from '../types/Notes';

const STORAGE_KEY = 'notes-app-data';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (noteData: NoteFormData) => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getAllTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  };

  return {
    notes,
    addNote,
    deleteNote,
    getAllTags
  };
};