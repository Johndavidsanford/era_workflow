import workflow from './workflow.json';
import './App.css';

function Workflow(props) {
  return <h1>{props.key}</h1>;
}
function App() {
  let node = {
    "name": null,
    "next": null,
    "timestamp": null
  };
  Object.assign(node, workflow.root);
  console.log(node.tableOfContents);
  return Object.keys(node).map((key) => {
    return (<h1 key={key}>{key + ":" + node[key]}</h1>)
  })
}
export default App;
