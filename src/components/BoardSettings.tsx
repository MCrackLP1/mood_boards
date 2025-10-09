"use client";

import { Board } from "@/types";
import { useState } from "react";
import { X, Settings, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BoardSettingsProps {
  board: Board;
  onUpdate: (board: Board) => void;
}

export default function BoardSettings({ board, onUpdate }: BoardSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState(board.clientName || "");
  const [welcomeMessage, setWelcomeMessage] = useState(board.welcomeMessage || "");
  const [password, setPassword] = useState(board.password || "");
  const [showSignature, setShowSignature] = useState(board.showSignature !== false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...board,
      clientName: clientName.trim() || undefined,
      welcomeMessage: welcomeMessage.trim() || undefined,
      password: password.trim() || undefined,
      showSignature,
    });
    setIsOpen(false);
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/share/${board.id}${password ? `?pwd=${password}` : ''}`
    : '';

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
      >
        <Settings size={18} />
        <span className="hidden sm:inline">Einstellungen</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Board-Einstellungen</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Share Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teilbarer Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                      />
                      <button
                        onClick={copyShareLink}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span className="hidden sm:inline">{copied ? "Kopiert!" : "Kopieren"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Teile diesen Link mit deinen Kunden, um das Moodboard zu präsentieren.
                    </p>
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kundenname (optional)
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="z.B. Lisa & Tom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Wird in der Willkommensanimation angezeigt
                    </p>
                  </div>

                  {/* Welcome Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Willkommensnachricht (optional)
                    </label>
                    <textarea
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      placeholder="z.B. Hier ist mein Shooting-Vorschlag für euer Hochzeits-Shooting ✨"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Personalisiere die Begrüßung für deine Kunden
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Passwort-Schutz (optional)
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Passwort eingeben"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Schütze dein Board mit einem Passwort. Kunden müssen es eingeben, um das Board zu sehen.
                    </p>
                  </div>

                  {/* Show Signature */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        Signatur anzeigen
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        "by Mark Tietz Fotografie" in der Kundenansicht anzeigen
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSignature}
                        onChange={(e) => setShowSignature(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

