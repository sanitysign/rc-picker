import * as React from 'react';
import type { Components, Locale, RangeList } from '../interface';

export type RangesProps = {
  prefixCls: string;
  rangeList?: RangeList;
  components?: Components;
  needConfirmButton: boolean;
  cancelBtnText?: React.ReactNode;
  onNow?: null | (() => void) | false;
  onOk?: null | (() => void) | false;
  okDisabled?: boolean;
  showNow?: boolean;
  locale: Locale;
} & (
  | {
      needCancelButton: true;
      onCancel: () => void;
    }
  | {
      needCancelButton: false;
      onCancel?: () => void;
    }
);

export default function getRanges({
  prefixCls,
  // rangeList = [],
  components = {},
  needConfirmButton,
  needCancelButton,
  cancelBtnText,
  onNow,
  onOk,
  onCancel,
  okDisabled,
  showNow,
  locale,
}: RangesProps) {
  let presetNode: React.ReactNode;
  let okNode: React.ReactNode;
  const Button = (components.button || 'button') as any;

  if (needConfirmButton) {
    if (onNow && showNow !== false) {
      presetNode = (
        <li className={`${prefixCls}-now`}>
          <a className={`${prefixCls}-now-btn`} onClick={onNow}>
            {locale.now}
          </a>
        </li>
      );
    }

    okNode = needConfirmButton && (
      <li className={`${prefixCls}-btn ${prefixCls}-ok`}>
        <Button disabled={okDisabled} onClick={onOk}>
          {locale.ok}
        </Button>
      </li>
    );
  }

  if (!presetNode && !okNode) {
    return null;
  }

  return (
    <ul className={`${prefixCls}-ranges`}>
      {presetNode}
      {okNode}
      {!!needCancelButton && (
        <li className={`${prefixCls}-btn ${prefixCls}-cancel`}>
          <Button onClick={onCancel}>{cancelBtnText ?? 'Cancel'}</Button>
        </li>
      )}
    </ul>
  );
}
