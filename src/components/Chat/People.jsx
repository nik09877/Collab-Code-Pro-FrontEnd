import React from 'react';
import { Typography, Grid, Avatar } from '@mui/material';
import ScrollToBottom from 'react-scroll-to-bottom';
import classes from './Message.module.css';

const People = ({ persons, you }) => {
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
        People
      </Typography>
      <Grid
        style={{
          height: '70vh',
          display: 'flex',
          flexFlow: 'row',
          background: '#313332',
        }}
      >
        <ScrollToBottom className={classes.scroll_messages}>
          <div
            style={{
              width: '100%',
              overflowX: 'hidden',
              background: '#313332',
            }}
          >
            {persons.map((person, i) => {
              console.log(you, person);
              if (!person || !person.username) return null;
              return (
                <div
                  title={person.username}
                  className={`${classes.messageContainer} ${classes.justifyStart}`}
                  style={{ width: '270px', marginBottom: '10px' }}
                  key={i}
                >
                  <div
                    className={`${classes.messageBox} ${classes.backgroundUser}`}
                  >
                    <Avatar className={classes.Avatar}>
                      {person.username[0].toUpperCase()}
                    </Avatar>
                    <p
                      className={`${classes.messageText} ${classes.colorLight} ${classes.username}`}
                    >
                      {person.username.length <= 3
                        ? person.username
                        : person.username.slice(0, 3)}
                    </p>
                  </div>
                  {you.trim().toLowerCase() ===
                  person.username.trim().toLowerCase() ? (
                    <div className={classes.you}>you</div>
                  ) : (
                    <div className={classes.online} />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollToBottom>
      </Grid>
    </Grid>
  );
};

export default People;
