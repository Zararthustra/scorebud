import { IIcon } from '@interfaces/index';

const IconSuccess = ({ size = 24, className = '', noColor }: IIcon) => (
  <svg
    className={className}
    fill={noColor ? 'currentColor' : 'var(--color-green-500)'}
    height={size}
    width={size}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896zm-55.808 536.384l-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z" />
  </svg>
);

export default IconSuccess;
