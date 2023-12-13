import * as React from 'react';
import type { Components, Locale, RangeList } from '../interface';

export type RenderOkBtn = {
  renderOkBtn?: (props: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => React.ReactNode;
};

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
} & RenderOkBtn &
  (
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
  renderOkBtn,
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

    okNode = (
      <li className={`${prefixCls}-btn ${prefixCls}-ok`}>
        {typeof renderOkBtn === 'function' ? (
          renderOkBtn({
            onClick: () => typeof onOk === 'function' && onOk(),
            disabled: okDisabled,
            children: locale.ok,
          })
        ) : (
          <Button disabled={okDisabled} onClick={onOk}>
            {locale.ok}
          </Button>
        )}
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
