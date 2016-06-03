/* @flow */
import { connect } from 'react-redux';
import { List, ListItem, Divider, Paper, Avatar, Drawer, AppBar } from 'material-ui';
import Radium from 'radium';
import React from 'react';
import { autobind } from 'core-decorators';
import type { Map } from 'immutable';
import { addNewAnimation } from 'Actions/animations';
import AnimationInMenu from './AnimationInMenu';
import NotificationSms from 'material-ui/svg-icons/notification/sms';
import NotificationMms from 'material-ui/svg-icons/notification/mms';
import { t } from 'i18next';

type Props = {
  animations: Map<string, Animation>,
  selectedId: ?string,
}

const style = {
  wrap: {
    alignItems: 'center',
    display: 'flex',
    //flex: '0 0 20%',
    flexDirection: 'column',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

/*::`*/
@Radium
@connect(state => ({
  animations: state.animations,
  selectedId: state.selectedAnimation ? state.selectedAnimation.id : undefined,
}))
/*::`*/
export default class Menu extends React.Component {
  props: Props;
  @autobind
  addNewAnimationText() {
    addNewAnimation('text');
  }
  @autobind
  addNewAnimation() {
    addNewAnimation('pixel');
  }

  render() {
    const { animations, selectedId } = this.props;
    return (
        <Paper style={style.wrap}>
              <List>
                {
                  animations.map((animation, index) => (
                    <AnimationInMenu selected={animation.id === selectedId} key={animation.creationDate} animation={animation}/>
                  )).toArray()
                }
              <Divider />
                <ListItem
                  leftAvatar={<Avatar icon={<NotificationSms />} />}
                  primaryText={t('menu.addText')}
                  onTouchTap={this.addNewAnimationText} />
                <ListItem
                  leftAvatar={<Avatar icon={<NotificationMms />} />}
                  primaryText={t('menu.addAnimation')}
                  onTouchTap={this.addNewAnimation} />
              </List>
        </Paper>
    );
  }
}
