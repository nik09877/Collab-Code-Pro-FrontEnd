import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { notifyOutputSuccess, notifyOutputError } from '../../store/toolsSlice';

import { initSocket } from '../../socket/socket';
import { socketActions } from '../../socket/socketActions';

import ContestSpinner from '../../components/Spinners/ContestSpinner/ContestSpinner';
import Toolbar from '../../components/Toolbar/Toolbar';
import Problem from '../../components/Problem/Problem';
import Snacker from '../../components/Snacker/Snacker';
import IO from '../../components/IO/IO';
import Chat from '../../components/Chat/ChatTabs';

import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { useSnackbar } from 'notistack';
import Editor from '../../components/Editor/Editor';

const CodeEditorPage = () => {
  const [joined, setJoined] = useState(false);
  const [startMsgSnackbar, setStartMsgSnackbar] = useState(true);
  const [resizeEditorNotify, setResizeEditorNotify] = useState(1);

  const { enqueueSnackbar } = useSnackbar();

  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  const output_success = useSelector((state) => state.tools.output_success);
  const output_error = useSelector((state) => state.tools.output_error);
  const dispatch = useDispatch();

  //HANDLERS
  const handleErrors = (_, msg) => {
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
      socketRef.current.emit(socketActions.CODE_SYNC, { roomId: roomId });
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
        autoHideDuration: 2000,
      });
      dispatch(notifyOutputSuccess(false));
    }
  }, [output_success]);

  return joined ? (
    <React.Fragment>
      <Toolbar socketRef={socketRef} />
      <div style={{ height: '85vh', overflowY: 'hidden' }}>
        <ReflexContainer orientation='vertical'>
          <ReflexElement
            minSize={0}
            maxSize={900}
            size={400}
            style={{ overflowX: 'hidden' }}
          >
            <Problem socketRef={socketRef} />
          </ReflexElement>

          <ReflexSplitter
            className='reflex-thin'
            style={{
              background: '#1f273d',
              opacity: '1',
              border: '0.3px',
            }}
          />

          <ReflexElement orientation='horizontol' maxSize={1900} minSize={400}>
            <ReflexContainer>
              <ReflexElement
                minSize={100}
                maxSize={1600}
                style={{ display: 'flex' }}
              >
                <Editor socketRef={socketRef} />
              </ReflexElement>
              <ReflexSplitter
                className='reflex-thin'
                style={{
                  backgroundColor: '#1f273d',
                  opacity: '1',
                  border: '0.3px',
                }}
              />
              <ReflexElement
                minSize={10}
                maxSize={300}
                size={200}
                style={{ overflow: 'hidden' }}
              >
                <IO socketRef={socketRef} />
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>

          <ReflexSplitter
            className='reflex-thin'
            style={{
              backgroundColor: '#1f273d',
              opacity: '1',
              border: '0.3px',
            }}
          />

          <ReflexElement
            minSize={8}
            maxSize={250}
            size={250}
            style={{ overflow: 'hidden' }}
          >
            <Chat socketRef={socketRef} />
          </ReflexElement>
        </ReflexContainer>

        <Snacker
          open={output_error}
          vertical='top'
          horizontal='center'
          onClose={() => dispatch(notifyOutputError(false))}
          message='Something Went Wrong!'
          severity='error'
        />

        <Snacker
          open={startMsgSnackbar}
          timer={4000}
          vertical='top'
          horizontal='center'
          message='Share URL of this page to collaborate'
          severity='info'
          onClose={() => {
            setStartMsgSnackbar(false);
            setResizeEditorNotify((state) => state + 1);
          }}
        />

        <Snacker
          open={resizeEditorNotify === 2}
          timer={4000}
          vertical='top'
          horizontal='center'
          message='You can also resize your editor by dragging the splitter'
          severity='info'
          onClose={() => {
            setResizeEditorNotify(3);
          }}
        />
      </div>
    </React.Fragment>
  ) : (
    <ContestSpinner />
  );
};

export default CodeEditorPage;
