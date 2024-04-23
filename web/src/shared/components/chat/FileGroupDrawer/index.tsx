import type { DrawerProps } from 'antd';
import { Drawer, Tabs, Typography } from 'antd';
import styled from '@emotion/styled';
import { cloneElement, useState } from 'react';
import { ReactComponent as CloseOutlineSVG } from '#/assets/svgs/close-outline.svg';
import { FILE_GROUPS } from '#/shared/utils/constant';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { FileGroupType } from '#/shared/utils/type/file-group';

const StyledDrawer = styled(Drawer)`
  animation: none !important;
  .ant-drawer {
    &-header {
      border-bottom: 1px solid var(--border) !important;
    }
    &-footer {
      border-top: 1px solid var(--border) !important;
    }
    &-body {
      padding: 0 !important;
      position: relative;
      overflow: hidden;
    }
    &-mask {
      opacity: 0;
    }
  }
`;

const StyledTabs = styled(Tabs)`
  height: 100% !important;
  .ant-tabs {
    &-tabpane {
      height: 100%;
    }
    &-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    &-tab {
      display: flex;
      font-weight: 600;
      font-size: 1rem !important;
      justify-content: center;
      color: var(--grey-primary-500);
      &:hover {
        color: var(--primary-color);
      }
      &-btn {
        word-wrap: break-word;
        white-space: pre-wrap;
        text-align: center;
      }
    }
    &-nav {
      box-shadow: 0px 0.25rem 1.25rem -0.125rem #32324714 !important;
      margin: 0 !important;
      &-list {
        display: grid !important;
        width: 100%;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0;
      }
    }
  }
`;

export default function FileGroupDrawer({ onClose, ...rest }: DrawerProps) {
  const { t } = useTypeSafeTranslation();
  const [currentTab, setCurrentTab] = useState<string>(FileGroupType.Media);
  return (
    <StyledDrawer
      afterOpenChange={() => setCurrentTab(FileGroupType.Media)}
      closable={false}
      destroyOnClose
      mask={false}
      maskClosable
      onClose={onClose}
      title={
        <div className="flex items-center justify-between">
          <Typography className="text-base font-semibold">
            {t('fileGroup.title')}
          </Typography>

          <span className="cursor-pointer hover:text-primary" onClick={onClose}>
            <CloseOutlineSVG height={24} width={24} />
          </span>
        </div>
      }
      {...rest}
    >
      <StyledTabs
        activeKey={currentTab}
        items={FILE_GROUPS.map(fileGroup => ({
          children: cloneElement(fileGroup.element, { currentTab }),
          forceRender: true,
          key: fileGroup.type,
          label: t(fileGroup.title),
          tab: t(fileGroup.title),
          tabKey: fileGroup.type,
        }))}
        onChange={key => setCurrentTab(key)}
        tabBarGutter={0}
      />
    </StyledDrawer>
  );
}
