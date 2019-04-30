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
import AnimationPreview from './AnimationPreview';


const style = {
  itemText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
};

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
    const avatar = <AnimationPreview 
      animation={animation} 
      size="thumb" 
      offColor="black"
      style={{position: 'absolute', top: '8px', left: '16px' }}
    />
    const txt = <div style={style.itemText}>{animation.name || animation.text || '\u00A0'}</div>;
    return (
      <ListItem
        leftAvatar={avatar}
        rightIcon={<ActionDeleteForever onClick={this.removeAnimation} />}
        primaryText={txt}
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
