/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import App from './App';
import TextEditor from './TextEditor';
import PixelEditor from './PixelEditor';
import ShareWidget from './ShareWidget';
import type { Animation } from '../Reducer';
import { updateAnimation } from 'Actions/animations';

type Props = {
  uid?: string,
  animations: Array<Animation>,
  routeParams: object,
  updateAnimation: typeof updateAnimation
};

type State = {
  sharing?: Animation,
};

class Webedit extends React.Component<Props, State> {
  state: State = {
    sharing: null
  };

  handleUpdate = (animation) => (
    this.props.updateAnimation(animation, this.props.uid)
  )

  handleShare = (animation) => {
    this.setState({sharing: animation});
  };

  render() {
    const { animations } = this.props;
    const id = this.props.routeParams['animationId'];
    const animation = (id) ? animations.get(id) : animations.first();
    let element;
    if (!animation) {
      element = <div></div>;
    } else if (animation.type === 'text') {
      element = <TextEditor animation={ animation } onUpdate={ this.handleUpdate } onShare={ this.handleShare }/>;
    } else if (animation.type === 'pixel') {
      element = <PixelEditor animation={ animation } onUpdate={ this.handleUpdate } onShare={ this.handleShare }/>;
    }

    return (
      <App 
        activeView="webedit" 
        currentAnimationId={id}
        {...this.props}
      >
        { element }
        <ShareWidget 
          animation={ this.state.sharing } 
          close={ () => this.setState({sharing: null}) }
        />
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
