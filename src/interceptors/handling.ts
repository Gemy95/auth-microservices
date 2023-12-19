import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception instanceof HttpException
            ? exception.getStatus() as HttpStatus
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // eslint-disable-next-line no-unsafe-optional-chaining
        const message= exception instanceof HttpException ? exception?.message + " , " +(exception?.getResponse())["message"] || "" :
            exception["message"] || ""; 
        response
            .status(statusCode)
            .json({
                statusCode,
                message,
                date:{}
                //timestamp: new Date().toISOString(),
                //path: request.url,
            });
    }
}