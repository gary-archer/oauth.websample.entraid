# Entra ID SPA and API Code Sample

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87203e565f6d4ded9299896cdd741cc1)](https://app.codacy.com/gh/gary-archer/oauth.websample.azure?utm_source=github.com&utm_medium=referral&utm_content=gary-archer/oauth.websample.azure&utm_campaign=Badge_Grade)

[![Known Vulnerabilities](https://snyk.io/test/github/gary-archer/oauth.websample.azure/badge.svg?targetFile=spa/package.json)](https://snyk.io/test/github/gary-archer/oauth.websample.azure?targetFile=spa/package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/gary-archer/oauth.websample.azure/badge.svg?targetFile=api/package.json)](https://snyk.io/test/github/gary-archer/oauth.websample.azure?targetFile=api/package.json)

## Overview

An OAuth code sample that adapts the [updated SPA and API code sample](https://github.com/gary-archer/oauth.websample2) to use Microsoft Entra ID.\
The goal is to demonstrate code portability, where these features work the same regardless of the authorization server:

- The SPA uses the code flow with a complete application lifecycle.
- The API combines claims-based authorization with finer-grained business permissions.
- The SPA and API use both OAuth user attributes and business user attributes.

## Views

The SPA is a simple UI with some basic navigation between views, to render fictional investment resources.

![SPA Views](./images/views.png)

## Prerequisites

See the [Entra ID SPA and API Setup](https://github.com/gary-archer/oauth.blog/tree/master/public/posts/azure-active-directory-setup.mdx) for the Microsoft online configuration details.\
You could configure all of the settings and then update these configuration files to point to your own Entra ID tenant:

- spa/spa.config.json
- api/api.config.json

## Local Development Quick Start

Run the code sample from a terminal on Linux, macOS or Windows (with Git bash).  
The SPA and API use [Real World OAuth Development URLs](https://github.com/gary-archer/oauth.blog/blob/master/public/posts/developer-ssl-setup.mdx#real-world-oauth-development-urls) on a local computer.  

### Administrator Setup

You must use admin permissions to configure infrastructure before you run the code.  
First, add DNS entries to your `/etc/hosts` file:

```bash
127.0.0.1 localhost www.authsamples-dev.com api.authsamples-dev.com
```

Make sure OpenSSL 3+ is installed, specify a secrets folder, then create development certificates:

```bash
export SECRETS_FOLDER="$HOME/secrets"
mkdir -p "$SECRETS_FOLDER"
./certs/create.sh
```

Configure [HTTPS Trust](https://github.com/gary-archer/oauth.blog/blob/master/public/posts/developer-ssl-setup.mdx#configure-operating-system-trust) for the SSL root certificate at the following location:

```text
./certs/authsamples-dev.ca.crt
```

Ensure that Node.js 26+ is installed, then grant it access to listen on port 443:

```bash
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

### Run the Code

Then run the SPA and API, which does not require admin permissions:

```bash
./start.sh
```

The system browser runs and you can sign in with your own Entra ID user accounts.

## Further Information

* See the [Entra ID SPA and API OAuth Flow](https://github.com/gary-archer/oauth.blog/tree/master/public/posts/azure-ad-troubleshooting.mdx) page to understand some finer details.

## Programming Languages

* The SPA and its views use plain TypeScript code.
* The API uses Node.js and TypeScript.

## Infrastructure

* Express is used as the HTTP server for the secured API and to serve the SPA's static content.
* The SPA uses the [oidc-client-ts](https://github.com/authts/oidc-client-ts) library to implement OpenID Connect.
* The API uses the [jose](https://github.com/panva/jose) library to validate JWT access tokens.
* Microsoft Entra ID is the default authorization server for the SPA and API.

## Limitations

- The SPA uses tokens in the browser, which is against 2021 security best practices.
- The SPA uses the original iframe-based silent token renewal which has some usability problems.
- The [Final SPA Code Sample](https://github.com/gary-archer/oauth.websample.final) solves these problems.
