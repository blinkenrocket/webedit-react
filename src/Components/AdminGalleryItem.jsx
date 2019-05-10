/* @flow */
import React from 'react';
import Frame from './Frame';
import AnimationPreview from './AnimationPreview';
import { getFrameColumns } from '../utils';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArchiveIcon from '@material-ui/icons/Archive';


const style = {
  galleryItem: {
    padding: '8px',
    margin: '8px',
  },
};

const actionIcons = {
  add: <AddIcon />,
  remove: <RemoveIcon />,
  archive: <ArchiveIcon />,
}

const tooltips = { 
  add: 'Copy animation to public gallery',
  remove: 'Remove from public gallery',
  archive: 'Mark as reviewed without adding to gallery',
}

type Props = {
  animation: Animation,
  primaryAction: string,
  secondaryAction: string
};

type State = {
  preview: boolean,
};

class AdminGalleryItem extends React.Component<Props, State> {
  state: State = {
    preview: false,
  };
  static defaultProps = {
    primaryAction: 'add',
    secondaryAction: 'archive',
  };

  shouldComponentUpdate(nextProps, nextState){
    return (this.props.animation !== nextProps.animation
      || this.props.primaryAction !== nextProps.primaryAction
      || this.props.handlePrimary !== nextProps.handlePrimary
      || this.props.secondaryAction !== nextProps.secondaryAction
      || this.props.handleSecondary !== nextProps.handleSecondary
      || this.props.buttonsDisabled !== nextProps.buttonsDisabled
      || this.state.preview !== nextState.preview
    );
  }

  render() {
    const { animation } = this.props;
    return (
      <div 
        style={style.galleryItem}
        onMouseEnter={() => this.setState({preview: true})}
        onMouseLeave={() => this.setState({preview: false})}
      >
        { !this.state.preview && 
        <Frame
          columns={getFrameColumns(animation, animation.animation.currentFrame)}
          size='gallery'
          offColor="black"
          style={{opacity: 0.5 }}
        />
        }

        { this.state.preview && 
        <AnimationPreview 
          animation={this.props.animation} 
          key={this.props.animation.id}
          size="gallery" 
          offColor="black"
        />
        }
        { this.props.handlePrimary &&
          <Tooltip title={tooltips[this.props.primaryAction]}>
            <Fab 
              size="small" 
              color="primary" 
              onClick={() => { this.props.handlePrimary(animation) }}
              disabled={this.props.buttonsDisabled}
              style={{top: '-8px'}}
            >
              { actionIcons[this.props.primaryAction] }
            </Fab>
          </Tooltip>
        }
        { this.props.handleSecondary &&
          <Tooltip title={tooltips[this.props.secondaryAction]}>
            <Fab 
              size="small" 
              color="secondary" 
              onClick={() => { this.props.handleSecondary(animation) }}
              disabled={this.props.buttonsDisabled}
              style={{top: '-8px', right: '-23px'}}
            >
              { actionIcons[this.props.secondaryAction] }
            </Fab>
          </Tooltip>
        }
      </div>
    );
  }
}

export default AdminGalleryItem;
