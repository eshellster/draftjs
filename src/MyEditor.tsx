import React, { useState } from 'react';
import {DraftEditorCommand, Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './MyEditor.css'


const MyEditor = () => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onChange = (editorState:EditorState) => setEditorState(editorState);

  const handleKeyCommand = (command:DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      
      return 'handled';
    }
    return 'not-handled';
  }


  return (
    <div className='editor'>
        <Editor 
        editorState={editorState} 
        handleKeyCommand={handleKeyCommand} 
        onChange={setEditorState} />
    </div>
    );
}

export default MyEditor;