import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../store/toolsSlice';

import { Grid, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import classes from './tools.module.css';

const LanguagePicker = () => {
  const language = useSelector((state) => state.tools.language);
  const dispatch = useDispatch();

  const handleLanguageChange = (event) => {
    dispatch(setLanguage(event.target.value));
  };

  return (
    <Grid className={classes.mainGrid}>
      <FormControl>
        <p style={{ marginBottom: '-25px' }}>Language</p>
        {/*<InputLabel style={{ color: 'white' }}>Language</InputLabel>*/}
        <Select
          displayEmpty
          className={`${classes.selectEmpty} ${classes.navSelect}`}
          onChange={handleLanguageChange}
          value={language}
        >
          <MenuItem value='cpp' selected>
            <em>C/C++(14)</em>
          </MenuItem>
          <MenuItem value='csharp'>C#</MenuItem>
          <MenuItem value='go'>Go</MenuItem>
          <MenuItem value='java'>Java</MenuItem>
          <MenuItem value='kotlin'>Kotlin</MenuItem>
          <MenuItem value='lua'>Lua</MenuItem>
          <MenuItem value='nodejs'>NodeJs</MenuItem>
          <MenuItem value='pascal'>Pascal</MenuItem>
          <MenuItem value='perl'>Perl</MenuItem>
          <MenuItem value='php'>Php</MenuItem>
          <MenuItem value='python'>Python3</MenuItem>
          <MenuItem value='r'>R</MenuItem>
          <MenuItem value='ruby'>Ruby</MenuItem>
          <MenuItem value='rust'>Rust</MenuItem>
          <MenuItem value='shell'>Shell</MenuItem>
          <MenuItem value='sql'>SQL</MenuItem>
          <MenuItem value='swift'>Swift</MenuItem>
          <MenuItem value='text'>Text</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default LanguagePicker;
