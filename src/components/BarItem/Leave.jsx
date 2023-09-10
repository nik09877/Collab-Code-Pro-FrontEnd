import React from 'react';
import { Box } from '@mui/material';

import classes from './tools.module.css';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { socketActions } from '../../socket/socketActions';

const Leave = ({ socketRef }) => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');
  const location = useLocation();
  const navigate = useNavigate();

  const title =
    location.pathname === `/contest/${roomId}` ? 'End Contest' : 'Leave Room';

  const handleHomeNav = (msg) => {
    navigate('/home', {
      state: { err: `${msg}` },
      replace: true,
    });
  };
  const leaveRoomHandler = () => {
    if (!window.confirm('Are you sure you want to leave this room ?')) {
      return;
    }
    if (location.pathname === `/contest/${roomId}`) {
      // console.log('leaving contest');
      //FIXME UNCOMMENT IF NOT WORKING
      // socketRef.current.emit(socketActions.CONTEST_UPDATE, { roomId });
      socketRef.current.emit(socketActions.LEAVE_CONTEST, {
        name: userName,
        roomId,
      });
      handleHomeNav('You Left the Contest');
    } else {
      handleHomeNav('You Left the Room');
    }
  };

  return (
    <Box className={classes.navButton} onClick={leaveRoomHandler}>
      {title}
    </Box>
  );
};

export default Leave;
