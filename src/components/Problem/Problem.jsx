import React, { useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';

import BlogSpinner from '../Spinners/BlogSpinner/BlogSpinner';
import './Problem.css';
import { socketActions } from '../../socket/socketActions';

const Problem = ({ socketRef }) => {
  const problemRef = useRef();
  const [problemLink, setProblemLink] = useState('');
  const [loading, setLoading] = useState(false);

  //Listen for problem Fetched event
  useEffect(() => {
    socketRef.current.on(socketActions.PROBLEM, (problem) => {
      problemRef.current.innerHTML = problem;
      setLoading(false);
    });

    return () => {
      socketRef.current.off(socketActions.PROBLEM);
    };
  }, []);

  const handleProblemLinkChange = (event) => {
    setProblemLink(event.target.value);
  };

  const handleProblemFetch = () => {
    if (!problemLink || !problemLink.trim()) return;
    setLoading(true);
    socketRef.current.emit(socketActions.CODEFORCES_PROBLEM, problemLink);
    setProblemLink('');
    problemRef.current.innerHTML = '';
  };

  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: '#fff',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '6vh',
            fontSize: '20px',
            padding: '0 0 0 2vh',
            textAlign: 'center',
            background: '#3F51B5',
            boxSizing: 'border-box',
          }}
        >
          <p style={{ fontSize: '18px', color: '#fff', margin: '1vh 0 0 0' }}>
            Problem
          </p>
        </div>
        <Grid
          style={{
            height: '74vh',
            maxWidth: '120vh',
            display: 'flex',
            flexFlow: 'column',
            padding: '1vh',
            border: '2px solid black',
            margin: '1.5vh',
            borderRadius: '10px',
            backgroundColor: '#313332',
            boxShadow: '0 5px 15px 0px rgba(0,0,0,0.6)',
          }}
        >
          <Grid
            ref={problemRef}
            style={{
              overflowY: 'auto',
              color: '#fff',
              fontSize: '19px',
              fontFamily: ['Fira Sans', 'sans-serif'].join(),
              wordWrap: 'break-word',
            }}
          >
            copy url of any problem from the following websites: <br />
            codeforces ,codechef , geeksforgeeks , atcoder , cses, codeDrills
            paste the url in place of Problem Link and click fetch. same problem
            will also be fetched on your collaborator's problem section
            <br />
            <br />
            eg : you can paste this url : <br />{' '}
            https://codeforces.com/problemset/problem/1528/A
          </Grid>

          <Grid
            style={{
              display: 'flex',
              minHeight: '8vh',
              margin: '1vh 0 0 0',
              flexDirection: 'row',
              maxWidth: '110vh',
              boxSizing: 'border-box',
            }}
          >
            <input
              value={problemLink}
              placeholder='Problem Link'
              className='place'
              onChange={handleProblemLinkChange}
            />
            <div
              style={{
                minHeight: '4vh',
                background: '#872e2e',
                color: '#fff',
                width: '55px',
                borderRadius: '5px',
                margin: '2.5vh 0 0 1vh',
                padding: '1vh 1vh 0 1vh',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={handleProblemFetch}
            >
              Fetch
            </div>
          </Grid>
          {loading ? <BlogSpinner /> : null}
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default Problem;
