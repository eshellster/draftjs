import React, { useState, useRef} from 'react'
import{convertToRaw,CompositeDecorator,Editor,EditorState,RichUtils} from 'draft-js'
import './Link.css'

const styles = {
    root: {
      fontFamily: '\'Georgia\', serif',
      padding: 20,
      width: 600,
    },
    buttons: {
      marginBottom: 10,
    },
    urlInputContainer: {
      marginBottom: 10,
    },
    urlInput: {
      fontFamily: '\'Georgia\', serif',
      marginRight: 10,
      padding: 3,
    },
    editor: {
      border: '1px solid #ccc',
      cursor: 'text',
      minHeight: 80,
      padding: 10,
    },
    button: {
      marginTop: 10,
    //   textAlign: 'center',
    },
    link: {
      color: '#3b5998',
      textDecoration: 'underline',
    },
  };


function findLinkEntities(contentBlock:any, callback:any, contentState:any) {
    contentBlock.findEntityRanges(
      (character:any) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }

  const Link = (props:any) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url} style={styles.link}>
          {props.children}
     </a>
    );
  };

  const LinkEditorExample = () => {

    const decorator = new CompositeDecorator([
        {
          strategy: findLinkEntities,
          component: Link,
        },
      ]);

    const [state,setState] = useState({
        editorState: EditorState.createEmpty(decorator),
        showURLInput: false,
        urlValue: '',
      })

    // type 지정이 어려웠음 => 반환해야하는 형식을 지정해줌 & inputElement의 경우엔 null을 넣어준다.  
    const editorRef = useRef<Editor>(null)
    const urlRef = useRef<HTMLInputElement>(null)

 

  

    const _promptForLink = (e:any) => {
      e.preventDefault();
      const {editorState} = state;
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        const contentState = editorState.getCurrentContent();
        const startKey = editorState.getSelection().getStartKey();
        const startOffset = editorState.getSelection().getStartOffset();
        const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
        const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

        let url = '';
        if (linkKey) {
          const linkInstance = contentState.getEntity(linkKey);
          url = linkInstance.getData().url;
        }

        setState({...state, showURLInput: true,urlValue: url})
        
        setTimeout(() => { urlRef?.current?.focus()}, 0);
        
      }
    }

    const _confirmLink = (e:any) => {
      e.preventDefault();
      const {editorState, urlValue} = state;
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        {url: urlValue}
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      setState({
        editorState: RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        ),
        showURLInput: false,
        urlValue: '',
      })
      setTimeout(() => editorRef?.current?.focus(), 0);
      
    }

    const _onLinkInputKeyDown = (e:any) => {
      if (e.which === 13) {
        _confirmLink(e);
      }
    }

    const _removeLink = (e:any) => {
      e.preventDefault();
      const {editorState} = state;
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        setState({
          ...state, editorState: RichUtils.toggleLink(editorState, selection, null),
        });
      }
    }



      const focus = () => editorRef?.current?.focus();
      const onChange = (editorState:EditorState) =>  setState({...state, editorState});
      const logState = () => {
        const content =  state.editorState.getCurrentContent();
        console.log(convertToRaw(content));
      };

      const promptForLink =  _promptForLink;
      const onURLChange = (e:any) => setState({ ...state, urlValue: e.target.value});
      const confirmLink = _confirmLink;
      const onLinkInputKeyDown = _onLinkInputKeyDown;
      const removeLink = _removeLink;

    
      let urlInput;
      if (state.showURLInput) {
        urlInput =
          <div style={styles.urlInputContainer}>
            <input
              onChange={onURLChange}
              ref={urlRef}
              style={urlInput}
              type="text"
              value={state.urlValue}
              onKeyDown={onLinkInputKeyDown}
            />
            <button onMouseDown={confirmLink}>
              Confirm
            </button>
          </div>;
      }

      return (
        <div style={styles.root}>
          <div style={{marginBottom: 10}}>
            Select some text, then use the buttons to add or remove links
            on the selected text.
          </div>
          <div style={styles.buttons}>
            <button
              onMouseDown={promptForLink}
              style={{marginRight: 10}}>
              Add Link
            </button>
            <button onMouseDown={removeLink}>
              Remove Link
            </button>
          </div>
          {urlInput}
          <div style={styles.editor} onClick={focus}>
            <Editor
              editorState={state.editorState}
              onChange={onChange}
              placeholder="Enter some text..."
              ref={editorRef}
            />
          </div>
          <input
            style={styles.button}
            onClick={logState}
            type="button"
            value="Log State"
          />
        </div>
      );
    
  }

  export default LinkEditorExample;