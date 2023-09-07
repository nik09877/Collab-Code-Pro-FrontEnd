import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  setOutput,
  setCode,
  setUploadedCode,
} from '../../store/toolsSlice';

import languageMapper from '../../utils/languageMapper';
import Modal from '../Modal/Modal';
import Graph from '../Graph/Graph';

import RandomColor from 'randomcolor';
import './EditorAddons';
import { CodemirrorBinding } from 'y-codemirror';
import { UnControlled as CodeMirrorEditor } from 'react-codemirror2';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

import './Editor.css';
import { socketActions } from '../../socket/socketActions';

const Editor = ({ socketRef }) => {
  const tools = useSelector((state) => state.tools);
  const [editorRef, setEditorRef] = useState(null);
  const dispatch = useDispatch();

  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  //Setting the uploaded code
  useEffect(() => {
    if (tools.uploaded_code && editorRef) {
      editorRef.setValue(tools.uploaded_code);
      dispatch(setUploadedCode(''));
    }
  }, [tools.uploaded_code]);

  //Setting the editor reference when editor gets mounted
  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

  //Emitting the compile event to other users
  useEffect(() => {
    const init = async () => {
      if (tools.nowCompile === true && tools.isLoading === false) {
        dispatch(setOutput(''));
        dispatch(setLoading());
        socketRef.current.emit(socketActions.COMPILE_ON, {
          language: tools.language,
          code: tools.code,
          input: tools.input,
          reason: 'code-editor',
        });
      }
    };
    init();
  }, [tools.nowCompile]);

  //Yjs based real-time connection and collaboration
  useEffect(() => {
    //Collboration and connection starts after the editor is mounted
    if (editorRef) {
      //Yjs document that holds shared data
      const ydoc = new Y.Doc();

      let provider = null;
      try {
        //syncs the ydoc throught WebRTC connection
        provider = new WebrtcProvider(roomId.trim().toLowerCase(), ydoc, {
          signaling: [
            process.env.REACT_APP_SIGNALING_SERVER_URL,
            // 'ws://localhost:4444',
            // 'wss://signaling.yjs.dev',
            // 'wss://y-webrtc-signaling-eu.herokuapp.com',
            // 'wss://y-webrtc-signaling-us.herokuapp.com',
            // 'wss://y-webrtc-ckynwnzncc.now.sh',
          ],
          password: null,
        });

        //Define a shared text type on the document
        const yText = ydoc.getText('codemirror');

        //Undomanager used for stacking the undo and redo operation for yjs
        const yUndoManager = new Y.UndoManager(yText);

        const awareness = provider.awareness;

        const color = RandomColor();

        //Awareness protocol is used to propagate your information (cursor position , name , etc)
        awareness.setLocalStateField('user', {
          name: userName,
          color: color,
        });

        //Binds the Codemirror editor to Yjs text type
        const getBinding = new CodemirrorBinding(yText, editorRef, awareness, {
          yUndoManager,
        });
      } catch (err) {
        alert('error in collaborating try refreshing or come back later !');
      }
      return () => {
        //Releasing the resources used and destroying the document
        if (provider) {
          provider.disconnect();
          ydoc.destroy();
        }
      };
    }
  }, [editorRef]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        fontSize: `${tools.fontSize}px`,
        overflowY: 'auto',
      }}
    >
      <CodeMirrorEditor
        onChange={(editor, data, value) => {
          dispatch(setCode(value));
        }}
        autoScroll
        options={{
          mode: languageMapper(tools.language),
          theme: tools.theme,
          lineWrapping: true,
          smartIndent: true,
          lineNumbers: true,
          foldGutter: true,
          tabSize: 2,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          autoCloseTags: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          extraKeys: {
            'Ctrl-Space': 'autocomplete',
          },
        }}
        editorDidMount={(editor) => {
          handleEditorDidMount(editor);
          editor.setSize('100vw', '100%');
        }}
      />
      {tools.isLoading === true ? <Modal /> : null}
      {tools.showGraph === true ? <Graph /> : null}
    </div>
  );
};

export default Editor;
