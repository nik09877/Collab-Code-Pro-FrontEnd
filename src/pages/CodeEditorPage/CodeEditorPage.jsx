import React, { useEffect, useRef, useState } from 'react';
import { initSocket } from '../../socket';
import { useNavigate } from 'react-router-dom';
import ContestSpinner from '../../components/Spinners/ContestSpinner/ContestSpinner';
import { useSnackbar } from 'notistack';

const CodeEditorPage = () => {
  const [joined, setJoined] = useState(false);
  const [startMsgSnackbar, setStartMsgSnackbar] = useState(true);
  const [resizeEditorNotify, setResizeEditorNotify] = useState(1);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const socketRef = useRef(null);
  const navigate = useNavigate();

  const handleErrors = (e) => {
    console.log('socket error', e);
    navigate('/home', {
      state: { err: 'Socket connection failed, try again later' },
      replace: true,
    });
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));
    };

    init();

    return () => {
      socketRef?.current?.disconnect();
      //Turn off those events which you have been listening to
      // socketRef.current.off(ACTIONS.JOINED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  return <ContestSpinner />;
};

export default CodeEditorPage;
