import React from 'react';
import SharedContext from './SharedContext';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {Link} from 'react-router-dom';

/**
 * @param {*} id
 * @param {function} starClickState
 * @param {function} setStarClickState
 */

/* eslint-disable */
function fetchMail(id, starClickState, setStarClickState, setJustChanged) {
  fetch(`http://localhost:3010/v0/mail/starred/${id}`, {
    method: 'PUT',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .then((json) => {
        const email = json;
        setJustChanged(true);
        setStarClickState(email.starred);
        return email;
      })
      .catch((error) => {
        console.log(error.toString());
      });
}
/**
 * @param {*} id
 * @param {function} setStarClickState
 */
function fetchGetById(id, setStarClickState) {
  fetch(`http://localhost:3010/v0/mail/${id}`, {
    method: 'GET',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .then((json) => {
        const email = json;
        setStarClickState(email.starred);
        return email;
      })
      .catch((error) => {
        console.log(error.toString());
      });
}

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

const useStyles = makeStyles((theme) => ({
  picture: {
    overflow: 'hidden',
  },

  linkToEmail: {
    textDecoration: 'none',
  },

  emailFrom: {
    fontSize: 18,
  },
  emailSubject: {
    fontSize: 18,
  },
  emailContent: {
  },

  emailData: {
  },

  starBtn: {
  },
}));

/**
 * @return {object} JSX
 * @param {*} props
 */
function EmailPreview(props) {
  const [starClickState, setStarClickState] =
  React.useState(props.email.starred);
  const {mailbox, setBoxes} = React.useContext(SharedContext);
  const [justChanged, setJustChanged] = React.useState(false);

  React.useEffect(() => {
    fetchGetById(props.email.id, setStarClickState);
  }, ([]));
  React.useEffect(() => {
    if (justChanged) {
      fetchMailboxCount(setBoxes);
      setJustChanged(false);
    }
  }, ([starClickState]));

  const classes = useStyles();

  const emailDate = new Date(props.email.received);
  const currentDate = new Date();
  const emailYear = emailDate.getFullYear();
  const emailMonth = emailDate.getMonth();
  const emailDay = emailDate.getDate();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  let dateDisplayed = null;

  if (emailYear == currentYear && emailMonth == currentMonth &&
    currentDay == emailDay) {
    dateDisplayed = currentDate.getHours() > 12 ?
      (emailDate.getHours() - 12) + ':' + emailDate.getMinutes() + ' P.M.' :
        emailDate.getHours() + ':' + emailDate.getMinutes() + 'A.M.';
  } else if (emailYear == currentYear && emailMonth == currentMonth &&
      (currentDay - 1) == emailDay) {
    dateDisplayed = 'Yesterday';
  } else if (currentYear == emailYear) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayedMonth = months[emailDate.getMonth()];
    dateDisplayed = displayedMonth + ' ' + emailDate.getDate();
  } else {
    dateDisplayed = emailDate.getFullYear();
  }

  return ( props.email == undefined ? '' :
    <Box className = {classes.emailPrevContainer} display = 'flex'
      style = {{width: '100%'}}
    >
      <Box className = {classes.picture} style = {{width: '100%'}}>
        <Link
          to = {
            {
              pathname: `/mail/${props.email.id}`,
              from: `${mailbox}`,
              id: `${props.email.id}`,
            }
          }
          className = {classes.linkToEmail}
        >
          <Box display = 'flex'>

            <Box flexGrow = {1}>
              <Typography
                className = {classes.emailFrom}
                color = 'primary'
                style = {{display: 'inline-block',
                  fontWeight: props.email.unread ? 'bold' : 'normal'}}
                noWrap
              >
                {
                  props.email.from.name == 'CSE183 Student' ?
                  props.email.to.name : props.email.from.name
                }
              </Typography>
            </Box>

            <Box>
              <Typography
                className = {classes.emailFrom}
                color = 'primary'
                noWrap
              >
                {dateDisplayed}
              </Typography>
            </Box>
          </Box>
          <Typography
            className = {classes.emailSubject}
            color = 'primary'
            style = {{fontWeight: props.email.unread ? 'bold' : 'normal'}}
            noWrap
          >
            {props.email.subject}
          </Typography>
          <Box display = 'flex' style ={{width: '100%'}}>
            <Typography
              className = {classes.emailContent}
              color = 'primary'
              noWrap
            >
              {props.email.content}
            </Typography>
            <IconButton
              style = {{color: starClickState ? '#e3c74b' : 'black'}}
              id = 'starBtn'
              onClick = {(e) => {
                e.preventDefault();
                e.stopPropagation();
                fetchMail(props.email.id, starClickState, setStarClickState, setJustChanged);
              }}
            >
              {starClickState ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}

EmailPreview.propTypes = {
  email: PropTypes.object,
};

export default EmailPreview;
