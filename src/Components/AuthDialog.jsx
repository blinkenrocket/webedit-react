/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';
import firebase from '../firebase';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { FlatButton, TextField, RaisedButton } from 'material-ui';

import { signedUp, loggedIn, syncLibrary } from 'Actions/auth';


const style = {
  signupHint: {
    marginTop: '50px'
  }
}

type Props = {
  isOpen: boolean,
  close: () => void,
};

type State = {
  view: string,
  email: string,
  password: string,
  error: string,
};

@Radium
class AuthDialog extends React.Component<Props, State> {

  state: State = {
    view: 'login',
    email: '',
    password: '',
    error: '',
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loggedIn(user['uid']);
      }
    });
  }

  login = () => {
    const { email, password} = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.props.loggedIn(res.user['uid']);
        this.props.syncLibrary(res.user['uid'], this.props.animations);
        this.close();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  signup = () => {
    const { email, password} = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.props.signedUp(res.user.uid, this.props.animations);
        this.close();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  resetPwd = () => {
    firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
      alert(t('auth_dialog.resetlink_sent_notification'));
      this.close();
    }).catch((error) => {
      this.setState({ error: error.message });
    });
  }

  close = () => {
    this.setState({view: 'login', error: ''});
    this.props.close();
  }

  render() {
    const { isOpen } = this.props;

    const submitButton = {
      login: <FlatButton key="l" label={t('auth_dialog.login')} primary onClick={this.login} />,
      signup: <FlatButton key="s" label={t('auth_dialog.signup')} primary onClick={this.signup} />,
      reset: <FlatButton key="r" label={t('auth_dialog.reset')} primary onClick={this.resetPwd} />,
    }[this.state.view];

    return (
      <Dialog open={isOpen}>
        <DialogTitle>{t('auth_dialog.title')}</DialogTitle>
        <DialogContent>
          <TextField
            id="email"
            onChange={(e) => this.setState({email: e.target.value})}
            floatingLabelText={t('auth_dialog.email')}
            floatingLabelFixed
            autoFocus
          />
          <br />
          { (this.state.view !== 'reset') && 
          <TextField
            id="password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => this.setState({password: e.target.value})}
            floatingLabelText={t('auth_dialog.password')}
            floatingLabelFixed
          />
          }

          { (this.state.view === 'login') && (
            <DialogContentText style={{ fontSize: '0.7rem', marginTop: '30px'}}>
              { t('auth_dialog.account_missing') } { ' ' }
              <a href="#" onClick={() => this.setState({view: 'signup'})}><strong>{t('auth_dialog.create_account')}</strong></a> 
              <br />
              <a href="#" onClick={() => this.setState({view: 'reset'})}>{t('auth_dialog.forgot_pwd')}</a> 
            </DialogContentText>
          )}

          { (this.state.error) && (
            <DialogContentText style={{ color: 'darkred' }}>
              { this.state.error }
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <FlatButton key="c" label={t('share_dialog.close')} onClick={this.close} icon={<NavigationClose />} />
          { submitButton }
        </DialogActions>
      </Dialog>
    );
  }
}
export default connect(
  (state) => ({ animations: state.animations }),
  { signedUp, loggedIn, syncLibrary })
(AuthDialog);
