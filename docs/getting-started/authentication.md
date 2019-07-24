# Authentication

We provide authentication using [hapijs bell](https://github.com/hapijs/bell) for third party oath authentication and [hapijs basic](https://github.com/hapijs/basic) for username/password authentication.

## Configuration

Al the configuration is done using the `.env` files in the `ui` and `api projects.

By defualt the authentication is **disabled**

### Basic authentication
To enable the minimum authenticatio using [hapijs basic](https://github.com/hapijs/basic) you need to have:

`api/server/.env`
```bash
SESSION_SECRET=session_secret
AUTH_ENABLED=true
```
`ui/.env`
```bash
AUTH_ENABLED=true
```

### Third party
In adition to the basic authentication you can enable autentication usingt Twitter and Github (more coming) by adding the following settings:


`api/server/.env`
```bash
SESSION_SECRET=session_secret
AUTH_ENABLED=true
AUTH_TWITTER_KEY=twitter-key
AUTH_TWITTER_SECRET=twittter-secret
AUTH_GITHUB_KEY=github-key
AUTH_GITHUB_SECRET=github-secret
AUTH_PROVIDERS=twitter;github
```
`ui/.env`
```bash
AUTH_ENABLED=true
```

### Default user creation
When pnly using the basic authentication you can especofy a default user, this will be created only of there is no other user or if the force settign is true (if the user already exists this will be updated with the set password)

`api/server/.env`
```bash
SESSION_SECRET=session_secret
AUTH_ENABLED=true
AUTH_FORCE_DEFAULT_USER=false
AUTH_USER=user@email.com
AUTH_PASSWORD=123456789
```
`ui/.env`
```bash
AUTH_ENABLED=true
```
