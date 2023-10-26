import React, { createRef, useRef } from 'react';
import workflow from '../workflow.json';
import Node from './node';
import '../styles/App.css';
import Arrows from './arrows';

export interface WorkflowProps {
  workflowKey: string | null
 };
export interface WokflowState {
  timestamps: any,
  workflowKey: string,
  // node: any,
  patient: any,
  arrows: any //[{ from: any; to: string; }]
  ids: any,
  arrowRefs: any,
  arrowTargets: any
}
type Point = {
  x: number;
  y: number;
};
type Span = {
  width: number;
  height: number;
};
type arrowParams = {x: number, y: number};
type ArrowProps = {
  id: any,
  refz: any,
  arrowParams: {from: Point, to: Point, target: Span, arrow: arrowParams}
};
let arrows: { from: any; to: string; }[] = [];
let arrowKey=0;
let ids: String[] = [];
export default class Workflow extends React.Component<WorkflowProps, WokflowState> {
  constructor(props: WorkflowProps | Readonly<WorkflowProps>) {
    super(props);
    this.state = {
      timestamps: {},
      workflowKey: this.props.workflowKey?this.props.workflowKey:"universalPatientAssessment",
      patient: {
        weight: undefined,
        age: undefined
      },
      arrows: [],
      ids: [],
      arrowRefs: [],
      arrowTargets: {}
    }
  };
  setRef = (arrowTargets: any) => {
    this.setState({arrowTargets: arrowTargets});
  };
  setArrow = (from: string, to: string) => {
    if (!arrows.some((element: { from: String, to: String }) => (element.from === from && element.to === to))) {
      arrows.push({ from: from, to: to});
    }
  };
  render() {
    return <React.Fragment>
      <input type="text" key="age" id="age" placeholder="Patient Age" onBlur={(value) => {
        arrowKey++;
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
      <input type="text" key="weight" id="weight" placeholder="Patient Weight" onBlur={(value) => {
        arrowKey++;
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
      <Node workflow={workflow} workflowKey={this.state.workflowKey} patient={this.state.patient} timestamps={this.state.timestamps} setRef={this.setRef} setArrow={this.setArrow}/>
      <Arrows key={arrowKey} workflow={workflow} workflowKey={this.state.workflowKey} timestamps={this.state.timestamps} arrowTargets={this.state.arrowTargets} arrows={arrows}/>
    </React.Fragment>
  }
}
