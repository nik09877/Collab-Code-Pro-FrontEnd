import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GetStarted from './pages/GetStarted/GetStarted';
import Home from './pages/Home/Home';
import JoinRoom from './pages/JoinRoom/JoinRoom';
import CodeEditorPage from './pages/CodeEditorPage/CodeEditorPage';
import ContestPage from './pages/ContestPage/ContestPage';
import Whiteboard from './pages/Whiteboard/Whiteboard.component';
import CursorOverlay from './pages/Whiteboard/components/CursorOverLay.component';

const App = () => {
  return (
    <Routes>
      <Route index element={<GetStarted />} />
      <Route path='home' element={<Home />} />
      <Route path='join-room' element={<JoinRoom />} />
      <Route path='code-editor/:roomId' element={<CodeEditorPage />} />
      <Route path='contest/:roomId' element={<ContestPage />} />
      <Route
        path='collab-draw/:roomId'
        element={
          <React.Fragment>
            <Whiteboard />
            <CursorOverlay />
          </React.Fragment>
        }
      />
    </Routes>
  );
};

export default App;
