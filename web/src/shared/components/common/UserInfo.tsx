import { twMerge } from 'tailwind-merge';
import { Avatar, Typography } from 'antd';
import DefaultAvatar from '#/assets/images/avatar.png';

interface UserInfoProps {
  name?: string;
  avatar?: string | null;
  onClick?: () => void;
  size?: number;
  className?: string;
}

function UserInfo({
  size = 24,
  name,
  avatar,
  onClick,
  className,
}: UserInfoProps) {
  return (
    <div
      className={twMerge('flex items-center gap-3', className)}
      onClick={onClick}
    >
      <Avatar size={size} src={avatar || DefaultAvatar} />
      <Typography>{name}</Typography>
    </div>
  );
}

export default UserInfo;
