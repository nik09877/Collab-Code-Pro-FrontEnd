import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/toolsSlice';

import { Grid, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import classes from './tools.module.css';

const ThemePicker = () => {
  const theme = useSelector((state) => state.tools.theme);
  const dispatch = useDispatch();

  const handleThemeChange = (event) => {
    dispatch(setTheme(event.target.value));
  };

  return (
    <Grid className={classes.mainGrid}>
      <FormControl>
        <p style={{ marginBottom: '-25px' }}>Theme</p>

        {/*<InputLabel style={{ color: '#fff', paddingLeft: '40px' }}>
          Theme
        </InputLabel>*/}
        <Select
          onChange={handleThemeChange}
          displayEmpty
          className={`${classes.selectEmpty} ${classes.navSelect}`}
          value={theme}
        >
          <MenuItem value='monokai' selected>
            <em>monokai</em>
          </MenuItem>

          <MenuItem value='eclipse'>eclipse</MenuItem>
          <MenuItem value='material-darker'>material-darker</MenuItem>
          <MenuItem value='dracula'>dracula</MenuItem>
          <MenuItem value='ambiance'>ambiance</MenuItem>
          <MenuItem value='mdn-like'>mdn-like</MenuItem>
          <MenuItem value='material-palenight'>material-palenight</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default ThemePicker;
