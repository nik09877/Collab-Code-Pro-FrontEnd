import React from 'react';
import { Grid, Button } from '@mui/material';
import { hideContestEndedModal } from '../../store/contestSlice';
import { useDispatch } from 'react-redux';

const ContestEndedModal = () => {
  const dispatch = useDispatch();

  return (
    <Grid
      style={{
        position: 'fixed',
        zIndex: '800',
        backgroundColor: 'black',
        height: '45vh',
        width: '40%',
        border: '1px solid #ccc',
        boxShadow: '1px 1px 1px black',
        background: 'rgb(39, 41, 43,0.8)',
        padding: '15vh',
        left: '30%',
        top: '150px',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease-out',
      }}
    >
      <div>
        <div style={{ display: 'flex', color: '#fff', fontSize: '30px' }}>
          Contest Ended
        </div>
        <Button
          onClick={() => dispatch(hideContestEndedModal())}
          style={{
            cursor: 'pointer',
            color: 'white',
            height: '50px',
            width: '200px',
            marginTop: '20%',
            borderRadius: '5px',
            background: '#c42b2b',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          OK
        </Button>
      </div>
    </Grid>
  );
};

export default ContestEndedModal;
