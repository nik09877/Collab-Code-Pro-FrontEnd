import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GetStarted from './pages/GetStarted/GetStarted';
import Home from './pages/Home/Home';
import JoinRoom from './pages/JoinRoom/JoinRoom';
import CodeEditorPage from './pages/CodeEditorPage/CodeEditorPage';

const App = () => {
  return (
    <Routes>
      <Route index element={<GetStarted />} />
      <Route path='home' element={<Home />} />
      <Route path='join-room' element={<JoinRoom />} />
      <Route path='code-editor/:roomId' element={<CodeEditorPage />} />
      {/*<Route path='contest/:roomId' element={<CodeEditorPage />} /> */}
    </Routes>
  );
};

export default App;
