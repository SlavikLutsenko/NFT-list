import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './styles.module.scss';

function NftItem(
  {
    img,
    title,
    price,

    className,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        styles['nft-item'],

        className
      )}
    >
      <div className={styles['nft-image-wrapper']}>
        { /* eslint-disable-next-line @next/next/no-img-element */ }
        <img
          className={styles['nft-image']}
          src={img}
          decoding="async"
          alt={title}
        />
      </div>
      <p className="px-3 py-2 flex justify-between items-center">
        <span
          className="text-sm font-light text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap"
          title={title}
        >
          {title}
        </span>
        {' '}
        <span className="text-green-600 text-xl font-semibold ml-4">
          {
            new Intl.NumberFormat(
              'en-US',
              {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }
            ).format(price)
          }
        </span>
      </p>
    </div>
  );
}

NftItem.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,

  className: PropTypes.string,
};

const NftItemWithRef = forwardRef(NftItem);

export { NftItemWithRef as NftItem };
