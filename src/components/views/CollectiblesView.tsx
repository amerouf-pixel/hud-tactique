import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CollectibleCategory } from '../../types';
import {
  Sparkles,
  MapPin,
  Search,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  FileCode,
  Volume2,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface CollectiblesViewProps {
  onOpenNewItemModal: () => void;
}

export const CollectiblesView: React.FC<CollectiblesViewProps> = ({ onOpenNewItemModal }) => {
  const { collectibles, toggleCollectible, stats } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = collectibles.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (cat: CollectibleCategory) => {
    switch (cat) {
      case 'audio_log':
        return <Volume2 className="w-4 h-4 text-sky-400" />;
      case 'relic':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'blueprint':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'cache':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  const getCategoryLabel = (cat: CollectibleCategory) => {
    switch (cat) {
      case 'audio_log':
        return 'Journal Audio';
      case 'relic':
        return 'Relique';
      case 'blueprint':
        return 'Plan d’Arme';
      case 'cache':
        return 'Cache Secrète';
      case 'easter_egg':
        return 'Secret / Easter Egg';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold font-hud text-white">CARTE DES COLLECTIBLES</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Localisation et indices pour obtenir le 100% de complétion sur tous les secrets.
          </p>
        </div>

        <button
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-hud font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>AJOUTER UN COLLECTIBLE</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-[#0c1322] border border-amber-950/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono-code text-slate-400 uppercase">
            Statut Global des Objets Cachés
          </div>
          <div className="text-xl font-bold font-hud text-white mt-0.5">
            {stats.collectiblesDone} sur {stats.collectiblesTotal} découverts ({Math.round(
              (stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100
            )}%)
          </div>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-500"
              style={{
                width: `${(stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Chips & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Chercher un nom de relique, quartier, indice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0c1322] border border-cyan-950 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'audio_log', label: 'Audio' },
            { id: 'relic', label: 'Reliques' },
            { id: 'blueprint', label: 'Plans' },
            { id: 'cache', label: 'Caches' },
            { id: 'easter_egg', label: 'Secrets' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === chip.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Collectibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-[#0c1322] border border-slate-800 rounded-2xl">
            <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <div className="text-slate-300 font-semibold">Aucun collectible trouvé.</div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCollectible(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                item.collected
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                  : 'bg-[#0c1322] border-cyan-950/80 hover:border-amber-500/40 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(item.category)}
                    <span className="text-[11px] font-mono-code uppercase text-amber-400 font-semibold">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {item.district}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3
                    className={`font-hud font-bold text-base ${
                      item.collected ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </h3>

                  <div className="flex-shrink-0 mt-0.5">
                    {item.collected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 font-semibold">Indice : </span>
                  {item.hint}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  {item.coordinates || 'Coordonnées GPS'}
                </span>
                <span className={item.collected ? 'text-emerald-400' : 'text-slate-500'}>
                  {item.collected ? 'Collecté ✓' : 'Non collecté'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
