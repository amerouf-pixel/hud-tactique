import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Plus, Compass, Sparkles, Car, FileText } from 'lucide-react';
import { MissionType, CollectibleCategory, VehicleCategory } from '../types';

interface ModalNewItemProps {
  isOpen: boolean;
  onClose: () => void;
}

type ItemType = 'mission' | 'collectible' | 'vehicle' | 'note';

export const ModalNewItem: React.FC<ModalNewItemProps> = ({ isOpen, onClose }) => {
  const { addMission, addCollectible, addVehicle, addNote } = useGame();
  const [selectedType, setSelectedType] = useState<ItemType>('mission');

  // Mission state
  const [missionTitle, setMissionTitle] = useState('');
  const [missionType, setMissionType] = useState<MissionType>('main');
  const [missionDistrict, setMissionDistrict] = useState('Centre-Ville');
  const [missionGiver, setMissionGiver] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionXp, setMissionXp] = useState('1000');
  const [missionCredits, setMissionCredits] = useState('3000');

  // Collectible state
  const [collectibleName, setCollectibleName] = useState('');
  const [collectibleCat, setCollectibleCat] = useState<CollectibleCategory>('relic');
  const [collectibleDistrict, setCollectibleDistrict] = useState('Watson');
  const [collectibleHint, setCollectibleHint] = useState('');
  const [collectibleCoords, setCollectibleCoords] = useState('');

  // Vehicle state
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleManufacturer, setVehicleManufacturer] = useState('');
  const [vehicleCat, setVehicleCat] = useState<VehicleCategory>('sport');
  const [vehicleSpeed, setVehicleSpeed] = useState('80');
  const [vehicleHandling, setVehicleHandling] = useState('75');
  const [vehicleArmor, setVehicleArmor] = useState('60');
  const [vehicleLoc, setVehicleLoc] = useState('');

  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('boss, tactique');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedType === 'mission') {
      if (!missionTitle.trim()) return;
      addMission({
        title: missionTitle,
        type: missionType,
        district: missionDistrict,
        giver: missionGiver || 'Inconnu',
        description: missionDesc || 'Aucune description fournie.',
        rewardXp: Number(missionXp) || 500,
        rewardCredits: Number(missionCredits) || 1000,
        status: 'available',
        steps: [
          { id: `s_${Date.now()}_1`, text: 'Atteindre le lieu indiqué', completed: false },
          { id: `s_${Date.now()}_2`, text: 'Accomplir l’objectif principal', completed: false },
        ],
      });
    } else if (selectedType === 'collectible') {
      if (!collectibleName.trim()) return;
      addCollectible({
        name: collectibleName,
        category: collectibleCat,
        district: collectibleDistrict,
        hint: collectibleHint || 'Indice inconnu',
        coordinates: collectibleCoords || 'X: 0.0 | Y: 0.0',
        collected: false,
      });
    } else if (selectedType === 'vehicle') {
      if (!vehicleName.trim()) return;
      addVehicle({
        name: vehicleName,
        manufacturer: vehicleManufacturer || 'Custom',
        category: vehicleCat,
        speed: Number(vehicleSpeed) || 75,
        handling: Number(vehicleHandling) || 70,
        armor: Number(vehicleArmor) || 50,
        unlocked: true,
        location: vehicleLoc || 'Garage Personnel',
        isFavorite: false,
      });
    } else if (selectedType === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle,
        content: noteContent || '',
        tags: noteTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        pinned: true,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0c1322] border border-cyan-900/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h2 className="font-hud font-bold text-lg text-white">AJOUTER UNE ENTRÉE TACTIQUE</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector tabs */}
        <div className="grid grid-cols-4 p-2 bg-slate-950 border-b border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setSelectedType('mission')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'mission'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mission</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('collectible')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'collectible'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collectible</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('vehicle')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'vehicle'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Véhicule</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('note')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'note'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Mission Form */}
          {selectedType === 'mission' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Titre de la mission *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Infiltration du Port Industriel"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Type</label>
                  <select
                    value={missionType}
                    onChange={(e) => setMissionType(e.target.value as MissionType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="main">Principale</option>
                    <option value="side">Secondaire</option>
                    <option value="bounty">Contrat / Prime</option>
                    <option value="activity">Activité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Quartier / District</label>
                  <input
                    type="text"
                    value={missionDistrict}
                    onChange={(e) => setMissionDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Donneur d’ordre</label>
                <input
                  type="text"
                  placeholder="ex: Rogue, Regina, Franklin..."
                  value={missionGiver}
                  onChange={(e) => setMissionGiver(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Description / Briefing</label>
                <textarea
                  rows={2}
                  placeholder="Détails tactiques de l'objectif..."
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Récompense XP</label>
                  <input
                    type="number"
                    value={missionXp}
                    onChange={(e) => setMissionXp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Crédits (E$)</label>
                  <input
                    type="number"
                    value={missionCredits}
                    onChange={(e) => setMissionCredits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Collectible Form */}
          {selectedType === 'collectible' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Nom de l'objet *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Puce cryptée #07"
                  value={collectibleName}
                  onChange={(e) => setCollectibleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={collectibleCat}
                    onChange={(e) => setCollectibleCat(e.target.value as CollectibleCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="relic">Relique</option>
                    <option value="cache">Cache Secrète</option>
                    <option value="audio_log">Journal Audio</option>
                    <option value="blueprint">Plan d'arme</option>
                    <option value="easter_egg">Secret / Easter Egg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Quartier / Région</label>
                  <input
                    type="text"
                    value={collectibleDistrict}
                    onChange={(e) => setCollectibleDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Indice de localisation</label>
                <input
                  type="text"
                  placeholder="ex: Sous la passerelle métallique près de l'ascenseur"
                  value={collectibleHint}
                  onChange={(e) => setCollectibleHint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Coordonnées GPS</label>
                <input
                  type="text"
                  placeholder="ex: X: 312.4 | Y: 184.2"
                  value={collectibleCoords}
                  onChange={(e) => setCollectibleCoords(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          {/* Vehicle Form */}
          {selectedType === 'vehicle' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Nom du modèle *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Rayfield Caliburn"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Constructeur</label>
                  <input
                    type="text"
                    placeholder="ex: Rayfield, Quadra, Mizutani"
                    value={vehicleManufacturer}
                    onChange={(e) => setVehicleManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Type</label>
                  <select
                    value={vehicleCat}
                    onChange={(e) => setVehicleCat(e.target.value as VehicleCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sport">Sportive</option>
                    <option value="muscle">Muscle Car</option>
                    <option value="moto">Moto</option>
                    <option value="offroad">Tout-terrain (4x4)</option>
                    <option value="heavy">Lourd</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Vitesse (0-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vehicleSpeed}
                    onChange={(e) => setVehicleSpeed(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Maniabilité</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vehicleHandling}
                    onChange={(e) => setVehicleHandling(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Blindage</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vehicleArmor}
                    onChange={(e) => setVehicleArmor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Lieu de déblocage</label>
                <input
                  type="text"
                  placeholder="ex: Conteneur secret dans le tunnel des Badlands"
                  value={vehicleLoc}
                  onChange={(e) => setVehicleLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          )}

          {/* Note Form */}
          {selectedType === 'note' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Titre de la note *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Code porte laboratoire secret"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Contenu / Code</label>
                <textarea
                  rows={4}
                  placeholder="Tapez vos notes tactiques, codes, indices..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  placeholder="ex: codes, boss, secret, arme"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-mono-code text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer transition-all"
            >
              ENREGISTRER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
