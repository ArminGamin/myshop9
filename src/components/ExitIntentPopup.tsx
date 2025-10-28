import React, { useState, useEffect } from 'react';
import { X, Gift, Percent, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitIntentPopupProps {
  onClose: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [discountCode, setDiscountCode] = useState('KALEDOS15');

  useEffect(() => {
    let hasShown = localStorage.getItem('exitIntentShown');
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowPopup(true);
        localStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    onClose();
  };

  const copyDiscountCode = () => {
    navigator.clipboard.writeText(discountCode);
    // You could add a toast notification here
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Palaukite! Neiškeliaukite tuščiomis rankomis!
              </h2>
              <p className="text-gray-600">
                Gaukite <span className="font-bold text-red-600">15% nuolaidą</span> pirmajam užsakymui
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Percent className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-800">Jūsų nuolaidos kodas:</span>
              </div>
              <div className="bg-white border-2 border-dashed border-red-300 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{discountCode}</div>
                <button
                  onClick={copyDiscountCode}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  Kopijuoti kodą
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Gift className="w-4 h-4 text-green-600" />
                <span>Nemokamas pristatymas užsakymams virš €30</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Greitas pristatymas per 2-5 darbo dienas</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="w-4 h-4 text-yellow-600">🔒</span>
                <span>100% saugus mokėjimas</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 transition">
                Naudoti nuolaidos kodą
              </button>
              <button
                onClick={handleClose}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Ačiū, bet ne
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Nuolaidos kodas galioja 24 valandas
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


