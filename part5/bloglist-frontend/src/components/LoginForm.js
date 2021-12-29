import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ loginHandler, username, usernameSetter, password, passwordSetter }) => (
  <div>
    <h2>Login</h2>
    <form onSubmit={loginHandler}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => usernameSetter(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => passwordSetter(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)

LoginForm.propTypes = {
  loginHandler: PropTypes.func.isRequired,
  usernameSetter: PropTypes.func.isRequired,
  passwordSetter: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
