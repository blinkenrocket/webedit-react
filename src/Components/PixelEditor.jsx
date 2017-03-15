import React from 'react';
import { TextField, Slider, FlatButton } from 'material-ui';
import { updateAnimation } from 'Actions/animations';
import PixelPreview from './PixelPreview';
import { autobind } from 'core-decorators';
import { t } from 'i18next';
import Radium from 'radium';
import AvSkipNext from 'material-ui/svg-icons/av/skip-next';
import AvSkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import ContentContentCopy from 'material-ui/svg-icons/content/content-copy';
import { MAX_ANIMATION_FRAMES } from '../variables';
import { List } from 'immutable';
import { range } from 'lodash';

const style = {
  noShrink: {
    flexShrink: 0,
  },
  wrapper: {
    display: 'inline-flex',
    flex: '1 1 0',
    flexDirection: 'column',
    overflowX: 'auto',
    overflowY: 'auto',
    padding: 20,
    cursor: 'default',
  },
  buttonWrapper: {
    marginBottom: 15,
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  },
  slider: {
    marginTop: 0,
    marginBottom: 0,
    flex: '1 1 0',
    marginLeft: 15,
    marginRight: 15,
  },
};

const MOUSE_MODE_NOTHING = 'MOUSE_MODE_NOTHING';
const MOUSE_MODE_PAINT = 'MOUSE_MODE_PAINT';
const MOUSE_MODE_ERASE = 'MOUSE_MODE_ERASE';

type Props = {
  animation: Animation,
}

type State = {
  mouseMode: string,  
}

const EMPTY_DATA = List(range(8).map(() => 0x00));

/*::`*/
@Radium
/*::`*/
export default class PixelEditor extends React.Component {
  props: Props;

  state: State = {
    mouseMode: MOUSE_MODE_NOTHING,
  };

  componentWillMount() {
    const { animation } = this.props;
    updateAnimation(Object.assign({}, animation, {
      animation: {
        data: List(animation.animation.data),
        currentFrame: 0,
        length: animation.animation.length,
        frames: animation.animation.frames,
      },
    }));
  }

  handleChange(prop: string, e: SyntheticKeyboardEvent) {
    const { animation } = this.props;
    updateAnimation(Object.assign({}, animation, {
      [prop]: e.target.value,
    }));
  }
  @autobind
  handleSpeedChange(e: SyntheticEvent, value: number) {
    const { animation } = this.props;
    updateAnimation(Object.assign({}, animation, {
      speed: value,
    }));
  }
  @autobind
  handleDelayChange(e: SyntheticEvent, value: number) {
    const { animation } = this.props;
    updateAnimation(Object.assign({}, animation, {
      delay: value,
    }));
  }
  @autobind
  handleRepeatChange(e: SyntheticEvent, value: number) {
    const { animation } = this.props;
    updateAnimation(Object.assign({}, animation, {
      repeat: value,
    }));
  }

  @autobind
  handleNextFrame() {
    const { animation } = this.props;
    // check whether next frame would violate the MAX_ANIMATION_FRAMES limit
    if (animation.animation.currentFrame + 1 === MAX_ANIMATION_FRAMES - 1) {
      return;
    }
    // check whether the next frame would cross boundary
    if (animation.animation.currentFrame + 1 >= animation.animation.frames) {
      updateAnimation(Object.assign({}, animation, {
        animation: {
          data: animation.animation.data.concat(EMPTY_DATA),
          currentFrame: animation.animation.currentFrame + 1,
          length: animation.animation.length + 1,
          frames: animation.animation.frames + 1,
        },
      }));
    } else {
      // boundary not crossed, just forward the frame
      updateAnimation(Object.assign({}, animation, {
        animation: {
          data: animation.animation.data,
          currentFrame: animation.animation.currentFrame + 1,
          length: animation.animation.length,
          frames: animation.animation.frames,
        },
      }));
    }
  }

  @autobind
  handlePreviousFrame() {
    const { animation } = this.props;
    // check whether we would go minus...
    if (animation.animation.currentFrame - 1 < 0) {
      return;
    }
    updateAnimation(Object.assign({}, animation, {
        animation: {
          data: animation.animation.data,
          currentFrame: animation.animation.currentFrame - 1,
          length: animation.animation.length,
          frames: animation.animation.frames,
        },
      }));
  }

  @autobind
  handleDeleteFrame() {
    const { animation } = this.props;
    let newdata;

    // If user removes the first frame and it is the only frame
    if (animation.animation.currentFrame === 0 && animation.animation.frames === 1) {
      newdata = animation.animation.data = EMPTY_DATA;
      updateAnimation(Object.assign({}, animation, {
          animation: {
            data: newdata,
            currentFrame: 0,
            length: animation.animation.length,
            frames: animation.animation.frames,
          },
        }));
        return;
    }
  
    // create new data:
    // 1. everything up to current Frame:
    newdata = animation.animation.data.slice(0, 8 * animation.animation.currentFrame);
    // 2. add everything to until the end
    newdata = newdata.concat(animation.animation.data.skip(8 * animation.animation.currentFrame + 8));

    const newCurrentFrame = (animation.animation.currentFrame === 0) ? 0 : animation.animation.currentFrame - 1;
    updateAnimation(Object.assign({}, animation, {
        animation: {
          data: newdata,
          currentFrame: newCurrentFrame,
          length: animation.animation.length - 1,
          frames: animation.animation.frames - 1,
        },
      }));
  }

  @autobind
  handleCopyFrame() {
    const { animation } = this.props;
    // check whether another frame would violate the MAX_ANIMATION_FRAMES limit
    if (animation.animation.currentFrame + 1 === MAX_ANIMATION_FRAMES - 1) {
      return;
    }

    // 1. get current frame data
    const currentFrameData = animation.animation.data.slice(8 * animation.animation.currentFrame, 8 * animation.animation.currentFrame + 8);

    // 2. add everything up including the current frame
    let newdata = animation.animation.data.slice(0, 8 * animation.animation.currentFrame + 8);

    // 3. add current frame data and everything until the end
    newdata = newdata.concat(currentFrameData, animation.animation.data.skip(8 * animation.animation.currentFrame + 8));

    updateAnimation(Object.assign({}, animation, {
      animation: {
        data: newdata,
        currentFrame: animation.animation.currentFrame + 1,
        length: animation.animation.length + 1,
        frames: animation.animation.frames + 1,
      },
    }));

  }

  /*eslint-disable no-unused-vars */
  @autobind
  mouseDown(y, x) {
    // console.log('mouseDown', y, x);
    const isOn = this.animationPointIsOn(y, x);

    // If current point is (was) on, set to erase mode
    this.setState({ mouseMode: isOn ? MOUSE_MODE_ERASE : MOUSE_MODE_PAINT });

    // console.log('mouseMode:', this.state.mouseMode);
    this.setAnimationPoint(y, x, !isOn);
  }

  @autobind
  mouseUp(y, x) {
    // console.log('mouseUpX', y, x);
    this.setState({ mouseMode: MOUSE_MODE_NOTHING });
  }

  @autobind
  mouseOver(y, x) {
    // console.log('mouseOver', y, x, this.state.mouseMode);
    if (this.state.mouseMode !== MOUSE_MODE_NOTHING) {
      this.setAnimationPoint(y, x, this.state.mouseMode === MOUSE_MODE_PAINT);
    }
  }

  animationPointIsOn(y, x) {
    const { animation } = this.props;
    animation.animation.data = List(animation.animation.data);
    const column = animation.animation.data.get(8 * animation.animation.currentFrame + x);
    const bitIndex = 7 - y;
    // console.log('bitIndex:', bitIndex);
    /*eslint-disable no-bitwise */
    const wasOn = column & 1 << bitIndex;
    // console.log('isOnBefore:', wasOn);
    return wasOn;
  }

  setAnimationPoint(y, x, isOn) {
    const { animation } = this.props;
    animation.animation.data = List(animation.animation.data);
    let column = animation.animation.data.get(8 * animation.animation.currentFrame + x);
    const bitIndex = 7 - y;

    if (isOn) {
      column |= (1 << bitIndex);
    } else {
      column &= ~(1 << bitIndex);
    }

    animation.animation.data = animation.animation.data.set(8 * animation.animation.currentFrame + x, column);

    updateAnimation(Object.assign({}, animation, {
      animation: {
        data: animation.animation.data,
        currentFrame: animation.animation.currentFrame,
        length: animation.animation.length,
        frames: animation.animation.frames,
      },
    }));

  }

  render() {
    const { animation } = this.props;

    let pixelPreviewCursor = 'auto';
    if (this.state.mouseMode === MOUSE_MODE_PAINT) {
      pixelPreviewCursor = 'pointer';
    } else if (this.state.mouseMode === MOUSE_MODE_ERASE) {
      pixelPreviewCursor = 'crosshair';
    }

    return (
      <div style={style.wrapper}>
          Frame {animation.animation.currentFrame + 1} / {animation.animation.frames}
        <PixelPreview 
          cursor={pixelPreviewCursor}
          data={animation.animation.data}
          frame={animation.animation.currentFrame}
          mouseDownCallback={this.mouseDown.bind(this)}
          mouseUpCallback={this.mouseUp.bind(this)}
          mouseOverCallback={this.mouseOver.bind(this)} />
        <div style={style.buttonWrapper}>
          <FlatButton
            label={t('pixelEditor.previousFrame')}
            labelPosition="after"
            primary
            onClick={this.handlePreviousFrame}
            style={style.buttons}
            icon={<AvSkipPrevious />} />
          <FlatButton
            primary
            onClick={this.handleDeleteFrame}
            style={style.buttons}
            icon={<ActionDeleteForever />} />
          <FlatButton
            primary
            onClick={this.handleCopyFrame}
            style={style.buttons}
            icon={<ContentContentCopy />} />
          <FlatButton
            label={t('pixelEditor.nextFrame')}
            labelPosition="before"
            primary
            onClick={this.handleNextFrame}
            style={style.buttons}
            icon={<AvSkipNext />} />
        </div>
        <TextField style={style.noShrink} id="name" ref="name" value={animation.name} onChange={this.handleChange.bind(this, 'name')}
          floatingLabelText={t('pixelEditor.name')} placeholder={t('pixelEditor.name')}/>
        <div style={[style.sliderContainer, style.noShrink]}>
          {t('pixelEditor.speed')}
          <Slider style={style.slider} value={animation.speed} step={1} min={0} max={15} onChange={this.handleSpeedChange}/>
          {animation.speed}
        </div>
        <div style={[style.sliderContainer, style.noShrink]}>
          {t('pixelEditor.delay')}
          <Slider style={style.slider} value={animation.delay} step={0.5} min={0} max={7.5} onChange={this.handleDelayChange}/>
          {animation.delay}
        </div>
        <div style={[style.sliderContainer, style.noShrink]}>
          {t('pixelEditor.repeat')}
          <Slider style={style.slider} value={animation.repeat} step={1} min={0} max={15} onChange={this.handleRepeatChange}/>
          {animation.repeat}
        </div>
      </div>
    );
  }
}
