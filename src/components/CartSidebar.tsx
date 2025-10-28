import React from 'react';
import { X, ShoppingCart, Clock, Gift, Shield, Trash2 } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalItems: number;
  totalPrice: number;
  urgencyTimer: { hours: number; minutes: number; seconds: number };
  giftWrapping: boolean;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  onCheckout: () => void;
  translations: any;
}

export const CartSidebar = React.memo(({
  isOpen,
  onClose,
  cartItems,
  totalItems,
  totalPrice,
  urgencyTimer,
  giftWrapping,
  updateQuantity,
  removeItem,
  onCheckout,
  translations: t
}: CartSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Krepšelis • {totalItems}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {totalItems > 0 && (
            <>
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium mb-2">
                  Jūs esate €{Math.max(0, 30 - totalPrice).toFixed(2)} nuo NEMOKAMO dovanos!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalPrice / 30) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-gray-600">Nemokama dovana</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-gray-600">Nemokamas pristatymas</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 text-orange-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold text-sm">Pasiūlymas baigiasi:</span>
                  <span className="font-bold">
                    {urgencyTimer.hours}:{urgencyTimer.minutes.toString().padStart(2, '0')}:{urgencyTimer.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </>
          )}

          {totalItems === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">{t.emptyCart}</p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-red-600 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-700 hover:to-green-700"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" loading="lazy" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      {item.selectedColor && <p className="text-xs text-gray-500">Spalva: {item.selectedColor}</p>}
                      {item.selectedSize && <p className="text-xs text-gray-500">Dydis: {item.selectedSize}</p>}
                      <span className="text-lg font-bold text-red-600">€{item.price}</span>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-sm hover:bg-gray-300">-</button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-sm hover:bg-gray-300">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{t.orderTotal}:</span>
                    <span className="text-xl font-bold text-red-600">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <button onClick={onCheckout} className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 transition">
                    {t.checkout} • €{(totalPrice + (totalPrice >= 30 ? 0 : 2.99) + (giftWrapping ? 2.99 : 0)).toFixed(2)}
                  </button>
                </div>

                <div className="flex justify-center space-x-3 pt-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" className="h-6 opacity-60" alt="Mastercard" />
                  <div className="bg-white border border-gray-300 px-2 py-1 rounded">
                    <span className="text-blue-600 font-bold text-sm">VISA</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6 opacity-60" alt="PayPal" />
                </div>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>100% pinigų grąžinimo garantija</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

CartSidebar.displayName = 'CartSidebar';
