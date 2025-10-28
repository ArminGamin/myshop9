import React, { useState, useEffect } from 'react';
import { Clock, Users, Eye } from 'lucide-react';

interface UrgencyTimerProps {
  endTime?: Date;
  showViewers?: boolean;
  showStock?: boolean;
}

export const UrgencyTimer: React.FC<UrgencyTimerProps> = ({ 
  endTime = new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  showViewers = true,
  showStock = true 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 20) + 5);
  const [stock, setStock] = useState(Math.floor(Math.random() * 10) + 1);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Update viewers every 30 seconds
    const viewerTimer = setInterval(() => {
      setViewers(prev => Math.max(3, prev + Math.floor(Math.random() * 6) - 3));
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(viewerTimer);
    };
  }, [endTime]);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-800">Ribotas laikas!</span>
        </div>
        <div className="text-sm text-red-600 font-medium">
          Pasiūlymas baigiasi:
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{timeLeft.hours}</div>
          <div className="text-xs text-red-500">Valandos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{timeLeft.minutes}</div>
          <div className="text-xs text-red-500">Minutės</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{timeLeft.seconds}</div>
          <div className="text-xs text-red-500">Sekundės</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        {showViewers && (
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{viewers} žmonių žiūri dabar</span>
          </div>
        )}
        {showStock && (
          <div className="flex items-center space-x-1 text-orange-600">
            <Eye className="w-4 h-4" />
            <span>Liko tik {stock} vnt.</span>
          </div>
        )}
      </div>
    </div>
  );
};


