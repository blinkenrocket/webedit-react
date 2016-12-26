/* @flow */
import { autobind } from 'core-decorators';
import { AppBar, Drawer } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { t } from 'i18next';
import Editor from './Editor';
import Menu from './Menu';
import Radium from 'radium';
import React from 'react';
import RightMenu from './RightMenu';
import withWidth from 'material-ui/utils/withWidth';

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

type State = {
  drawerOpen: bool,
}

/*::`*/
@Radium
/*::`*/
class Webedit extends React.Component {
  state: State = {
    drawerOpen: true,
  };

  @autobind
  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={style.wrap}>
          <AppBar onLeftIconButtonTouchTap={this.toggleDrawer} title={this.props.width > 1 ? t('headerTitle') : ''} iconStyleRight={style.appRight} iconElementRight={<RightMenu/>}/>
          <div style={this.state.drawerOpen ? style.contentOpen : style.contentClose}>
            <Drawer open={this.state.drawerOpen}>
              <AppBar title={t('headerTitle')} onTitleTouchTap={this.toggleDrawer} onLeftIconButtonTouchTap={this.toggleDrawer}/>
              <Menu/>
            </Drawer>
            <Editor/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(Webedit);
