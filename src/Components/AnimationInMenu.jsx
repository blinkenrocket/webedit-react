// @flow
import React from 'react';
import Radium from 'radium';
import { ListItem } from 'material-ui';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';

import AnimationPreview from './AnimationPreview';
import type { Animation } from 'Reducer';


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
  onRemove: (string) => void
};

@Radium
class AnimationInMenu extends React.Component<Props> {

  remove = (e: SyntheticMouseEvent<*>) => {
    const { animation } = this.props;

    this.props.onRemove(animation.id);
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
        rightIcon={<ActionDeleteForever onClick={this.remove} />}
        primaryText={txt}
        onClick={this.props.onClick}
        style={selected ? { backgroundColor: '#e0e0e0' } : {}}
      />
    );
  }
}

export default AnimationInMenu;
