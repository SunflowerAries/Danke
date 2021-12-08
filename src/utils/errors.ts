import { QueryFailedError } from 'typeorm';

interface MysqlErrorConstructor {
  new (code: string): Error;
  (code: string): Error;
}

export declare var MysqlError: MysqlErrorConstructor;

// add more errors as needed
export enum QueryError {
  Unknown = 0,
  DuplicateEntry = 1,
}

export function getQueryError(e: QueryFailedError): QueryError {
  if (e.message.startsWith('ER_DUP_ENTRY')) {
    return QueryError.DuplicateEntry;
  }
  return QueryError.Unknown;
}
