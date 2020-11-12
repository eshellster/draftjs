import React from 'react';
import './App.css';
import LinkEditorExample from './components/Link';
import MyEditor from './components/MyEditor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MyEditor />
        <LinkEditorExample />
      </header>
    </div>
  );
}

export default App;
