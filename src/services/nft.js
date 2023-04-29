import axios from 'axios';
import qs from 'qs';

export class Nft {
  static async getNftList(page = 1, pageSize = 20) {
    return (await axios.get(
      `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?${
        qs.stringify({
          collectionSymbol: 'okay_bears',
          offset: (page - 1) * pageSize,
          limit: pageSize,
        })
      }`
    )).data.results;
  }
}
