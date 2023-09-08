import React from 'react';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';

import classes from './tools.module.css';

const CopyRoomBtn = () => {
  const { roomId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      enqueueSnackbar('Room Id Copied Succesfully !', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Could not copy the Room ID', {
        variant: 'error',
      });
    }
  };
  return (
    <Box onClick={handleCopyRoomId} className={classes.navButton}>
      Copy RoomId
    </Box>
  );
};

export default CopyRoomBtn;
