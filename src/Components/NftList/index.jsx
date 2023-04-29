import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import cn from 'classnames';

import { Spinner } from '@/Components/Spinner';

import { Nft } from '@/services/nft';

import { NftItem } from './components/NftItem';

import styles from './styles.module.scss';

export function NftList() {
  const [isLoading, setIsLoading] = useState(true);
  const [nftList, setNftList] = useState([]);

  useEffect(
    () => {
      const controller = new AbortController();

      loadNftListPage(
        1,
        {
          signal: controller.signal,
        }
      )
        .catch(error => {
          if (!axios.isCancel(error)) {
            return Promise.reject(error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      return () => controller.abort();
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-52">
        <Spinner />
      </div>
    );
  }

  return (
    <InfiniteScroll
      pageStart={1}
      loadMore={loadNftListPage}
      initialLoad={false}
      hasMore={!isLoading}
      loader={(
        <div key={0} className={cn(styles['infinite-scroll-loader'], 'flex justify-center py-5')}>
          <Spinner />
        </div>
      )}
      className={styles['nft-list']}
    >
      {
        nftList.map(nftItem => (
          <NftItem
            key={nftItem.id}

            className="m-2"

            {...nftItem}
          />
        ))
      }
    </InfiniteScroll>
  );

  async function loadNftListPage(page = 1, config = {}) {
    const newNftItem = await Nft.getNftList(page, 20, config);

    setNftList(currentNftItems => currentNftItems.concat(newNftItem));
  }
}
