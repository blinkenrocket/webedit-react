import React from 'react';
import { autobind } from 'core-decorators';
import { t } from 'i18next';
import { selectAnimation, removeAnimation } from 'Actions/animations';
import Radium from 'radium';
import { FontIcon, ListItem, Avatar } from 'material-ui';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import NotificationSms from 'material-ui/svg-icons/notification/sms';
import NotificationMms from 'material-ui/svg-icons/notification/mms';

type Props = {
  animation: Animation,
  selected: bool,
}

const style = {
  root: {
    backgroundColor: '#000',
  },
};

/*::`*/
@Radium
/*::`*/
export default class AnimationInMenu extends React.Component {
  props: Props;
  @autobind
  selectAnimation() {
    const { animation } = this.props;
    selectAnimation(animation);
  }
  @autobind
  removeAnimation(e: SyntheticMouseEvent) {
    const { animation } = this.props;
    removeAnimation(animation.id);
    e.stopPropagation();
  }
  render() {
    const { animation, selected } = this.props;
    return (
      <ListItem
        leftAvatar={<Avatar icon={(animation.type === 'pixel') ? <NotificationMms /> : <NotificationSms />} />}
        rightIcon={<ActionDeleteForever onClick={this.removeAnimation}/>}
        primaryText={animation.name}
        secondaryText={(animation.type === 'pixel') ? t('animation.animation') : t('animation.text')}
        onTouchTap={this.selectAnimation}
        style={selected && { backgroundColor: '#e0e0e0' }} />
    );
  }
}
