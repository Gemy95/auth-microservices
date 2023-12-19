import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const getMessageFromMethod =(method:string) => {
    switch(method){
    case "GET": 
        return "data retrieved successfully";
    case "POST": 
        return "data added successfully";
    case "PUT": 
        return "data updated successfully";
    case "PATCH": 
        return "data updated successfully";
    case "DELETE": 
        return "data deleted successfully";   
    }
};

export interface Response {
  statusCode: number;
  message: string;
  data: object;
}

@Injectable()
export class TransformInterceptor
implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Observable<any> {
        return next
            .handle()
            .pipe(
                map((response) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: response?.message || getMessageFromMethod(context.switchToHttp().getResponse().req.method),
                    data: response || {}
                })),
            );
    }
}