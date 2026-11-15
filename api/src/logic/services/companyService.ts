import {ClaimsPrincipal} from '../../middleware/claims/claimsPrincipal.js';
import {ClaimsReader} from '../../middleware/claims/claimsReader.js';
import {ClientError} from '../../middleware/errors/clientError.js';
import {ErrorCodes} from '../../middleware/errors/errorCodes.js';
import {Company} from '../entities/company.js';
import {CompanyTransactions} from '../entities/companyTransactions.js';
import {CompanyRepository} from '../repositories/companyRepository.js';

/*
 * Our service layer class applies logic before returning data
 */
export class CompanyService {

    private readonly repository: CompanyRepository;
    private readonly claims: ClaimsPrincipal;

    public constructor(repository: CompanyRepository, claims: ClaimsPrincipal) {
        this.repository = repository;
        this.claims = claims;
    }

    /*
     * Return the list of companies
     */
    public async getCompanyList(): Promise<Company[]> {

        // Get all companies
        const companies = await this.repository.getCompanyList();

        // Filter on those the user is authorized to access
        return companies.filter((c) => this.isUserAuthorizedForCompany(c));
    }

    /*
     * Return the transaction details for a company
     */
    public async getCompanyTransactions(id: number): Promise<CompanyTransactions> {

        // Forward to the repository class
        const data = await this.repository.getCompanyTransactions(id);

        // If the user is unauthorized or data was not found then return 404
        if (!data || !this.isUserAuthorizedForCompany(data.company)) {
            throw this.unauthorizedError(id);
        }

        return data;
    }

    /*
     * A simple example of authorizing using extra claims
     * Real world systems may need to implement more complex rules based on claims
     * You may not want to issue all of these to the access token
     */
    private isUserAuthorizedForCompany(company: Company): boolean {

        // The admin role is granted access to all resources
        const role = ClaimsReader.getStringClaim(this.claims.getJwt(), 'custom_role');
        if (role === 'admin') {
            return true;
        }

        // Unknown roles are granted no access to resources
        if (role !== 'user') {
            return false;
        }

        // Next authorize based on a business rule that links the user to regional data
        const found = this.claims.getExtra().regions.find((c) => c === company.region);
        return !!found;
    }

    /*
     * Return a 404 error if a company is requested that is outside an allowed range
     */
    private unauthorizedError(companyId: number): ClientError {

        return new ClientError(
            404,
            ErrorCodes.companyNotFound,
            `Company ${companyId} was not found for this user`);
    }
}
