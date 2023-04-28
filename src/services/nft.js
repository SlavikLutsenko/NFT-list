import axios from 'axios';
import qs from 'qs';

export class Nft {
  static async getNftList() {
    return (await axios.get(
      `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?${
        qs.stringify({
          collectionSymbol: 'okay_bears',
          offset: 0,
          limit: 20,
        })
      }`
    )).data.results;
  }
}
