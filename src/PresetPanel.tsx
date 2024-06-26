import type { GenerateConfig } from './generate';
import type { PresetDate } from './interface';
import { isSameDate, isSameTime } from './utils/dateUtil';
import { executeValue } from './utils/miscUtil';

export interface PresetPanelProps<T, DateType> {
  prefixCls: string;
  presets: PresetDate<T>[];
  onClick: (value: T) => void;
  onHover?: (value: T) => void;
  generateConfig: GenerateConfig<DateType>;
  prevValue: T;
  renderPresets?: RenderPresets<T>;
}

export type RenderPresetsProps<T> = {
  checkEqual: (value: T) => { date: boolean; time: boolean };
  getClassNames: (value: T) => string;
  onClick: (value: T) => void;
  onMouseEnter: (value: T) => void;
  onMouseLeave: () => void;
};

export type RenderPresets<T> = (props: RenderPresetsProps<T>) => JSX.Element;

const isEqualDateTime = <T, DateType>(generateConfig: GenerateConfig<DateType>, a: T, b: T) => {
  if (a === b) return { date: true, time: true };

  if (!a || !b) return { date: false, time: false };

  if (Array.isArray(a) && Array.isArray(b)) {
    return {
      date: isSameDate(generateConfig, a[0], b[0]) && isSameDate(generateConfig, a[1], b[1]),
      time: isSameTime(generateConfig, a[0], b[0]) && isSameTime(generateConfig, a[1], b[1]),
    };
  }

  if (Array.isArray(a) || Array.isArray(b)) return { date: false, time: false };

  const dateA = a as unknown as DateType;
  const dateB = b as unknown as DateType;

  return {
    date: isSameDate(generateConfig, dateA, dateB),
    time: isSameTime(generateConfig, dateA, dateB),
  };
};

export default function PresetPanel<T, DateType>(props: PresetPanelProps<T, DateType>) {
  const { prefixCls, presets, onClick, onHover, generateConfig, prevValue, renderPresets } = props;

  if (!presets.length && !renderPresets) return null;

  const checkEqual = (value: T) => {
    const val = executeValue(value);
    return isEqualDateTime<T, DateType>(generateConfig, prevValue, val);
  };

  const getClassNames = (value: T) => {
    const equal = checkEqual(value);

    let cn = '';
    if (equal.date) cn += 'is-active-date';
    if (equal.time) cn += ' is-active-time';

    return cn.trim();
  };

  const onItemClick = (value: T) => onClick?.(executeValue(value));

  const onMouseEnter = (value: T) => onHover?.(executeValue(value));

  const onMouseLeave = () => onHover?.(null);

  const elem =
    typeof renderPresets === 'function'
      ? renderPresets({
          checkEqual,
          getClassNames,
          onClick: onItemClick,
          onMouseEnter,
          onMouseLeave,
        })
      : null;

  if (!presets.length && !elem) return null;

  return (
    <div className={`${prefixCls}-presets`}>
      {!!presets.length && (
        <ul>
          {presets.map(({ label, value }, index) => {
            return (
              <li
                className={getClassNames(value as T)}
                key={index}
                onClick={() => onItemClick(value as T)}
                onMouseEnter={() => onMouseEnter(value as T)}
                onMouseLeave={() => onMouseLeave()}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}

      {elem}
    </div>
  );
}
