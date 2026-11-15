/*
 * Settings used by Entra ID for the on behalf of flow
 */
export interface OAuthClientConfiguration {
    clientId: string;
    clientSecret: string;
    scope: string;
}
