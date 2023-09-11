import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import classes from '../LockoutPanel/Lockout.module.css';
import { Grid } from '@mui/material';

const Problem = () => {
  const contest = useSelector((state) => state.contest.contest);

  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  const problems = contest.Problems.map((problem) => {
    let bgcolor = '#3959d4';

    if (problem.solved) {
      if (problem.author === userName) {
        bgcolor = 'green';
      } else {
        bgcolor = '#f00505';
      }
    }
    return (
      <a
        key={problem.key}
        style={{ backgroundColor: `${bgcolor}` }}
        className={classes.anchorTag}
        href={problem.link}
        title={problem.name}
        target='_blank'
        rel='noreferrer'
      >
        {problem.points}
      </a>
    );
  });

  return <Grid className={classes.anchorContainer}>{problems}</Grid>;
};

export default Problem;
