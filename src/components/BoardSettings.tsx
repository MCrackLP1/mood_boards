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
        className="px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
      >
        <Settings size={20} />
        <span className="hidden sm:inline">Settings</span>
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
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Board Settings</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure your board for sharing</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 overflow-y-auto flex-1">
                  {/* Share Link */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Shareable Link
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm text-gray-700 font-mono shadow-sm"
                      />
                      <button
                        onClick={copyShareLink}
                        className={`px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg ${
                          copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:scale-105'
                        }`}
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Share this link with your clients to present the moodboard
                    </p>
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Client Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Lisa & Tom"
                      className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm hover:shadow-md"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Displayed in the welcome animation
                    </p>
                  </div>

                  {/* Welcome Message */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Welcome Message <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      placeholder="e.g. Here's my shooting proposal for your wedding ✨"
                      rows={3}
                      className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none resize-none transition-all shadow-sm hover:shadow-md"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Personalize the greeting for your clients
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Password Protection <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm hover:shadow-md"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Protect your board - clients must enter password to view
                    </p>
                  </div>

                  {/* Show Signature */}
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div>
                      <label className="block text-sm font-bold text-gray-800">
                        Show Signature
                      </label>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Display "by Mark Tietz Fotografie" in client view
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSignature}
                        onChange={(e) => setShowSignature(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gray-900 peer-checked:to-gray-800 shadow-inner"></div>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-8 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Save Settings
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

