import React, { createRef, useRef } from 'react';
import '../styles/App.css';
export interface NodeProps {
    workflow: any,
    workflowKey: string,
    patient: {
        weight: number,
        age: number
    },
    timestamps: any,
    setRef: any,
    setArrow: any
};
export interface NodeState {
    workflow: any,
    workflowKey: string,
    node: any,
    patient: any,
    timestamps: any
}
type Span = {
    width: number;
    height: number;
};
let ids: String[] = [];
export default class Node extends React.Component<NodeProps, NodeState> {
    arrowTargets: any;
    constructor(props: NodeProps | Readonly<NodeProps>) {
        super(props);
        this.state = {
            workflow: this.props.workflow,
            workflowKey: this.props.workflowKey,
            node: this.props.workflow[this.props.workflowKey],
            patient: this.props.patient,
            timestamps: this.props.timestamps
        }
        this.arrowTargets = {};
    };
    componentDidMount(): void {
        this.props.setRef(this.arrowTargets);
    };
    componentDidUpdate(prevProps: Readonly<NodeProps>, prevState: Readonly<NodeState>, snapshot?: any): void {
        if (prevProps.patient !== this.props.patient) {
          this.setState({patient: this.props.patient});
        }
        if (prevProps.workflowKey !== this.props.workflowKey) {
          this.setState({workflowKey: this.props.workflowKey, node: this.state.workflow[this.state.workflowKey]});
        }
        if (prevProps.timestamps !== this.props.timestamps) {
          this.setState({timestamps: this.props.timestamps});
        }
    }
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
                                            node: this.props.workflow[node[key][key2].target] // as keyof typeof this.props.workflow
                                        }
                                    );
                                    window.location.href = "/workflow?name=" + node[key][key2].target;
                                } } />)
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
            if (key !== "") {
                Object.assign(this.arrowTargets, { [key]: element });
            }
            return temp;
        }
        return <div ref={(element) => setRef(element, node.id?this.props.workflowKey + "_" + node.id:"")} className={node.nodeType ? node.nodeType : node.level ? "node " + node.level : "node"}>
            {
                Object.keys(node).map((key) => {
                    if (node.id && !ids.some((element: String) => element === this.props.workflowKey + "_" + node.id)) {
                        Object.entries(node.next).map((nextNode: any) => {
                            this.props.setArrow(this.props.workflowKey + "_" + node.id, this.props.workflowKey + "_" + nextNode[1]);
                        });
                        ids.push(this.props.workflowKey + "_" + node.id);
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
                                                    return <li key={node.id + "_" + key + "_" + key2 + "_" + index}>{object[1].value}</li>
                                                })
                                            }
                                        </ul></div>)
                                    case "table":
                                        return (<table key={key2}><tbody>
                                            {
                                                Object.entries(node[key][key2].rows).map((row: any) => {
                                                    return (<tr key={key +"_"+key2}>
                                                        {
                                                            Array(row[1].cells).map((cells: any) => {
                                                                return Object.entries(cells).map((cell: any) => {
                                                                    return (<td colSpan={cell[1].span} key={key+"_"+key2}>
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
                                                    node: this.props.workflow[node[key][key2].target] // as keyof typeof this.props.workflow
                                                }
                                            );
                                            window.location.href = "/workflow?name=" + node[key][key2].target;
                                        }} />)
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
                                                        node: this.props.workflow[node.next] // as keyof typeof this.props.workflow
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
                                                        node: this.props.workflow["universalPatientAssessment"] // as keyof typeof this.props.workflow
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
            {this.resolveNode(node)}
        </React.Fragment>
    }
}
