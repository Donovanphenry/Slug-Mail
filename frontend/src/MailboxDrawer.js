import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import SharedContext from './SharedContext';
import MailboxList from './MailboxList';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer +200,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

/**
 * @param {*} setBoxes
 */
function fetchMailboxCount(setBoxes) {
  fetch(`http://localhost:3010/v0/mailboxes`, {
    method: 'GET',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .then((json) => {
        const emailArray = json;

        // Source:
        // stackoverflow.com/questions/12192491/sort-array-by-iso-8601-date
        // This function sorts the emailList lexicographically by
        // the date received in each map element in descending
        // order from top to bottom
        emailArray.sort(function(a, b) {
          return (a.order < b.order) ?
            -1 : ((a.order > b.order) ? 1:0);
        });

        setBoxes(emailArray);
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * @return {object} JSX
 */
function MailboxDrawer() {
  const {mailbox, drawerOpen, boxes} = React.useContext(SharedContext);
  const {setMailbox, setDrawerOpen, setBoxes, toggleDrawerOpen, setDialogOpen} =
    React.useContext(SharedContext);
  const [newMailDrawerOpen, setNewMailDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    fetchMailboxCount(setBoxes);
  }, ([]));

  const selectMailbox= (mailbox) => {
    setMailbox(mailbox);
    setDrawerOpen(false);
  };

  const classes = useStyles();
  return (
    <SharedContext.Provider value={{
      mailbox, selectMailbox,
      boxes, setBoxes,
      setDrawerOpen,
      newMailDrawerOpen, setNewMailDrawerOpen,
      setDialogOpen,
    }} >
      <Hidden smDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{paper: classes.drawerPaper}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
      <Hidden smUp implementation="css">
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawerOpen}
          ModalProps={{keepMounted: true}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
    </SharedContext.Provider>
  );
}

export default MailboxDrawer;
