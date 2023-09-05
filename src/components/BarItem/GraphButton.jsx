import React from 'react';
import { showGraph } from '../../store/toolsSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Box } from '@mui/material';
import classes from './tools.module.css';

const GraphButton = () => {
  const shouldShowGraph = useSelector((state) => state.tools.showGraph);
  const dispatch = useDispatch();
  return (
    <Box
      disabled={shouldShowGraph}
      onClick={() => dispatch(showGraph())}
      className={classes.navButton}
    >
      Graph
    </Box>
  );
};

export default GraphButton;
