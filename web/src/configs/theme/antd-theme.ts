import type { AliasToken, OverrideToken } from 'antd/es/theme/interface';

export const TOKEN: Partial<AliasToken> = {
  colorBgMask: 'rgba(7, 6, 50, 0.4)',
  colorError: '#f74360',
  colorPrimary: '#0d8e8b',
  colorSuccess: '#00c48c',
  colorWarning: '#ff934b',
};

export const BUTTON: Partial<OverrideToken['Button']> = {
  borderRadius: 12,
  controlHeight: 48,
};

export const IMAGE: Partial<OverrideToken['Image']> = {
  colorBgMask: 'rgba(0, 0, 0, 0.92)',
};
