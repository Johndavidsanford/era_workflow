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
  return Object.keys(node).map((key) => {
    switch(key) {
      case "title":
        return (<h1 key={key}>{node[key]}</h1>)
      case "subtitle":
        return (<h2 key={key}>{node[key]}</h2>)
      case "objects":
        return (Object.keys(node[key]).map((key2) => {
          switch (node[key][key2].type) {
            case "label":
              return (<p key={key2}>{node[key][key2].value}</p>)
            case "button":
              return (<input type="button" value={node[key][key2].value} />)
          }
        }))
       default:
        // code block
        break;
    }
  })
}
export default App;
