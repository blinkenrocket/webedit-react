/* @flow */
import { AppBar, Drawer } from 'material-ui';
import { t } from 'i18next';
import Editor from './Editor';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Menu from './Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Radium from 'radium';
import React from 'react';
import PropTypes from 'prop-types';
import RightMenu from './RightMenu';
import withWidth from 'material-ui/utils/withWidth';
import { addAnimation } from '../Actions/animations';

const style = {
  appRight: {
    marginTop: 0,
    display: 'flex',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto',
    position: 'relative',
    width: '100%',
  },
  contentClose: {
    display: 'flex',
    flex: '1 1 0',
  },
  contentOpen: {
    paddingLeft: '250px',
    display: 'flex',
    flex: '1 1 0',
  },
};

const muiTheme = getMuiTheme({});

type Props = {
  width: number,
};

type State = {
  drawerOpen: boolean,
};

@Radium
class Webedit extends React.Component<Props, State> {
  state = {
    drawerOpen: !(/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)),
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const encodedAnimation = this.props.location.query.s;

    if (encodedAnimation) {
      const decodedAnimation = JSON.parse(atob(encodedAnimation));
      this.context.store.dispatch(addAnimation(decodedAnimation));
    }
  }

  toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={style.wrap}>
          <AppBar
            onLeftIconButtonClick={this.toggleDrawer}
            title={this.props.width > 1 ? t('headerTitle') : ''}
            iconStyleRight={style.appRight}
            iconElementRight={<RightMenu />}
          />
          <div style={this.state.drawerOpen ? style.contentOpen : style.contentClose}>
            <Drawer open={this.state.drawerOpen}>
              <AppBar
                title={t('headerTitle')}
                onTitleClick={this.toggleDrawer}
                onLeftIconButtonClick={this.toggleDrawer}
              />
              <Menu />
            </Drawer>
            <Editor />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(Webedit);
