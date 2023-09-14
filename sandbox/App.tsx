import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import dayjs from 'dayjs';

import RangeSeparator from './Datepicker/RangeSeparator';

import './index.scss';

const locale = {
  placeholder: 'Select date',
  yearPlaceholder: 'Select year',
  quarterPlaceholder: 'Select quarter',
  monthPlaceholder: 'Select month',
  weekPlaceholder: 'Select week',
  rangePlaceholder: ['Start date', 'End date'],
  rangeYearPlaceholder: ['Start year', 'End year'],
  rangeQuarterPlaceholder: ['Start quarter', 'End quarter'],
  rangeMonthPlaceholder: ['Start month', 'End month'],
  rangeWeekPlaceholder: ['Start week', 'End week'],
  locale: 'en_US',
  today: 'Today',
  now: 'Now',
  backToToday: 'Back to today',
  ok: 'OK',
  clear: 'Clear',
  month: 'Month',
  year: 'Year',
  timeSelect: 'select time',
  dateSelect: 'select date',
  weekSelect: 'Choose a week',
  monthSelect: 'Choose a month',
  yearSelect: 'Choose a year',
  decadeSelect: 'Choose a decade',
  yearFormat: 'YYYY',
  dateFormat: 'M/D/YYYY',
  dayFormat: 'D',
  dateTimeFormat: 'M/D/YYYY HH:mm:ss',
  monthBeforeYear: true,
  previousMonth: 'Previous month (PageUp)',
  nextMonth: 'Next month (PageDown)',
  previousYear: 'Last year (Control + left)',
  nextYear: 'Next year (Control + right)',
  previousDecade: 'Last decade',
  nextDecade: 'Next decade',
  previousCentury: 'Last century',
  nextCentury: 'Next century',
};

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

const singlePresets = [
  { label: 'Yesterday', value: dayjs().add(-1, 'd') },
  { label: 'Last Week', value: dayjs().add(-7, 'd') },
  { label: 'Last Month', value: dayjs().add(-1, 'month') },
];

const rangePresets: any = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];

const props = {
  separator: <RangeSeparator />,
  onOk: (val) => console.log(val),
  generateConfig: dayjsGenerateConfig,
  locale: locale,
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
  vertical: false,
};

const App = () => {
  return (
    <div>
      <div className="pickers-row">
        <Picker {...props} placeholder="Select date" />
        <RangePicker {...props} placeholder={['Select start date', 'Select end date']} />
        {/* <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} showTime/> */}
      </div>

      {/* <div className="spacer"></div> */}

      <div className="pickers-row">
        <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} />
        <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} />
      </div>
    </div>
  );
};

export default App;
