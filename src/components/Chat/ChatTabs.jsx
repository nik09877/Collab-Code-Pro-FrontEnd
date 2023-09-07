import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Chat from './Chat';
import People from './People';
import { socketActions } from '../../socket/socketActions';

function TabPanel(props) {
  const { value, index, children } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ChatPanel({ socketRef }) {
  //   const [name, setName] = useState('');

  //currentTabValue -> [chat or people]
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState([]);
  const [persons, setPersons] = useState([]);

  // const location = useLocation();
  // const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  const { enqueueSnackbar } = useSnackbar();

  //TODO UNCOMMENT IF IT DOESN'T WORK
  //setting the user name
  //   useEffect(() => {
  //     if (location.pathname === `/contest/${roomId}`) {
  //       setName(auth.user.CodeforcesHandle);
  //     } else {
  //       if (searchParams.get('name')) {
  //     setName(searchParams.get('name').trim().toLowerCase());
  //       }
  //     }
  //   }, [location]);

  //Listening to the messages from other users
  useEffect(() => {
    socketRef.current.on(socketActions.SERVER_MSG, (msg) => {
      setMessages([...messages, msg]);
    });
    return () => {
      socketRef.current.off(socketActions.SERVER_MSG);
    };
  }, [messages]);

  //Listening the other peers information such as names and notifying
  //the current user about the entering and leaving
  useEffect(() => {
    socketRef.current.on(socketActions.PEOPLE_IN_ROOM, (data) => {
      setPersons(data.teamMembers);
      if (data.userJoin) {
        if (
          userName &&
          data.userJoin.trim().toLowerCase() !== userName.trim().toLowerCase()
        )
          enqueueSnackbar(`${data.userJoin} joined this room`, {
            variant: 'info',
          });
      } else if (data.userLeft) {
        enqueueSnackbar(`${data.userLeft} left this room`, {
          variant: 'warning',
        });
      }
    });
    return () => {
      socketRef.current.off(socketActions.PEOPLE_IN_ROOM);
    };
  }, [persons, userName]);

  //handleTabChange
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div stlye={{ backgroundColor: '#313332' }}>
      <AppBar position='static' style={{ backgroundColor: '#3f51b5' }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          style={{ display: 'flex' }}
          indicatorColor='primary'
        >
          <Tab
            style={{ minWidth: 20, color: 'white', flex: '1' }}
            label='Chat'
          />
          <Tab
            style={{ minWidth: 20, color: 'white', flex: '1' }}
            label='People'
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Chat socketRef={socketRef} messages={messages} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <People persons={persons} you={userName} />
      </TabPanel>
    </div>
  );
}
