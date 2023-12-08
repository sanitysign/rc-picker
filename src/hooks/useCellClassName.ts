import type { GenerateConfig } from '../generate';
import type { NullableDateType, RangeValue } from '../interface';
import { isInRange } from '../utils/dateUtil';
import { getValue } from '../utils/miscUtil';

type MainProps<DateType> = {
  cellPrefixCls: string;
  generateConfig: GenerateConfig<DateType>;
  rangedValue?: RangeValue<DateType>;
  hoverRangedValue?: RangeValue<DateType>;
  today?: NullableDateType<DateType>;
  value?: NullableDateType<DateType>;
};

export type CellStatuses = {
  isInView: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRangeStartSingle: boolean;
  isRangeEndSingle: boolean;
  isRangeStartNearHover: boolean;
  isRangeEndNearHover: boolean;
  isRangeHovered: boolean;
  isHoverStart: boolean;
  isHoverEnd: boolean;
  isHoverEdgeStart: boolean;
  isHoverEdgeEnd: boolean;
  isHoverEdgeStartNearRange: boolean;
  isHoverEdgeEndNearRange: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type ModifyCellClassNamesT<DateType> = {
  modifyCellClassNames?: (
    classNames: Record<string, any>,
    options: MainProps<DateType> & {
      currentDate: DateType;
      statuses: CellStatuses;
    },
  ) => Record<string, any>;
};

export default function useCellClassName<DateType>({
  cellPrefixCls,
  generateConfig,
  rangedValue,
  hoverRangedValue,
  isInView,
  isSameCell,
  offsetCell,
  today,
  value,
  modifyCellClassNames,
}: {
  isSameCell: (current: NullableDateType<DateType>, target: NullableDateType<DateType>) => boolean;
  offsetCell: (date: DateType, offset: number) => DateType;
  isInView: (date: DateType) => boolean;
} & MainProps<DateType> &
  ModifyCellClassNamesT<DateType>) {
  function getClassName(currentDate: DateType) {
    const prevDate = offsetCell(currentDate, -1);
    const nextDate = offsetCell(currentDate, 1);

    const rangeStart = getValue(rangedValue, 0);
    const rangeEnd = getValue(rangedValue, 1);

    const hoverStart = getValue(hoverRangedValue, 0);
    const hoverEnd = getValue(hoverRangedValue, 1);

    const isRangeHovered = isInRange(generateConfig, hoverStart, hoverEnd, currentDate);

    function isRangeStart(date: DateType) {
      return isSameCell(rangeStart, date);
    }
    function isRangeEnd(date: DateType) {
      return isSameCell(rangeEnd, date);
    }
    const isHoverStart = isSameCell(hoverStart, currentDate);
    const isHoverEnd = isSameCell(hoverEnd, currentDate);

    const isHoverEdgeStart =
      (isRangeHovered || isHoverEnd) && (!isInView(prevDate) || isRangeEnd(prevDate));
    const isHoverEdgeEnd =
      (isRangeHovered || isHoverStart) && (!isInView(nextDate) || isRangeStart(nextDate));

    const statuses = {
      isInView: isInView(currentDate),
      isInRange: isInRange<DateType>(generateConfig, rangeStart, rangeEnd, currentDate),
      isRangeStart: isRangeStart(currentDate),
      isRangeEnd: isRangeEnd(currentDate),
      isRangeStartSingle: isRangeStart(currentDate) && !rangeEnd,
      isRangeEndSingle: isRangeEnd(currentDate) && !rangeStart,
      isRangeStartNearHover:
        isRangeStart(currentDate) &&
        (isSameCell(prevDate, hoverStart) ||
          isInRange(generateConfig, hoverStart, hoverEnd, prevDate)),
      isRangeEndNearHover:
        isRangeEnd(currentDate) &&
        (isSameCell(nextDate, hoverEnd) ||
          isInRange(generateConfig, hoverStart, hoverEnd, nextDate)),
      isRangeHovered,
      isHoverStart,
      isHoverEnd,
      isHoverEdgeStart,
      isHoverEdgeEnd,
      isHoverEdgeStartNearRange: isHoverEdgeStart && isSameCell(prevDate, rangeEnd),
      isHoverEdgeEndNearRange: isHoverEdgeEnd && isSameCell(nextDate, rangeStart),
      isToday: isSameCell(today, currentDate),
      isSelected: isSameCell(value, currentDate),
    };

    const classNames = {
      // In view
      [`${cellPrefixCls}-in-view`]: statuses.isInView,

      // Range
      [`${cellPrefixCls}-in-range`]: statuses.isInRange,
      [`${cellPrefixCls}-range-start`]: statuses.isRangeStart,
      [`${cellPrefixCls}-range-end`]: statuses.isRangeEnd,
      [`${cellPrefixCls}-range-start-single`]: statuses.isRangeStartSingle,
      [`${cellPrefixCls}-range-end-single`]: statuses.isRangeEndSingle,
      [`${cellPrefixCls}-range-start-near-hover`]: statuses.isRangeStartNearHover,
      [`${cellPrefixCls}-range-end-near-hover`]: statuses.isRangeEndNearHover,

      // Range Hover
      [`${cellPrefixCls}-range-hover`]: statuses.isRangeHovered,
      [`${cellPrefixCls}-range-hover-start`]: statuses.isHoverStart,
      [`${cellPrefixCls}-range-hover-end`]: statuses.isHoverEnd,

      // Range Edge
      [`${cellPrefixCls}-range-hover-edge-start`]: statuses.isHoverEdgeStart,
      [`${cellPrefixCls}-range-hover-edge-end`]: statuses.isHoverEdgeEnd,
      [`${cellPrefixCls}-range-hover-edge-start-near-range`]: statuses.isHoverEdgeStartNearRange,
      [`${cellPrefixCls}-range-hover-edge-end-near-range`]: statuses.isHoverEdgeEndNearRange,

      // Others
      [`${cellPrefixCls}-today`]: statuses.isToday,
      [`${cellPrefixCls}-selected`]: statuses.isSelected,
    };

    return typeof modifyCellClassNames === 'function'
      ? modifyCellClassNames(classNames, {
          cellPrefixCls,
          generateConfig,
          rangedValue,
          hoverRangedValue,
          today,
          value,
          currentDate,
          statuses,
        })
      : classNames;
  }

  return getClassName;
}
