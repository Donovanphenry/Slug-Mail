import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Home from './Home';
import Compose from './Compose';
import Login from './Login';
import MailViewer from './MailViewer';
import SharedContext from './SharedContext';
import SearchMail from './SearchMail';
import Settings from './Settings';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  const [mail, setMail] = React.useState('');
  const [boxes, setBoxes] = React.useState([]);
  const [mailbox, setMailbox] = React.useState('Inbox');
  const [userAvatar, setUserAvatar] = React.useState('https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg');
  const [userName, setUserName] = React.useState('CSE183 Student');


  return (
    <div>
      <SharedContext.Provider value = {{
        setMail, mail,
        boxes, setBoxes,
        mailbox, setMailbox,
        userAvatar, setUserAvatar,
        userName, setUserName,
      }}>
        <Router>
          <Switch>
            <Route path = '/login' exact>
              <Login />
            </Route>
            <Route path = '/' exact>
              <Home />
            </Route>
            <Route path = '/compose'>
              <Compose />
            </Route>
            <Route path = '/mail/:id'>
              <MailViewer />
            </Route>
            <Route path = '/searchMail'>
              <SearchMail />
            </Route>
            <Route path = '/settings'>
              <Settings />
            </Route>
          </Switch>
        </Router>
      </SharedContext.Provider>
    </div>
  );
}

export default App;
