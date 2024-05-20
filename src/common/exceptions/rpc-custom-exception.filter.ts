import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost) {
        // return throwError(() => exception.getError());
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();

        if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
            const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
            return response.status(status).json(rpcError);
        }

        response.status(400).json(
            {
                status: 400,
                message: rpcError
            }
        )
    }
}