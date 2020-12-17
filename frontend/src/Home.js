import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/styles';
import SharedContext from './SharedContext';
import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';
// import {BrowserRouter as Router, Route} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },

}));

/**
 * Simple component with no state.
 *
 * @param {function} setMail set the dummy state
 * @param {*} mailbox
 */
function fetchMail(setMail, mailbox) {
  const url = mailbox === 'Starred' ? 'http://localhost:3010/v0/starred' :
    `http://localhost:3010/v0/mail?mailbox=${mailbox}`;
  fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        const emailList = json[0].mail;

        // Source:
        // stackoverflow.com/questions/12192491/sort-array-by-iso-8601-date
        // This function sorts the emailList lexicographically by
        // the date received in each map element in descending
        // order from top to bottom
        emailList.sort(function(a, b) {
          return (a.received > b.received) ?
            -1 : ((a.received < b.received) ? 1:0);
        });

        setMail(emailList);
      })
      .catch((error) => {
        setMail([]);
        console.error(error);
      });
}

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function Home() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const {mailbox, mail, boxes, userAvatar, setUserAvatar} =
  React.useContext(SharedContext);
  const {setMailbox, setMail, setBoxes} = React.useContext(SharedContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    fetchMail(setMail, mailbox);
  }, ([]));
  React.useEffect(() => {
    fetchMail(setMail, mailbox);
  }, ([mailbox]));

  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <div className = {classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mail, setMail,
        boxes, setBoxes,
        mailbox, setMailbox,
        drawerOpen, setDrawerOpen,
        toggleDrawerOpen,
        dialogOpen, setDialogOpen,
        userAvatar, setUserAvatar,
      }}
      >
        <MailboxDrawer/>
        <TitleBar/>
        <Content className = {classes.content}/>
      </SharedContext.Provider>
    </div>
  );
}

export default Home;
