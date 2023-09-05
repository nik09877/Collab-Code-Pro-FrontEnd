import React, { useEffect, useRef, useState } from 'react';
import { initSocket } from '../../socket/socket';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ContestSpinner from '../../components/Spinners/ContestSpinner/ContestSpinner';
import { useSnackbar } from 'notistack';
import { socketActions } from '../../socket/socketActions';
import { useSelector, useDispatch } from 'react-redux';
import { notifyOutputSuccess, notifyOutputError } from '../../store/toolsSlice';
import Toolbar from '../../components/Toolbar/Toolbar';

const CodeEditorPage = () => {
  const [joined, setJoined] = useState(false);
  const [startMsgSnackbar, setStartMsgSnackbar] = useState(true);
  const [resizeEditorNotify, setResizeEditorNotify] = useState(1);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams, _] = useSearchParams();
  const userName = searchParams.get('userName');

  const output_success = useSelector((state) => state.tools.output_success);
  const output_error = useSelector((state) => state.tools.output_error);
  const dispatch = useDispatch();

  //HANDLERS
  const handleErrors = (_, msg) => {
    // console.log('socket error', e);
    navigate('/home', {
      state: { err: `${msg}` },
      replace: true,
    });
  };

  //FOR SOCKET CONNECTION
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) =>
        handleErrors(err, 'Socket connection failed, try again later')
      );
      socketRef.current.on('connect_failed', (err) =>
        handleErrors(err, 'Socket connection failed, try again later')
      );

      socketRef.current.emit(
        socketActions.JOIN,
        { room: roomId, username: userName, password: 'password' },
        ({ error, user }) => {
          if (error) {
            handleErrors({ error }, error);
          }
          setJoined(true);
        }
      );
    };

    init();

    return () => {
      socketRef?.current?.disconnect();
      //Turn off those events which you have been listening to
      socketRef.current.off(socketActions.JOIN);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  useEffect(() => {
    if (output_success) {
      enqueueSnackbar('Code Compiled Succesfully !', {
        variant: 'success',
      });
      dispatch(notifyOutputSuccess(false));
    }
  }, [output_success]);

  return joined ? <Toolbar socketRef={socketRef} /> : <ContestSpinner />;
};

export default CodeEditorPage;
