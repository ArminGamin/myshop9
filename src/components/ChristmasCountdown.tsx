import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Snowflake } from 'lucide-react';

interface ChristmasCountdownProps {
  showGiftTracker?: boolean;
  showSnowfall?: boolean;
}

export const ChristmasCountdown: React.FC<ChristmasCountdownProps> = ({
  showGiftTracker = true,
  showSnowfall = true
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [giftsOrdered, setGiftsOrdered] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const christmas = new Date("2024-12-25T00:00:00");
      const now = new Date();
      const difference = christmas.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    // Simulate gifts being ordered
    const giftInterval = setInterval(() => {
      setGiftsOrdered(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(giftInterval);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-green-600 text-white rounded-2xl p-6 mb-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Laikas iki Kalėdų</h2>
        </div>
        <p className="text-lg opacity-90">
          Nepraleiskite švenčių pasiūlymų!
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-sm opacity-90">Dienos</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm opacity-90">Valandos</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm opacity-90">Minutės</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm opacity-90">Sekundės</div>
        </div>
      </div>

      {showGiftTracker && (
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Šiandien užsakyta dovanų:</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{giftsOrdered + Math.floor(Math.random() * 50) + 20}</div>
            <div className="text-sm opacity-90">ir skaičius auga!</div>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm opacity-90 mb-2">
          🎄 Pristatysime per 2-5 darbo dienas
        </p>
        <p className="text-xs opacity-75">
          Paskutinis užsakymo diena: 2024-12-20
        </p>
      </div>
    </div>
  );
};


