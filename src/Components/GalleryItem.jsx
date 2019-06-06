/* @flow */
import React from 'react';
import Frame from './Frame';
import AnimationPreview from './AnimationPreview';
import { getFrameColumns } from '../utils';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const style = {
  galleryItem: {
    alignItems: 'center',
    margin: '15px',
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginBottom: '4px',
    width: '100px',
  },
  frame: {
    boxShadow: '7px 6px 2px lightgrey',
  },
  overlay: {
    position: 'absolute',
    left: '50%'

  },
  actionButton: {
    marginTop: '10px',
    width: '100%',
  }
};

const actionIcons = {
  add: <AddIcon />,
  remove: <RemoveIcon />
}

type Props = {
  animation: Animation,
  clickIcon: string,
  clickLabel: string,
  onClick?: (animations: Array<Animation>) => void
};

type State = {
  playing: boolean,
};

class GalleryItem extends React.Component<Props, State> {
  state: State = {
    playing: false,
  };
  static defaultProps = {
    clickIcon: 'add',
    clickLabel: '',
  };

  shouldComponentUpdate(nextProps, nextState){
    const update = (this.state.playing !== nextState.playing
      || this.props.onClick !== nextProps.onClick
      || this.props.animation !== nextProps.animation
    );
    return update
  }

  render() {
    const { animation } = this.props;
    return (
      <div 
        style={style.galleryItem}
        onMouseEnter={() => this.setState({playing: true})}
        onMouseLeave={() => this.setState({playing: false})}
      >
        <div style={style.title} title={animation.name} alt={animation.name}>
          { animation.name ? <b>{animation.name}</b> : <i>Untitled</i> } 
        </div>
        { !this.state.playing && 
        <Frame
          columns={getFrameColumns(animation, animation.animation.currentFrame)}
          onClick={() => this.setState({playing: true})}
          size={this.props.size}
          offColor="black"
          style={{...style.frame, opacity: 0.5 }}
        />
        }

        { this.state.playing && 
        <AnimationPreview 
          animation={this.props.animation} 
          key={this.props.animation.id}
          size={this.props.size}
          style={style.frame}
          offColor="black"
          onClick={() => this.setState({playing: false})}
        />
        }
        <Button 
          size="small" 
          variant="outlined"
          color="primary" 
          onClick={() => { this.props.onClick(animation) }}
          style={style.actionButton}
        >
          { actionIcons[this.props.clickIcon] }
          { this.props.clickLabel }
        </Button>
      </div>
    );
  }
}

export default GalleryItem;


