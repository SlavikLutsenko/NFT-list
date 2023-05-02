import axios from 'axios';
import axiosRetry from 'axios-retry';
import qs from 'qs';

axiosRetry(
  axios,
  {
    retries: 3,
    shouldResetTimeout: true,
    retryDelay: retryCount => retryCount * 1000,
  }
);

export class Nft {
  static async getNftList(offset, limit, config = {}) {
    return (await axios.get(
      `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?${
        qs.stringify({
          collectionSymbol: 'okay_bears',
          offset: offset,
          limit: limit,
        })
      }`,
      config
    )).data.results;
  }
}
