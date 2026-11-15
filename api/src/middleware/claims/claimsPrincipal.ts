import {JWTPayload} from 'jose';
import {ExtraClaims} from './extraClaims.js';

/*
 * Contains JWT claims from the access token and extra values from a secondary user record
 * Provides a convenient object to inject into business logic, to make all user attributes available
 */
export class ClaimsPrincipal {

    private jwtClaims: JWTPayload;
    private extraClaims: ExtraClaims;

    public constructor(jwtClaims: JWTPayload, extraClaims: ExtraClaims) {
        this.jwtClaims = jwtClaims;
        this.extraClaims = extraClaims;
    }

    public getJwt(): JWTPayload {
        return this.jwtClaims;
    }

    public getExtra(): ExtraClaims {
        return this.extraClaims;
    }
}
