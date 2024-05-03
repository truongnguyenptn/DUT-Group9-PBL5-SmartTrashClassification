import { useLocation, useNavigate } from 'react-router-dom';
import { cloneElement } from 'react';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type { Section } from '#/shared/utils/type';

interface NavBarItemProps {
  section?: Section;
}

const Item = styled.div<{ active?: boolean }>`
  color: ${props => (props.active ? '#ffffff !important' : '')};

  span {
    color: ${props => (props.active ? '#ffffff !important' : '')};
  }
`;

export default function NavBarItem({ section }: NavBarItemProps) {
  const { t } = useTypeSafeTranslation();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = section?.to ? pathname.includes(section.to) : false;

  return (
    <Item
      active={isActive}
      className={`${
        isActive ? 'bg-primary' : ''
      } flex cursor-pointer items-center gap-x-4 p-5 text-primary transition duration-300 ease-linear lg:w-full lg:justify-center ss:p-3`}
      onClick={() => section?.to && navigate(section.to)}
    >
      {section?.icon &&
        cloneElement(section.icon, {
          className: 'lg:w-8 lg:h-8',
          height: 24,
          width: 24,
        })}

      <Typography.Text
        className={`text-base font-medium text-primary lg:hidden ${
          isActive ? 'text-primary' : ''
        }`}
      >
        {section?.title && t(section.title)}
      </Typography.Text>
    </Item>
  );
}
