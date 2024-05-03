import { Typography } from 'antd';
import { ReactNode } from 'react';

interface DotsProps {
  icon?: ReactNode;
  label: string;
}

function Dots({ icon, label }: DotsProps) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <Typography.Text className="text-primary-color" strong>
        {label}
      </Typography.Text>
    </div>
  );
}

export default Dots;
