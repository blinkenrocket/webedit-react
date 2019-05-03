/* @flow */
import React from 'react';
import Frame from './Frame';
import AnimationPreview from './AnimationPreview';
import { getFrameColumns } from '../utils';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

const style = {
  galleryItem: {
    position: 'relative',
    width: '100px',
    height: '100px',
    display: 'flex', 
    alignItems: 'center',

    margin: '8px',
  },
  frame: {
    position: 'absolute',
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: 'absolute',
    left: '50%'

  }
};

type Props = {
  animation: Animation,
  onClick?: (animations: Array<Animation>) => void
};

type State = {
  playing: boolean,
};

class GalleryItem extends React.Component<Props, State> {
  state: State = {
    playing: false,
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
        { !this.state.playing && 
        <Frame
          columns={getFrameColumns(animation, animation.animation.currentFrame)}
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
        />
        }
        { this.state.playing && 
          <div style={style.overlay}>
            <div style={{position: 'relative', left: '-50%', opacity: 0.32}}>
              <Tooltip title="FOOBAR">
                <Fab 
                  size="small" 
                  color="secondary" 
                  onClick={() => { this.props.onClick(animation) }}
                >
                  <AddIcon />,
                </Fab>
              </Tooltip>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default GalleryItem;


