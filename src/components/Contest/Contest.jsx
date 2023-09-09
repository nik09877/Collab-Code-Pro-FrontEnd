import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuestionLoading, updateContest } from '../../store/contestSlice';

import ContestSpinner from '../Spinners/ContestSpinner/ContestSpinner';
import { socketActions } from '../../socket/socketActions';
import LockoutPanel from './LockoutPanel/LockoutPanel';
import FilterContest from './FilterContest/FilterContest';

const Contest = ({ socketRef }) => {
  const contest = useSelector((state) => state.contest.contest);
  const questionLoading = useSelector((state) => state.contest.questionLoading);
  const dispatch = useDispatch();

  //Updating the contest on the Event Update
  useEffect(() => {
    socketRef.current.on(socketActions.UPDATE, (updatedContest) => {
      dispatch(updateContest(updatedContest));
      dispatch(resetQuestionLoading());
    });

    return () => {
      socketRef.current.off(socketActions.UPDATE);
    };
  }, []);

  return !questionLoading ? (
    contest.Started === false ? (
      <FilterContest socketRef={socketRef} roomId={contest.Id} />
    ) : (
      <LockoutPanel socketRef={socketRef} />
    )
  ) : (
    <div style={{ marginLeft: '-15px' }}>
      <ContestSpinner marginTop='-13px' />
    </div>
  );
};

export default Contest;
