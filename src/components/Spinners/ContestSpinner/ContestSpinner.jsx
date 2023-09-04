import React from 'react';
import Styles from './ContestSpinner.module.css';

const ContestSpinner = (props) => {
  return (
    <div className={Styles.wrapped}>
      <div className={Styles.spinner} style={{ marginTop: props.margin }}></div>
    </div>
  );
};

export default ContestSpinner;
