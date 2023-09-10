import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setLoading,
  setOutput,
  setUploadedCode,
  setCode,
} from '../../../store/toolsSlice';
import { socketActions } from '../../../socket/socketActions';
import { UnControlled as CodeMirrorEditor } from 'react-codemirror2';
import '../../Editor/EditorAddons';
import languageMapper from '../../../utils/languageMapper';
import Modal from '../../Modal/Modal';
import Graph from '../../Graph/Graph';
import ContestEndedModal from '../../Modal/ContestEndedModal';

const ContestEditor = ({ socketRef }) => {
  const [editorRef, setEditorRef] = useState(null);
  const tools = useSelector((state) => state.tools);
  const contest = useSelector((state) => state.contest);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  //Setting the uploaded code
  useEffect(() => {
    if (tools.uploaded_code && editorRef) {
      editorRef.setValue(tools.uploaded_code);
      dispatch(setUploadedCode(''));
    }
  }, [tools.uploaded_code]);

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
          reason: 'lockout',
        });
      }
    };
    init();
  }, [tools.nowCompile]);

  //Setting the editor reference when editor gets mounted
  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

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
      {contest.showContestEndedModal ? <ContestEndedModal /> : null}
    </div>
  );
};

export default ContestEditor;
