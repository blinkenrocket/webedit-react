// @flow
import { connect } from 'react-redux';
import PixelEditor from './PixelEditor';
import React from 'react';
import TextEditor from './TextEditor';
import type { Animation } from 'Reducer';

type Props = {
  selectedAnimation?: ?Animation,
};

@connect(state => ({
  selectedAnimation: state.selectedAnimation,
}))
export default class Editor extends React.Component<Props> {
  render() {
    const { selectedAnimation } = this.props;

    if (!selectedAnimation) {
      return <div />;
    }
    switch (selectedAnimation.type) {
      case 'text':
        return <TextEditor animation={selectedAnimation} />;
      case 'pixel':
        return <PixelEditor animation={selectedAnimation} />;
      default:
        return null;
    }
  }
}
