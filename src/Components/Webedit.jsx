/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import App from './App';
import TextEditor from './TextEditor';
import PixelEditor from './PixelEditor';
import type { Animation } from '../Reducer';
import { updateAnimation } from 'Actions/animations';

type Props = {
  uid?: string,
  animations: Array<Animation>,
  routeParams: object,
  updateAnimation: typeof updateAnimation
};

class Webedit extends React.Component<Props, State> {

  handleUpdate = (animation) => (
    this.props.updateAnimation(this.props.uid, animation)
  )

  render() {
    const { animations } = this.props;
    const id = this.props.routeParams['animationId'];
    const animation = (id) ? animations.get(id) : animations.first();
    let element;
    if (!animation) {
      element = <div></div>;
    } else if (animation.type === 'text') {
      element = <TextEditor animation={ animation } onUpdate={ this.handleUpdate } />;
    } else if (animation.type === 'pixel') {
      element = <PixelEditor animation={ animation } onUpdate={ this.handleUpdate } />;
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
  uid: state.uid,
  animations: state.animations,
}), {
  updateAnimation
})(Webedit);
