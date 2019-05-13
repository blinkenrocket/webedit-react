/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UUID from 'uuid-js';
import { t } from 'i18next';
import Radium from 'radium';
import { Map } from 'immutable';

import App from './App';
import Gallery from './Gallery';
import { addAnimation } from '../Actions/animations';
import { loadGallery } from '../Actions/gallery';

const style = {
  canvas: {
    padding: '20px',
  },
};

type Props = {
  width: number,
  gallery: Map<string, Animation>,
};

@Radium
class PublicGallery extends React.Component<Props, State> {
  static defaultProps = {
    gallery: new Map()
  };

  componentDidMount() {
    if (this.props.gallery.size === 0) {
      this.props.loadGallery();
    }
  }

  copyAnimationToLibrary = (animation) => {
    const cleaned = Object.assign({}, animation,
      {
        id: UUID.create().toString(),
        author: undefined,
        animation: { ...animation.animation }
      }
    );

    this.props.addAnimation(animation, this.props.uid);
  }

  render() {
    const gallery = this.props.gallery.valueSeq().sortBy(a => a.creationDate).reverse();

    if (gallery.size === 0) {
      return <center><h3>Loading...</h3></center>;
    }
    return (
      <App activeView="gallery" {...this.props} >
        <div style={style.canvas}>
          <Gallery 
            gallery={gallery} 
            clickLabel={ t('admin_gallery.copy_animation') }
            onClick={this.copyAnimationToLibrary}
          />
        </div>
      </App>
    );
  }
}

export default connect(
  (state => ({ 
    uid: state.uid,
    gallery: state.gallery 
  })), 
  { addAnimation, loadGallery }
)(PublicGallery);
