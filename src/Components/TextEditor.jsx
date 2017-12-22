// @flow
import { Divider, Slider, TextField, Toggle } from 'material-ui';
import { MAX_TEXT_LENGTH } from '../variables';
import { t } from 'i18next';
import { updateAnimation } from 'Actions/animations';
import Radium from 'radium';
import React from 'react';
import TextPreview from './TextPreview';
import type { Animation } from 'Reducer';

type Props = {
  animation: Animation,
  currentText?: ?string,
};

type State = {
  livePreview: boolean,
};

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
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 15,
  },
  slider: {
    marginTop: 0,
    marginBottom: -10,
    flex: '1 1 0',
    marginRight: 15,
  },
};

@Radium
export default class TextEditor extends React.Component<Props, State> {
  state: State = {
    livePreview: true,
  };
  handleChange(prop: string, e: SyntheticEvent<any>) {
    const { animation } = this.props;

    // $FlowFixMe
    if (e.target.value.length > MAX_TEXT_LENGTH) {
      return;
    }
    updateAnimation(
      Object.assign({}, animation, {
        // $FlowFixMe
        [prop]: e.target.value,
      })
    );
  }
  handleSpeedChange = (e: SyntheticEvent<*>, value: number) => {
    const { animation } = this.props;

    updateAnimation(
      Object.assign({}, animation, {
        speed: value,
      })
    );
  };
  handleDelayChange = (e: SyntheticEvent<*>, value: number) => {
    const { animation } = this.props;

    updateAnimation(
      Object.assign({}, animation, {
        delay: value,
      })
    );
  };
  handleRepeatChange = (e: SyntheticEvent<*>, value: number) => {
    const { animation } = this.props;

    updateAnimation(
      Object.assign({}, animation, {
        repeat: value,
      })
    );
  };
  handleDirectionChange = (e: SyntheticEvent<*>, toggled: boolean) => {
    const { animation } = this.props;

    updateAnimation(
      Object.assign({}, animation, {
        direction: toggled ? 1 : 0,
      })
    );
  };
  handlePreviewChange = (e: SyntheticEvent<*>, toggled: boolean) => {
    this.setState({
      livePreview: toggled,
    });
  };
  render() {
    const { animation } = this.props;
    const { livePreview } = this.state;

    return (
      <div style={style.wrapper}>
        <TextPreview
          delay={animation.delay}
          repeat={animation.repeat}
          rtl={animation.direction === 1}
          livePreview={livePreview}
          text={animation.text}
          speed={animation.speed}
        />
        <Divider />
        <TextField
          style={style.noShrink}
          id="text"
          value={animation.text || ' '}
          onChange={this.handleChange.bind(this, 'text')}
          floatingLabelText={t('textEditor.textPlaceholder')}
          placeholder={t('textEditor.textPlaceholder')}
          floatingLabelFixed
        />
        <TextField
          style={style.noShrink}
          id="name"
          value={animation.name}
          onChange={this.handleChange.bind(this, 'name')}
          floatingLabelText={t('textEditor.name')}
          placeholder={t('textEditor.name')}
          floatingLabelFixed
        />
        <div style={[style.sliderContainer, style.noShrink]}>
          <Slider
            description={t('textEditor.speed')}
            style={style.slider}
            value={animation.speed}
            step={1}
            min={0}
            max={15}
            onChange={this.handleSpeedChange}
          />
          {animation.speed}
        </div>
        <div style={[style.sliderContainer, style.noShrink]}>
          <Slider
            description={t('textEditor.delay')}
            style={style.slider}
            value={animation.delay}
            step={0.5}
            min={0}
            max={7.5}
            onChange={this.handleDelayChange}
          />
          {animation.delay}
        </div>
        <div style={[style.sliderContainer, style.noShrink]}>
          <Slider
            description={t('textEditor.repeat')}
            style={style.slider}
            value={animation.repeat}
            step={1}
            min={0}
            max={15}
            onChange={this.handleRepeatChange}
          />
          {animation.repeat}
        </div>
        <div style={[style.sliderContainer, style.noShrink]}>
          <Toggle
            label={t('textEditor.rtl')}
            toggled={Boolean(animation.direction)}
            onToggle={this.handleDirectionChange}
          />
        </div>
        <div style={[style.sliderContainer, style.noShrink]}>
          <Toggle label={t('textEditor.livePreview')} toggled={livePreview} onToggle={this.handlePreviewChange} />
        </div>
      </div>
    );
  }
}
