import React, { useEffect, useState } from 'react';
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

import './EditorAddons';
import { UnControlled as CodeMirrorEditor } from 'react-codemirror2';

import './Editor.css';
import { socketActions } from '../../socket/socketActions';
import { useParams } from 'react-router-dom';

const Editor = ({ socketRef }) => {
  const tools = useSelector((state) => state.tools);
  const [editorRef, setEditorRef] = useState(null);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  //Setting the editor reference when editor gets mounted
  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

  const handleCodeEditorValueChange = async (value) => {
    if (tools.code === value) return;
    dispatch(setCode(value));
    socketRef.current.emit(socketActions.CODE_CHANGE, { code: value });
  };

  useEffect(() => {
    socketRef.current.emit(socketActions.CODE_SYNC, { roomId: roomId });
  }, []);

  //Setting the uploaded code
  useEffect(() => {
    if (tools.uploaded_code && editorRef) {
      editorRef.setValue(tools.uploaded_code);
      dispatch(setUploadedCode(''));
    }
  }, [tools.uploaded_code]);

  //Listen for Code Editor Value Changes
  useEffect(() => {
    if (editorRef) {
      socketRef.current.on(socketActions.CODE_CHANGE, ({ code }) => {
        if (tools.code !== code) editorRef.setValue(code);
      });
    }
    return () => {
      socketRef.current.off(socketActions.CODE_CHANGE);
    };
  }, [editorRef, tools.code]);

  useEffect(() => {
    if (editorRef) {
      socketRef.current.on(socketActions.CODE_SYNC, ({ code }) => {
        if (tools.code !== code) editorRef.setValue(code);
      });
    }

    return () => {
      socketRef.current.off(socketActions.CODE_SYNC);
    };
  }, [editorRef, tools.code]);

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
        onChange={(editor, data, value) => handleCodeEditorValueChange(value)}
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
