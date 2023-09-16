type IconProps = {
  prefixCls: string;
};

const NavIcon = ({ prefixCls, isNext = false }: IconProps & { isNext?: boolean }) => (
  <span
    className={`${prefixCls}-nav-icon ${prefixCls}-nav-icon-${isNext ? 'next' : 'prev'}`}
  ></span>
);

const SuperNavIcon = ({ prefixCls, isNext = false }: IconProps & { isNext?: boolean }) => (
  <span
    className={`${prefixCls}-nav-icon-super ${prefixCls}-nav-icon-super-${
      isNext ? 'next' : 'prev'
    }`}
  ></span>
);

export const PrevIcon = ({ prefixCls }: IconProps) => <NavIcon prefixCls={prefixCls} />;

export const NextIcon = ({ prefixCls }: IconProps) => <NavIcon isNext prefixCls={prefixCls} />;

export const SuperPrevIcon = ({ prefixCls }: IconProps) => <SuperNavIcon prefixCls={prefixCls} />;

export const SuperNextIcon = ({ prefixCls }: IconProps) => (
  <SuperNavIcon isNext prefixCls={prefixCls} />
);

export const SuffixIcon = ({ prefixCls }: IconProps) => (
  <span className={`${prefixCls}-suffix-icon`}>
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

export const ClearIcon = ({ prefixCls }: IconProps) => (
  <span className={`${prefixCls}-clear-icon`}>
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

export const RangeSeparator = ({ prefixCls }: IconProps) => (
  <span className={`${prefixCls}-range-separator-inner`}>
    <svg
      viewBox="0 0 1024 1024"
      focusable="false"
      data-icon="swap-right"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path>
    </svg>
  </span>
);
