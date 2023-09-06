import React from 'react';
import { Grid } from '@mui/material';

import Spinner from '../Spinners/Spinner/Spinner';
import classes from './Modal.module.css';

const Modal = (props) => {
  return (
    <div className={classes.modal}>
      <Spinner />
    </div>
  );
};

export default Modal;
