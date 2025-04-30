import React from 'react';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { View, Text } from 'react-native';

export interface ExpoStepSliderState {
  sliderValue: number;
}

export interface ExpoStepSliderProps {
  min: number;
  max: number;
  steps: number[];
}

export class ExpoStepSlider extends React.Component<ExpoStepSliderProps, ExpoStepSliderState> {
  constructor(props: ExpoStepSliderProps){
    super(props);
    this.state = {
      sliderValue: 50
    }
  }
  
  public render() {
    let [points, sliderTransform] = scaleTransform(this.props.min, this.props.max, this.props.steps);
    console.log(points);
    return (
      <View>
        <Text>output: {sliderTransform(this.state.sliderValue)}</Text>
        <Slider
          value={this.state.sliderValue}
          onChange={(e)=> this.setState({sliderValue: Number(e)})}
          min={0}
          max={points}
        />
      </View>
    );
  }
}


//  "exponential step" curry function
//   return tuple where 
//   [0] is the number of inputs we need our slider to have
//   [1] is our output transform function
function scaleTransform(min: number, max: number, intervals: number[]): [number, (input: number) => number] {

  //determine how many "points" we need
  let distributions = intervals.length;
  let descretePoints = Math.ceil(
    (max - min) / intervals.reduce((total, step) => total + step / distributions, 0)
  );

  return [
    descretePoints,
    (input: number) => {
      let stepTransforms = intervals.map((s, i) => {
        let setCount = Math.min(Math.ceil(input - (descretePoints * i / distributions)), Math.round(descretePoints / distributions));
        return setCount > 0 ? setCount * s : 0;
      });

      let lastStep = 0;
      let out = Math.round(stepTransforms.reduce((total, num, i) => {
        if (num) {
          lastStep = i;
        }
        return total + num;
      })) + min;

      let currentUnit = intervals[lastStep];
      return Math.min(
        Math.round((out / currentUnit)) * currentUnit,  //round to nearest step
        max
      );
    }
  ]
}