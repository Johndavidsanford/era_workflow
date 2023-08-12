import React from 'react';
import workflow from './workflow.json';
import './App.css';

export interface WorkflowProps { };
export interface WokflowState {
  timestamps: any,
  workflowKey: string,
  node: any,
  patient: any
}
export default class Workflow extends React.Component<WorkflowProps, WokflowState> {
  constructor(props: WorkflowProps | Readonly<WorkflowProps>) {
    super(props);
    this.state = {
      timestamps: {},
      workflowKey: "universalPatientAssessment",
      node: workflow["universalPatientAssessment"],
      patient: {
        weight: undefined,
        age: undefined
      }
    }
  };
  render() {
    const node = this.state.node;
    return <React.Fragment>
      <input type="text" id="age" placeholder="Patient Age" onClick={(value) => {
        this.setState(
          {
            patient: {
              ...this.state.patient,
              age: value
            },
          }
        );
      }
      } />
      <input type="text" id="weight" placeholder="Patient Weight" onClick={(value) => {
        this.setState(
          {
            patient: {
              ...this.state.patient,
              weight: value
            },
          }
        );
      }
      } />
      {
        Object.keys(node).map((key) => {
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
                  case "link":
                    return (<input key={key2} type="button" value={node[key][key2].value} onClick={() => {
                      if (this.state.patient.age && this.state.patient.weight) {
                        this.setState(
                          {
                            timestamps: {
                              ...this.state.timestamps,
                              workflowKey: new Date()
                            },
                            workflowKey: node[key][key2].target,
                            node: workflow[node[key][key2].target as keyof typeof workflow]
                          }
                        );
                      } else {
                        alert("Patient Age and Weight are required!");
                      }
                    }
                    } />)
                  case "next":
                    return (<input key={key2} type="button" value={node[key][key2].value} onClick={() => {
                      if (this.state.patient.age && this.state.patient.weight) {
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
                      } else {
                        alert("Patient Age and Weight are required!");
                      }
                    }
                    } />)
                  case "back":
                    return (<input key={key2} type="button" value={node[key][key2].value} onClick={() => {
                      if (this.state.patient.age && this.state.patient.weight) {
                        this.setState(
                          {
                            timestamps: {
                              ...this.state.timestamps,
                              workflowKey: new Date()
                            },
                            workflowKey: "universalPatientAssessment",
                            node: workflow["universalPatientAssessment" as keyof typeof workflow]
                          }
                        );
                      } else {
                        alert("Patient Age and Weight are required!");
                      }
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
    </React.Fragment>
  }
}
