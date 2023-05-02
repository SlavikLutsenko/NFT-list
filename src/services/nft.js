import axios from 'axios';
import qs from 'qs';

export class Nft {
  static async getNftPage(page = 1, pageSize = 20, config = {}) {
    return Nft.getNftList(
      (page - 1) * pageSize,
      pageSize,
      config
    );
  }

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
