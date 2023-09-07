import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setInput,
  setOutput,
  resetLoading,
  setCompileOff,
  notifyOutputSuccess,
  notifyOutputError,
  setCompileOn,
  setLoading,
} from '../../store/toolsSlice';
import { socketActions } from '../../socket/socketActions';

const useStyles = makeStyles((theme) => ({
  textarea: {
    resize: 'none',
    outline: 'none',
    width: '100%',
    border: '2px solid white',
    borderRadius: '10px',
    background: '#272822',
    color: '#fff',
    boxSizing: 'content-box',
    padding: '10px 10px 0 10px',
    fontSize: '18px',
    '&::placeholder': {
      color: 'grey',
    },
  },
  IoContainer: {
    display: 'flex',
    height: '100%',
    backgroundColor: '#1f273d',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: '10px',
    boxSizing: 'border-box',
  },
  IoGrid: {
    backgroundColor: '#272822',
    zIndex: '100',
    width: '50%',
    border: '2px solid #fff',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    padding: '1vh',
    boxSizing: 'border-box',
  },
}));

const IO = ({ socketRef }) => {
  const [recieved, setRecieved] = useState(1);
  const [reason, setReason] = useState('');

  const inputRef = useRef();
  const outputRef = useRef();

  const classes = useStyles();

  const location = useLocation();
  const { roomId } = useParams();

  const input = useSelector((state) => state.tools.input);
  const output = useSelector((state) => state.tools.output);
  const dispatch = useDispatch();

  /* recieved { 1 = true for initial load , 2 = true forever ,
      3 = false forever}
      1 is true for changeHandler only so that a
      person can change on initial reload but his initial
      input output dont emit changeIO */
  const changeHandler = (event) => {
    dispatch(setInput(event.target.value));
    inputRef.current.value = event.target.value;
    if (recieved == 1 || recieved == 2) {
      setRecieved(2);
      socketRef.current.emit(socketActions.CHANGE_IO, {
        inputText: event.target.value,
        outputText: output,
        reason: reason,
      });
    }
  };

  useEffect(() => {
    dispatch(setInput(null));
    dispatch(setOutput(null));
    dispatch(resetLoading());
  }, []);

  //Listening to the output response after compilation
  useEffect(() => {
    if (location.pathname === `/contest/${roomId}`) {
      setReason('lockout');
    } else {
      setReason('code-editor');
    }

    socketRef.current.on(socketActions.COMPILE_ON, () => {
      dispatch(setCompileOn());
      dispatch(setLoading());
    });

    socketRef.current.on(socketActions.COMPILE_OFF, (data) => {
      const response = data;
      dispatch(setCompileOff());
      dispatch(resetLoading());
      if (response && response.output !== undefined) {
        dispatch(setOutput(response.output || ''));
        dispatch(notifyOutputSuccess(true));
      } else {
        dispatch(setOutput(response.e || 'Oops something went wrong'));
        dispatch(notifyOutputError(true));
      }
    });

    return () => {
      socketRef.current.off(socketActions.COMPILE_ON);
      socketRef.current.off(socketActions.COMPILE_OFF);
    };
  }, [location]);

  //Listening to the IO recieved from other peers
  useEffect(() => {
    socketRef.current.on(socketActions.IO_RECEIVED, (data) => {
      setRecieved(3);
      if (data.inputText !== undefined) {
        inputRef.current.value = data.inputText;
        dispatch(setInput(data.inputText));
      }
      if (data.outputText !== undefined) {
        outputRef.current.value = data.outputText;
        dispatch(setOutput(data.outputText));
      }
      setRecieved(2);
    });

    //Send the initial IO to the new user
    socketRef.current.on(socketActions.SEND_INITIAL_IO, (obj) => {
      socketRef.current.emit(socketActions.TAKE_INITIAL_IO, {
        id: obj.id,
        inputText: inputRef.current.value,
        outputText: outputRef.current.value,
        reason: 'code-editor',
      });
    });

    return () => {
      socketRef.current.off(socketActions.SEND_INITIAL_IO);
    };
  }, []);

  //Emitting the IO changes to other users
  useEffect(() => {
    if (recieved == 2 && location.pathname !== `/contest/${roomId}`) {
      setRecieved(2);
      socketRef.current.emit(socketActions.CHANGE_IO, {
        inputText: input,
        outputText: output,
        reason: reason,
      });
    }
    outputRef.current.value = output;
  }, [output]);

  return (
    <Grid className={classes.IoContainer} item lg={12}>
      <Grid className={classes.IoGrid}>
        <textarea
          rows='7'
          placeholder='Input'
          onChange={changeHandler}
          className={classes.textarea}
          ref={inputRef}
        ></textarea>
      </Grid>

      <Grid className={classes.IoGrid}>
        <textarea
          rows='7'
          readOnly={true}
          className={classes.textarea}
          ref={outputRef}
        ></textarea>
      </Grid>
    </Grid>
  );
};

export default IO;
