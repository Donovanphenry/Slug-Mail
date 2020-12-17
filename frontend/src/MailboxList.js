import React from 'react';
import {useHistory} from 'react-router-dom';

import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/core/styles';

import SharedContext from './SharedContext';
import {Typography} from '@material-ui/core';

import InboxIcon from '@material-ui/icons/Inbox';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import DraftsIcon from '@material-ui/icons/Drafts';
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const tempDrawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: '#c9c9c9',
    width: tempDrawerWidth,
    margin: theme.spacing(1),
  },
  unselected: {
    width: tempDrawerWidth,
    margin: theme.spacing(1),
  },
}));

/**
 * @return {object} JSX
 */
function MailboxList() {
  const {mailbox, selectMailbox} =
    React.useContext(SharedContext);
  const {boxes} = React.useContext(SharedContext);
  const classes = useStyles();
  let currentSecType = 'inbox';
  const history = useHistory();

  return (
    <div>
      <Toolbar>
        <Typography style = {{fontWeight: 'bold'}}>
          CSE183 Mail
        </Typography>
      </Toolbar>
      <List>
        {boxes.map((box) => {
          let boxIcon = null;

          if (box.name === 'Inbox') {
            boxIcon = <InboxIcon />;
          } else if (box.name === 'Starred') {
            boxIcon = <StarIcon />;
          } else if (box.name === 'Drafts') {
            boxIcon = <DraftsIcon />;
          } else if (box.name === 'Trash') {
            boxIcon = <DeleteIcon />;
          } else if (box.name == 'Sent') {
            boxIcon = <SendIcon />;
          } else {
            boxIcon = <ArrowForwardIcon />;
          }

          let test = '';
          if (currentSecType != box.sectionType) {
            console.log('Name: ' + box.name + ' secType: ' + box.sectionType +
              ' Current: ' + currentSecType);
            currentSecType = box.sectionType;
            test = <Divider />;
          }

          return (
            <div key = {box.name}>
              {test}
              {
                <ListItem button
                  key={box.name}
                  disabled={mailbox == box.name}
                  className = {mailbox == box.name ? classes.selected :
                      classes.unselected}
                  onClick={() => selectMailbox(box.name)}
                >
                  <Box display = 'flex' style = {{width: '100%'}}>
                    <Box>
                      <ListItemIcon
                        key = {`liIcon${box.name}`}
                      >
                        {boxIcon}
                      </ListItemIcon>
                    </Box>

                    <Box flexGrow = {2}>
                      <ListItemText primary={
                        <Typography noWrap>
                          {box.name}
                        </Typography>
                      }

                      key = {`liTextOuter${box.name}`}
                      />
                    </Box>

                    <Box>
                      <ListItemText
                        key = {`liTextInner${box.name}`}
                      >
                        <Typography noWrap>
                          {box.count}
                        </Typography>
                      </ListItemText>
                    </Box>
                  </Box>
                </ListItem>
              }
            </div>
          );
        })}
        <Divider />
        <ListItem button
          key={'New mailbox button'}
          onClick={() => console.log('New mailbox!')}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>
            New Mailbox
          </ListItemText>
        </ListItem>

        <Divider />

        <ListItem button
          key={'SettingsButton'}
          onClick={() => history.push('/settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>
            Settings
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );
}

export default MailboxList;
