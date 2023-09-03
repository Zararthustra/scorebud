import { ArgsProps } from 'antd/es/notification/interface';

import {
  IconError,
  IconInfo,
  IconLoader,
  IconSuccess,
  IconWarning
} from '@assets/index';

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const JsonToHtml = ({ json }: { json: object }) => (
  <pre>
    <code>{JSON.stringify(json, null, 4)}</code>
  </pre>
);

export const toastObject = (
  type: 'success' | 'error' | 'warning' | 'info' | 'loading',
  title: string,
  description: string,
  key?: string
) => {
  let icon;
  let color;

  switch (type) {
    case 'success':
      icon = <IconSuccess />;
      color = 'var(--color-green-500)';
      break;
    case 'error':
      icon = <IconError />;
      color = 'var(--color-red-500)';
      break;
    case 'warning':
      icon = <IconWarning />;
      color = 'var(--color-orange-500)';
      break;
    case 'info':
      icon = <IconInfo />;
      color = 'var(--color-blue-400)';
      break;

    case 'loading':
      icon = <IconLoader width={24} height={24} />;
      color = 'var(--color-primary-700)';
      break;

    default:
      icon = <IconError />;
      color = 'black';
      break;
  }

  if (key)
    return {
      icon: icon,
      placement: 'top',
      style: { borderLeft: `4px solid ${color}` },
      message: <h3>{title}</h3>,
      description: <p className="f-m m-0">{description}</p>,
      duration: type === 'loading' ? 200 : 4,
      key: key
    } as ArgsProps;

  return {
    icon: icon,
    placement: 'top',
    style: { borderLeft: `4px solid ${color}` },
    message: <h3>{title}</h3>,
    description: <p className="f-m m-0">{description}</p>
  } as ArgsProps;
};

export const messageObject = (
  type: 'success' | 'error' | 'warning' | 'info' | 'loading',
  content: string,
  key?: string
) => {
  let icon;
  let color;

  switch (type) {
    case 'success':
      icon = <IconSuccess />;
      color = 'var(--color-green-500)';
      break;
    case 'error':
      icon = <IconError />;
      color = 'var(--color-red-500)';
      break;
    case 'warning':
      icon = <IconWarning />;
      color = 'var(--color-orange-500)';
      break;
    case 'info':
      icon = <IconInfo />;
      color = 'var(--color-blue-400)';
      break;

    case 'loading':
      icon = <IconLoader width={24} height={24} />;
      color = 'var(--color-primary-700)';
      break;

    default:
      icon = <IconError />;
      color = 'black';
      break;
  }

  if (key)
    return {
      icon: icon,
      content,
      key: key,
      duration: type === 'loading' ? 200 : 4
    };

  return {
    icon: icon,
    content: content
  };
};
