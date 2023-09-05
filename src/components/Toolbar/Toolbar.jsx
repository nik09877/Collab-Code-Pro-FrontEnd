import React from 'react';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Compile from '../BarItem/Compile';
import FileHandling from '../BarItem/FileHandling';
import FontSize from '../BarItem/FontSize';
import GraphButton from '../BarItem/GraphButton';
import Leave from '../BarItem/Leave';
import ThemePicker from '../BarItem/ThemePicker';
import LanguagePicker from '../BarItem/LanguagePicker';

import classes from './Toolbar.module.css';

const Toolbar = ({ socketRef }) => {
  const navigate = useNavigate();

  const handleHomeNav = (msg) => {
    navigate('/home', {
      state: { err: `${msg}` },
      replace: true,
    });
  };

  return (
    <Grid className={classes.main}>
      <Grid
        className={classes.imgGrid}
        title='Go to Home Page'
        onClick={() => handleHomeNav('You Left the Room')}
      >
        <h1 className={classes.header}>Collab-Code-Pro</h1>
      </Grid>
      <Grid className={classes.toolWrap}>
        <Grid className={classes.toolsGrid}>
          <LanguagePicker />
          <ThemePicker />
          <FontSize />
        </Grid>
        <Grid className={classes.toolsGrid}>
          <Compile />
          <GraphButton />
          <Leave socketRef={socketRef} />
          <FileHandling />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Toolbar;
