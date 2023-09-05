import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stars from '../../components/Stars/Stars';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();

  const handleHomeNav = () => {
    navigate('home');
  };
  return (
    <div
      style={{
        height: '100vh',
        background: 'radial-gradient(ellipse, #1b2735 0%, #090a0f 100%)',
      }}
    >
      <Stars color='#fff' />
      <Grid
        container
        direction='column'
        alignItems='center'
        style={{ marginTop: '35vh', textAlign: 'center' }}
      >
        <span
          style={{
            fontFamily: 'VT323',
            display: 'inline-block',
            width: '40%',
            minWidth: '300px',
            fontSize: '50px',
          }}
        >
          Collab-Code-Pro
        </span>

        <Box
          style={{
            width: '20%',
            color: '#fff',
            margin: '10vh auto',
            border: '2px solid #fff',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
            marginTop: '25px',
          }}
          onClick={handleHomeNav}
        >
          <span
            style={{
              fontFamily: 'VT323',
              display: 'inline-block',
              width: '55%',
              alignSelf: 'center',
              minWidth: '60px',
              fontSize: '20px',
            }}
          >
            Get Started
          </span>
        </Box>
      </Grid>
    </div>
  );
};

export default GetStarted;
