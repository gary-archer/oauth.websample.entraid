import {OAuthClientConfiguration} from './oauthClientConfiguration.js';

/*
 * A holder for OAuth settings
 */
export interface OAuthConfiguration {
    jwksEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint: string;
    issuer: string;
    audience: string;
    algorithm: string;
    scope: string;
    claimsCacheTimeToLiveMinutes: number;
    graphClient: OAuthClientConfiguration;
}
