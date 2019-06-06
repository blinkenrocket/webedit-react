/* @flow */
import { connect } from 'react-redux';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import { range } from 'lodash';
import { t } from 'i18next';
import ContentSend from 'material-ui/svg-icons/content/send';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import transfer from 'Services/flash';
import AuthDialog from './AuthDialog';
import firebase from '../firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { loggedOut } from '../Actions/auth';


const style = {
  button: {
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
  transferWidgetOpen: boolean,
  authWidgetOpen: boolean
};

@Radium
class RightMenu extends React.Component<Props, State> {
  state: State = {
    transferWidgetOpen: false,
    authWidgetOpen: false
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
    transfer(this.context.store.getState().animations);
  };
  cancelTransfer = () => {
    this.setState({
      transferWidgetOpen: false,
    });
  };


  
  logout = () => {
    firebase.auth().signOut().then(() => {
      this.context.store.dispatch(loggedOut());
    })
  }

  authButton = ({ isSignedIn, user }) => {
    if (isSignedIn) {
      return [ 
        <RaisedButton
          key="logout"
          size="small"
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
          size="small"
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

    const flashInstructions = range(4).map(i => `${i + 1}. ${t(`transfer_dialog.instructions${i}`)}`);

    return (
      <div style={style.wrap}>
        <RaisedButton
          label={t('menu.transfer')}
          onClick={this.transfer}
          size="small"
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


        <AuthDialog isOpen={this.state.authWidgetOpen} close={() => this.setState({authWidgetOpen: false})} />
      </div>
    );
  }
}

export default connect(state => ({
  animations: state.animations
}))(RightMenu);
