export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type Status = (typeof STATUSES)[keyof typeof STATUSES];

export const ACTIONS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

export const DEFAULT_MONTHLY_TARGET: number = 500