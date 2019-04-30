// @flow
import React from 'react';
import { numFrames, lastFrameIndex, getFrameColumns } from '../utils';
import Frame from './Frame';
import type { Animation } from '../Reducer';

type Props = {
  animation: Animation
};

type State = {
  currentFrame: number
};

const style = {
  flexShrink: 0,
  overflow: 'auto',
  cursor: 'default',

  // avoid dragging the whole preview in FireFox
  UserSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
};


export default class AnimationPreview extends React.Component<Props, State> {
  state = { currentFrame: 0 }
  rAF: any;

  componentDidMount() {
    this.resetLoop();
  }

  componentDidUpdate(prevProps) {
    const { 
      speed,
      delay,
      direction,
      text,
      animation: {
        frames
      }
    } = this.props.animation;

    // reset the animation for changes to the Animation, 
    // but ignore state-changes
    if ( prevProps.animation.speed !== speed
      || prevProps.animation.delay !== delay
      || prevProps.animation.direction !== direction
      || prevProps.animation.text !== text
      || prevProps.animation.animation.frames !== frames
    ) {
      this.resetLoop();
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rAF);
  }

  resetLoop = () => {
    // cleanup old request
    window.cancelAnimationFrame(this.rAF);
    const frames = numFrames(this.props.animation);
    if (frames === 0) {
      // no frames, no loops
      return;
    }

    // prepare and kick off rAF handler
    const { direction, delay, speed } = this.props.animation;
    const msPerFrame = 1000 / (1 / (0.002048 * (250 - 16 * (speed || 1))));
    let nextUpdate = new Date().getTime();

    const loop = () => {
      if (nextUpdate > new Date().getTime()) {
        // no changes, check again later
        this.rAF = window.requestAnimationFrame(loop);
        return 
      } 
      const nextFrame = (this.state.currentFrame + (direction ? -1 : 1)) % frames;
      
      const now = new Date().getTime();
      let offset = msPerFrame;
      // set timing for next animation-frame
      if (nextFrame === lastFrameIndex(this.props.animation) && delay > 0) {
        offset = (delay * 1000);
      }       
      nextUpdate += offset;
      if (nextUpdate < now) {
        // the browser will stop AF requests when the tab is idle/inactive. 
        // this condition avoids having a sped up animation after inactivity,
        // due to the timer being way in the past
        nextUpdate = now + offset;
      } 
      // step to next Frame
      this.setState({ currentFrame: nextFrame});
      this.rAF = window.requestAnimationFrame(loop);
    }
    this.rAF = window.requestAnimationFrame(loop);
  }

  render() {
    const columns = getFrameColumns(this.props.animation, this.state.currentFrame)

    return <Frame 
      columns={columns} 
      size={this.props.size} 
      offColor={this.props.offColor} 
      style={style} 
      />
  }
}

