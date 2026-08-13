import { QueryFailedError } from 'typeorm';
import { POSTGRES_UNIQUE_VIOLATION } from './postgres-error-codes';

export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string })?.code === POSTGRES_UNIQUE_VIOLATION
  );
}
