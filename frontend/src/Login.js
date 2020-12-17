import React from 'react';
import {useHistory} from 'react-router-dom';

/**
 * @return {*}
 */
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useHistory();

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/authenticate', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((json) => {
          localStorage.setItem('user', JSON.stringify(json));
          history.push('/');
        }) .catch((err) => {
          alert('Error logging in, please try again');
        });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 id='welcome'>CSE183 Authenticated Email</h2>
      <input
        type="email"
        name="email"
        placeholder="EMail"
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleInputChange}
        required
      />
      <input type="submit" value="Submit"/>
    </form>
  );
}

export default Login;
