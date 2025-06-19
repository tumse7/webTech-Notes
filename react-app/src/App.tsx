import { BookOpen, FileText } from 'lucide-react';
import { AddNoteForm } from './components/AddNotesForm';
import { SearchBar } from './components/SearchBar';
import { NoteCard } from './components/NoteCard';
import { useNotes } from './hooks/useNotes';
import { useSearch } from './hooks/useSearch';
import { useState } from 'react';
import type { Note } from './types/Notes';

function App() {
  const { notes, addNote, editNote, deleteNote, getAllTags } = useNotes();
  const { searchTerm, setSearchTerm, selectedTag, setSelectedTag, filteredNotes } = useSearch(notes);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleUpdateNote = (updatedNote: { id: string } & { title: string; content: string; tags: string[] }) => {
    editNote(updatedNote);
    setEditingNote(null);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white shadow-lg shadow-blue-500/25">
              <BookOpen size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Notes
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Organize your thoughts with tags, markdown support, and powerful search
          </p>
        </div>

        {/* Add/Edit Note Form */}
        <AddNoteForm 
          onAddNote={addNote}
          onEditNote={handleUpdateNote}
          editingNote={editingNote}
          onCancelEdit={handleCancelEdit}
          availableTags={getAllTags()}
        />

        {/* Search Bar */}
        {notes.length > 0 && (
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            availableTags={getAllTags()}
          />
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No notes found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-500">
              Create your first note to get started!
            </p>
          </div>
        )}

        {/* Stats Footer */}
        {notes.length > 0 && (
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              {filteredNotes.length} of {notes.length} notes shown
              {getAllTags().length > 0 && ` • ${getAllTags().length} unique tags`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;