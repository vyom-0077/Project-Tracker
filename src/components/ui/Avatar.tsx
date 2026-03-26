import React from 'react';
import { USERS } from '../../data/generator';
import { getInitials } from '../../utils/task';

interface AvatarProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export const Avatar: React.FC<AvatarProps> = ({ userId, size = 'md', className = '' }) => {
  const user = USERS.find((u) => u.id === userId);
  if (!user) return null;

  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-full flex items-center justify-center font-semibold font-mono select-none flex-shrink-0 ${className}`}
      style={{ backgroundColor: user.color + '30', color: user.color, border: `1.5px solid ${user.color}60` }}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
};
