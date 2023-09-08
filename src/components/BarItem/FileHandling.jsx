import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadedCode, setCode } from '../../store/toolsSlice';

import PublishIcon from '@mui/icons-material/Publish';
import GetAppIcon from '@mui/icons-material/GetApp';
import Tooltip from '@mui/material/Tooltip';

const FileHandling = () => {
  const code = useSelector((state) => state.tools.code);
  const dispatch = useDispatch();

  //UPLOAD CODE
  const chooseFileHandler = async (event) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      dispatch(setUploadedCode(text));
      //TODO maybe do setCode(text) here
    };
    reader.readAsText(event.target.files[0]);
    event.target.value = '';
  };

  //DOWNLOAD CODE
  const TextFile = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'CollabCodePro.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: 'center',
      }}
    >
      <label htmlFor='uploading'>
        <Tooltip title='Upload your Code'>
          <PublishIcon style={{ color: '#fff', cursor: 'pointer' }} />
        </Tooltip>
      </label>
      <input
        id='uploading'
        type='file'
        onChange={chooseFileHandler}
        style={{ display: 'none' }}
      />
      <label htmlFor='downloading'>
        <Tooltip title="Download the Editor's Code" onClick={TextFile}>
          <GetAppIcon
            style={{ color: '#fff', cursor: 'pointer', marginBottom: '-12px' }}
          />
        </Tooltip>
      </label>
    </div>
  );
};

export default FileHandling;
