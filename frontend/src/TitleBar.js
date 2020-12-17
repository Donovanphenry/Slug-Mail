import React from 'react';

import {useHistory} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import CreateIcon from '@material-ui/icons/Create';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import {Typography} from '@material-ui/core';
import {Hidden} from '@material-ui/core';

import SharedContext from './SharedContext';

const useStyles = makeStyles((theme) => ({
  inputBase: {
    color: 'white',
    backgroundColor: '#626eb5',
    // 6075eb
    padding: '5px',
    width: '100%',
  },

  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  outlineStandard: {
    color: 'white',
    [theme.breakpoints.down('xs')]: {
    },
    [theme.breakpoints.up('xs')]: {
      width: '85%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '92%',
    },
    [theme.breakpoints.up('md')]: {
      width: '95%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '95%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '97%',
    },
  },

  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },

  composeButton: {
    margin: theme.spacing(1),
    [theme.breakpoints.up('xs')]: {
      position: 'absolute',
      right: '3.8%',
    },
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      right: '2.5%',
    },
    [theme.breakpoints.up('lg')]: {
      position: 'absolute',
      right: '2%',
    },
  },

  search: {
    'backgroundColor': '#626eb5',
    'borderRadius': theme.shape.borderRadius,
    'width': '100%',
  },
  searchIcon: {
    color: 'white',
    padding: theme.spacing(0, 2),
    height: '100%',
    top: '30%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
  },

  settingsButton: {
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      right: '0%',
    },
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      right: '0%',
    },
  },

  containerBox: {
    width: '100%',
    alignItems: 'center',
  },
  menuBox: {
    flexShrink: 1,
  },
  searchBox: {
    flexGrow: 4,
  },

  composeBox: {
    flexShrink: 1,
  },

  settingsBox: {
    flexShrink: 1,
  },
}));

// Look into history api

/**
 * @return {oject} JSX
 */
function TitleBar() {
  const history = useHistory();
  const {mailbox, toggleDrawerOpen, userAvatar} =
    React.useContext(SharedContext);

  console.log(userAvatar);

  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Hidden smDown>
          <Typography>
            CSE 183 - {mailbox}
          </Typography>
        </Hidden>

        <Box display = 'flex' className = {classes.containerBox}>
          <Box className = {classes.menuBox}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box className = {classes.searchBox} flexGrow = {1}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                style = {{color: '#b7beeb', width: '100%'}}
                inputProps={{'aria-label': 'search'}}
                onClick = {() => history.push('/searchMail')}
              />
            </div>
          </Box>

          <Box className = {classes.composeBox}>
            <IconButton
              style = {{color: 'white'}}
              onClick = {() => history.push('/compose')}
            >
              <CreateIcon />
            </IconButton>
          </Box>

          <Box className = {classes.settingsBox}>
            <IconButton
              color="inherit"
              edge="start"
              onClick = {() => history.push('/settings')}
            >
              <Avatar src = {userAvatar} />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
