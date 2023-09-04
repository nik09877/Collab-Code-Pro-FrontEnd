import React, { useEffect } from 'react';
import CodeEditorPage from '../CodeEditorPage/CodeEditorPage';
import { io } from 'socket.io-client';

const CodeEditorPageWrapper = () => {
  const socket = io(process.env.REACT_APP_BASE_URL);
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  return <CodeEditorPage socket={socket} />;
};

export default CodeEditorPageWrapper;
