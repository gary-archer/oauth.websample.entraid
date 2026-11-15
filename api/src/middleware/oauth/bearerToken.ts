import {Request} from 'express';

/*
 * A simple class to read the access token from the request
 */
export class BearerToken {

    /*
     * Try to read the token from the authorization header
     */
    public static read(request: Request): string | null {

        const authorizationHeader = request.header('authorization');
        if (authorizationHeader) {
            const parts = authorizationHeader.split(' ');
            if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
                return parts[1];
            }
        }

        return null;
    }
}
