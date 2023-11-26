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
}

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
  const { prefixCls, presets, onClick, onHover, generateConfig, prevValue } = props;

  if (!presets.length) {
    return null;
  }

  return (
    <div className={`${prefixCls}-presets`}>
      <ul>
        {presets.map(({ label, value }, index) => {
          const val = executeValue(value);
          const equal = isEqualDateTime<T, DateType>(generateConfig, prevValue, val);

          let cn = '';
          if (equal.date) cn += 'is-active-date';
          if (equal.time) cn += ' is-active-time';

          return (
            <li
              className={cn.trim()}
              key={index}
              onClick={() => onClick?.(executeValue(value))}
              onMouseEnter={() => onHover?.(executeValue(value))}
              onMouseLeave={() => onHover?.(null)}
            >
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
