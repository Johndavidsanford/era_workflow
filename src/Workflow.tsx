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
  // arrowTargets: any
}
type Point = {
  x: number;
  y: number;
};
type ArrowProps = {
  id: any,
  refz: any,
  arrowParams: {from: Point, to: Point}
};
// const {refsByKey, setRef} = useRefs();
let arrows: { from: any; to: string; }[] = [];
let ids: String[] = [];
const Arrow = ({ id, refz, arrowParams}: ArrowProps) => {
  // Getting info about SVG canvas
  const canvasStartPoint = {
    x: Math.min(arrowParams.from.x - 10, arrowParams.to.x - 10),
    y: Math.min(arrowParams.from.y - 10, arrowParams.to.y - 10),
  };
  const canvasWidth = Math.abs(arrowParams.to.x - arrowParams.from.x + 0);
  const canvasHeight = Math.abs(arrowParams.to.y - arrowParams.from.y + 0);
  // let temp = "0 0, 10 3.5, 0 7";
  let temp2 = (arrowParams.to.x - canvasStartPoint.x) + " " + (arrowParams.to.y - canvasStartPoint.y) + "," +
    (arrowParams.to.x - canvasStartPoint.x - 10) + " " + (arrowParams.to.y - canvasStartPoint.y - 10) + "," +
    (arrowParams.to.x - canvasStartPoint.x + 10) + " " + (arrowParams.to.y - canvasStartPoint.y - 10);
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
// import React, { useRef, useEffect } from 'react'
// export const Component = ({ items }) => {
//   const itemsEls = useRef(new Array())
//   return (
//     {items.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => {
//       const getRef = (element: any) => (itemsEls.current.push(element))
//       return getRef;
//     })}
//   )
// }
// const [elRefs, setElRefs] = React.useState([]);
// let arrowTargets: React.RefObject<Record<string,HTMLElement | null>>;
// React.useEffect(() => {
//   // add or remove refs
//   setElRefs((elRefs) => Object(arrLength).map((_, i) => elRefs[i] || createRef()),
//   );
// }, [arrLength]);
// let arrowTargets = useRef(new Array());
export default class Workflow extends React.Component<WorkflowProps, WokflowState> {
  arrowTargets: any;
  arrowRefs: any;
  // arrowTargets: React.RefObject<Record<string,HTMLElement | null>> = React.createRef();
  // arrowTargets: React.RefObject<Array<HTMLDivElement | null>>([]) = useRef([]);
  // arrowTargets = useRef(new Array());
  // arrowTarget: React.RefObject<HTMLObjectElement> = React.createRef();
  // arrowTarget: React.RefObject<Record<string,HTMLElement>> = React.createRef();

  // arrowTarget: React.RefObject<Record<string,HTMLElement>> = React.createRef();
  // refsByKey: typeof useRef<Record<string,HTMLElement | null>>({})
  // const refsByKey = useRef<Record<string,HTMLElement | null>>({})
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
      // arrowTargets: useRef
    }
    this.arrowTargets = {};
    this.arrowRefs = {};
    // this.arrowTargets = useRef({});
    // arrowTargets = useRef(new Array());
    // let arrowTargets = useRef<Record<string,HTMLElement | null>>({});
  };
  componentDidMount(): void {
    // this.resolveArrows();
    this.drawArrows({});
    // this.resolveArrows();
  };
  resolveArrows() {
    // componentDidMount() {
    //   this.getFontSize();
    // } 
    // getFontSize = () => {
    // console.log(
    //   window.getComputedStyle(this.ref, null).getPropertyValue("font-size")
    // );
    // };
    // console.log("arrows", arrows);

    // console.log("arrowTargets", this.arrowTargets);
    // console.log("ids", ids);
    return Object.entries(arrows).map((arrow, index) => {
      let from = arrow[1].from;
      let to = arrow[1].to;
      // const fromSelector = document.querySelector("#" + from)!;
      const fromObject = this.arrowTargets[from];
      const fromObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: from, height: fromObject.offsetHeight, width: fromObject.offsetWidth, top: fromObject.offsetTop, left: fromObject.offsetLeft };
      //console.log("fromObjectProps",fromObjectProps);
      // console.log("fromObject", fromObject);
      //console.log("style",Array.from(document.head.getElementsByTagName("style")));
      // const fromStyles = window.getComputedStyle(fromSelector);
      // window.getComputedStyle(fromSelector, null).getPropertyValue("font-size");
      // console.log(fromStyles.getPropertyValue(""));
      // const toSelector = document.querySelector("#" + to)!;
      const toObject = this.arrowTargets[to];
      const toObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: to, height: toObject.offsetHeight, width: toObject.offsetWidth, top: toObject.offsetTop, left: toObject.offsetLeft };
      // console.log("toObjectProps", toObjectProps);
      const arrowProps: { from: { id: string, height: number, width: number, top: number, left: number }, to: { id: string, height: number, width: number, top: number, left: number } } = { from: fromObjectProps, to: toObjectProps }
      // console.log("arrowProps", arrowProps);
      // window.getComputedStyle(toSelector, null).getPropertyValue("font-size");
      // const toStyles = window.getComputedStyle(toSelector);
      // let fromX = window.getComputedStyle(document.getElementById(from));
      // console.log("from", from);
      // console.log("fromStyles", fromStyles);
      // console.log("toStyles", toStyles);
      // console.log("to", to);

      // const arrowSelector = document.querySelector("#arrow_" + from + "_" + to)!;
      // console.log("top", document.getElementById("#arrow_" + from + "_" + to)?.offsetTop);
      const featureAPosition = {
        x: 300,
        y: 0,
      };
      const featureBPosition = {
        x: 400,
        y: 200,
      };
      // console.log("useRef", useRef);
      // console.log("from",from);
      // console.log("to",to);
      return (
        <div key={"arrow_" + index} style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
          <Xarrow key={"arrow_" + index} start={fromObject} end={toObject} color='red' headColor="red" />
        </div>
      );
      // return <Xarrow key={"arrow_" + index} start={from} end={to} />
      //<Arrow key={"arrow_" + index} startPoint={featureAPosition} endPoint={featureBPosition} />;
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
        // console.log("set: arrow_"+from+"_"+to,);
        const arrowProps: { from: { id: string, height: number, width: number, top: number, left: number }, to: { id: string, height: number, width: number, top: number, left: number } } = { from: fromObjectProps, to: toObjectProps }
        // console.log("arrow_"+from+"_"+to, arrowProps);
        const featureAPosition = {
          x: fromObjectProps.left,//300,
          y: fromObjectProps.top,//0,
        };
        const featureBPosition = {
          x: toObjectProps.left,//400,
          y: toObjectProps.top,//200,
        };
        //console.log("arrow_"+from+"_"+to,this.arrowRefs["arrow_"+from+"_"+to]);
        this.arrowRefs["arrow_"+from+"_"+to] = arrowProps;
        // console.log(this.state.arrowRefs);
        // console.log("arrowProps",arrowProps);
        if (JSON.stringify(this.state.arrowRefs["arrow_"+from+"_"+to]) !== JSON.stringify(arrowProps)) {
          // console.log("!==",arrowProps);
          this.setState({
            arrowRefs: {
              ...this.state.arrowRefs,
              ["arrow_"+from+"_"+to]: arrowProps
            }
          })
        }
        const params = {from:{...featureAPosition},to:{...featureBPosition}};
        // return <Xarrow key={"arrow_" + index} start={from} end={to} color='red' headColor="red" />
        return <Arrow key={"arrow_" + index} id={"arrow_" + from + "_" + to} refz={(element: HTMLElement | null) => setRef(element, "arrow_"+from+"_"+to)} arrowParams={params} />
      } else {
        const featureAPosition = {
          x: 300,
          y: 0,
        };
        const featureBPosition = {
          x: 400,
          y: 200,
        };
        const params = {from:{...featureAPosition},to:{...featureBPosition}};
        return <Arrow key={"arrow_" + index} id={"arrow_" + from + "_" + to} refz={(element: HTMLElement | null) => setRef(element, "arrow_"+from+"_"+to)} arrowParams={params} />
      }
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
                  // if (this.state.patient.age && this.state.patient.weight) {
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
                  // const timer = setTimeout(() => {
                  //   this.componentDidMount()
                  // }, 1000);
                  // } else {
                  //   alert("Patient Age and Weight are required!");
                  // }
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
    // const itemEls = useRef({});
    // const arrowTargets = useRef({});
    // // {(element) => itemEls.current[index] = element}
    // const getRef = (element: any) => (itemEls.current.push(element));
    // // const useRefs = () => {
    const setRef = (element: HTMLElement | null, key: string) => {
      const temp: React.RefObject<HTMLElement> = React.createRef();
      //   // if (this.arrowTargets.current)
      // this.arrowTargets.push({key:temp});
      // this.arrowTargets[key] = temp;
      Object.assign(this.arrowTargets, { [key]: element });
      return temp;
      // }
      //   return {refsByKey: refsByKey.current, setRef};
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
                      // if (this.state.patient.age && this.state.patient.weight) {
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
                      // const timer = setTimeout(() => {
                      //   this.componentDidMount()
                      // }, 1000);
                      // } else {
                      //   alert("Patient Age and Weight are required!");
                      // }
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
                        // const timer = setTimeout(() => {
                        //   this.componentDidMount()
                        // }, 1000);
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
      {
        // const timer = setTimeout(() => {
        //   this.componentDidMount()
        // }, 1000);
        // this.resolveArrows()
      }
    </div>
  };
  render() {
    const node = this.state.node;
    // const setRef = (element: HTMLElement | null, key: string) => {
    //   const temp: React.RefObject<HTMLElement> = React.createRef();
    //   Object.assign(this.arrowRefs, { [key]: element });
    //   return temp;
    // }
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
        // console.log(key, this.arrowRefs[key]);
        console.log(this.arrowRefs[key]);
        // this.arrowRefs[key].current.startPoint = featureAPosition;
        // this.arrowRefs[key].current.endPoint = featureBPosition;
        // return <Arrow key={key} id={key} ref={(eslement: HTMLElement | null) => setRef(element, key)} startPoint={featureAPosition} endPoint={featureBPosition} />
      })}
    </React.Fragment>
  }
}
