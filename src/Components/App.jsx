/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { t } from 'i18next';
import Radium from 'radium';
import UUID from 'uuid-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import withWidth from 'material-ui/utils/withWidth';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Drawer } from 'material-ui';

import Menu from './Menu';
import RightMenu from './RightMenu';
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
  hamburger: {
    badge: {
      marginTop: 15, 
      marginRight: 20 
    },
    button: {
      padding: 12, 
      marginTop: -15, 
      marginRight: -20 
    },
    icon: {
      height: 24,
      width: 24,
      display: 'inline-block',
      color: 'white',
      fill: 'white',
    }
  }
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

  componentDidMount() {
    const encodedAnimation = this.props.location.query.s;

    if (encodedAnimation) {
      const decodedAnimation = JSON.parse(atob(decodeURIComponent(encodedAnimation)));
      decodedAnimation.id = UUID.create().toString();
      this.props.addAnimation(decodedAnimation);
      this.props.router.push(`${BASE_URL}/${decodedAnimation.id}`);
    }
  }

  toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  };

  render() {
    const { activeView, currentAnimationId } = this.props
    const hamburger = (
      <Badge badgeContent={this.props.animations.size} style={style.hamburger.badge} color="primary">
        <Button style={style.hamburger.button}>
          <MenuIcon style={style.hamburger.icon}/>
        </Button>
      </Badge>
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={style.wrap}>
          <AppBar
            onLeftIconButtonClick={this.toggleDrawer}
            title={this.props.width > 1 ? t('headerTitle') : ''}
            iconElementLeft={hamburger}
            iconStyleRight={style.appRight}
            iconElementRight={<RightMenu currentAnimationId={currentAnimationId}/>}
          />
          <div style={this.state.drawerOpen ? style.contentOpen : style.contentClose}>
            <Drawer open={this.state.drawerOpen}>
              <AppBar
                title={t('headerTitle')}
                onTitleClick={this.toggleDrawer}
                onLeftIconButtonClick={this.toggleDrawer}
              />
              <Menu 
                active={activeView}
                currentAnimationId={currentAnimationId}
                navigate={(path) => this.props.router.push(`${BASE_URL}${path}`)}
              />
            </Drawer>
            { this.props.children }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({ animations: state.animations }), { addAnimation })(withWidth()(Webedit));

