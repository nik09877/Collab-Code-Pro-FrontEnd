import React, { useEffect, useState } from 'react';
import {
  showContestEndedModal,
  updateContestEnded,
} from '../../store/contestSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { socketActions } from '../../socket/socketActions';

const CountDown = ({ stopAt, socketRef }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const dispatch = useDispatch();
  const { roomId } = useParams();

  useEffect(() => {
    const interval = setInterval(() => {
      let now = new Date().getTime();
      const distance = stopAt - now;
      let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let s = Math.floor((distance % (1000 * 60)) / 1000);

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(interval);
        dispatch(showContestEndedModal());
        dispatch(updateContestEnded(true));
        socketRef.current.emit(socketActions.CONTEST_UPDATE, {
          roomId: roomId,
        });
        return;
      }
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);
  }, []);

  return (
    <div style={{ color: '#fff', width: '100%', textAlign: 'center' }}>
      <div style={{ margin: '2px' }}>Timer</div>
      <h1 style={{ margin: '0px' }}>
        {hours !== '' ? `${hours}:${minutes}:${seconds}` : '----'}
      </h1>
    </div>
  );
};

export default CountDown;
