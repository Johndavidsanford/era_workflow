import React from 'react';
import workflow from './workflow.json';
import './App.css';

export interface WorkflowProps { };
export interface WokflowState {
  timestamps: any,
  workflowKey: string,
  node: any
}
export default class Workflow extends React.Component<WorkflowProps, WokflowState> {
  constructor(props: WorkflowProps | Readonly<WorkflowProps>) {
    super(props);
    this.state = {
      timestamps: {},
      workflowKey: "universalPatientAssessment",
      node: workflow["universalPatientAssessment"]
    }
  };
  render() {
    const node = this.state.node;
    return Object.keys(node).map((key) => {
      switch (key) {
        case "title":
          return (<h1 key={key}>{node[key]}</h1>)
        case "subtitle":
          return (<h2 key={key}>{node[key]}</h2>)
        case "objects":
          return (Object.keys(node[key]).map((key2) => {
            switch (node[key][key2].type) {
              case "label":
                return (<p key={key2}>{node[key][key2].value}</p>)
              case "next":
                return (<input key={key2} type="button" value={node[key][key2].value} onClick={() => {
                  this.setState(
                    {
                      timestamps: {
                        ...this.state.timestamps,
                        workflowKey: new Date()
                      },
                      workflowKey: node.next,
                      node: workflow[node.next as keyof typeof workflow]
                    }
                  );
                }
                } />)
            }
          }))
        default:
          // code block
          break;
      }
    })
  }
}
