import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly adminService: AdminService) { }

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Only log CRITICAL alerts for non-HttpExceptions or 500 errors
        if (status >= 500 || !(exception instanceof HttpException)) {
            try {
                await this.adminService.createAlert({
                    severity: 'CRITICAL',
                    source: 'GlobalExceptionFilter',
                    message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || 'Unhandled Exception',
                    details: {
                        path: request.url,
                        method: request.method,
                        body: request.body,
                        stack: exception instanceof Error ? exception.stack : null,
                        exception: exception
                    },
                    restaurantId: request.user?.restaurantId || null
                });
            } catch (err) {
                console.error('Failed to log system alert:', err);
            }
        }

        const responseBody = typeof exceptionResponse === 'object'
            ? { ...exceptionResponse, timestamp: new Date().toISOString(), path: request.url }
            : { statusCode: status, message: exceptionResponse, timestamp: new Date().toISOString(), path: request.url };

        response.status(status).json(responseBody);
    }
}
