import type { ReactNode } from 'react';
import { ClearIcon } from '../components/icons';

export function getClearIcon(
  prefixCls,
  allowClear?: boolean | { clearIcon?: ReactNode },
  clearIcon?: ReactNode,
) {
  const mergedClearIcon = typeof allowClear === 'object' ? allowClear.clearIcon : clearIcon;

  return mergedClearIcon || <ClearIcon prefixCls={prefixCls} />;
}
