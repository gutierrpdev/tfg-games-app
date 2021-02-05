import Ajv from 'ajv';
import {
  GetUserResponse as GUR,
  getUserResponseSchema,
  SubmitEventRequest as SER,
} from '../common/api-schema';

export type GetUserResponse = GUR;
export type SubmitEventRequest = SER;


export type ApiResult<T> =
  | { kind: 'ok', data: T }
  | ApiError;

export type ApiError =
  | { kind: 'fetch-error', error: Error }
  | { kind: 'http-error', response: Response }
  | { kind: 'parse-error', errors: ParseError }
;

export type ParseError =
  | 'InvalidJson'
  | Ajv.ErrorObject[];

export class Api {

  public constructor(
    private apiUrl: string,
    private flaskUrl: string,
  ) {}

  public async getUser(): Promise<ApiResult<GetUserResponse>> {
    const url = `${this.apiUrl}/users/me`;
    return apiRequestGET<GetUserResponse>(url, getUserResponseSchema);
  }

  public async getBlekResult(userId: string): Promise<ApiResult<{ maxLevels: number }>> {
    const url = `${this.flaskUrl}/blek/${userId}`;
    return apiRequestGET<{ maxLevels: number }>(url, getUserResponseSchema);
  }

  public async getEdgeResult(userId: string): Promise<ApiResult<{ maxLevels: number }>> {
    const url = `${this.flaskUrl}/edge/${userId}`;
    return apiRequestGET<{ maxLevels: number }>(url, getUserResponseSchema);
  }

  public async getUnpossibleResult(userId: string): Promise<ApiResult<{ numTries: number }>> {
    const url = `${this.flaskUrl}/unpossible/${userId}`;
    return apiRequestGET<{ numTries: number }>(url, getUserResponseSchema);
  }

  public async submitLogin(userId: string, password: string): Promise<ApiResult<void>> {
    const url = `${this.apiUrl}/users/login`;
    const payload: {userId: string, password: string} = {userId, password};
    return apiRequestPOST<{userId: string, password: string}>(url, payload);
  }

}

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
});

async function apiRequestGET<T>(url: string, schema: {}): Promise<ApiResult<T>> {

  const request = new Request(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  let response: Response;

  try {
    response = await fetch(request);
  } catch (err) {
    return { kind: 'fetch-error', error: err };
  }

  if (!response.ok) return { kind: 'http-error', response };

  let data;
  try {
    data = await response.json();
  } catch (err) {
    return { kind: 'parse-error', errors: 'InvalidJson' };
  }

  const valid = ajv.validate(schema, data);
  if (!valid) {
    return { kind: 'parse-error', errors: (ajv.errors as Ajv.ErrorObject[]) };
  }

  return { kind: 'ok', data: (data as T) };
}

async function apiRequestPOST<T>(url: string, payload: T): Promise<ApiResult<void>> {

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    return { kind: 'fetch-error', error: err };
  }

  if (!response.ok) return { kind: 'http-error', response };

  return { kind: 'ok', data: undefined };
}
