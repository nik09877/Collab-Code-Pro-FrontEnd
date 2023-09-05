import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFontSize } from '../../store/toolsSlice';

import { Grid, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import classes from './tools.module.css';

const FontSize = () => {
  const fontSize = useSelector((state) => state.tools.fontSize);
  const dispatch = useDispatch();

  const handleFontSizeChange = (event) => {
    dispatch(setFontSize(parseInt(event.target.value)));
  };

  return (
    <Grid className={classes.mainGrid}>
      <FormControl>
        <p style={{ marginBottom: '-25px' }}>Font</p>

        {/*<InputLabel style={{ color: '#fff', paddingLeft: '50px' }}>
          Font
  </InputLabel>*/}
        <Select
          onChange={handleFontSizeChange}
          displayEmpty
          className={`${classes.selectEmpty} ${classes.navSelect}`}
          value={fontSize}
        >
          <MenuItem value={15}>Smallest</MenuItem>
          <MenuItem value={20}>Small</MenuItem>
          <MenuItem value={25} selected>
            <em>Medium</em>
          </MenuItem>
          <MenuItem value={30}>Large</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default FontSize;
