import { Typography } from 'antd';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ContactItemProps {
  label?: string;
  value?: string | ReactNode;
  className?: string;
  href?: string;
}

export function ContactItem({
  label,
  value,
  className,
  href,
}: ContactItemProps) {
  return (
    <Typography.Text className="block text-sm font-semibold leading-6 text-grey">
      {label ? `${label}:` : ''}
      {value && href ? (
        <a
          className={twMerge(
            `break-word mb-1 ml-2 mt-1 whitespace-normal font-normal `,
            className,
          )}
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {value}
        </a>
      ) : (
        <span
          className={twMerge(
            'break-word mb-1 ml-2 mt-1 whitespace-normal font-normal',
            className,
          )}
        >
          {value}
        </span>
      )}
    </Typography.Text>
  );
}
