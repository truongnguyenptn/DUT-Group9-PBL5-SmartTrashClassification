import { CloseOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { last, trimEnd } from 'lodash-es';
import { useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import StatusLegend from '../common/StatusLegend';
import { PATHS } from '#/shared/utils/path';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

interface SidebarProps {
  isEmpty?: boolean;
}

export default function Sidebar({ isEmpty }: SidebarProps) {
  const { t } = useTypeSafeTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const pathName = last(trimEnd(location.pathname, '/').split('/').slice(-1));

  return (
    <>
      <div
        className={twMerge(
          'hidden justify-between px-2 pb-5 pt-6 md:flex md:pb-4',
          // PATHS[pathName ?? ''].headerClass,
        )}
      >
        <Typography.Title className="mb-0 text-2xl font-semibold text-grey md:pl-2">
          {/* {t(PATHS[pathName ?? ''].title)} */}
        </Typography.Title>

        <div className="flex">
          {/* <div className="flex h-8 w-10 items-center justify-center">
            <StatusLegend />
          </div> */}

          <CloseOutlined
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => navigate('/')}
          />
        </div>
      </div>

      <div className="md:hidden">
        <div
          className="absolute -right-[0.938rem] -top-4 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
          onClick={() => navigate('/')}
        >
          <CloseOutlined />
        </div>

        {/* <div className="absolute -left-5 top-[1.563rem] z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md">
          <StatusLegend />
        </div> */}
      </div>
    </>
  );
}
