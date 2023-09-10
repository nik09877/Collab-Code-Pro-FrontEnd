import React, { useEffect, useRef, useState } from 'react';
import { initSocket } from '../../socket/socket';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { socketActions } from '../../socket/socketActions';
import { updateContest, updateContestEnded } from '../../store/contestSlice';
import { notifyOutputSuccess, notifyOutputError } from '../../store/toolsSlice';
import { useDispatch, useSelector } from 'react-redux';

import ContestSpinner from '../../components/Spinners/ContestSpinner/ContestSpinner';
import Snacker from '../../components/Snacker/Snacker';
import Chat from '../../components/Chat/ChatTabs';
import Rules from '../../components/Rules/Rules';
import IO from '../../components/IO/IO';
import Toolbar from '../../components/Toolbar/Toolbar';
import ContestSidePanel from '../../components/Contest/Contest';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import ContestEditor from '../../components/Contest/ContestEditor/ContestEditor';

const ContestPage = () => {
  const [joined, setJoined] = useState(false);
  const [startMsgSnackbar, setStartMsgSnackbar] = useState(true);

  const output_success = useSelector((state) => state.tools.output_success);
  const output_error = useSelector((state) => state.tools.output_error);
  const contest = useSelector((state) => state.contest.contest);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  const socketRef = useRef(null);

  //HANDLERS
  const handleErrors = (_, msg) => {
    navigate('/home', {
      state: { err: `${msg}` },
      replace: true,
    });
  };

  //FOR SOCKET CONNECTION
  useEffect(() => {
    const user = {
      Name: userName,
      RoomId: roomId,
    };
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) =>
        handleErrors(err, 'Socket connection failed, try again later')
      );
      socketRef.current.on('connect_failed', (err) =>
        handleErrors(err, 'Socket connection failed, try again later')
      );

      socketRef.current.emit(
        socketActions.CONTEST_JOIN,
        user,
        ({ error, contest }) => {
          if (error) {
            return handleErrors({ error }, error);
          }
          dispatch(updateContest(contest));
          setJoined(true);

          if (contest?.EndTime) {
            const now = new Date().getTime();
            dispatch(updateContestEnded(contest.EndTime <= now));
          }
        }
      );
    };

    init();

    return () => {
      socketRef?.current?.disconnect();
      socketRef.current.off(socketActions.CONTEST_JOIN);
    };
  }, []);

  return joined ? (
    <React.Fragment>
      <Toolbar socketRef={socketRef} />
      <div style={{ height: '85vh', overflowY: 'hidden' }}>
        <ReflexContainer orientation='vertical'>
          <ReflexElement
            minSize={300}
            maxSize={300}
            size={300}
            style={{ overflow: 'hidden', minWidth: '225px' }}
          >
            <div
              style={{
                margin: '10px 20px 10px 10px',
                height: '96%',
                background: '#313332',
                border: '2px solid black',
                borderRadius: '10px',
                boxShadow: '0 5px 15px 0px rgba(0,0,0,0.6)',
              }}
            >
              <ContestSidePanel socketRef={socketRef} />
            </div>
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
            {contest && contest.Started ? (
              <ReflexContainer>
                <ReflexElement
                  minSize={100}
                  maxSize={1600}
                  style={{ overflow: 'hidden' }}
                >
                  <ContestEditor socketRef={socketRef} />
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
                  minSize={0}
                  maxSize={300}
                  size={200}
                  style={{ overflow: 'hidden' }}
                >
                  <IO socketRef={socketRef} />
                </ReflexElement>
              </ReflexContainer>
            ) : (
              <div
                style={{
                  background: '#313332',
                  boxShadow: '0 5px 15px 0px rgba(0,0,0,0.6)',
                  width: '96%',
                  margin: 'auto',
                  borderRadius: '10px',
                }}
              >
                <Rules />
              </div>
            )}
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
          open={startMsgSnackbar}
          timer={3000}
          vertical='top'
          horizontal='center'
          message='Share URL of this page with your friend and wait for them to join before starting contest'
          severity='info'
          onClose={() => {
            setStartMsgSnackbar(false);
          }}
        />

        <Snacker
          open={output_success}
          horizontal='center'
          message='Code Compiled SuccessFully !'
          onClose={() => dispatch(notifyOutputSuccess(false))}
        />

        <Snacker
          open={output_error}
          vertical='top'
          horizontal='center'
          severity='error'
          message='Something Went Wrong!'
          onClose={() => dispatch(notifyOutputError(false))}
        />
      </div>
    </React.Fragment>
  ) : (
    <ContestSpinner />
  );
};

export default ContestPage;
