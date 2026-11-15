import {ClaimsPrincipal} from '../../middleware/claims/claimsPrincipal.js';
import {GraphClient} from '../../middleware/oauth/graphClient.js';

/*
 * The API provides two user info endpoints for the SPA
 */
export class UserInfoService {

    /*
     * Special handling to get information from the Entra ID OAuth user info endpoint
     */
    public async getOAuthUserInfo(accessToken: string, graphClient: GraphClient): Promise<any> {
        return await graphClient.getUserInfo(accessToken);
    }

    /*
     * Return user attributes not stored in the authorization server to the UI for display
     */
    public getApiUserInfo(claims: ClaimsPrincipal): any {

        return {
            title: claims.getExtra().title,
            regions: claims.getExtra().regions,
        };
    }
}
