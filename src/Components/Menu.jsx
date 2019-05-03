/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';
import type { Map } from 'immutable';
import { Avatar, Divider, List, ListItem, Paper } from 'material-ui';
import AddIcon from '@material-ui/icons/Add';
import AnimationInMenu from './AnimationInMenu';
import { addNewAnimation } from 'Actions/animations';
import type { Animation } from 'Reducer';

type Props = {
  animations?: Map<string, Animation>,
  addNewAnimation: typeof addNewAnimation,
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
      this.props.addNewAnimation('text', 'blinkenrocket.com').payload;
    }
  }

  addNewAnimationText = () => {
    const { payload } = this.props.addNewAnimation('text');
    this.props.navigate(`/${payload.id}`);
  };
  addNewAnimation = () => {
    const { payload } = this.props.addNewAnimation('pixel');
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
            onClick={this.addNewAnimationText}
          />
          <ListItem
            leftAvatar={<Avatar icon={<AddIcon />} />}
            primaryText={t('menu.addAnimation')}
            onClick={this.addNewAnimation}
          />
          <Divider />
          {animations
            .map(animation => (
              <AnimationInMenu
                selected={this.props.active === 'webedit' && animation.id === this.props.currentAnimationId}
                key={animation.creationDate}
                animation={animation}
                onClick={() => { this.props.navigate(`/${animation.id}`) }}
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
    animations: state.animations,
  }),
  { addNewAnimation }
)(Radium(Menu));
