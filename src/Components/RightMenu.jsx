/* @flow */
import { connect } from 'react-redux';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import { Link } from 'react-router';
import { range } from 'lodash';
import { reset } from 'Actions/animations';
import { t } from 'i18next';
import ContentLink from 'material-ui/svg-icons/content/link';
import ContentSend from 'material-ui/svg-icons/content/send';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import SocialShare from 'material-ui/svg-icons/social/share';
import transfer from 'Services/flash';
import AuthDialog from './AuthDialog';
import firebase from '../firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { loggedOut } from '../Actions/auth';


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

type Props = {
  resetAction: typeof reset,
};

type State = {
  transferWidgetOpen: boolean,
  authWidgetOpen: boolean,
  shareWidgetOpen: boolean,
  shareString: string,
};

@Radium
class RightMenu extends React.Component<Props, State> {
  state: State = {
    transferWidgetOpen: false,
    authWidgetOpen: false,
    shareWidgetOpen: false,
    shareString: '',
  };
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  transfer = () => {
    if (this.context.store.getState().animations.size > 0) {
      //     transfer(this.context.store.getState().animations);
      this.setState({
        transferWidgetOpen: true,
      });
    }
  };
  confirmTransfer = () => {
    this.setState({
      transferWidgetOpen: false,
    });
    transfer(this.context.store.getState().animations
      .sort((animation1, animation2) => {
        return animation1.creationDate >= animation2.creationDate
      })
    );
  };
  cancelTransfer = () => {
    this.setState({
      transferWidgetOpen: false,
    });
  };

  share = () => {
    const { animations, currentAnimationId } = this.props
    const selectedAnimation = animations.get(currentAnimationId);
    const encodedAnimation = btoa(JSON.stringify(selectedAnimation));

    const shareUrl = encodedAnimation;

    if (!selectedAnimation) {
      return;
    }

    if (this.context.store.getState().animations.size > 0) {
      this.setState({
        shareWidgetOpen: true,
        shareString: shareUrl,
      });
    }
  };

  closeShare = () => {
    this.setState({
      shareWidgetOpen: false,
    });
  };
  
  logout = () => {
    firebase.auth().signOut().then(() => {
      this.context.store.dispatch(loggedOut());
    })
  }

  new = () => {
    if (confirm(t('menu.newWarning'))) {
      this.props.resetAction();
    }
  };
  
  authButton = ({ isSignedIn, user }) => {
    if (isSignedIn) {
      return [ 
        <RaisedButton
          key="logout"
          primary
          label={t('menu.logout') + ' ' + user.email}
          onClick={this.logout}
          style={style.button}
          icon={<ActionExitToApp />}
        />
      ]
    } else {
      return [ 
        <RaisedButton
          key="openauth"
          primary
          label={t('menu.login')}
          onClick={() => this.setState({authWidgetOpen: true})}
          style={style.button}
        />
      ]
    }
  }
  
  render() {
    const transferActions = [
      <FlatButton
        key="a"
        label={t('transfer_dialog.cancel')}
        secondary
        onClick={this.cancelTransfer}
        icon={<NavigationClose />}
      />,
      <FlatButton
        key="b"
        label={t('transfer_dialog.transfer')}
        primary
        keyboardFocused
        onClick={this.confirmTransfer}
        icon={<ContentSend />}
      />,
    ];

    const shareActions = [
      <FlatButton
        key="c"
        label={t('share_dialog.close')}
        primary
        onClick={this.closeShare}
        icon={<NavigationClose />}
      />,
    ];

    const flashInstructions = range(4).map(i => `${i + 1}. ${t(`transfer_dialog.instructions${i}`)}`);

    return (
      <div style={style.wrap}>
        <RaisedButton
          label={t('menu.share')}
          onClick={this.share}
          primary
          style={style.button}
          icon={<SocialShare />}
        />
        { !this.props.uid && <RaisedButton label={t('menu.new')} onClick={this.new} primary style={style.button} />}
        <RaisedButton
          label={t('menu.transfer')}
          onClick={this.transfer}
          primary
          style={style.button}
          icon={<ContentSend />}
        />
        <FirebaseAuthConsumer children={this.authButton} />

        <Dialog
          title={t('transfer_dialog.title')}
          actions={transferActions}
          modal
          autoScrollBodyContent
          open={this.state.transferWidgetOpen}
        >
          {/* <div style={style.instructions}>
            <InlineSVG src={transferSvg}/>
          </div>*/}
          <ul style={style.instructionList}>
            {flashInstructions.map(instruction => <li key={instruction}>{instruction}</li>)}
          </ul>
        </Dialog>

        <Dialog
          title={t('share_dialog.title')}
          actions={shareActions}
          modal
          autoScrollBodyContent
          open={this.state.shareWidgetOpen}
        >
          <p>{t('share_dialog.instructions')}</p>
          <Link to={{ pathname: `${BASE_URL}/`, query: { s: this.state.shareString } }}>
            <RaisedButton label={t('share_dialog.link')} primary keyboardFocused icon={<ContentLink />} />
          </Link>
        </Dialog>

        <AuthDialog isOpen={this.state.authWidgetOpen} close={() => this.setState({authWidgetOpen: false})} />
      </div>
    );
  }
}

export default connect(state => ({
  uid: state.uid,
  animations: state.animations
}), {
  resetAction: reset,
})(RightMenu);
