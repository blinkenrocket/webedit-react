/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';
import type { Map } from 'immutable';
import Button from '@material-ui/core/Button';
import { Avatar, Divider, List, ListItem, Paper } from 'material-ui';
import AddIcon from '@material-ui/icons/Add';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import AnimationInMenu from './AnimationInMenu';
import { newAnimation, addAnimation, removeAnimation, reset } from 'Actions/animations';
import type { Animation } from 'Reducer';
import { INITIAL_ANIMATION_TEXT } from '../variables';

type Props = {
  animations?: Map<string, Animation>,
  addAnimation: typeof addAnimation,
  removeAnimation: typeof removeAnimation,
  reset: typeof reset,
};

const style = {
  wrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    width: '100%',
  },
  reset: {
    width: '100%', 
    marginTop: '30px', 
    minHeight: '34px', 
    color: '#da1616'
  }
};

class Menu extends React.Component<Props> {

  constructor(props) {
    super(props);
    const { animations } = this.props;
    var animation;
    if(animations.toList().size == 0) {
      this.props.addAnimation(newAnimation('text', INITIAL_ANIMATION_TEXT));
    }
  }

  handleRemove = (animationId) => (
    this.props.removeAnimation(animationId, this.props.uid)
  )
  
  handleReset = () => {
    if (confirm(t('menu.newWarning'))) {
      this.props.reset();
      this.props.navigate('/');
    }
  };

  addTextAnimation = () => {
    const { payload } = this.props.addAnimation(newAnimation('text'));
    this.props.navigate(`/${payload.id}`);
  };
  addPixelAnimation = () => {
    const { payload } = this.props.addAnimation(newAnimation('pixel'));
    this.props.navigate(`/${payload.id}`);
  };

  render() {
    const { animations } = this.props;

    return (
      <Paper style={style.wrap}>
        <List style={style.list}>
          <ListItem
            leftAvatar={<Avatar icon={<AddIcon />} />}
            primaryText={t('menu.addText')}
            onClick={this.addTextAnimation}
          />
          <ListItem
            leftAvatar={<Avatar icon={<AddIcon />} />}
            primaryText={t('menu.addAnimation')}
            onClick={this.addPixelAnimation}
          />
          <ListItem
            leftAvatar={<Avatar icon={<ImagePhotoLibrary />} />}
            primaryText={t('menu.gallery')}
            style={(this.props.active === 'gallery') ? { backgroundColor: '#e0e0e0' } : {}}
            onClick={() => this.props.navigate('/gallery')}
          />
          {this.props.admin && 
          <ListItem
            leftAvatar={<Avatar icon={<ImagePhotoLibrary />} />}
            primaryText={t('menu.admin_gallery')}
            style={(this.props.active === 'admingallery') ? { backgroundColor: '#e0e0e0' } : {}}
            onClick={() => this.props.navigate('/gallery/admin')}
          />
          }
          <Divider />
          {animations
            .map(animation => (
              <AnimationInMenu
                selected={this.props.active === 'webedit' && animation.id === this.props.currentAnimationId}
                key={animation.id}
                animation={animation}
                onClick={() => { this.props.navigate(`/${animation.id}`) }}
                onRemove={this.handleRemove}
              />
            ))
            .toList()
            .toArray()}
          <Divider />
          { !this.props.uid && 
          <Button
             size="small"
             style={style.reset}
             onClick={this.handleReset}
           >
            { t('menu.clear_library') }
           </Button>
          }
        </List>
      </Paper>
    );
  }
}

export default connect(
  state => ({
    uid: state.uid,
    admin: state.admin,
    animations: state.animations,
  }),
  { addAnimation, removeAnimation, reset }
)(Radium(Menu));
