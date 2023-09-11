import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import CountDown from '../../CountDown/CountDown';
import Problem from '../Problem/Problem';
import LeaderBoard from '../LeaderBoard/LeaderBoard';

const LockoutPanel = ({ socketRef }) => {
  const contest = useSelector((state) => state.contest.contest);

  return (
    <React.Fragment>
      <CountDown stopAt={contest.EndTime} socketRef={socketRef} />
      <Grid
        container
        direction='column'
        justify='space-around'
        style={{ margin: '5px 5px 100px 5px', boxSizing: 'border-box' }}
      >
        <Grid
          style={{
            height: '29vh',
            margin: '2px',
            maxHeight: '250px',
            boxSizing: 'border_box',
            border: '10px 10px 10px 10px #fff',
          }}
        >
          <Problem />
        </Grid>
        <Grid
          style={{
            minHeight: '38vh',
            margin: '5px 8px 5px 0',
            boxSizing: 'border-box',
          }}
        >
          <LeaderBoard socketRef={socketRef} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default LockoutPanel;
