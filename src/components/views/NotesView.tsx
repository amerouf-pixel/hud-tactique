import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  FileText,
  Pin,
  Trash2,
  Plus,
  Search,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

interface NotesViewProps {
  onOpenNewItemModal: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onOpenNewItemModal }) => {
  const { notes, deleteNote, togglePinNote } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = notes.filter((n) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = n.title.toLowerCase().includes(q);
    const matchContent = n.content.toLowerCase().includes(q);
    const matchTag = n.tags.some((t) => t.toLowerCase().includes(q));
    return matchTitle || matchContent || matchTag;
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold font-hud text-white">NOTES & TACTIQUE</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Bloc-notes rapide pour stocker les combinaisons de coffres, stratégies de boss et secrets.
          </p>
        </div>

        <button
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NOUVELLE NOTE</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher dans les notes (mots clés, codes, tags)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#0c1322] border border-cyan-950 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-[#0c1322] border border-slate-800 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <div className="text-slate-300 font-semibold">Aucune note pour le moment.</div>
            <div className="text-xs text-slate-500 mt-1">
              Créez votre première note pour consigner des codes ou des astuces.
            </div>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                note.pinned
                  ? 'bg-gradient-to-b from-[#0f1b30] to-[#0c1322] border-cyan-500/40 glow-cyan'
                  : 'bg-[#0c1322] border-cyan-950/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-hud font-bold text-base text-white">{note.title}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        note.pinned
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                      title={note.pinned ? 'Détacher' : 'Épingler'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-rose-400 border border-slate-800 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono-code text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-950"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono-code text-slate-500">
                <span>{note.updatedAt}</span>
                <button
                  onClick={() => handleCopy(note.id, note.content)}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 cursor-pointer"
                  title="Copier dans le presse-papier"
                >
                  {copiedId === note.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
