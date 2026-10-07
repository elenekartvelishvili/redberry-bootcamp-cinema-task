import { useEffect, useState } from 'react';
import './HoldTimer.css';

const getSecondsLeft = (expiresAt) => {
  const millisecondsLeft = new Date(expiresAt) - Date.now();
  return Math.max(0, Math.round(millisecondsLeft / 1000));
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

function HoldTimer({ expiresAt, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = getSecondsLeft(expiresAt);
      setSecondsLeft(left);

      if (left === 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <div className="hold-timer">
      <span className="text-label-s">Seats held</span>
      <span className="text-h3">{formatTime(secondsLeft)}</span>
    </div>
  );
}

export default HoldTimer;