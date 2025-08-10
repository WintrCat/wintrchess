# 🏗️ Hosting WintrChess locally

> This is a guide on how to get WintrChess running on your local machine.

## Prerequisites

- Git
- Node.js 22 or later
- Docker if you want to host with that

## Setup

### Clone the repository

```sh
git clone https://github.com/wintrcat/wintrchess.git

# Go to the directory
cd wintrchess
```

### Set environment variables

These are the environment variables that you can set when hosting WintrChess:

```toml
NODE_ENV="production"
```

The environment that the app is running in. Can be one of two values: `production` (default) and `development`. In production, only requests with the `Host` header set to `wintrchess.com` are accepted. You can edit the hostname whitelist in `server/src/lib/security/whitelist.ts`.

```toml
PORT=8080
```

The port that the backend server listens on. Defaults to `8080`.

```toml
ORIGIN="http://localhost:8080"
```
> Required

The origin - URLs in emails are constructed using this, and the authentication uses it as a base URL.
For example, `http://localhost:8080` or `https://wintrchess.com`.

```toml
DATABASE_URI="mongodb://" # ...
```

A connection string for a MongoDB database. Collections, indexes etc. will be created when the app runs. Defaults to `mongodb://database/wintrchess`.

```toml
ANALYSIS_SESSION_ACTIONS=80
```

The number of actions that a user can take during an analysis session, before they have to solve a CAPTCHA again. Each request to the server using the analysis session to authorize oneself uses an action; this may be analysing a game or a single move added to the board. Defaults to `80`.

```toml
MAXIMUM_ARCHIVE_SIZE=50
```

The maximum number of games that the server will allow users to keep in their game archive. Defaults to `50`.

```toml
INTERNAL_PASSWORD="squidward"
```

The password for the internal dashboard, where administrators can change the announcement banner and author news posts.

```toml
AUTH_SECRET="12345678901234567890"
```
> Required

A random string used for authentication i.e hashing passwords, signing JWTs etc. Make sure it has a good amount of entropy.

```toml
GOOGLE_OAUTH_CLIENT_ID="12345678901234567890"
GOOGLE_OAUTH_CLIENT_SECRET="12345678901234567890"
```

Your Google OAuth client ID and secret, if you would like to enable Google sign-in.

```toml
ADS_PUBLISHER_ID="ca-pub-3914142339921252"
```

Your Google AdSense publisher ID, if you would like to enable advertisements. Note that advertisements will not display on local deployments.

```toml
EMAIL_ACCOUNT="contact@wintrchess.com"
AUTOMATED_EMAIL_ADDRESS="no-reply@wintrchess.com"
AUTOMATED_EMAIL_KEY="aaaa bbbb cccc dddd"
```

The email address that should be listed as the contact for the website. The automated email address is the address that sends automated correspondence like email verification and password resets. To login to the account, use the automated email key, which is the password to the account / Google Workspace app password.

## Deploy manually

### Install dependencies

```sh
npm install
```

### Build the app

```sh
npm run build
```

You can also compile individual workspaces if you want with the `-w` flag:

```sh
npm run build -w client
npm run build -w server
npm run build -w shared
```

### Start the server

```sh
npm start
```

The server will begin listening on the port that you defined in the environment variables, or `8080` if you have not defined one.

## Deploy with Docker

You might find it easier to run WintrChess in a Docker container. The database will be created for you so you will not have to
specify a database URI.

### Build and start

```sh
docker compose up
```