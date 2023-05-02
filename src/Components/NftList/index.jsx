import { useEffect, useRef, useState } from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';

import { Spinner } from '@/Components/Spinner';

import { Nft } from '@/services/nft';

import { NftItem } from './components/NftItem';

import styles from './styles.module.scss';

export function NftList() {
  const [nftList, setNftList] = useState([]);
  const [countNftItemInRow, setCountNftItemInRow] = useState(0);
  const [nftItemHeight, setNftItemHeight] = useState(340);

  const nftListWrapperRef = useRef();
  const nftListVirtualizedRef = useRef();

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
      className={styles['nft-list-wrapper']}
    >
      {
        countNftItemInRow
          ? (
            <AutoSizer>
              {({ height, width }) => (
                <InfiniteLoader
                  isRowLoaded={isRowLoaded}
                  loadMoreRows={loadMoreRows}
                  rowCount={Math.ceil(nftList.length / countNftItemInRow) + 3}
                >
                  {({ onRowsRendered, registerChild }) => (
                    <List
                      height={height}
                      onRowsRendered={onRowsRendered}
                      ref={list => {
                        nftListVirtualizedRef.current = list;
                        registerChild(list);
                      }}
                      rowCount={Math.ceil(nftList.length / countNftItemInRow) + 3}
                      rowHeight={() => nftItemHeight}
                      rowRenderer={rowRenderer}
                      width={width}
                      overscanRowCount={2}
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
  );

  async function loadMoreRows({ startIndex: startRow, stopIndex: stopRow }, config = {}) {
    const newNftItem = await Nft.getNftList(
      startRow * countNftItemInRow,
      (stopRow - startRow + 1) * countNftItemInRow,
      config
    );

    setNftList(currentNftItems => currentNftItems.concat(newNftItem));
  }

  function isRowLoaded({ index }) {
    return index < (nftList.length / countNftItemInRow);
  }

  function rowRenderer({ key, index, style }) {
    const nftItemForCurrentRow = nftList.slice(index * countNftItemInRow, (index + 1) * countNftItemInRow);
    const emptyNftItemForCurrentRow = (new Array(countNftItemInRow))
      .fill(1)
      .map(() => ({ id: Math.random() }));

    return (
      <div
        key={key}
        style={style}
        className={styles['nft-list']}
      >
        {
          (
            nftItemForCurrentRow.length
              ? nftItemForCurrentRow
              : emptyNftItemForCurrentRow
          )
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
