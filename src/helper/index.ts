import * as crypto from 'crypto';
import { promisify } from 'util';
import { isUUID } from 'class-validator';

export class BaseResponse {
  constructor(
    public statusCode: number,
    public message?: any,
    public error?: any,
    public data?: any,
  ) {}

  static encodeData(data: any, statusCode: number = 200, message?: any, error?: any) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    if (process.env.APP_ENV !== 'production') {
      console.log('encrypted', `${encrypted}.${key.toString('hex')}.${iv.toString('hex')}`);
    }

    if (process.env.APP_ENV === 'production') {
      const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      console.log('decrypted', decrypted);
    }

    const result = process.env.APP_ENV === 'production'
      ? `${encrypted}.${key.toString('hex')}.${iv.toString('hex')}` : data;

    const response: any = {
      statusCode,
      data: result
    };

    if (message) {
      response.message = message;
    }

    if (error) {
      response.error = error;
    }

    return new BaseResponse(
      response.statusCode,
      response.message,
      response.error,
      response.data
    );
  }

  static decodeData(data: any) {}

  static createdResponse() {
    return new BaseResponse(201);
  }

  static updatedOrDeleteResponse() {
    return new BaseResponse(204);
  }

  static notFoundResponse() {
    return new BaseResponse(404);
  }

  static errorResponse(message?: any) {
    return new BaseResponse(400, message, 'Bad Request');
  }

  static internalServerErrorResponse(message?: any) {
    if (process.env.APP_ENV !== 'production') {
      console.error('error', message);
      return new BaseResponse(500, message, 'Internal Server Error');
    } else {
      return new BaseResponse(500, undefined, 'Internal Server Error');
    }
  }

  static conflictResponse(message?: any) {
    return new BaseResponse(409, message, 'Conflict');
  }

  static unauthorizedResponse(message?: any) {
    return new BaseResponse(401, message, 'Unauthorized');
  }
}

export function isUuid(id: string): boolean {
  return isUUID(id, '4');
}
