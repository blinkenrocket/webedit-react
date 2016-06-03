import React from 'react';
import { connect } from 'react-redux';
import TextEditor from './TextEditor';
import PixelEditor from './PixelEditor';


type Props = {
  selectedAnimation: ?Animation,
}

/*::`*/
@connect(state => ({
  selectedAnimation: state.selectedAnimation,
}))
export default class Editor extends React.Component {
  props: Props;
  render() {
    const { selectedAnimation } = this.props;
    if (!selectedAnimation) {
      return (<div></div>);
    }
    switch (selectedAnimation.type) {
      case 'text':
      return (<TextEditor animation={selectedAnimation}/>);
      case 'pixel':
      return (<PixelEditor animation={selectedAnimation}/>);
      default: return null;
    }
  }
}
