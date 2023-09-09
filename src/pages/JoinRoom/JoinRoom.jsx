import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Styles from './JoinRoom.module.css';
import Stars from '../../components/Stars/Stars';
import Back from '../../components/Back/Back';
import Nav from '../../components/Nav/Nav';
import Snacker from '../../components/Snacker/Snacker';
import { Button, Grid, InputLabel } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const JoinRoom = () => {
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  const [searchParams] = useSearchParams();
  const roomType = searchParams.get('type');

  const navigate = useNavigate();

  const handleUserNameChange = (e) => {
    setUserName(e.target.value.trim());
  };
  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value.trim());
  };
  const generateRoomId = () => {
    const id = uuidv4();
    setRoomId(id);
  };

  const handleJoinRoom = () => {
    if (!userName || !roomId) setError('Invalid UserName/RoomId');

    navigate({
      pathname: `/${roomType}/${roomId}`,
      search: `?userName=${userName}`,
    });

    setUserName('');
    setRoomId('');
  };

  return (
    <div className={Styles.main}>
      <Stars color='#fff' />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        <Back />
        <Nav />
      </div>

      <Grid container direction='column' justify='center' alignItems='center'>
        <h1 className={Styles.header}>Collab-Code-Pro</h1>
        <div className={Styles.inputContainer}>
          <div>
            <InputLabel style={{ color: '#fff', fontWeight: 'bold' }}>
              {roomType === 'contest'
                ? '* Enter Your Codeforces Handle'
                : '* What do you want to be called ?'}
            </InputLabel>
            <input
              type='text'
              className={Styles.input}
              onChange={handleUserNameChange}
              value={userName}
            />
          </div>
          <div>
            <InputLabel style={{ color: '#fff', fontWeight: 'bold' }}>
              * Enter Room Id{' '}
              <span
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                }}
                onClick={generateRoomId}
              >
                (Or Click here to generate roomId){' '}
              </span>
            </InputLabel>
            <input
              type='text'
              className={Styles.input}
              onChange={handleRoomIdChange}
              value={roomId}
            />
          </div>

          <Button
            variant='contained'
            style={{
              alignSelf: 'center',
              border: '3px solid white',
              borderRadius: '5px',
              background: userName && roomId ? 'transparent' : '#7d7574',
              marginTop: '2vh',
              padding: '2vh',
              width: '12vw',
              minWidth: '120px',
              transform: `translateX(${'-5%'})`,
            }}
            disabled={userName === '' || roomId === ''}
            onClick={handleJoinRoom}
          >
            Join / Create
          </Button>
        </div>
      </Grid>
      <Snacker
        severity='error'
        timer={6000}
        message={error}
        onClose={() => setError(null)}
        open={error ? true : false}
      />
    </div>
  );
};

export default JoinRoom;
