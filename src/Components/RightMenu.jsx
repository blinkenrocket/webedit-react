/* @flow */
import { autobind } from 'core-decorators';
import { Dialog, RaisedButton, FlatButton } from 'material-ui';
// $FlowFixMe
import SocialShare from 'material-ui/svg-icons/social/share';
// $FlowFixMe
import ContentAdd from 'material-ui/svg-icons/content/add';
// $FlowFixMe
import ContentSend from 'material-ui/svg-icons/content/send';
// $FlowFixMe
import ContentLink from 'material-ui/svg-icons/content/link';
// $FlowFixMe
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { range } from 'lodash';
import { reset } from 'Actions/animations';
import { t } from 'i18next';
import { transfer } from 'Services/flash';
//import InlineSVG from 'svg-inline-react';
import Radium from 'radium';
import React from 'react';
import { Link } from 'react-router';
//import transferSvg from './transfer.svg';

const style = {
  button: {
    margin: 12,
  },
  wrap: {
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  instructions: {
    display: 'flex',
    width: '96px',
    height: '96px',
    paddingLeft: '30%',
    alignContent: 'center',
    flex: '0 1 auto',
  },
  instructionList: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    flex: '0 0 1',
    flexDirection: 'column',
  },
};

type State = {
  transferWidgetOpen: bool,
  shareWidgetOpen: bool,
  shareString: string,
}

/*::`*/
@Radium
/*::`*/
export default class RightMenu extends React.Component {
  state: State = {
    transferWidgetOpen: false,
    shareWidgetOpen: false,
    shareString: '',
  };
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  };
  @autobind
  transfer() {
    if (this.context.store.getState().animations.size > 0){
 //     transfer(this.context.store.getState().animations);
      this.setState({
        transferWidgetOpen: true,
      });
    }
  }
  @autobind
  confirmTransfer() {
    this.setState({
      transferWidgetOpen: false,
    });
    transfer(this.context.store.getState().animations);
  }
  @autobind
  cancelTransfer() {
    this.setState({
      transferWidgetOpen: false,
    });
  }

  @autobind
  share() {
    const selectedAnimation = this.context.store.getState().selectedAnimation,
          encodedAnimation = btoa(JSON.stringify(selectedAnimation)),
          shareUrl = encodedAnimation;

    if (!selectedAnimation) {
      return;
    }

    if (this.context.store.getState().animations.size > 0) {
      this.setState({
        shareWidgetOpen: true,
        shareString: shareUrl,
      });
    }
  }

  @autobind
  closeShare() {
    this.setState({
      shareWidgetOpen: false,
    });
  }

  new() {
    reset();
  }
  render() {
    const transferActions = [
      <FlatButton
        label={t('transfer_dialog.cancel')}
        secondary
        onTouchTap={this.cancelTransfer}
        icon={<NavigationClose/>}/>,
      <FlatButton
        label={t('transfer_dialog.transfer')}
        primary
        keyboardFocused
        onTouchTap={this.confirmTransfer}
        icon={<ContentSend/>}/>,
    ];

    const shareActions = [
      <FlatButton
        label={t('share_dialog.close')}
        primary
        onTouchTap={this.closeShare}
        icon={<NavigationClose/>}/>,
    ];

    const flashInstructions = range(4).map(i => `${i + 1}. ${t(`transfer_dialog.instructions${i}`)}`);

    return (
      <div style={style.wrap}>
        <RaisedButton label={t('menu.share')} onClick={this.share} primary style={style.button} icon={<SocialShare/>}/>
        <RaisedButton label={t('menu.new')} onClick={this.new} primary style={style.button} icon={<ContentAdd/>}/>
        <RaisedButton label={t('menu.transfer')} onClick={this.transfer} primary style={style.button} icon={<ContentSend/>}/>

        <Dialog
          title={t('transfer_dialog.title')}
          actions={transferActions}
          modal
          autoScrollBodyContent
          open={this.state.transferWidgetOpen}>
          {/*<div style={style.instructions}>
            <InlineSVG src={transferSvg}/>
          </div>*/}
          <ul style={style.instructionList}>{
              flashInstructions.map(instruction => (
                <li key={instruction}>{instruction}</li>
              ))
            }
          </ul>
        </Dialog>

        <Dialog
          title={t('share_dialog.title')}
          actions={shareActions}
          modal
          autoScrollBodyContent
          open={this.state.shareWidgetOpen}>
          <p>{t('share_dialog.instructions')}</p>
          <Link to={{ pathname: BASE_URL, query: { s: this.state.shareString } }}>
            <RaisedButton label={t('share_dialog.link')} primary keyboardFocused icon={<ContentLink/>}/>
          </Link>
        </Dialog>
      </div>
    );
  }
}
