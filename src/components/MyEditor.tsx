import React, { useState } from 'react';
import {DraftEditorCommand, Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './MyEditor.css'


const MyEditor = () => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onChange = (editorState:EditorState) => setEditorState(editorState);

  const _onBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  const handleKeyCommand = (command:DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }
    console.log(editorState);
    return 'not-handled';
    
  }


  return (
    <div className='editor'>
        <button onClick={_onBoldClick}>Bold</button>
        <Editor 
        editorState={editorState} 
        handleKeyCommand={handleKeyCommand} 
        onChange={setEditorState} />
    </div>
    );
}

export default MyEditor;