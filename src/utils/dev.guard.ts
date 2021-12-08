import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DEV_GUARD_ALLOW_ACCESS } from './config';
import { logger } from './logger';

@Injectable()
export class DevGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    logger.log('DevGuard: ' + DEV_GUARD_ALLOW_ACCESS);
    return DEV_GUARD_ALLOW_ACCESS;
  }
}
