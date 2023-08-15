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
  resolveTableNode(node: any): any {
    return Object.keys(node).map((key) => {
      switch (key) {
        case "objects":
          return (Object.keys(node[key]).map((key2) => {
            switch (node[key][key2].type) {
              case "label":
                return (<p key={key2}>{node[key][key2].value}</p>)
              case "list":
                return (<ul>
                  {
                    Object.entries(node[key][key2].objects).map((object: any) => {
                      return (<li>{object.value}</li>)
                    })
                  }
                </ul>)
              case "table":
                return (<table>
                  {
                    Object.entries(node[key][key2].rows).map((row: any) => {
                      return (<tr>
                        {
                          Array(row[1].cells).map((cells: any) => {
                            return Object.entries(cells).map((cell: any) => {
                              console.log("cell[1]", cell[1]);
                              return (<td colSpan={cell[1].span}>
                                {
                                  this.resolveTableNode(cell[1])
                                }
                              </td>)
                            })
                          })
                        }
                      </tr>)
                    })
                  }
                </table>)
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
            }
          }))
        default:
          // code block
          break;
      }
    })
  };
  resolveNode(node: any): any {
    return <div className={node.nodeType ? node.nodeType : "node"}>
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
                  case "list":
                    return (<div className="listView"><ul>
                      {
                        Object.entries(node[key][key2].objects).map((object: any) => {
                          return <li>{object[1].value}</li>
                        })
                      }
                    </ul></div>)
                  case "table":
                    return (<table>
                      {
                        Object.entries(node[key][key2].rows).map((row: any) => {
                          return (<tr>
                            {
                              Array(row[1].cells).map((cells: any) => {
                                return Object.entries(cells).map((cell: any) => {
                                  console.log("cell[1]", cell[1]);
                                  return (<td colSpan={cell[1].span}>
                                    {
                                      this.resolveTableNode(cell[1])
                                    }
                                  </td>)
                                })
                              })
                            }
                          </tr>)
                        })
                      }
                    </table>)
                  case "node":
                    return this.resolveNode(node[key][key2])
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
                    return (<input key={key2} type="button" className="back" value={node[key][key2].value} onClick={() => {
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
    </div>
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
      {this.resolveNode(node)}
    </React.Fragment>
  }
}
