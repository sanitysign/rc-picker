import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import type { PresetDate } from '@/interface';
import type { RangeValue } from '@/interface';
import CalendarLocaleRu from '../src/locale/ru_RU';
import CalendarLocaleEn from '../src/locale/en_US';

import RangeSeparator from './Datepicker/RangeSeparator';

import './index.scss';

const NavIcon = ({ isNext = false }) => {
  return (
    <span className={`rc-picker-nav-icon rc-picker-nav-icon-${isNext ? 'next' : 'prev'}`}></span>
  );
};

const NavIconSuper = ({ isNext = false }) => {
  return (
    <span
      className={`rc-picker-nav-icon-super rc-picker-nav-icon-super-${isNext ? 'next' : 'prev'}`}
    ></span>
  );
};

const SuffixIcon = () => {
  return (
    <span className="rc-picker-suffix-icon">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.4454 2.60156H2.55653C1.69742 2.60156 1.00098 3.31791 1.00098 4.20156V15.4016C1.00098 16.2852 1.69742 17.0016 2.55653 17.0016H13.4454C14.3045 17.0016 15.001 16.2852 15.001 15.4016V4.20156C15.001 3.31791 14.3045 2.60156 13.4454 2.60156Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.1084 1V4.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.89014 1V4.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.00098 7.40137H15.001"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

const ClearIcon = () => {
  return (
    <span className="rc-picker-clear-icon">
      <svg
        fillRule="evenodd"
        viewBox="64 64 896 896"
        focusable="false"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z"></path>
      </svg>
    </span>
  );
};

const props = {
  separator: <RangeSeparator />,
  onOk: (val) => {
    // console.log(val)
  },
  generateConfig: dayjsGenerateConfig,
  locale: CalendarLocaleEn,
  superPrevIcon: <NavIconSuper />,
  prevIcon: <NavIcon />,
  superNextIcon: <NavIconSuper isNext />,
  nextIcon: <NavIcon isNext />,
  suffixIcon: <SuffixIcon />,
  direction: 'ltr' as const,
  // showTime: true,
  allowClear: {
    clearIcon: <ClearIcon />,
  },
  showAllNavButtons: false,
  vertical: true,
  // okBtn: true,
  format: "D MMM YYYY"
};

// console.log(dayjs().weekday(1).toDate())
// console.log(dayjs().startOf('w').toDate());

const rangePresets: PresetDate<RangeValue<dayjs.Dayjs>>[] = [
  {
    label: 'Вчера',
    value: () => {
      const now = dayjs();
      return [now.add(-1, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Текущая неделя',
    value: () => {
      const now = dayjs();
      return [now.startOf('w').add(1, 'd'), now];
    },
  },
  {
    label: 'Последние 7 дней',
    value: () => {
      const now = dayjs();
      return [now.add(-7, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Прошлая неделя',
    value: () => {
      const prevWeek = dayjs().add(-1, 'w');
      return [prevWeek.startOf('w').add(1, 'd'), prevWeek.endOf('w').add(1, 'd')];
    },
  },
  {
    label: 'Последние 14 дней',
    value: () => {
      const now = dayjs();
      return [now.add(-14, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Текущий месяц',
    value: () => {
      const now = dayjs();
      return [now.startOf('M'), now];
    },
  },
  {
    label: 'Последние 30 дней',
    value: () => {
      const now = dayjs();
      return [now.add(-30, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Прошлый месяц',
    value: () => {
      const prevMonth = dayjs().add(-1, 'M');
      return [prevMonth.startOf('M'), prevMonth.endOf('M')];
    },
  },
];

const App = () => {
  return (
    <div>
      <div className="pickers-row">
        <Picker {...props} placeholder="Select date" />
        <RangePicker
          {...props}
          placeholder={['Select start date', 'Select end date']}
          presets={rangePresets}
        />
        {/* <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} showTime/> */}
      </div>

      {/* <div className="spacer"></div> */}

      {/* <div className="pickers-row">
        <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} />
        <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} />
      </div> */}
    </div>
  );
};

export default App;
