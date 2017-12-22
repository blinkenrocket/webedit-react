/* @flow */
import { addNewAnimation } from 'Actions/animations';
import { Avatar, Divider, List, ListItem, Paper } from 'material-ui';
import { connect } from 'react-redux';
import { t } from 'i18next';
import AnimationInMenu from './AnimationInMenu';
import NotificationMms from 'material-ui/svg-icons/notification/mms';
import NotificationSms from 'material-ui/svg-icons/notification/sms';
import Radium from 'radium';
import React from 'react';
import type { Animation } from 'Reducer';
import type { Map } from 'immutable';

type Props = {
  animations?: Map<string, Animation>,
  selectedId?: ?string,
  addNewAnimationAction: typeof addNewAnimation,
};

const style = {
  wrap: {
    alignItems: 'center',
    display: 'flex',
    // flex: '0 0 20%',
    flexDirection: 'column',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

class Menu extends React.Component<Props> {
  addNewAnimationText = () => {
    this.props.addNewAnimationAction('text');
  };
  addNewAnimation = () => {
    this.props.addNewAnimationAction('pixel');
  };

  render() {
    const { animations, selectedId } = this.props;

    if (!animations) {
      return null;
    }

    return (
      <Paper style={style.wrap}>
        <List>
          {animations
            .map(animation => (
              <AnimationInMenu
                selected={animation.id === selectedId}
                key={animation.creationDate}
                animation={animation}
              />
            ))
            .toList()
            .toArray()}
          <Divider />
          <ListItem
            leftAvatar={<Avatar icon={<NotificationSms />} />}
            primaryText={t('menu.addText')}
            onTouchTap={this.addNewAnimationText}
          />
          <ListItem
            leftAvatar={<Avatar icon={<NotificationMms />} />}
            primaryText={t('menu.addAnimation')}
            onTouchTap={this.addNewAnimation}
          />
        </List>
      </Paper>
    );
  }
}

export default connect(
  state => ({
    animations: state.animations,
    selectedId: state.selectedAnimation ? state.selectedAnimation.id : undefined,
  }),
  {
    addNewAnimationAction: addNewAnimation,
  }
)(Radium(Menu));
