/* @flow */
import React from 'react';
import Radium from 'radium';
import { Map } from 'immutable';

import GalleryItem from './GalleryItem';

const style = {
  gallery: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
};

type Props = {
  gallery: Map<string, Animation>,
};

@Radium
export default class Gallery extends React.Component<Props, State> {
  static defaultProps = {
    gallery: new Map()
  };

  render() {
    const { gallery } = this.props;

    return (
      <div style={style.gallery}>
        { gallery.valueSeq().map((animation) => 
          <GalleryItem 
            key={ animation.id }
            animation={ animation } 
            size="gallery"
          />
        )}
      </div>
    );
  }
}
