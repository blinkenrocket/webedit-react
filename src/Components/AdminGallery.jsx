/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';

import App from './App';
import Gallery from './Gallery';
import AdminGalleryItem from './AdminGalleryItem';
import { loadGallery, loadAdminGallery, addAnimationToGallery, 
  removeAnimationFromGallery, reviewAnimation } from '../Actions/gallery';



const style = {
  canvas: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    height: '100%',
    width: '100%',
    padding: '20px',
  },
  adminGallery: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
  adminCanvas: {
    width: '50%',
    padding: '20px', 
    margin: '20px', 
    border: '1px solid goldenrod',
  },
  publicCanvas: {
    width: '50%', 
    padding: '20px', 
    margin: '20px', 
    border: '1px solid limegreen',
  },
};


type Props = {
  width: number,
  gallery: Map<string, Animation>,
  adminGallery: Map<string, Animation>
};

@Radium
class AdminGallery extends React.Component<Props, State> {
  static defaultProps = {
    gallery: new Map(),
    adminGallery: new Map()
  };
  componentDidMount() {
    this.props.loadAdminGallery();
    this.props.loadGallery();
  }

  addToGallery = (animation) => {
    this.props.addAnimationToGallery(animation);
    this.props.reviewAnimation(animation, new Date());
  }
  
  removeFromGallery = (animation) => {
    this.props.removeAnimationFromGallery(animation);
    const original = this.props.adminGallery.get(animation.originalId);
    this.props.reviewAnimation(original, null);
  }
  
  handleArchive = (animation) => {
    this.props.reviewAnimation(animation, new Date()) 
  }

  render() {
    const originalIds = this.props.gallery.valueSeq().map(anim => anim.originalId).toJS();
    const adminGallery = this.props.adminGallery.valueSeq().filter((a) => (!a.originalId) && (a.reviewedAt || -1) < (a.modifiedAt || 1));
    const gallery = this.props.gallery.valueSeq().sortBy(a => a.creationDate).reverse();

    return (
      <App 
        activeView="gallery" 
        {...this.props}
      >
        <div style={style.canvas}>
          <div style={style.adminCanvas}>
            <h2>User Animations for Review:</h2>
            <div style={style.adminGallery}>
              { adminGallery.map((animation) => 
                <AdminGalleryItem 
                  key={ animation.id }
                  animation={ animation } 
                  buttonsDisabled={ originalIds.indexOf(animation.id) > -1 }
                  handlePrimary={ this.addToGallery  }
                  handleSecondary={ this.handleArchive }
                  primaryAction="add"
                  secondaryAction="archive"
                />
              )}
            </div>
          </div>
          <div style={style.publicCanvas}>
            <h2>Public Gallery</h2>
            <Gallery gallery={gallery} onClick={this.removeFromGallery}/>
          </div>
        </div>
      </App>
    );
  }
}

export default connect(
  state => ({ 
    gallery: state.gallery, 
    adminGallery: state.adminGallery 
  }), 
  { loadGallery, loadAdminGallery, reviewAnimation, addAnimationToGallery, removeAnimationFromGallery }
)(AdminGallery);

