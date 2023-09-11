import React from 'react';
import { Typography } from '@mui/material';

const Rules = () => {
  return (
    <div
      style={{
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: 'verdana',
        overflow: 'auto',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          width: '100%',
          color: 'red',

          display: 'block',
          fontSize: '2em',
          marginBlockStart: '0.67em',
          marginBlockEnd: '0.67em',
          marginInlineStart: '0px',
          marginInlineEnd: '0px',
          fontWeight: 'bold',
        }}
      >
        Rules!
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '15px 10px 10px 25px',
          flexWrap: 'wrap',
        }}
      >
        <h3>1. Share the Room Id with your friends to compete with them</h3>
        <h3>2. Maximum of 4 People can join a Contest</h3>
        <h3>
          3. Person who solves a problem first will get its point added to
          his/her Score, After that No one will get point for that problem even
          if they solve it
        </h3>
        <h3>
          4. To update your LeaderBoard and Unsolved Problems Click Update
        </h3>
        <h3>5. Person Who Scores Maximum Will be the Winner</h3>
        <h3>
          6. Choose tags and rating for problems you want to compete for and
          press Start Contest
        </h3>
        <h3>
          7. The score of each problem will be written on their respective block
        </h3>
        <h3>
          8. Person who clicks Start Contest, his configuration for contest
          would be taken into account so please discuss before starting
        </h3>
        <h3>
          9. for problem blocks : Blue = unsolved , green = Solved by you , red
          = already solved by someone else
        </h3>
      </div>
    </div>
  );
};

export default Rules;
