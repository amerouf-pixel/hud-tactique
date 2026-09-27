import React, { useState, useEffect } from 'react';
import { cyberAudio } from '../utils/cyberAudio';
import { ArrowLeft, Shield, CheckCircle2, Lock, Sparkles, X } from 'lucide-react';

interface CheckoutTerminalProps {
  planName?: string;
  price?: string;
  duration?: string;
  redirectUrl?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const CheckoutTerminal: React.FC<CheckoutTerminalProps> = ({
  planName = 'LICENCE CORPO ACCESS',
  price = '29.00',
  duration = 'LIAISON PERMANENTE (À VIE)',
  redirectUrl = 'https://buy.stripe.com/test_ton_lien_de_paiement',
  onSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('INITIALISER LE TRANSFERT DE CRÉDITS');
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Simulation de la séquence de paiement
  useEffect(() => {
    if (isProcessing) {
      setGlitchActive(true);
      cyberAudio.playTargetAcquired();

      const sequence = [
        { time: 0, text: "Établissement d'une connexion sécurisée...", progress: 15 },
        { time: 1400, text: "Cryptage des données (AES-256)...", progress: 45 },
        { time: 2800, text: "Liaison au serveur corpo en cours...", progress: 65 },
        { time: 4200, text: "Autorisation des Eurodollars...", progress: 85 },
        { time: 5600, text: "TRANSFERT APPROUVÉ - ACCÈS DÉVERROUILLÉ", progress: 100 },
      ];

      const timers = sequence.map((step) =>
        setTimeout(() => {
          setStatusText(step.text);
          setProgress(step.progress);

          if (step.progress === 100) {
            setGlitchActive(false);
            cyberAudio.playFanfare();
            setStatusText("REDIRECTION VERS LA PASSERELLE SÉCURISÉE...");

            // Remplacer l'URL ci-dessous par ton vrai lien Stripe Payment ou Lemon Squeezy
            setTimeout(() => {
              try {
                window.location.href = redirectUrl || "https://buy.stripe.com/test_ton_lien_de_paiement";
              } catch (e) {
                console.error("Redirection error:", e);
              }
            }, 1500); // Laisse le temps au joueur de lire le message avant de quitter la page
          } else {
            cyberAudio.playClick();
          }
        }, step.time)
      );

      return () => timers.forEach(clearTimeout);
    }
  }, [isProcessing, redirectUrl]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  return (
    <>
      {/* Styles inline pour les effets spécifiques Cyberpunk */}
      <style>
        {`
          @keyframes glitch-anim {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 1px) }
            40% { transform: translate(-1px, -1px) }
            60% { transform: translate(2px, 1px) }
            80% { transform: translate(1px, -1px) }
            100% { transform: translate(0) }
          }
          .animate-glitch {
            animation: glitch-anim 0.3s infinite;
          }
          .scanlines {
            background: linear-gradient(
              to bottom,
              rgba(255,255,255,0),
              rgba(255,255,255,0) 50%,
              rgba(0,0,0,0.2) 50%,
              rgba(0,0,0,0.2)
            );
            background-size: 100% 4px;
          }
        `}
      </style>

      <div className="min-h-screen bg-[#090d16] font-mono text-cyan-500 p-4 md:p-8 flex items-center justify-center relative overflow-hidden select-none">
        {/* Overlay Scanline conditionnel */}
        <div
          className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
            glitchActive ? 'opacity-100 scanlines' : 'opacity-0'
          }`}
        />

        {/* Effet radial en fond */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#090d16] to-[#090d16] z-0" />

        {/* Floating Top Controls (Retour / Annuler) */}
        {onClose && (
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-40 px-3 py-1.5 bg-[#050912]/90 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 text-xs font-hud uppercase flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETOUR</span>
          </button>
        )}

        <div
          className={`w-full max-w-5xl border border-cyan-500/50 bg-[#090d16]/90 relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col md:flex-row transition-all duration-300 ${
            glitchActive
              ? 'animate-glitch border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)] text-red-400'
              : ''
          }`}
        >
          {/* Panneau de gauche : RÉSUMÉ D'EXTRACTION */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-cyan-500/30 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 ${
                      glitchActive ? 'bg-red-500' : 'bg-cyan-500'
                    } animate-pulse`}
                  />
                  <h2 className="text-xl tracking-widest text-white uppercase font-bold">
                    Résumé d'extraction
                  </h2>
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="md:hidden text-slate-500 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex-1">
                <table className="w-full text-sm text-left">
                  <tbody>
                    <tr className="border-b border-cyan-500/20">
                      <td className="py-4 text-slate-400">CONTRAT</td>
                      <td className="py-4 text-right text-white font-bold">{planName}</td>
                    </tr>
                    <tr className="border-b border-cyan-500/20">
                      <td className="py-4 text-slate-400">DURÉE</td>
                      <td className="py-4 text-right text-cyan-300">{duration}</td>
                    </tr>
                    <tr className="border-b border-cyan-500/20">
                      <td className="py-4 text-slate-400">MODULES</td>
                      <td className="py-4 text-right text-xs leading-relaxed">
                        <span className="text-cyan-400">[TUNING_GARAGE]</span>
                        <br />
                        <span className="text-cyan-400">[RADAR_HOLO_360]</span>
                        <br />
                        <span className="text-cyan-400">[TROPHY_TRACKER]</span>
                        <br />
                        <span className="text-cyan-400">[LOCAL_VAULT_AES]</span>
                      </td>
                    </tr>
                    <tr className="border-b-2 border-cyan-500">
                      <td className="py-6 text-slate-400 font-bold">MONTANT TOTAL</td>
                      <td className="py-6 text-right text-2xl text-white font-bold tracking-wider">
                        {price} <span className="text-cyan-500 text-sm">E$</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-500 leading-relaxed pt-4 border-t border-slate-900">
              <p>
                &gt; AVERTISSEMENT: Toute tentative de falsification de crédits entraînera une
                traque immédiate par la NetWatch.
              </p>
              <p className="mt-1 text-slate-600">&gt; HASH DE SÉCURITÉ: 0x8F9A...4B2C</p>
            </div>
          </div>

          {/* Panneau de droite : LIAISON BANCAIRE */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-black/30">
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl tracking-widest text-white uppercase font-bold">
                  Uplink Bancaire
                </h2>
                <span className="text-xs text-cyan-400 border border-cyan-500/30 px-2 py-1 bg-cyan-950/40 font-mono-code flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  SECURE 256-BIT
                </span>
              </div>

              {/* Quick Auto-Fill Demo Chip for easy evaluation */}
              {!isProcessing && progress < 100 && (
                <div className="mb-5 p-2.5 bg-cyan-950/30 border border-cyan-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Mode démonstration rapide :</span>
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playChirp();
                      setCardNumber('4532 8910 2345 6789');
                      setCardExpiry('12/28');
                      setCardCvc('777');
                    }}
                    className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    [INJECTER PUCE TEST VIP]
                  </button>
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Numéro de compte */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider block">
                    Numéro de puce de crédit
                  </label>
                  <input
                    type="text"
                    disabled={isProcessing}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 8910 2345 6789"
                    maxLength={19}
                    className="w-full bg-slate-950/50 border border-cyan-500/30 p-3 text-cyan-300 font-mono text-base md:text-lg rounded-none focus:outline-none focus:border-cyan-400 focus:bg-cyan-900/20 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all placeholder:text-cyan-900/50 disabled:opacity-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {/* Expiration */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider block">
                      Expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full bg-slate-950/50 border border-cyan-500/30 p-3 text-cyan-300 font-mono text-base md:text-lg rounded-none focus:outline-none focus:border-cyan-400 focus:bg-cyan-900/20 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all placeholder:text-cyan-900/50 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* CVC */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider block">
                      Code Auth (CVC)
                    </label>
                    <input
                      type="password"
                      disabled={isProcessing}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.substring(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-slate-950/50 border border-cyan-500/30 p-3 text-cyan-300 font-mono text-base md:text-lg rounded-none focus:outline-none focus:border-amber-400 focus:bg-amber-900/20 focus:shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all placeholder:text-cyan-900/50 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Bouton de soumission massif */}
                <div className="pt-6">
                  {progress === 100 ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/80 text-emerald-300 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span>TRANSFERT APPROUVÉ · VOS ACCRÉDITATIONS SONT ACTIVES</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          try {
                            localStorage.setItem('cyber_license', planName);
                          } catch {
                            // ignore localStorage error
                          }
                          cyberAudio.playFanfare();
                          if (onSuccess) onSuccess();
                        }}
                        className="w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(16,185,129,0.7)] cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>OUVRIR LE COCKPIT / TERMINAL PRINCIPAL</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full relative overflow-hidden group border rounded-none p-4 transition-all duration-300 cursor-pointer ${
                        glitchActive
                          ? 'border-red-500 bg-red-900/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                          : 'border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] text-cyan-300'
                      }`}
                    >
                      {/* Barre de progression interne au bouton */}
                      {isProcessing && (
                        <div
                          className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out z-0 ${
                            glitchActive ? 'bg-red-500/30' : 'bg-cyan-500/30'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      )}

                      {/* Texte du bouton */}
                      <span className="relative z-10 font-bold tracking-widest text-xs md:text-sm flex items-center justify-center gap-3 uppercase">
                        {isProcessing && progress < 100 && (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        {statusText}
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="pt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono-code">
              <span>SÉCURITÉ MILITAIRE ARASAKA</span>
              <span className="text-cyan-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                LIAISON CRYPTÉE
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutTerminal;
