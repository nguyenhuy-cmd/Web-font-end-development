import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity.js';

// Key để lưu metadata role
export const ROLES_KEY = 'roles';

// Decorator @Roles() - dùng để đánh dấu endpoint cần quyền gì
// Ví dụ: @Roles(UserRole.ADMIN)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
