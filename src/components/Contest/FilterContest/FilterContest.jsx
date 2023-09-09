import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateMinRating,
  updateMaxRating,
  updateMaxDuration,
  setQuestionLoading,
} from '../../../store/contestSlice';
import { socketActions } from '../../../socket/socketActions';

import { Button, TextField } from '@mui/material';
import TagChips from '../TagChips/TagChips';

const FilterContest = ({ socketRef, roomId }) => {
  const contestProblemsTags = useSelector((state) => state.contest.problemTags);
  const minRating = useSelector((state) => state.contest.minRating);
  const maxRating = useSelector((state) => state.contest.maxRating);
  const maxDuration = useSelector((state) => state.contest.maxDuration);
  const dispatch = useDispatch();

  //Listening to the fetching request
  useEffect(() => {
    socketRef.current.on(socketActions.CONTEST_STARTING, () => {
      dispatch(setQuestionLoading());
    });

    return () => {
      socketRef.current.off(socketActions.CONTEST_STARTING);
    };
  }, []);

  //Emitting the start of contest with the configuration of the current user
  const startContestHandler = () => {
    socketRef.current.emit(socketActions.START_CONTEST, {
      room: roomId,
      problemTags: contestProblemsTags,
      minRating: minRating,
      maxRating: maxRating,
      maxDuration: maxDuration,
    });
    dispatch(setQuestionLoading());
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          justify: 'center',
          height: '100%',
          paddingBottom: '20px',
        }}
      >
        <div
          style={{
            width: '240px',
            margin: 'auto',
            padding: '20px',
            height: '58vh',
            borderRadius: '10px',
            maxHeight: '450px',
            background: '#fff',
            boxShadow: '0 5px 15px 0px rgba(0,0,0,0.6)',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              justify: 'center',
              gridGap: '20px',
            }}
          >
            <TextField
              id='outlined-basic'
              label='Min-Rating'
              variant='outlined'
              type='number'
              value={minRating}
              onChange={(e) => dispatch(updateMinRating(e.target.value))}
            />
            <TextField
              id='outlined-basic'
              label='Max-Rating'
              variant='outlined'
              value={maxRating}
              type='number'
              onChange={(e) => dispatch(updateMaxRating(e.target.value))}
            />

            <TextField
              id='outlined-basic'
              label='Max-Duration in minutes'
              placeholder='(10-120) default is 30m'
              variant='outlined'
              value={maxDuration}
              type='number'
              onChange={(e) => dispatch(updateMaxDuration(e.target.value))}
            />

            <TagChips />
          </div>
        </div>
        <Button
          //FIXME BUG HERE, REMOVED CODE CHANGE IF NOT WORKING
          style={{
            background: '#872e2e',
            color: '#fff',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '10px',
            width: '140px',
            alignText: 'center',
            padding: 'auto',
            cursor: 'pointer',
            margin: 'auto',
            boxShadow: '0 5px 15px 0px rgba(0,0,0,0.6)',
          }}
          onClick={startContestHandler}
        >
          Start Contest
        </Button>
      </div>
    </React.Fragment>
  );
};

export default FilterContest;
