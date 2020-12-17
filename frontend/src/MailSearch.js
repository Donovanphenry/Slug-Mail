import React from 'react';
import EmailPreview from './EmailPreview';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';

/**
 * Simple component with no state.
 * @param {*} props
 * @return {object} JSX
 */
function MailSearch(props) {
  const emailList = props.emailList;
  console.log(emailList);

  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar src = {'https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg'} />
        </ListItemAvatar>

        <ListItemText primary = {<EmailPreview email = {email}/>} />
      </ListItem>
    </List>
  );
}

MailSearch.propTypes = {
  emailList: PropTypes.array,
};

export default MailSearch;
