import {ServerError} from '../../logic/errors/serverError.js';
import {ClientError} from '../../logic/errors/clientError.js';
import {ErrorCodes} from '../../logic/errors/errorCodes.js';

/*
 * A class to handle trapping errors
 */
export class ErrorFactory {

    /*
     * Ensure that all errors used by business logic have a known type
     */
    public static fromException(exception: any): ServerError | ClientError {

        // Already handled 500 errors
        if (exception instanceof ServerError) {
            return exception;
        }

        // Already handled 4xx errors
        if (exception instanceof ClientError) {
            return exception;
        }

        // Handle general exceptions
        return ErrorFactory.fromServerError(exception);
    }

    /*
     * Process exception details
     */
    public static fromServerError(exception: any): ServerError {

        const serverError = new ServerError(
            ErrorCodes.serverError,
            'An unexpected exception occurred in the API',
            exception.stack);

        serverError.setDetails(this.getExceptionDetails(exception));
        return serverError;
    }

    /*
     * Handle requests to API routes that don't exist
     */
    public static fromRequestNotFound(): ClientError {

        return new ClientError(
            404,
            ErrorCodes.requestNotFound,
            'An API request was sent to a route that does not exist');
    }

    /*
     * Handle the error for key identifier lookups
     */
    public static fromJwksDownloadError(e: any, url: string): ServerError {

        const error = new ServerError(
            ErrorCodes.jwksDownloadError,
            'Problem downloading token signing keys',
            e.stack);

        const details = this.getExceptionDetails(e);
        error.setDetails(`${details}, URL: ${url}`);
        return error;
    }

    /*
     * The error thrown if we cannot find an expected claim during OAuth processing
     */
    public static fromMissingClaim(claimName: string): ServerError {

        const error = new ServerError(ErrorCodes.claimsFailure, 'Authorization Data Not Found');
        error.setDetails(`An empty value was found for the expected claim ${claimName}`);
        return error;
    }

    /*
     * Exceptions during fetches could be caused by CORS misconfiguration, server unavailable or JSON parsing failures
     */
    public static getFromFetchError(exception: any, url: string, source: string): ServerError {

        // Already handled
        if (exception instanceof ServerError) {
            return exception;
        }

        let error: ServerError;
        if (exception.constructor.name === 'SyntaxError') {

            // Handle JSON parse errors
            error = new ServerError(
                ErrorCodes.dataError,
                `Unexpected data received from the ${source}`
            );

        } else {

            // Handle connection errors
            error = new ServerError(
                ErrorCodes.connectionError,
                `A connection error occurred when the API called the ${source}`
            );
        }

        const details = this.getExceptionDetails(exception);
        error.setDetails(`${details}, URL: ${url}`);
        return error;
    }

    /*
     * Response errors can contain an API error response or may be issued by an API gateway
     */
    public static async getFromFetchResponseError(response: Response, source: string): Promise<ServerError> {

        let errorCode = '';
        let details = '';

        try {
            // Try to read a JSON error response
            const data = await response.json() as any;
            if (data) {

                // Account for Graph token endpoint and Graph user info error responses
                errorCode = data.error || data.code || ErrorCodes.responseError;
                details = data.error_description || data.message || '';
            }

        } catch {
            // Swallow JSON parse errors for unexpected responses
        }

        const error = new ServerError(
            source,
            errorCode,
            `An error response was returned from the ${source}`
        );
        error.setDetails(details);
        return error;
    }

    /*
     * Get the message from an exception
     */
    private static getExceptionDetails(exception: any): string {

        // Prefer to return a code and message
        const code = exception?.code || exception?.cause?.code || '';
        const message = exception.message || '';

        const parts = [];
        if (code) {
            parts.push(code);
        }
        if (code) {
            parts.push(message);
        }

        if (parts.length > 0) {
            return parts.join(', ');
        }

        // Otherwise get raw details and avoid returning [object Object]
        const details = exception.toString();
        if (details !== {}.toString()) {
            return details;
        }

        return '';
    }
}
