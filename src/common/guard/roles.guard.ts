import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/entities/user.entity.js';
import { ROLES_KEY } from '../decorator/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách role được phép từ metadata của @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không có @Roles() thì cho qua (không cần kiểm tra quyền)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Lấy thông tin user từ request (đã được JwtStrategy gán vào sau khi xác thực)
    const { user } = context.switchToHttp().getRequest();

    // Kiểm tra xem user có role phù hợp không
    const hasRole = requiredRoles.some((role) => user?.role === role);
    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }
    return true;
  }
}
