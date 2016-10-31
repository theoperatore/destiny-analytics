import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { line } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

import './lineChart.css';

const marginBottom = 50;
const marginTop = 10;
const marginLeft = 75;
const marginRight = 10;

export default class LineChart extends Component {
  static defaultProps = {
    width: 650,
    height: 400,
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const { width, height } = findDOMNode(this.svg).getBoundingClientRect();
    this.setState({ width, height });
  }

  componentWillUpdate(nextProps, nextState) {
    const { width, height } = nextState;
    const {
      startTime,
      endTime,
      highestKd,
      lowestKd,
    } = this.extent();

    const computedWidth = width - marginLeft - marginRight;
    const computedHeight = height - marginTop - marginBottom;

    this.widthScale = (!this.widthScale && width !== 0)
      ? scaleTime()
          .range([marginLeft, computedWidth])
          .domain([startTime, endTime])
      : this.widthScale
          .range([marginLeft, computedWidth])
          .domain([startTime, endTime]);

    this.heightScale = (!this.heightScale && height !== 0)
      ? scaleLinear()
          .range([computedHeight, marginTop])
          .domain([lowestKd - (lowestKd * 0.01), highestKd + (highestKd * 0.01)])
      : this.heightScale
          .range([computedHeight, marginTop])
          .domain([lowestKd - (lowestKd * 0.01), highestKd + (highestKd * 0.01)]);

    this.pathGen = !this.pathGen
      ? line()
        .x(snapshot => this.widthScale(+new Date(snapshot.timestamp)))
        .y(snapshot => this.heightScale(snapshot.characterStats.pvp[0].kd))
      : this.pathGen
        .x(snapshot => this.widthScale(+new Date(snapshot.timestamp)))
        .y(snapshot => this.heightScale(snapshot.characterStats.pvp[0].kd));

    this.xAxis = axisBottom(this.widthScale);
    this.yAxis = axisLeft(this.heightScale);
  }

  componentDidUpdate() {
    const xAxis = select(findDOMNode(this.xAxisRef));
    const yAxis = select(findDOMNode(this.yAxisRef));
    this.xAxis(xAxis);
    this.yAxis(yAxis);
  }

  extent() {
    let startTime = new Date().toISOString();
    let endTime = new Date(new Date().setYear(1973)).toISOString();
    let highestKd = -Infinity;
    let lowestKd = Infinity;

    this.props.snapshots.forEach(snapshot => {
      startTime = snapshot.timestamp < startTime
        ? snapshot.timestamp
        : startTime;
      endTime = snapshot.timestamp > endTime
        ? snapshot.timestamp
        : endTime;

      highestKd = Math.max(highestKd, snapshot.characterStats.pvp[0].kd);
      lowestKd = Math.min(lowestKd, snapshot.characterStats.pvp[0].kd);
    });

    return {
      startTime: +new Date(startTime),
      endTime: +new Date(endTime),
      highestKd,
      lowestKd,
    }
  }

  render() {
    const d = this.pathGen && this.pathGen(this.props.snapshots);

    return <svg
      className='linechart'
      ref={ref => this.svg = ref}
      width={this.props.width}
      height={this.props.height}
    >
      <g
      >
        <path
          d={d}
          strokeWidth={2}
          stroke='skyblue'
          style={{ fill: 'none' }}
          strokeLinecap="round"
        />
        <g ref={ref => this.yAxisRef = ref} transform={`translate(${marginLeft}, 0)`}/>
        <g ref={ref => this.xAxisRef = ref} transform={`translate(0, ${this.state.height - marginBottom - marginTop})`} />
      </g>
      <text
          transform={`translate(10, ${(this.state.height) / 2})rotate(-90)`}
        >{this.props.yLabel}</text>
        <text
          transform={`translate(${this.state.width / 2}, ${this.state.height})`}
        >{this.props.xLabel}</text>
    </svg>
  }
}