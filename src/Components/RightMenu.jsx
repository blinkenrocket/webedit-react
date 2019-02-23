/* @flow */
import { connect } from 'react-redux';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import { Link } from 'react-router';
import { range } from 'lodash';
import { reset } from 'Actions/animations';
import { t } from 'i18next';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentLink from 'material-ui/svg-icons/content/link';
import ContentSend from 'material-ui/svg-icons/content/send';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import SocialShare from 'material-ui/svg-icons/social/share';
import transfer from 'Services/flash';

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
  shareWidgetOpen: boolean,
  shareString: string,
};

@Radium
class RightMenu extends React.Component<Props, State> {
  state: State = {
    transferWidgetOpen: false,
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
    const selectedAnimation = this.context.store.getState().selectedAnimation;
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

  new = () => {
    this.props.resetAction();
  };
  render() {
    const transferActions = [
      <FlatButton
        key="a"
        label={t('transfer_dialog.cancel')}
        secondary
        onTouchTap={this.cancelTransfer}
        icon={<NavigationClose />}
      />,
      <FlatButton
        key="b"
        label={t('transfer_dialog.transfer')}
        primary
        keyboardFocused
        onTouchTap={this.confirmTransfer}
        icon={<ContentSend />}
      />,
    ];

    const shareActions = [
      <FlatButton
        key="c"
        label={t('share_dialog.close')}
        primary
        onTouchTap={this.closeShare}
        icon={<NavigationClose />}
      />,
    ];

    const flashInstructions = range(4).map(i => `${i + 1}. ${t(`transfer_dialog.instructions${i}`)}`);

    return (
      <div style={style.wrap}>
        <RaisedButton
          label={t('menu.share')}
          onTouchTap={this.share}
          primary
          style={style.button}
          icon={<SocialShare />}
        />
        <RaisedButton label={t('menu.new')} onTouchTap={this.new} primary style={style.button} icon={<ContentAdd />} />
        <RaisedButton
          label={t('menu.transfer')}
          onTouchTap={this.transfer}
          primary
          style={style.button}
          icon={<ContentSend />}
        />

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
          <Link to={{ pathname: BASE_URL, query: { s: this.state.shareString } }}>
            <RaisedButton label={t('share_dialog.link')} primary keyboardFocused icon={<ContentLink />} />
          </Link>
        </Dialog>
      </div>
    );
  }
}

export default connect(null, {
  resetAction: reset,
})(RightMenu);
