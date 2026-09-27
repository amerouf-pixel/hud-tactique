import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { VehicleCategory } from '../../types';
import {
  Car,
  Lock,
  Unlock,
  Star,
  Plus,
  MapPin,
  Gauge,
  Shield,
  Zap,
} from 'lucide-react';

interface VehiclesViewProps {
  onOpenNewItemModal: () => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({ onOpenNewItemModal }) => {
  const { vehicles, toggleVehicleUnlocked, toggleVehicleFavorite, stats } = useGame();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredVehicles = vehicles.filter((v) => {
    if (filterCategory === 'unlocked' && !v.unlocked) return false;
    if (filterCategory === 'favorite' && !v.isFavorite) return false;
    if (['sport', 'muscle', 'moto', 'offroad', 'heavy'].includes(filterCategory) && v.category !== filterCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold font-hud text-white">GARAGE & VÉHICULES</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Gestion du parc de bolides, statistiques de performances et localisations de déblocage.
          </p>
        </div>

        <button
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-hud font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>AJOUTER UN VÉHICULE</span>
        </button>
      </div>

      {/* Garage Stats Banner */}
      <div className="bg-[#0c1322] border border-emerald-950/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono-code text-slate-400 uppercase">Capacité du Garage</div>
            <div className="text-xl font-bold font-hud text-white">
              {stats.vehiclesUnlocked} / {stats.vehiclesTotal} Débloqués
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'unlocked', label: 'Débloqués' },
            { id: 'favorite', label: 'Favoris' },
            { id: 'sport', label: 'Sport' },
            { id: 'muscle', label: 'Muscle' },
            { id: 'moto', label: 'Moto' },
            { id: 'offroad', label: '4x4' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterCategory(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors ${
                filterCategory === chip.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`p-5 rounded-2xl border transition-all ${
              vehicle.unlocked
                ? 'bg-[#0c1322] border-cyan-950/80 hover:border-emerald-500/40 shadow-lg'
                : 'bg-slate-950/50 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase">
                    {vehicle.manufacturer}
                  </span>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {vehicle.category.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-hud font-bold text-lg text-white mt-1">{vehicle.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVehicleFavorite(vehicle.id)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-amber-400 border border-slate-800 cursor-pointer transition-colors"
                  title="Marquer en favori"
                >
                  <Star
                    className={`w-4 h-4 ${
                      vehicle.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => toggleVehicleUnlocked(vehicle.id)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                    vehicle.unlocked
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title={vehicle.unlocked ? 'Véhicule débloqué' : 'Véhicule verrouillé'}
                >
                  {vehicle.unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="space-y-2.5 mt-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div>
                <div className="flex justify-between text-xs font-mono-code text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Vitesse de pointe
                  </span>
                  <span className="text-cyan-400 font-semibold">{vehicle.speed} km/h</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${vehicle.speed}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-code text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Maniabilité
                  </span>
                  <span className="text-emerald-400 font-semibold">{vehicle.handling} / 100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${vehicle.handling}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-code text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" /> Blindage
                  </span>
                  <span className="text-amber-400 font-semibold">{vehicle.armor} / 100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${vehicle.armor}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Location & notes */}
            <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="truncate">{vehicle.location}</span>
            </div>

            {vehicle.notes && (
              <p className="text-xs text-slate-400 mt-2 italic bg-slate-900/30 p-2 rounded-lg">
                "{vehicle.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
