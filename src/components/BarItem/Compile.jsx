import React from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCompileOn } from '../../store/toolsSlice';
import classes from './tools.module.css';

const Compile = () => {
  const isCompiling = useSelector((state) => state.tools.nowCompile);
  const dispatch = useDispatch();

  return (
    <Box
      disabled={isCompiling}
      onClick={() => dispatch(setCompileOn())}
      className={classes.navButton}
    >
      Compile
    </Box>
  );
};

export default Compile;
