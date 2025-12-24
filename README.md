# Entra ID SPA and API Code Sample

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87203e565f6d4ded9299896cdd741cc1)](https://app.codacy.com/gh/gary-archer/oauth.websample.azure?utm_source=github.com&utm_medium=referral&utm_content=gary-archer/oauth.websample.azure&utm_campaign=Badge_Grade)

[![Known Vulnerabilities](https://snyk.io/test/github/gary-archer/oauth.websample.azure/badge.svg?targetFile=spa/package.json)](https://snyk.io/test/github/gary-archer/oauth.websample.azure?targetFile=spa/package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/gary-archer/oauth.websample.azure/badge.svg?targetFile=api/package.json)](https://snyk.io/test/github/gary-archer/oauth.websample.azure?targetFile=api/package.json)

## Overview

An OAuth code sample that adapts the [updated SPA and API code sample](https://github.com/gary-archer/oauth.websample2) to use Microsoft Entra ID.\
The goal is to demonstrate code portability, where these features work the same regardless of the authorization server:

- The SPA uses the traditional OpenID connect flow, with a complete application lifecycle.
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

To run the code sample locally you must configure some infrastructure before you run the code.

### Configure DNS and SSL

Configure custom development domains by adding these DNS entries to your hosts file:

```bash
127.0.0.1 localhost www.authsamples-dev.com api.authsamples-dev.com
```

Install OpenSSL 3+ if required, create a secrets folder, then create development certificates:

```bash
export SECRETS_FOLDER="$HOME/secrets"
mkdir -p "$SECRETS_FOLDER"
./certs/create.sh
```

Finally, configure [Browser SSL Trust](https://github.com/gary-archer/oauth.blog/tree/master/public/posts/developer-ssl-setup.mdx#trust-a-root-certificate-in-browsers) for the SSL root certificate at this location:

```text
./certs/authsamples-dev.ca.crt
```

### Run the Code

Ensure that Node.js 24+ is installed, then build and run the SPA and API:

```bash
./start.sh
```

The system browser runs and you can sign in with your own Entra ID user accounts.

## Problem Areas

- The initial SPA does not handle tokens in line with 2021 security recommendations.
- The SPA also demonstrates some usability problems with iframe-based silent token renewal.
- The [Final SPA Code Sample](https://github.com/gary-archer/oauth.websample.final) solves these problems but requires a more complex flow.

## Further Information

* See the [Entra ID SPA and API OAuth Flow](https://github.com/gary-archer/oauth.blog/tree/master/public/posts/azure-ad-troubleshooting.mdx) page to understand some finer details.

## Programming Languages

* The SPA and its views use plain TypeScript code.
* The API uses Node.js and TypeScript.

## Infrastructure

* Express is used as the HTTP server for both the API and the SPA's web static content.
* The SPA uses the [oidc-client-ts](https://github.com/authts/oidc-client-ts) library to implement OpenID Connect.
* The API uses the [jose](https://github.com/panva/jose) library to validate JWT access tokens.
* Microsoft Entra ID is the default authorization server for the SPA and API.
