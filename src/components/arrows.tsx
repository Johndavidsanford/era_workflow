import React, { createRef, useRef } from 'react';
import '../styles/App.css';

export interface ArrowsProps {
    workflow: any,
    workflowKey: string,
    timestamps: any,
    arrowTargets: any,
    arrows: any
};
export interface ArrowsState {
    workflow: any,
    workflowKey: string,
    node: any,
    timestamps: any,
    arrowRefs: any,
    arrows: { from: any; to: string; }[]
}
type Span = {
    width: number;
    height: number;
};
type arrowParams = {x: number, y: number};
type Point = {
    x: number;
    y: number;
  };
type ArrowProps = {
  id: any,
  refz: any,
  arrowParams: {from: Point, to: Point, target: Span, arrow: arrowParams}
};
let arrows: { from: any; to: string; }[] = [];
let arrowKey=0;
let ids: String[] = [];
const rotatePoint = (point: Point, origin: Point, angle: number) => {
  let polar = angle / (180 / Math.PI);
  let x = (point.x - origin.x) * Math.cos(polar) - (point.y - origin.y) * Math.sin(polar) + origin.x;
  let y = (point.x - origin.x) * Math.sin(polar) + (point.y - origin.y) * Math.cos(polar) + origin.y;
  return {x:x,y:y};
}
const Arrow = ({id, refz, arrowParams}: ArrowProps) => {
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
  let arrowHead = {x: arrowParams.arrow.x, y: arrowParams.arrow.y};
  let rise = (arrowParams.from.y - canvasStartPoint.y) - (arrowParams.to.y - canvasStartPoint.y);
  let run = (arrowParams.from.x - canvasStartPoint.x) - (arrowParams.to.x - canvasStartPoint.x);
  let slope = rise / run;
  let angle = Math.atan2(rise,run) * (180 / Math.PI); //polar to cartesian
  const point0 = {x: arrowHead.x, y: arrowHead.y};
  const point1 = rotatePoint({x: arrowHead.x + 10, y: arrowHead.y + 10}, point0, angle);
  const point2 = rotatePoint({x: arrowHead.x + 10, y: arrowHead.y - 10}, point0, angle);
  let temp2 = (arrowHead.x - canvasStartPoint.x) + " " + (arrowHead.y - canvasStartPoint.y) + "," +
    (point1.x - canvasStartPoint.x) + " " + (point1.y - canvasStartPoint.y) + "," +
    (point2.x - canvasStartPoint.x) + " " + (point2.y - canvasStartPoint.y);
  return (
    <svg
      id={id}
      key={arrowParams.from + '-' + arrowParams.to + '_' + arrowKey++}
      ref={refz}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        top: canvasStartPoint.y,
        left: canvasStartPoint.x,
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
      <polygon points={temp2} fill="red" />
    </svg>
  );
};
export default class Arrows extends React.Component<ArrowsProps, ArrowsState> {
    arrowTargets: any;
    arrowRefs: any;
    constructor(props: ArrowsProps | Readonly<ArrowsProps>) {
        super(props);
        this.state = {
            workflow: this.props.workflow,
            workflowKey: this.props.workflowKey,
            node: this.props.workflow[this.props.workflowKey],
            timestamps: this.props.timestamps,
            arrowRefs: [],
            arrows: this.props.arrows
        }
        this.arrowTargets = {};
        this.arrowRefs = {};
    };
    componentDidMount(): void {
      console.log("mounted");
      // this.drawArrows({});
    };
    componentDidUpdate(prevProps: Readonly<ArrowsProps>, prevState: Readonly<ArrowsState>, snapshot?: any): void {
        if (prevProps.workflowKey !== this.props.workflowKey) {
          // console.log("!!workflowKey:",this.props.workflowKey);
          this.setState({workflowKey: this.props.workflowKey});
        }
        if (prevProps.arrowTargets !== this.props.arrowTargets) {
          console.log("!!arrowTargets:",this.props.arrowTargets);
          Object.assign(this.arrowTargets, this.props.arrowTargets);
          this.drawArrows({});
        }
        if (prevProps.arrows !== this.props.arrows) {
          // console.log("!!arrows:",this.props.arrows);
          // Object.assign(arrows, this.props.arrows);
          this.setState({arrows: this.props.arrows})
        }
    }
    drawArrows(node: any) {
        const setRef = (element: HTMLElement | null, key: string) => {
            const temp: React.RefObject<HTMLElement> = React.createRef();
            Object.assign(this.arrowRefs, { [key]: element });
            return temp;
        }
        // console.log("this.state.arrows",this.state.arrows);
        return Object.entries(this.state.arrows).map((arrow, index) => {
          // console.log("arrow",arrow);
          // console.log("this.arrowTargets",this.arrowTargets);
          let from = arrow[1].from;
            let to = arrow[1].to;
            const fromObject = this.arrowTargets[from];
            const toObject = this.arrowTargets[to];
            if (fromObject && toObject) {
                const fromObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: from, height: fromObject.offsetHeight, width: fromObject.offsetWidth, top: fromObject.offsetTop, left: fromObject.offsetLeft };
                const toObjectProps: { id: string, height: number, width: number, top: number, left: number } = { id: to, height: toObject.offsetHeight, width: toObject.offsetWidth, top: toObject.offsetTop, left: toObject.offsetLeft };
                // console.log("fromObjectProps",fromObjectProps);
                // console.log("toObjectProps",toObjectProps);
                const arrowProps: { from: { id: string, height: number, width: number, top: number, left: number }, to: { id: string, height: number, width: number, top: number, left: number } } = { from: fromObjectProps, to: toObjectProps }
                const featureAPosition = {
                    y: fromObjectProps.top + (.5 * fromObjectProps.height),
                    x: fromObjectProps.left + (.5 * fromObjectProps.width)
                };
                const featureBPosition = {
                    y: toObjectProps.top + (.5 * toObjectProps.height),
                    x: toObjectProps.left + (.5 * toObjectProps.width)
                };
                this.arrowRefs["arrow_" + from + "_" + to] = arrowProps;
                if (JSON.stringify(this.state.arrowRefs["arrow_" + from + "_" + to]) !== JSON.stringify(arrowProps)) {
                    this.setState({
                        arrowRefs: {
                            ...this.state.arrowRefs,
                            ["arrow_" + from + "_" + to]: arrowProps
                        }
                    })
                }
                let arrowPosition: { x: number, y: number } = { x: -1, y: -1 };
                let deltaX = featureAPosition.x - featureBPosition.x;
                let deltaY = featureAPosition.y - featureBPosition.y;
                let t = deltaX / deltaY;
                //equations
                // let x = toObjectProps.left + deltaX * t;
                // let y = toObjectProps.top + deltaY * t;

                let x0 = featureBPosition.x;
                let y0 = featureBPosition.y;

                let x1 = toObjectProps.left;
                let y1 = toObjectProps.top + toObjectProps.height;

                let x2 = toObjectProps.left + toObjectProps.width;
                let y2 = toObjectProps.top;

                let eX = deltaX > 0 ? x2 : x1;
                let eY = deltaY <= 0 ? y2 : y1;

                if (deltaX === 0) {
                    arrowPosition = { x: x0, y: eY };
                } else if (deltaY === 0) {
                    arrowPosition = { x: eX, y: y0 };
                } else {
                    let tX = (eX - x0) / deltaX; //x0
                    let tY = (eY - y0) / deltaY; //y0
                    if (Math.abs(tX) <= Math.abs(tY)) { //meet vertical edge first
                        //return cx = ex, cy = y0 + tx * vy
                        // arrowPosition = {x: eX, y: y0 + (tX * deltaY)};
                        arrowPosition = { x: eX, y: y0 + (tX * deltaY) };
                    } else {
                        arrowPosition = { x: x0 + (tY * deltaX), y: eY };
                    }
                    // console.log("arrow_" + from + "_" + to, {
                    //     featureAPosition: featureAPosition,
                    //     featureBPosition: featureBPosition,
                    //     fromObjectProps: fromObjectProps,
                    //     toObjectProps: toObjectProps,
                    //     "deltaX, deltaY": { deltaX, deltaY },
                    //     "x0,y0": { x0, y0 },
                    //     "x1,y1": { x1, y1 },
                    //     "x2,y2": { x2, y2 },
                    //     "eX, eY": { eX, eY },
                    //     "tX, tY": { tX, tY },
                    //     "tX <= tY": (Math.abs(tX) <= Math.abs(tY) ? true : false),
                    //     "tY * deltaX": tY * deltaX,
                    //     "cX, cY": arrowPosition
                    // })
                }
                const params = { from: { ...featureAPosition }, to: { ...featureBPosition }, target: { height: toObjectProps.height, width: toObjectProps.width }, arrow: { ...arrowPosition } };
                return <Arrow key={"arrow_" + index + arrowKey++} id={"arrow_" + from + "_" + to} refz={(element: HTMLElement | null) => setRef(element, "arrow_" + from + "_" + to)} arrowParams={params} />
            }
        })
    };
    render() {
        const node = this.state.node;
        return <React.Fragment>
            {this.drawArrows(node)}
        </React.Fragment>
    }
}
