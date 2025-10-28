import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';

interface SocialProofProps {
  showRecentOrders?: boolean;
  showReviews?: boolean;
  showTrustBadges?: boolean;
}

export const SocialProof: React.FC<SocialProofProps> = ({
  showRecentOrders = true,
  showReviews = true,
  showTrustBadges = true
}) => {
  const [recentOrders, setRecentOrders] = useState([
    { name: 'Ana K.', location: 'Vilnius', time: '2 min', product: 'Kalėdinis namelis' },
    { name: 'Petras L.', location: 'Kaunas', time: '5 min', product: 'LED girlianda' },
    { name: 'Marija S.', location: 'Klaipėda', time: '8 min', product: 'Žaisliukų rinkinys' },
  ]);

  const reviews = [
    { name: 'Jonas M.', rating: 5, text: 'Puikus produktas, greitai pristatė!', verified: true },
    { name: 'Elena K.', rating: 5, text: 'Labai patiko, rekomenduoju!', verified: true },
    { name: 'Tomas R.', rating: 4, text: 'Kokybė gera, kaina prieinama.', verified: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentOrders(prev => {
        const newOrder = {
          name: ['Ana', 'Petras', 'Marija', 'Jonas', 'Elena', 'Tomas'][Math.floor(Math.random() * 6)] + ' ' + 
                 ['K.', 'L.', 'S.', 'M.', 'R.', 'N.'][Math.floor(Math.random() * 6)],
          location: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'][Math.floor(Math.random() * 5)],
          time: Math.floor(Math.random() * 10) + 1 + ' min',
          product: ['Kalėdinis namelis', 'LED girlianda', 'Žaisliukų rinkinys', 'Puokštė', 'Dekoracijos'][Math.floor(Math.random() * 5)]
        };
        return [newOrder, ...prev.slice(0, 2)];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Recent Orders */}
      {showRecentOrders && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Neseniai užsakyta:</span>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{order.name}</span>
                  <span className="text-gray-500">iš {order.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{order.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {showReviews && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-semibold text-blue-800">Klientų atsiliepimai:</span>
          </div>
          <div className="space-y-3">
            {reviews.map((review, index) => (
              <div key={index} className="border-l-2 border-blue-300 pl-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{review.name}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Patvirtinta
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Badges */}
      {showTrustBadges && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-sm font-medium text-gray-900">Saugus mokėjimas</div>
            <div className="text-xs text-gray-500">SSL šifravimas</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🚚</div>
            <div className="text-sm font-medium text-gray-900">Greitas pristatymas</div>
            <div className="text-xs text-gray-500">2-5 darbo dienos</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">↩️</div>
            <div className="text-sm font-medium text-gray-900">Lengvas grąžinimas</div>
            <div className="text-xs text-gray-500">30 dienų</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-sm font-medium text-gray-900">Aukšta kokybė</div>
            <div className="text-xs text-gray-500">4.8/5 įvertinimas</div>
          </div>
        </div>
      )}
    </div>
  );
};


