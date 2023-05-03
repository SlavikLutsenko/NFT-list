import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { AxiosError } from 'axios';
import cn from 'classnames';

import { Spinner } from '@/Components/Spinner';

import { Nft } from '@/services/nft';

import { NftItem } from './components/NftItem';

import styles from './styles.module.scss';

export function NftList() {
  const numberOfRowsToLoad = 4;
  const defaultNftItemHeight = 340;

  const [nftList, setNftList] = useState([]);
  const [countNftItemInRow, setCountNftItemInRow] = useState(0);
  const [nftItemHeight, setNftItemHeight] = useState(defaultNftItemHeight);
  const [search, setSearch] = useState('');

  const nftListWrapperRef = useRef();
  const nftListVirtualizedRef = useRef();

  const filteredNftList = useMemo(
    () => nftList.filter(({ title }) => title.toLowerCase().indexOf(search.toLowerCase()) != -1),
    [nftList, search]
  );
  const rowCount = useMemo(
    () => Math.ceil(filteredNftList.length / countNftItemInRow) + (search ? 0 : numberOfRowsToLoad),
    [filteredNftList.length, countNftItemInRow, search]
  );

  useEffect(
    () => {
      updateCountNftItemInRow();

      window.addEventListener('resize', updateCountNftItemInRow);

      return () => window.removeEventListener('resize', updateCountNftItemInRow);
    },
    []
  );

  useEffect(
    () => {
      if (nftListVirtualizedRef.current) {
        for (let i = 0; i < nftList.length / countNftItemInRow; i++) {
          nftListVirtualizedRef.current.recomputeRowHeights(i);
        }
      }
    },
    [nftItemHeight, countNftItemInRow]
  );

  return (
    <div
      ref={nftListWrapperRef}
      className={styles['page-wrapper']}
    >
      <input
        className={cn(styles['search-input'], 'self-center my-5')}
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
        placeholder="Search ..."
      />
      <div className="flex-1">
        {
          countNftItemInRow
            ? (
              <AutoSizer>
                {({ height, width }) => (
                  <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={rowCount}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <List
                        height={height}
                        onRowsRendered={onRowsRendered}
                        ref={list => {
                          nftListVirtualizedRef.current = list;
                          registerChild(list);
                        }}
                        rowCount={rowCount}
                        rowHeight={() => nftItemHeight}
                        rowRenderer={rowRenderer}
                        width={width}
                        overscanRowCount={search ? 0 : 2}
                        noRowsRenderer={() => (
                          <p className="mt-10 text-center text-4xl font-bold">
                            No NFT
                          </p>
                        )}
                      />
                    )}
                  </InfiniteLoader>
                )}
              </AutoSizer>
            )
            : (
              <div className="flex justify-center py-52">
                <Spinner />
              </div>
            )
        }
      </div>
    </div>
  );

  async function loadMoreRows({ startIndex: startRow, stopIndex: stopRow }, config = {}) {
    try {
      const newNftItem = await Nft.getNftList(
        startRow * countNftItemInRow,
        (stopRow - startRow + 1) * countNftItemInRow,
        config
      );

      setNftList(currentNftItems => currentNftItems.concat(newNftItem));
    }
    catch (error) {
      if (AxiosError.ERR_NETWORK === error.code) {
        toast.error(
          'The service is currently unavailable. Please wait a few moments and reload the page',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          }
        );
      }
      else {
        throw new Error(error);
      }
    }
  }

  function isRowLoaded({ index }) {
    return index < (nftList.length / countNftItemInRow);
  }

  function rowRenderer({ key, index, style }) {
    let nftItemForCurrentRow = nftList
      .filter(({ title }) => title.toLowerCase().indexOf(search.toLowerCase()) != -1)
      .slice(index * countNftItemInRow, (index + 1) * countNftItemInRow);

    if (nftItemForCurrentRow.length < countNftItemInRow && !search) {
      nftItemForCurrentRow = nftItemForCurrentRow.concat(
        (new Array(countNftItemInRow - nftItemForCurrentRow.length))
          .fill(1)
          .map(() => ({ id: Math.random() }))
      );
    }

    return (
      <div
        key={key}
        style={style}
        className={styles['nft-list']}
      >
        {
          nftItemForCurrentRow
            .map(nftItem => (
              <NftItem
                key={nftItem?.id}

                className="m-2"

                {...(nftItem || null)}
              />
            ))
        }
      </div>
    );
  }

  function updateCountNftItemInRow() {
    const clientNftListWrapperWidth = Math.min(
      parseInt(styles.maxNftListWidth),
      nftListWrapperRef.current.clientWidth
    );
    const currentCountNftItemInRow = getCurrentCountNftItemInRow();

    setCountNftItemInRow(currentCountNftItemInRow);
    setNftItemHeight(
      ( // calculate nft height of image
        clientNftListWrapperWidth / currentCountNftItemInRow
          - 2 // border
          - 16 // margin
      )
        + 44 // height of text block
        + 16 // margin
        + 2 // border
    );
  }

  function getCurrentCountNftItemInRow() {
    const clientNftListWrapperWidth = Math.min(
      parseInt(styles.maxNftListWidth),
      nftListWrapperRef.current.clientWidth
    );

    return Math.ceil(Math.min(
      clientNftListWrapperWidth / parseInt(styles.maxNftItemWidth) - 1,
      parseInt(styles.maxColumnCount)
    ));
  }
}
