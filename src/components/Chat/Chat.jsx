import React, { useEffect, useRef } from 'react';
import { Typography, Grid } from '@mui/material';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import Message from './Message';
import classes from './Message.module.css';
import { socketActions } from '../../socket/socketActions';

const Chat = ({ socketRef, messages }) => {
  //   const [name, setName] = useState('');

  const inputRef = useRef();

  const location = useLocation();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  //Emiting the messages to other users via socket
  const submitHandler = (e) => {
    e.preventDefault();
    const finalValue = inputRef.current.value.trim();
    if (finalValue) {
      if (location.pathname === `/contest/${roomId}`) {
        socketRef.current.emit(socketActions.CONTEST_MSG, {
          message: finalValue,
          room: roomId,
          name: userName,
        });
      } else {
        socketRef.current.emit(socketActions.CLIENT_MSG, {
          message: finalValue,
        });
      }
      inputRef.current.value = '';
    }
  };

  return (
    <Grid
      style={{
        display: 'flex',
        flexFlow: 'column',
        height: '74vh',
        width: '100%',
        overflow: 'hidden',
        background: '#313332',
        border: '2px solid black',
        borderRadius: '10px',
        boxShadow: '0 5px 15px 0px rgba(0,0,0,0.6)',
      }}
    >
      <Typography
        style={{
          fontSize: '15px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        CHAT
      </Typography>
      <Grid
        style={{
          height: '63.5vh',
          display: 'flex',
          flexFlow: 'row',
          background: '#313332',
        }}
      >
        <ScrollToBottom className={classes.scroll_messages}>
          <div className={classes.messages}>
            {messages.map((message, i) => (
              <div key={i}>
                <Message message={message} name={userName} />
              </div>
            ))}
          </div>
        </ScrollToBottom>
      </Grid>
      <form
        onSubmit={submitHandler}
        style={{ padding: '0 2px 1px 2px', background: '#313332' }}
      >
        <input
          ref={inputRef}
          onChange={(e) => {}}
          type='text'
          placeholder='Send a Message!'
          className={classes.input}
        />
      </form>
    </Grid>
  );
};

export default Chat;
