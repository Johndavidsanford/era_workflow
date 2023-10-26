import React from 'react';
import Workflow from './components/Workflow';

import './styles/App.css';

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const name = queryParameters.get("name")
  console.log(queryParameters.keys);
  return (
    <div>
      {/* <p>Name: {name}</p> */}
      <Workflow workflowKey={name} />
    </div>
  // return (<Workflow />);
  )
}
export default App;
