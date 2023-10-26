import React from 'react';
import Workflow from './components/Workflow';

import './styles/App.css';

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const name = queryParameters.get("name")
  console.log(queryParameters.keys);
  return (
    <div>
      <Workflow workflowKey={name} />
    </div>
  )
}
export default App;
