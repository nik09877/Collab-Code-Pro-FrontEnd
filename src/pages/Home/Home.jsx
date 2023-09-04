import React, { useEffect, useState } from 'react';
import Stars from '../../components/Stars/Stars';
import Back from '../../components/Back/Back';
import Nav from '../../components/Nav/Nav';
import Button from '../../components/Button/Button';
import Styles from './Home.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Snacker from '../../components/Snacker/Snacker';

const Home = () => {
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  //Check if you have been redirected from other page Cuz of Error
  useEffect(() => {
    if (location?.state?.err) {
      setError(location.state.err);
    }
  }, []);

  const handleCreateRoomNav = (type) => {
    navigate({
      pathname: '/join-room',
      search: `?type=${type}`,
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'radial-gradient(ellipse, #1b2735 0%, #090a0f 100%)',
      }}
    >
      <Stars color='#fff' />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        <Back />
        <Nav />
      </div>

      <div className={Styles.container}>
        <h1 className={Styles.header}>Collab-Code-Pro</h1>
        <Button
          name='Code-Editor'
          clicked={() => handleCreateRoomNav('code-Editor')}
        ></Button>
        <Button
          name='Code-Editor'
          clicked={() => handleCreateRoomNav('code-Editor')}
        ></Button>
        <Button
          name='Code-Editor'
          clicked={() => handleCreateRoomNav('code-Editor')}
        ></Button>
        <Button
          name='Code-Editor'
          clicked={() => handleCreateRoomNav('code-Editor')}
        ></Button>
      </div>
      <Snacker
        severity='error'
        timer={6000}
        message={error}
        onClose={() => setError(null)}
        open={error ? true : false}
      />
    </div>
  );
};

export default Home;
