import dayjs from 'dayjs';
import type { EventValue, RangeValue, PresetDate } from '../src/interface';
import type { Dayjs } from "dayjs";
import type { PresetComponentSingle } from '../src/Picker';
import type { PresetComponentRange } from '../src//RangePicker';

export const singlePresets: PresetDate<EventValue<Dayjs>>[] = [
  {
    label: 'Now',
    value: () => dayjs(),
  },
  {
    label: 'Yesterday',
    value: () => dayjs().add(-1, 'd'),
  },
  {
    label: 'Start of week',
    value: () => dayjs().startOf('w'),
  },
  {
    label: '7 days ago',
    value: () => dayjs().add(-7, 'd'),
  },
  {
    label: 'Start of prev. week',
    value: () => {
      const now = dayjs();
      const prevWeek = dayjs().add(now.day() === 0 ? -2 : -1, 'w');
      return prevWeek.startOf('w').add(1, 'd');
    },
  },
  {
    label: 'Start of month',
    value: () => dayjs().startOf('M'),
  },
  {
    label: '30 days ago',
    value: () => dayjs().add(-30, 'd'),
  },
];

export const rangePresets: PresetDate<RangeValue<Dayjs>>[] = [
  {
    label: 'Yesterday',
    value: () => {
      const now = dayjs();
      return [now.add(-1, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'This week',
    value: () => {
      const now = dayjs();
      const start = now.day() === 0 ? now.add(-1, 'w').startOf('w') : now.startOf('w');
      return [start.add(1, 'd'), now];
    },
  },
  {
    label: 'Last 7 days',
    value: () => {
      const now = dayjs();
      return [now.add(-7, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Last week',
    value: () => {
      const now = dayjs();
      const prevWeek = dayjs().add(now.day() === 0 ? -2 : -1, 'w');
      return [prevWeek.startOf('w').add(1, 'd'), prevWeek.endOf('w').add(1, 'd')];
    },
  },
  {
    label: 'Last 14 days',
    value: () => {
      const now = dayjs();
      return [now.add(-14, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'This month',
    value: () => {
      const now = dayjs();
      return [now.startOf('M'), now];
    },
  },
  {
    label: 'Last 30 days',
    value: () => {
      const now = dayjs();
      return [now.add(-30, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Last month',
    value: () => {
      const prevMonth = dayjs().add(-1, 'M');
      return [prevMonth.startOf('M'), prevMonth.endOf('M')];
    },
  },
];

export const PresetsSingle: PresetComponentSingle<Dayjs> = ({
  getClassNames,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <ul>
      {singlePresets.map(({ label, value }, index) => {
        return (
          <li
            className={getClassNames(value)}
            key={index}
            onClick={() => onClick(value)}
            onMouseEnter={() => onMouseEnter(value)}
            onMouseLeave={() => onMouseLeave()}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
};

export const PresetsRange: PresetComponentRange<Dayjs> = ({
  getClassNames,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <ul>
      {rangePresets.map(({ label, value }, index) => {
        return (
          <li
            className={getClassNames(value)}
            key={index}
            onClick={() => onClick(value)}
            onMouseEnter={() => onMouseEnter(value)}
            onMouseLeave={() => onMouseLeave()}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
};
