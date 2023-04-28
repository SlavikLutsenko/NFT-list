import { useEffect, useState } from 'react';

import { Nft } from '@/services/nft';

import { NftItem } from './components/NftItem';

import styles from './styles.module.scss';

export function NftList() {
  const [isLoading, setIsLoading] = useState(true);
  const [nftList, setNftList] = useState([]);

  useEffect(
    () => {
      Nft.getNftList()
        .then(setNftList)
        .finally(() => {
          setIsLoading(false);
        });
    },
    []
  );

  if (isLoading) {
    return (
      <div>
        loading ...
      </div>
    );
  }

  return (
    <div className={styles['nft-list']}>
      {
        nftList.map(nftItem => (
          <NftItem
            key={nftItem.id}

            className="m-2"

            {...nftItem}
          />
        ))
      }
    </div>
  );
}
