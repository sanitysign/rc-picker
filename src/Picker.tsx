/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */

import type { AlignType } from '@rc-component/trigger/lib/interface';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import pickAttrs from 'rc-util/lib/pickAttrs';
import warning from 'rc-util/lib/warning';
import * as React from 'react';
import { SuffixIcon } from './components/icons';
import type { ModifyCellClassNamesT } from './hooks/useCellClassName';
import useHoverValue from './hooks/useHoverValue';
import usePickerInput from './hooks/usePickerInput';
import usePresets from './hooks/usePresets';
import useTextValueMapping from './hooks/useTextValueMapping';
import useValueTexts from './hooks/useValueTexts';
import type { CustomFormat, PickerMode, PresetDate } from './interface';
import type { ContextOperationRefProps } from './PanelContext';
import PanelContext from './PanelContext';
import type {
  PickerPanelBaseProps,
  PickerPanelDateProps,
  PickerPanelTimeProps,
} from './PickerPanel';
import PickerPanel from './PickerPanel';
import PickerTrigger from './PickerTrigger';
import type { RenderPresets, RenderPresetsProps } from './PresetPanel';
import PresetPanel from './PresetPanel';
import { formatValue, isEqual, parseValue } from './utils/dateUtil';
import { getClearIcon } from './utils/getClearIcon';
import { toArray } from './utils/miscUtil';
import { elementsContains, getDefaultFormat, getInputSize } from './utils/uiUtil';
import { legacyPropsWarning } from './utils/warnUtil';

export type PickerRefConfig = {
  focus: () => void;
  blur: () => void;
  open: () => void;
  confirm: () => void;
};

export type PickerSharedProps<DateType> = {
  dropdownClassName?: string;
  inputClassName?: string;
  dropdownAlign?: AlignType;
  popupStyle?: React.CSSProperties;
  transitionName?: string;
  placeholder?: string;
  placeholderInner?: string;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  autoFocus?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  open?: boolean;
  defaultOpen?: boolean;
  /** Make input readOnly to avoid popup keyboard in mobile */
  inputReadOnly?: boolean;
  id?: string;

  presets?: PresetDate<DateType>[];

  // Value
  format?: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];

  // Render
  suffixIcon?: React.ReactNode;
  /**
   * Clear all icon
   * @deprecated Please use `allowClear` instead
   **/
  clearIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  panelRender?: (originPanel: React.ReactNode) => React.ReactNode;
  inputRender?: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactNode;
  innerInputRender?: (
    props: React.InputHTMLAttributes<HTMLInputElement>,
    inputIndex: 0 | 1,
  ) => React.ReactNode;

  // Events
  onChange?: (value: DateType | null, dateString: string) => void;
  onOpenChange?: (open: boolean) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, preventDefault: () => void) => void;

  /**
   * Trigger `onChange` event when blur.
   * If you don't want to user click `confirm` to trigger change, can use this.
   */
  changeOnBlur?: boolean;

  // Internal
  /** @private Internal usage, do not use in production mode!!! */
  pickerRef?: React.MutableRefObject<PickerRefConfig>;

  // WAI-ARIA
  role?: string;
  name?: string;

  autoComplete?: string;
  direction?: 'ltr' | 'rtl';

  // new props
  openOnFocus?: boolean;
  showInput?: boolean;
  showInnerInput?: boolean;
  closeOnPresetSelect?: boolean;
  toolbar?: JSX.Element;
  header?: JSX.Element;
  panelTop?: JSX.Element;
  isClickInsidePicker?: (target: EventTarget) => boolean;
  renderPresets?: RenderPresets<PresetDate<DateType>['value']>;
  autoApply?: boolean;
  modifyInputValue?: (
    value: string,
    options: { type: 'main' | 'inner'; index: 0 | 1; date: DateType | null },
  ) => string;
} & ModifyCellClassNamesT<DateType> &
  React.AriaAttributes;

type OmitPanelProps<Props> = Omit<
  Props,
  'onChange' | 'hideHeader' | 'pickerValue' | 'onPickerValueChange' | 'onCancel'
>;

export type RenderPresetsSingleProps<DateType> = RenderPresetsProps<PresetDate<DateType>['value']>;

export type PickerBaseProps<DateType> = {} & PickerSharedProps<DateType> &
  OmitPanelProps<PickerPanelBaseProps<DateType>>;

export type PickerDateProps<DateType> = {} & PickerSharedProps<DateType> &
  OmitPanelProps<PickerPanelDateProps<DateType>>;

export type PickerTimeProps<DateType> = {
  picker: 'time';
  /**
   * @deprecated Please use `defaultValue` directly instead
   * since `defaultOpenValue` will confuse user of current value status
   */
  defaultOpenValue?: DateType;
} & PickerSharedProps<DateType> &
  Omit<OmitPanelProps<PickerPanelTimeProps<DateType>>, 'format'>;

export type PickerProps<DateType> =
  | PickerBaseProps<DateType>
  | PickerDateProps<DateType>
  | PickerTimeProps<DateType>;

// TMP type to fit for ts 3.9.2
type OmitType<DateType> = Omit<PickerBaseProps<DateType>, 'picker'> &
  Omit<PickerDateProps<DateType>, 'picker'> &
  Omit<PickerTimeProps<DateType>, 'picker'>;

type MergedPickerProps<DateType> = {
  picker?: PickerMode;
} & OmitType<DateType>;

function InnerPicker<DateType>(props: PickerProps<DateType>) {
  const {
    prefixCls = 'rc-picker',
    id,
    name,
    tabIndex,
    style,
    className,
    dropdownClassName,
    inputClassName,
    dropdownAlign,
    popupStyle,
    transitionName,
    generateConfig,
    locale,
    inputReadOnly,
    allowClear,
    autoFocus,
    showTime,
    picker = 'date',
    format,
    use12Hours,
    value,
    defaultValue,
    presets,
    open,
    defaultOpen,
    defaultOpenValue,
    suffixIcon,
    clearIcon,
    disabled,
    disabledDate,
    placeholder,
    placeholderInner,
    getPopupContainer,
    pickerRef,
    panelRender,
    onChange,
    onOpenChange,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    onContextMenu,
    onClick,
    onOk,
    onClear,
    onKeyDown,
    onSelect,
    onUpdate,
    direction,
    autoComplete = 'off',
    inputRender,
    innerInputRender,
    changeOnBlur,
    okBtn,
    autoApply = true,
    openOnFocus = true,
    showInput = true,
    showInnerInput = false,
    closeOnPresetSelect = true,
    toolbar,
    header,
    panelTop,
    isClickInsidePicker,
    renderPresets,
    modifyInputValue,
  } = props as MergedPickerProps<DateType>;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const innerInputRef = React.useRef<HTMLInputElement>(null);

  const withTime = (picker === 'date' && !!showTime) || picker === 'time';
  const needConfirmButton: boolean = withTime || okBtn;
  const needConfirmation = needConfirmButton || !autoApply;

  const presetList = usePresets(presets);

  // ============================ Warning ============================
  if (process.env.NODE_ENV !== 'production') {
    legacyPropsWarning(props);
  }

  // ============================= State =============================
  const formatList = toArray(getDefaultFormat(format, picker, showTime, use12Hours));

  // Panel ref
  const panelDivRef = React.useRef<HTMLDivElement>(null);
  const inputDivRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Real value
  const [mergedValue, setInnerValue] = useMergedState(null, {
    value,
    defaultValue,
  });

  // Selected value
  const [selectedValue, setSelectedValue] = useMergedState<DateType | null>(mergedValue, {
    onChange: (val) => {
      onUpdate?.(val);
    },
  });

  // Operation ref
  const operationRef: React.MutableRefObject<ContextOperationRefProps | null> =
    React.useRef<ContextOperationRefProps>(null);

  // Open
  const [mergedOpen, triggerInnerOpen] = useMergedState(false, {
    value: open,
    defaultValue: defaultOpen,
    postState: (postOpen) => (disabled ? false : postOpen),
    onChange: (newOpen) => {
      if (!newOpen && operationRef.current && operationRef.current.onClose) {
        operationRef.current.onClose();
      }
    },
  });

  const prevOpenRef = React.useRef(mergedOpen);

  React.useEffect(() => {
    if (mergedOpen === prevOpenRef.current) return;
    onOpenChange?.(mergedOpen);
    prevOpenRef.current = mergedOpen;
  }, [mergedOpen, onOpenChange]);

  // ============================= Text ==============================
  const [valueTexts, firstValueText] = useValueTexts(selectedValue, {
    formatList,
    generateConfig,
    locale,
  });

  const [text, triggerTextChange, resetText] = useTextValueMapping({
    valueTexts,
    onTextChange: (newText) => {
      const inputDate = parseValue(newText, {
        locale,
        formatList,
        generateConfig,
      });
      if (inputDate && (!disabledDate || !disabledDate(inputDate))) {
        setSelectedValue(inputDate);
      }
    },
  });

  // ============================ Trigger ============================
  const triggerChange = (newValue: DateType | null) => {
    setSelectedValue(newValue);
    setInnerValue(newValue);

    if (onChange && !isEqual(generateConfig, mergedValue, newValue)) {
      onChange(
        newValue,
        newValue ? formatValue(newValue, { generateConfig, locale, format: formatList[0] }) : '',
      );
    }
  };

  const triggerOpen = (newOpen: boolean) => {
    if (disabled && newOpen) {
      return;
    }

    triggerInnerOpen(newOpen);
  };

  const forwardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (mergedOpen && operationRef.current && operationRef.current.onKeyDown) {
      // Let popup panel handle keyboard
      return operationRef.current.onKeyDown(e);
    }

    /* istanbul ignore next */
    /* eslint-disable no-lone-blocks */
    {
      warning(
        false,
        'Picker not correct forward KeyDown operation. Please help to fire issue about this.',
      );
      return false;
    }
  };

  const onInternalClick: React.MouseEventHandler<HTMLDivElement> = (...args) => {
    onClick?.(...args);

    if (inputRef.current) {
      inputRef.current.focus();
      triggerOpen(true);
    }
  };

  // ============================= Input =============================
  const onInternalBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (changeOnBlur) {
      triggerChange(selectedValue);
    }

    onBlur?.(e);
  };

  const [inputProps, { focused, typing }] = usePickerInput({
    blurToCancel: needConfirmation,
    open: mergedOpen,
    value: text,
    triggerOpen,
    forwardKeyDown,
    isClickOutside: (target) => {
      const contains = elementsContains(
        [panelDivRef.current, inputDivRef.current, containerRef.current],
        target as HTMLElement,
      );

      if (contains) return false;

      if (target && typeof isClickInsidePicker === 'function') return !isClickInsidePicker(target);

      return true;
    },
    onSubmit: () => {
      if (
        // When user typing disabledDate with keyboard and enter, this value will be empty
        !selectedValue ||
        // Normal disabled check
        (disabledDate && disabledDate(selectedValue))
      ) {
        return false;
      }

      triggerChange(selectedValue);
      triggerOpen(false);
      onOk?.(selectedValue);
      resetText();
      return true;
    },
    onCancel: () => {
      triggerOpen(false);
      setSelectedValue(mergedValue);
      resetText();
    },
    onKeyDown: (e, preventDefault) => {
      onKeyDown?.(e, preventDefault);
    },
    onFocus,
    onBlur: onInternalBlur,
    changeOnBlur,
  });

  // ============================= Sync ==============================
  // Close should sync back with text value
  React.useEffect(() => {
    if (!mergedOpen) {
      setSelectedValue(mergedValue);

      if (!valueTexts.length || valueTexts[0] === '') {
        triggerTextChange('');
      } else if (firstValueText !== text) {
        resetText();
      }
    }
  }, [mergedOpen, valueTexts]); // eslint-disable-line

  // Change picker should sync back with text value
  React.useEffect(() => {
    if (!mergedOpen) {
      resetText();
    }
  }, [picker]); // eslint-disable-line

  // Sync innerValue with control mode
  React.useEffect(() => {
    // Sync select value
    setSelectedValue(mergedValue);
  }, [mergedValue]); // eslint-disable-line

  // ============================ Private ============================
  if (pickerRef) {
    pickerRef.current = {
      focus: () => {
        inputRef.current?.focus();
        if (openOnFocus) triggerOpen(true);
      },
      blur: () => {
        inputRef.current?.blur();
      },
      open: () => {
        triggerOpen(true);
      },
      confirm: () => {
        triggerChange(selectedValue);
        triggerOpen(false);
        onOk?.(selectedValue);
      },
    };
  }

  const [hoverValue, hoverDate, onEnter, onLeave] = useHoverValue(text, {
    formatList,
    generateConfig,
    locale,
  });

  // ============================= Panel =============================
  const panelProps = {
    // Remove `picker` & `format` here since TimePicker is little different with other panel
    ...(props as Omit<MergedPickerProps<DateType>, 'picker' | 'format'>),
    className: undefined,
    style: undefined,
    pickerValue: undefined,
    onPickerValueChange: undefined,
    onChange: null,
  };

  const getPanelNode = () => (
    <div className={`${prefixCls}-panel-layout`}>
      <PresetPanel<DateType, DateType>
        prefixCls={prefixCls}
        presets={presetList}
        onClick={(nextValue) => {
          triggerChange(nextValue);
          if (closeOnPresetSelect) triggerOpen(false);
        }}
        generateConfig={generateConfig}
        prevValue={selectedValue}
        renderPresets={renderPresets}
      />
      <div className={`${prefixCls}-panels-outer-wrap`}>
        <PickerPanel<DateType>
          {...panelProps}
          generateConfig={generateConfig}
          className={classNames({
            [`${prefixCls}-panel-focused`]: !typing,
          })}
          value={selectedValue}
          locale={locale}
          tabIndex={-1}
          onSelect={(date) => {
            onSelect?.(date);
            setSelectedValue(date);
          }}
          direction={direction}
          onPanelChange={(viewDate, mode) => {
            const { onPanelChange } = props;
            onLeave(true);
            onPanelChange?.(viewDate, mode);
          }}
          onCancel={() => {
            triggerInnerOpen(false);
            setSelectedValue(mergedValue);
            resetText();
          }}
          innerInput={showInnerInput ? getInnerInput() : undefined}
          toolbar={toolbar}
          header={header}
          panelTop={panelTop}
        />
      </div>
    </div>
  );

  const getPanel = () => {
    const panelNode = panelRender ? panelRender(getPanelNode()) : getPanelNode();

    return (
      <div
        className={`${prefixCls}-panel-container`}
        ref={panelDivRef}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).tagName === 'INPUT') return;
          e.preventDefault();
        }}
      >
        {panelNode}
      </div>
    );
  };

  let suffixNode: React.ReactNode;
  if (suffixIcon === true) {
    suffixNode = <SuffixIcon prefixCls={prefixCls} />;
  } else if (suffixIcon) {
    suffixNode = (
      <span
        className={`${prefixCls}-suffix`}
        onMouseDown={(e) => {
          // Not lost focus
          e.preventDefault();
        }}
      >
        {suffixIcon}
      </span>
    );
  }

  // ============================ Clear ============================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !props.clearIcon,
      '`clearIcon` will be removed in future. Please use `allowClear` instead.',
    );
  }

  const mergedClearIcon: React.ReactNode = getClearIcon(prefixCls, allowClear, clearIcon);

  const clearNode: React.ReactNode = (
    <span
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerChange(null);
        triggerOpen(false);
        onClear?.();
      }}
      className={`${prefixCls}-clear`}
      role="button"
    >
      {mergedClearIcon}
    </span>
  );

  const mergedAllowClear = !!allowClear && mergedValue && !disabled;

  const inputValueInit = hoverValue || text;

  const inputValue =
    typeof modifyInputValue === 'function'
      ? modifyInputValue(inputValueInit, {
          type: 'main',
          index: 0,
          date: hoverDate || selectedValue,
        })
      : inputValueInit;

  // ============================= Inputs =============================
  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.MutableRefObject<HTMLInputElement>;
  } = {
    id,
    tabIndex,
    disabled,
    readOnly: inputReadOnly || typeof formatList[0] === 'function' || !typing,
    value: inputValue,
    onChange: (e) => {
      triggerTextChange(e.target.value);
    },
    autoFocus,
    placeholder,
    ref: inputRef,
    title: text,
    ...inputProps,
    size: getInputSize(picker, formatList[0], generateConfig),
    name,
    ...pickAttrs(props, { aria: true, data: true }),
    autoComplete,
    className: classNames(`${prefixCls}-input-element`, inputClassName),
  };

  const inputNode: React.ReactNode = inputRender ? (
    inputRender(mergedInputProps)
  ) : (
    <input {...mergedInputProps} />
  );

  function getInnerInput() {
    const inputValueInner =
      typeof modifyInputValue === 'function'
        ? modifyInputValue(inputValueInit, {
            type: 'inner',
            index: 0,
            date: hoverDate || selectedValue,
          })
        : inputValueInit;

    const mergedInnerInputProps: React.InputHTMLAttributes<HTMLInputElement> & {
      ref: React.MutableRefObject<HTMLInputElement>;
    } = {
      ...mergedInputProps,
      value: inputValueInner,
      placeholder: placeholderInner ?? placeholder,
      className: classNames(mergedInputProps.className, `${prefixCls}-inner-input-element`),
      ref: innerInputRef,
    };

    const innerInputNode: React.ReactNode = innerInputRender ? (
      innerInputRender(mergedInnerInputProps, 0)
    ) : (
      <input {...mergedInnerInputProps} />
    );

    return (
      <div
        className={classNames(prefixCls, `${prefixCls}-inner`, className, {
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-focused`]: focused,
          [`${prefixCls}-rtl`]: direction === 'rtl',
        })}
        style={style}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        onClick={onClick}
      >
        <div
          className={classNames(`${prefixCls}-input`, `${prefixCls}-inner-input`, {
            [`${prefixCls}-input-placeholder`]: !!hoverValue,
          })}
        >
          {innerInputNode}
          {suffixNode}
          {mergedAllowClear && clearNode}
        </div>
      </div>
    );
  }

  // ============================ Warning ============================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !defaultOpenValue,
      '`defaultOpenValue` may confuse user for the current value status. Please use `defaultValue` instead.',
    );
  }

  // ============================ Return =============================
  const onContextSelect = (date: DateType, type: 'key' | 'mouse' | 'submit') => {
    if (type === 'submit' || (type !== 'key' && !needConfirmation)) {
      // triggerChange will also update selected values
      triggerChange(date);
      triggerOpen(false);
      onOk?.(selectedValue);
    }
  };
  const popupPlacement = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';

  return (
    <PanelContext.Provider
      value={{
        operationRef,
        hideHeader: picker === 'time',
        onSelect: onContextSelect,
        open: mergedOpen,
        defaultOpenValue,
        onDateMouseEnter: onEnter,
        onDateMouseLeave: onLeave,
      }}
    >
      <PickerTrigger
        visible={mergedOpen}
        popupElement={getPanel()}
        popupStyle={popupStyle}
        prefixCls={prefixCls}
        dropdownClassName={dropdownClassName}
        dropdownAlign={dropdownAlign}
        getPopupContainer={getPopupContainer}
        transitionName={transitionName}
        popupPlacement={popupPlacement}
        direction={direction}
      >
        {showInput ? (
          <div
            ref={containerRef}
            className={classNames(prefixCls, className, {
              [`${prefixCls}-disabled`]: disabled,
              [`${prefixCls}-focused`]: focused,
              [`${prefixCls}-rtl`]: direction === 'rtl',
            })}
            style={style}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
            onClick={onInternalClick}
          >
            <div
              className={classNames(`${prefixCls}-input`, {
                [`${prefixCls}-input-placeholder`]: !!hoverValue,
              })}
              ref={inputDivRef}
            >
              {inputNode}
              {suffixNode}
              {mergedAllowClear && clearNode}
            </div>
          </div>
        ) : (
          // empty element is necessary to calculate the position of the popup
          <div></div>
        )}
      </PickerTrigger>
    </PanelContext.Provider>
  );
}

// Wrap with class component to enable pass generic with instance method
class Picker<DateType> extends React.Component<PickerProps<DateType>> {
  pickerRef = React.createRef<PickerRefConfig>();

  focus = () => {
    if (this.pickerRef.current) {
      this.pickerRef.current.focus();
    }
  };

  blur = () => {
    if (this.pickerRef.current) {
      this.pickerRef.current.blur();
    }
  };

  open = () => {
    this.pickerRef.current?.open();
  };

  confirm = () => {
    this.pickerRef.current?.confirm();
  };

  render() {
    return (
      <InnerPicker<DateType>
        {...this.props}
        pickerRef={this.pickerRef as React.MutableRefObject<PickerRefConfig>}
      />
    );
  }
}

export default Picker;
