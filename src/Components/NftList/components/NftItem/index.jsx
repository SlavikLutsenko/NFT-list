import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './styles.module.scss';

export function NftItem({
  img,
  title,
  price,

  className,
}) {
  return (
    <div
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
          alt={title}
        />
      </div>
      <p className="px-3 py-2 flex justify-between items-center">
        <span className="text-sm font-light text-gray-600">
          {title}
        </span>
        {' '}
        <span className="text-green-600 text-xl font-semibold">
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
