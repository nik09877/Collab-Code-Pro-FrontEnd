import React from 'react';
import Box from '@mui/material/Box';
import Styles from './Button.module.css';

const Button = (props) => {
  return (
    <Box
      style={{
        minHeight: '8.5vh',
        width: '80vw',
        maxWidth: '300px',
        border: '4px solid #fff',
        borderRadius: '20px',
        textAlign: 'center',
        color: '#fff',
        fontSize: '20px',
        cursor: 'pointer',
        borderStyle: 'double',
        borderWidth: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: ['Fira Sans', 'sans-serif'].join(),
      }}
      className={Styles.scale}
      onClick={props.clicked}
    >
      {props.name}
    </Box>
  );
};

export default Button;
