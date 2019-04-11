// @flow
import { Avatar, ListItem } from 'material-ui';
import { connect } from 'react-redux';
import { removeAnimation, selectAnimation } from 'Actions/animations';
import { t } from 'i18next';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import NotificationMms from 'material-ui/svg-icons/notification/mms';
import NotificationSms from 'material-ui/svg-icons/notification/sms';
import Radium from 'radium';
import React from 'react';
import type { Animation } from 'Reducer';

type Props = {
  animation: Animation,
  selected: boolean,
  removeAnimationAction: typeof removeAnimation,
  selectAnimationAction: typeof selectAnimation,
};

@Radium
class AnimationInMenu extends React.Component<Props> {
  selectAnimation = () => {
    const { animation, selectAnimationAction } = this.props;

    selectAnimationAction(animation);
  };
  removeAnimation = (e: SyntheticMouseEvent<*>) => {
    const { animation, removeAnimationAction } = this.props;

    removeAnimationAction(animation.id);
    e.stopPropagation();
  };
  render() {
    const { animation, selected } = this.props;

    return (
      <ListItem
        leftAvatar={<Avatar icon={animation.type === 'pixel' ? <NotificationMms /> : <NotificationSms />} />}
        rightIcon={<ActionDeleteForever onClick={this.removeAnimation} />}
        primaryText={animation.name}
        secondaryText={animation.type === 'pixel' ? t('animation.animation') : t('animation.text')}
        onClick={this.selectAnimation}
        style={selected ? { backgroundColor: '#e0e0e0' } : {}}
      />
    );
  }
}

export default connect(null, {
  removeAnimationAction: removeAnimation,
  selectAnimationAction: selectAnimation,
})(AnimationInMenu);
