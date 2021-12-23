import React from 'react'
const LoginForm = ({loginHandler, username, usernameSetter, password, passwordSetter}) => (
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

export default LoginForm
