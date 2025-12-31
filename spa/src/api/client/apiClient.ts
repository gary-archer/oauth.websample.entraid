import axios, {Method} from 'axios';
import {ErrorFactory} from '../../plumbing/errors/errorFactory';
import {UIError} from '../../plumbing/errors/uiError';
import {OAuthClient} from '../../plumbing/oauth/oauthClient';
import {AxiosUtils} from '../../plumbing/utilities/axiosUtils';
import {ApiUserInfo} from '../entities/apiUserInfo';
import {Company} from '../entities/company';
import {CompanyTransactions} from '../entities/companyTransactions';
import { OAuthUserInfo } from '../entities/oauthUserInfo';

/*
 * Logic related to making API calls
 */
export class ApiClient {

    private readonly apiBaseUrl: string;
    private readonly oauthClient: OAuthClient;

    public constructor(apiBaseUrl: string, oauthClient: OAuthClient) {

        this.apiBaseUrl = apiBaseUrl;
        if (!this.apiBaseUrl.endsWith('/')) {
            this.apiBaseUrl += '/';
        }

        this.oauthClient = oauthClient;
    }

    /*
     * Get a list of companies
     */
    public async getCompanyList(): Promise<Company[]> {

        return await this.callApi('companies', 'GET') as Company[];
    }

    /*
     * Get a list of transactions for a single company
     */
    public async getCompanyTransactions(id: string): Promise<CompanyTransactions> {

        return await this.callApi(`companies/${id}/transactions`, 'GET') as CompanyTransactions;
    }

    /*
     * The SPA's access token does not allow us to get user info from the authorization server
     * Instead we route via the API which gets the OAuth user info using a different access token
     */
    public async getOAuthUserInfo(): Promise<OAuthUserInfo> {

        const data = await this.callApi('oauthuserinfo', 'GET');
        const givenName = data.given_name || '';
        const familyName = data.family_name || '';
        return {
            givenName,
            familyName,
        };
    }

    /*
     * We also download user attributes that are not stored in the API's own data
     */
    public async getApiUserInfo(): Promise<ApiUserInfo> {

        return await this.callApi('apiuserinfo', 'GET') as ApiUserInfo;
    }

    /*
     * A central method to get data from an API and handle 401 retries
     * This basic implementation only works if a single API request is in flight at a time
     */
    private async callApi(path: string, method: Method, dataToSend?: any): Promise<any> {

        // Get the full path
        const url = `${this.apiBaseUrl}${path}`;

        // Get the access token
        let token = await this.oauthClient.getAccessToken();
        if (!token) {

            // Throw an error to inform the UI to move the user to the login required view
            throw ErrorFactory.getFromLoginRequired();
        }

        try {

            // Call the API
            return await this.callApiWithToken(url, method, dataToSend, token);

        } catch (e1: any) {

            // Report fetch errors if this is not a 401
            const error1 = e1 as UIError;
            if (error1.getStatusCode() !== 401) {
                throw error1;
            }

            // If we received a 401 then try to refresh the access token
            token = await this.oauthClient.refreshAccessToken();
            if (!token) {

                // Trigger a login redirect if we cannot refresh the access token
                // Also end the API request in a controlled way, by throwing an error that is not rendered
                throw ErrorFactory.getFromLoginRequired();
            }

            try {

                // Call the API again
                return await this.callApiWithToken(url, method, dataToSend, token);

            } catch (e2: any) {

                // Report errors if this is not a 401
                const error2 = e2 as UIError;
                if (error2.getStatusCode() !== 401) {
                    throw error2;
                }

                // A permanent API 401 error triggers a new login.
                // This could be caused by an invalid API configuration.
                await this.oauthClient.clearLoginState();
                throw ErrorFactory.getFromLoginRequired();
            }
        }
    }

    /*
     * Do the work of calling the API
     */
    private async callApiWithToken(
        url: string,
        method: Method,
        dataToSend: any,
        accessToken: string): Promise<any> {

        try {

            const response = await axios.request({
                url,
                method,
                data: dataToSend,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            AxiosUtils.checkJson(response.data);
            return response.data;

        } catch (e: any) {
            throw ErrorFactory.getFromHttpError(e, url, 'web API');
        }
    }
}
