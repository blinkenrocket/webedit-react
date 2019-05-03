/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';
import type { Map } from 'immutable';
import { Avatar, Divider, List, ListItem, Paper } from 'material-ui';
import AddIcon from '@material-ui/icons/Add';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import AnimationInMenu from './AnimationInMenu';
import { newAnimation, addAnimation, removeAnimation } from 'Actions/animations';
import type { Animation } from 'Reducer';

type Props = {
  animations?: Map<string, Animation>,
  addAnimation: typeof addAnimation,
};

const style = {
  wrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    width: '100%',
  }
};

class Menu extends React.Component<Props> {

  constructor(props) {
    super(props);
    const { animations } = this.props;
    var animation;
    if(animations.toList().size == 0) {
      this.props.addAnimation(newAnimation('text', 'blinkenrocket.com'));
    }
  }

  handleRemove = (animationId) => (
    this.props.removeAnimation(animationId, this.props.uid)
  )

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
            primaryText={'Gallery'}
            style={(this.props.active === 'gallery') ? { backgroundColor: '#e0e0e0' } : {}}
            onClick={() => this.props.navigate('/gallery')}
          />
          <Divider />
          {animations
            .map(animation => (
              <AnimationInMenu
                selected={this.props.active === 'webedit' && animation.id === this.props.currentAnimationId}
                key={animation.creationDate}
                animation={animation}
                onClick={() => { this.props.navigate(`/${animation.id}`) }}
                onRemove={this.handleRemove}
              />
            ))
            .toList()
            .toArray()}
        </List>
      </Paper>
    );
  }
}

export default connect(
  state => ({
    uid: state.uid,
    animations: state.animations,
  }),
  { addAnimation, removeAnimation }
)(Radium(Menu));
