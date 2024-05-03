import type { TagProps } from 'antd';
import { Tag } from 'antd';
import { twMerge } from 'tailwind-merge';

interface TagStatusProps {
  content?: string | JSX.Element;
  className?: string;
}

function TagStatus({ className, content, ...rest }: TagStatusProps & TagProps) {
  return (
    <Tag
      className={twMerge(
        'm-0 flex w-min items-center justify-center gap-3 rounded-md px-2 py-1 text-sm',
        className,
      )}
      {...rest}
    >
      {content}
    </Tag>
  );
}

export default TagStatus;
