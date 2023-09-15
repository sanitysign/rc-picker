import { useMergedState } from 'rc-util';
import useEvent from 'rc-util/lib/hooks/useEvent';
import raf from 'rc-util/lib/raf';
import * as React from 'react';

/**
 * 1. Click input to show picker
 * 2. Calculate next open index
 *
 * If click `confirm`:
 * 3. Hide current picker
 * 4. Open next index picker if exist
 *
 * If not `changeOnBlur` and click outside:
 * 3. Hide picker
 *
 * If `changeOnBlur` and click outside:
 * 3. Hide current picker
 * 4. Open next index picker if exist
 */

export type SourceType = 'open' | 'blur' | 'confirm' | 'cancel' | 'clear' | 'preset';

/**
 * Auto control of open state
 */
export default function useRangeOpen(
  defaultOpen: boolean,
  open: boolean,
  activePickerIndex: 0 | 1 | undefined,
  changeOnBlur: boolean,
  startInputRef: React.RefObject<HTMLInputElement>,
  endInputRef: React.RefObject<HTMLInputElement>,
  startSelectedValue: any,
  endSelectedValue: any,
  disabled: [boolean, boolean],
  onOpenChange?: (open: boolean) => void,
): [
  open: boolean,
  activeIndex: 0 | 1,
  firstTimeOpen: boolean,
  triggerOpen: (open: boolean, activeIndex: 0 | 1 | false, source: SourceType) => void,
  focusNextInput: (activeIndex: 0 | 1 | false, source: SourceType) => void,
] {
  const [firstTimeOpen, setFirstTimeOpen] = React.useState(false);

  const [afferentOpen, setAfferentOpen] = useMergedState(defaultOpen || false, {
    value: open,
  });

  const [mergedOpen, setMergedOpen] = useMergedState(defaultOpen || false, {
    value: open,
    onChange: (nextOpen) => {
      onOpenChange?.(nextOpen);
    },
  });

  const [mergedActivePickerIndex, setMergedActivePickerIndex] = useMergedState<0 | 1>(0, {
    value: activePickerIndex,
  });

  const [nextActiveIndex, setNextActiveIndex] = React.useState<0 | 1>(null);

  React.useEffect(() => {
    if (mergedOpen) {
      setFirstTimeOpen(true);
    }
  }, [mergedOpen]);

  const queryNextIndex = (index: number) => (index === 0 ? 1 : 0);

  const focusNextInput = (index: 0 | 1 | false, source: SourceType) => {
    if (index === false) return null;
    if (!(source === 'confirm' || (source === 'blur' && changeOnBlur))) return null;

    const customNextActiveIndex = afferentOpen ? queryNextIndex(index) : nextActiveIndex;

    if (customNextActiveIndex !== null) {
      setFirstTimeOpen(false);
      setMergedActivePickerIndex(customNextActiveIndex);
    }

    setNextActiveIndex(null);

    if (!(customNextActiveIndex !== null && !disabled[customNextActiveIndex])) return false;

    // Focus back
    raf(() => {
      const ref = [startInputRef, endInputRef][customNextActiveIndex];
      ref.current?.focus();
    });

    return true;
  };

  const triggerOpen = useEvent((nextOpen: boolean, index: 0 | 1 | false, source: SourceType) => {
    if (index === false) {
      // Only when `nextOpen` is false and no need open to next index
      setMergedOpen(nextOpen);

      return;
    }

    if (nextOpen) {
      setMergedActivePickerIndex(index);
      setMergedOpen(nextOpen);

      const nextIndex = queryNextIndex(index);

      // Record next open index
      if (
        !mergedOpen ||
        // Also set next index if next is empty
        ![startSelectedValue, endSelectedValue][nextIndex]
      ) {
        setNextActiveIndex(nextIndex);
      } else {
        setFirstTimeOpen(false);

        if (nextActiveIndex !== null) {
          setNextActiveIndex(null);
        }
      }

      return;
    }

    if (source === 'confirm' || (source === 'blur' && changeOnBlur)) {
      const res = focusNextInput(index, source)
      if (res === false) setMergedOpen(false);
      return;
    }

    setMergedOpen(false);
    setAfferentOpen(false);
  });

  return [mergedOpen, mergedActivePickerIndex, firstTimeOpen, triggerOpen, focusNextInput];
}
