import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import cn from 'classnames';

import 'react-loading-skeleton/dist/skeleton.css';

import styles from './styles.module.scss';

export function NftItem({
  img,
  title,
  price,

  className,
}) {
  const formattedPrice = useMemo(
    () => (
      new Intl.NumberFormat(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }
      ).format(price || 0)
    ),
    [price]
  );

  return (
    <div
      className={cn(
        styles['nft-item'],

        className
      )}
    >
      <div className={styles['nft-image-wrapper']}>
        {
          img
            ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles['nft-image']}
                src={img}
                decoding="async"
                alt={title}
              />
            )
            : (
              <Skeleton
                containerClassName={styles['img-skeleton']}
                className={styles['img-skeleton']}
              />
            )
        }
      </div>
      <p className="px-3 py-2 flex justify-between items-center">
        <span
          className={cn(
            'text-sm font-light text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap',
            {
              'w-32': !title,
            }
          )}
          title={title}
        >
          {
            title || <Skeleton />
          }
        </span>
        {' '}
        <span
          className={cn(
            'text-green-600 text-xl font-semibold ml-4 w-',
            {
              'w-16': !title,
            }
          )}
        >
          {
            price
              ? formattedPrice
              : <Skeleton />
          }
        </span>
      </p>
    </div>
  );
}

NftItem.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string,
  price: PropTypes.number,
  className: PropTypes.string,
};
