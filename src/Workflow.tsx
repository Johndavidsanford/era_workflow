import React, { createRef, useRef } from 'react';
import workflow from './workflow.json';
import './App.css';
import Xarrow from "react-xarrows";

export interface WorkflowProps { };
export interface WokflowState {
  timestamps: any,
  workflowKey: string,
  node: any,
  patient: any,
  arrows: any //[{ from: any; to: string; }]
  ids: any,
  arrowRefs: any
}
type Point = {
  x: number;
  y: number;
};
type Span = {
  width: number;
  height: number;
};
type ArrowProps = {
  id: any,
  refz: any,
  arrowParams: {from: Point, to: Point, target: Span}
};
let arrows: { from: any; to: string; }[] = [];
let ids: String[] = [];
const Arrow = ({ id, refz, arrowParams}: ArrowProps) => {
  // Getting info about SVG canvas
  const canvasStartPoint = {
    x: Math.min(arrowParams.from.x - 10, arrowParams.to.x - 10),
    y: Math.min(arrowParams.from.y - 10, arrowParams.to.y - 10),
  };
  const canvasEndPoint = {
    x: Math.max(arrowParams.from.x + 10, arrowParams.to.x + 10),
    y: Math.max(arrowParams.from.y + 10, arrowParams.to.y + 10),
  };
  const canvasWidth = Math.abs(canvasStartPoint.x - canvasEndPoint.x);
  const canvasHeight = Math.abs(canvasStartPoint.y - canvasEndPoint.y);

  const yDiff = arrowParams.from.y - arrowParams.to.y;
  const xDiff = arrowParams.from.x - arrowParams.to.x;

  const coeff = yDiff/xDiff;

  let arrowHead = {x: arrowParams.to.x - (.5 * arrowParams.target.width), y: arrowParams.to.y - (.5 * arrowParams.target.height)};
  if (yDiff > xDiff) {
    arrowHead.x = arrowHead.y / coeff;
    // arrowHead.y = arrowParams.to.y / coeff;
  } else {
    // arrowHead.x = arrowParams.to.x / coeff;
    arrowHead.y = arrowHead.x / coeff;
  }
  console.log("arrowParams",arrowParams);


  let temp2 = (arrowHead.x - canvasStartPoint.x) + " " + (arrowHead.y - canvasStartPoint.y) + "," +
    (arrowHead.x - canvasStartPoint.x - 10) + " " + (arrowHead.y - canvasStartPoint.y - 10) + "," +
    (arrowHead.x - canvasStartPoint.x + 10) + " " + (arrowHead.y - canvasStartPoint.y - 10);
  return (
    <svg
      id={id}
      key={arrowParams.from + '-' + arrowParams.to}
      ref={refz}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        top: canvasStartPoint.y,
        left: canvasStartPoint.x,
        // transform: `translate(${canvasStartPoint.x}px, ${canvasStartPoint.y}px)`,
      }}
    >
      <line
        stroke="#ff0000"
        strokeWidth={2}
        x1={arrowParams.from.x - canvasStartPoint.x}
        y1={arrowParams.from.y - canvasStartPoint.y}
        x2={arrowParams.to.x - canvasStartPoint.x}
        y2={arrowParams.to.y - canvasStartPoint.y}
      />
      {/* <defs>
        <marker id="endarrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth"> */}
      <polygon points={temp2} fill="red" />
      {/* </marker>
      </defs> */}
    </svg>
  );
};
export default class Workflow extends React.Component<WorkflowProps, WokflowState> {
  arrowTargets: any;
  arrowRefs: any;
  constructor(props: WorkflowProps | Readonly<WorkflowProps>) {
    super(props);
    this.state = {
      timestamps: {},
      workflowKey: "abdominalPain",
      node: workflow["abdominalPain"],
      patient: {
        weight: undefined,
        age: undefined
      },
      arrows: [],
      ids: [],
      arrowRefs: []
    }
    this.arrowTargets = {};
    this.arrowRefs = {};
  };
  componentDidMount(): void {
    this.drawArrows({});
  };
  resolveArrows() {
    return Object.entries(arrows).map((arrow, index) => {
      let from = arrow[1].from;
      let to = arrow[1].to;
      const fromObject = this.arrowTargets[from];
      const fromObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: from, height: fromObject.offsetHeight, width: fromObject.offsetWidth, top: fromObject.offsetTop, left: fromObject.offsetLeft };
      const toObject = this.arrowTargets[to];
      const toObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: to, height: toObject.offsetHeight, width: toObject.offsetWidth, top: toObject.offsetTop, left: toObject.offsetLeft };
      const arrowProps: { from: { id: string, height: number, width: number, top: number, left: number }, to: { id: string, height: number, width: number, top: number, left: number } } = { from: fromObjectProps, to: toObjectProps }
      const featureAPosition = {
        x: 300,
        y: 0,
      };
      const featureBPosition = {
        x: 400,
        y: 200,
      };
      return (
        <div key={"arrow_" + index} style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
          <Xarrow key={"arrow_" + index} start={fromObject} end={toObject} color='red' headColor="red" />
        </div>
      );
    })
  };
  drawArrows(node: any) {
    const setRef = (element: HTMLElement | null, key: string) => {
      const temp: React.RefObject<HTMLElement> = React.createRef();
      Object.assign(this.arrowRefs, { [key]: element });
      return temp;
    }
    return Object.entries(arrows).map((arrow, index) => {
      let from = arrow[1].from;
      let to = arrow[1].to;
      const fromObject = this.arrowTargets[from];
      const toObject = this.arrowTargets[to];
      if (fromObject && toObject) {
        const fromObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: from, height: fromObject.offsetHeight, width: fromObject.offsetWidth, top: fromObject.offsetTop, left: fromObject.offsetLeft };
        const toObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: to, height: toObject.offsetHeight, width: toObject.offsetWidth, top: toObject.offsetTop, left: toObject.offsetLeft };
        const arrowProps: { from: { id: string, height: number, width: number, top: number, left: number }, to: { id: string, height: number, width: number, top: number, left: number } } = { from: fromObjectProps, to: toObjectProps }
        const featureAPosition = {
          y: fromObjectProps.top + (.5*fromObjectProps.height),
          x: fromObjectProps.left + (.5*fromObjectProps.width)
        };
        const featureBPosition = {
          y: toObjectProps.top + (.5*toObjectProps.height),
          x: toObjectProps.left + (.5*toObjectProps.width)
        };
        this.arrowRefs["arrow_"+from+"_"+to] = arrowProps;
        if (JSON.stringify(this.state.arrowRefs["arrow_"+from+"_"+to]) !== JSON.stringify(arrowProps)) {
          this.setState({
            arrowRefs: {
              ...this.state.arrowRefs,
              ["arrow_"+from+"_"+to]: arrowProps
            }
          })
        }
        const params = {from:{...featureAPosition},to:{...featureBPosition},target:{height:toObjectProps.height,width:toObjectProps.width}};
        return <Arrow key={"arrow_" + index} id={"arrow_" + from + "_" + to} refz={(element: HTMLElement | null) => setRef(element, "arrow_"+from+"_"+to)} arrowParams={params} />
      }
      // } else {
      //   const featureAPosition = {
      //     x: 300,
      //     y: 0,
      //   };
      //   const featureBPosition = {
      //     x: 400,
      //     y: 200,
      //   };
      //   const params = {from:{...featureAPosition},to:{...featureBPosition}};
      //   return <Arrow key={"arrow_" + index} id={"arrow_" + from + "_" + to} refz={(element: HTMLElement | null) => setRef(element, "arrow_"+from+"_"+to)} arrowParams={params} />
      // }
    })
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
                return (<ul key={key2}>
                  {
                    Object.entries(node[key][key2].objects).map((object: any, index: number) => {
                      return (<li key={key2 + "_" + index}>{object.value}</li>)
                    })
                  }
                </ul>)
              case "table":
                return (<table key={key2}><tbody>
                  {
                    Object.entries(node[key][key2].rows).map((row: any, index: number) => {
                      return (<tr key={key2 + "_" + index}>
                        {
                          Array(row[1].cells).map((cells: any) => {
                            return Object.entries(cells).map((cell: any, cellIndex) => {
                              return (<td key={key2 + "_" + index + "_" + cellIndex} colSpan={cell[1].span}>
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
                </tbody></table>)
              case "link":
                return (<input key={key2} type="button" value={node[key][key2].value} onClick={() => {
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
                }
                } />)
            }
          }))
        default:
          break;
      }
    })
  };
  resolveNode(node: any): any {
    const setRef = (element: HTMLElement | null, key: string) => {
      const temp: React.RefObject<HTMLElement> = React.createRef();
      Object.assign(this.arrowTargets, { [key]: element });
      return temp;
    }
    return <div ref={(element) => setRef(element, node.id)} className={node.nodeType ? node.nodeType : node.level ? "node " + node.level : "node"}>
      {
        Object.keys(node).map((key) => {
          if (node.id && !ids.some((element: String) => element === node.id)) {
            Object.entries(node.next).map((nextNode: any) => {
              if (!arrows.some((element: { from: String, to: String }) => (element.from === node.id && element.to === nextNode[1]))) {
                arrows.push({ from: node.id, to: nextNode[1] });
              }
            });
            ids.push(node.id);
          }
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
                    return (<div key={key2} className="listView"><ul>
                      {
                        Object.entries(node[key][key2].objects).map((object: any, index: number) => {
                          return <li key={node.id + "_" + index}>{object[1].value}</li>
                        })
                      }
                    </ul></div>)
                  case "table":
                    return (<table key={key2}><tbody>
                      {
                        Object.entries(node[key][key2].rows).map((row: any) => {
                          return (<tr>
                            {
                              Array(row[1].cells).map((cells: any) => {
                                return Object.entries(cells).map((cell: any) => {
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
                    </tbody></table>)
                  case "node":
                    return this.resolveNode(node[key][key2])
                  case "link":
                    return (<input key={key2} type="button" value={node[key][key2].value} onClick={() => {
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
              break;
          }
        })
      }
    </div>
  };
  render() {
    const node = this.state.node;
    return <React.Fragment>
      <input type="text" key="age" id="age" placeholder="Patient Age" onClick={(value) => {
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
      <input type="text" key="weight" id="weight" placeholder="Patient Weight" onClick={(value) => {
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
      {this.drawArrows(node)}
      {Object.keys(this.arrowRefs).map((key) => {
        const featureAPosition = {
          x: this.arrowRefs[key].from.left,
          y: this.arrowRefs[key].from.top,
        };
        const featureBPosition = {
          x: this.arrowRefs[key].to.left,
          y: this.arrowRefs[key].to.top,
        };
        console.log(this.arrowRefs[key]);
      })}
    </React.Fragment>
  }
}
