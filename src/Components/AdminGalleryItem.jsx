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
    padding: '20px',
    margin: '20px',
    borderRadius: '6px',
    boxShadow: '2px 2px 5px lightgrey',
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginBottom: '16px',
    marginTop: '-6px',
    width: '100px',
  },
  bottomInfo: {
    marginTop: '1px',
    marginBottom: '16px',
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#999',
  },
  topInfo: {
    marginTop: '-4px',
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#999',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100px',
  }
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
    const dateFmt = (dt) => dt.toISOString().slice(0, 16).replace('T', ' ');

    return (
      <div 
        style={style.galleryItem}
        onMouseEnter={() => this.setState({preview: true})}
        onMouseLeave={() => this.setState({preview: false})}
      >
        <div style={style.title} title={animation.name} alt={animation.name}>
          { animation.name ? <b>{animation.name}</b> : <i>Untitled</i> } 
        </div>
        <div style={style.topInfo} alt={animation.text} title={animation.text}>
          {animation.type}: 
          {animation.type === 'pixel' && animation.animation.frames} 
          {animation.type === 'text' && animation.text } 
        </div>
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
          animation={animation} 
          key={animation.id}
          size="gallery" 
          offColor="black"
        />
        }
        <div style={style.bottomInfo}>{dateFmt(new Date(animation.creationDate * 1000))} </div>
        { this.props.handlePrimary &&
          <Tooltip title={tooltips[this.props.primaryAction]}>
            <Fab 
              size="small" 
              color="primary" 
              onClick={() => { this.props.handlePrimary(animation) }}
              disabled={this.props.buttonsDisabled}
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
              style={{ right: '-23px'}}
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
