/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import App from './App';
import TextEditor from './TextEditor';
import PixelEditor from './PixelEditor';
import type { Animation } from '../Reducer';

type Props = {
  animations: Array<Animation>,
  routeParams: object,
};

class Webedit extends React.Component<Props, State> {
  render() {
    const { animations } = this.props;
    const id = this.props.routeParams['animationId'];
    const animation = (id) ? animations.get(id) : animations.first();
    let element;
    if (!animation) {
      element = <div></div>;
    } else if (animation.type === 'text') {
      element =  <TextEditor animation={animation} />;
    } else if (animation.type === 'pixel') {
      element = <PixelEditor animation={animation} />;
    }

    return (
      <App 
        activeView="webedit" 
        currentAnimationId={id}
        {...this.props}
      >
        { element }
      </App>
    );
  }
}

export default connect(state => ({
  animations: state.animations,
}))(Webedit);
