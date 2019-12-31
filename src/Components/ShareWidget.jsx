import React from 'react';
import { t } from 'i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import ContentLink from 'material-ui/svg-icons/content/link';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

type Props = {
  animation?: Animation,
  close: Function
};

type State = {
  copied: bool
}

class ShareWidget extends React.Component<Props, State> {
  state: State = {
    copied: false
  };

  render() {
    const { animation } = this.props;
    const shareString = encodeURIComponent(btoa(JSON.stringify(animation)));

    if (!animation) {
      return null;
    }
    const url = `${HOST}${BASE_URL}/?s=${shareString}`;

    return (
        <Dialog
          title={t('share_dialog.title')}
          actions={<FlatButton
            key="c"
            label={t('share_dialog.close')}
            primary
            onClick={this.props.close}
            icon={<NavigationClose />}
          />}
          modal
          autoScrollBodyContent
          open={true}
        >
          <p>{t('share_dialog.instructions')}</p>
          <CopyToClipboard text={url} onCopy={() => this.setState({copied: true})}>
            <RaisedButton label={t('share_dialog.link')} primary keyboardFocused icon={<ContentLink />} />
          </CopyToClipboard>
          { this.state.copied && "Copied!" }
          
        </Dialog>
    );
  }
}

export default ShareWidget;
