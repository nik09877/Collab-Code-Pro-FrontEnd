import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { socketActions } from '../../../socket/socketActions';
import UpdateSpinner from '../../Spinners/UpdateSpinner/UpdateSpinner';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const LeaderBoard = ({ socketRef }) => {
  const [loading, setLoading] = useState(false);

  const { roomId } = useParams();

  const contest = useSelector((state) => state.contest.contest);
  const contestEnded = useSelector((state) => state.contest.contestEnded);

  //LeaderBoards Data
  const rows = [];
  contest.Users.forEach((user) => {
    rows.push({ Name: user.Name, Score: user.Score });
  });

  //FIXME UNCOMMENT IF UPDATE DOES NOT WORK
  useEffect(() => {
    setLoading(false);
  }, [contest]);

  // useEffect(() => {
  //   socketRef.current.on(socketActions.UPDATE, (updatedContest) => {
  //     setLoading(false);
  //   });

  //   return () => {
  //     socketRef.current.off(socketActions.UPDATE);
  //   };
  // }, []);

  //Updating the contest for all users
  const updateContest = () => {
    setLoading(true);
    socketRef.current.emit(socketActions.CONTEST_UPDATE, { roomId: roomId });
  };

  return (
    <TableContainer
      component={Paper}
      style={{ width: '100%', height: '100%', paddingBottom: '3vh' }}
    >
      <Table size='small' aria-label='a dense table'>
        <TableHead>
          <TableRow>
            <TableCell>
              <em>
                <b>Name</b>
              </em>
            </TableCell>
            <TableCell align='right'>
              <em>
                <b>Score</b>
              </em>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={row.Name}>
              <TableCell component='th' scope='row'>
                {i + 1}. {row.Name}
              </TableCell>
              <TableCell align='right'>{row.Score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {contestEnded === false ? (
        <Button
          style={{
            cursor: 'pointer',
            color: 'white',
            height: '35px',
            width: '90px',
            marginLeft: '35%',
            marginTop: '10px',
            borderRadius: '5px',
            background: '#872e2e',
            fontSize: '14px',
            paddingTop: '4px',
            textAlign: 'center',
            boxShadow: '0 3px 10px 0px #ba6261',
          }}
          onClick={updateContest}
        >
          {loading ? <UpdateSpinner /> : <p>UPDATE</p>}
        </Button>
      ) : null}
    </TableContainer>
  );
};

export default LeaderBoard;
