import PropTypes from 'prop-types';
import NextImage from 'next/image';
import cn from 'classnames';

// TODO: use embedded svg
import spinnerIconUrl from 'public/spinner.svg';

import styles from './styles.module.scss';

export function Spinner({ className, ...props }) {
  return (
    <NextImage
      priority
      className={cn(styles.spinner, className)}
      src={spinnerIconUrl}

      {...props}
    />
  );
}

Spinner.propTypes = {
  className: PropTypes.string,
};
