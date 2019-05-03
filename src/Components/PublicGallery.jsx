/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';
import { Map } from 'immutable';

import App from './App';
import Gallery from './Gallery';
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

  render() {
    const { gallery } = this.props;

    if (gallery.size === 0) {
      return <center><h3>Loading...</h3></center>;
    }
    return (
      <App activeView="gallery" {...this.props} >
        <div style={style.canvas}>
          <Gallery gallery={gallery} />
        </div>
      </App>
    );
  }
}

export default connect(
  (state => ({ gallery: state.gallery })), 
  { loadGallery }
)(PublicGallery);
