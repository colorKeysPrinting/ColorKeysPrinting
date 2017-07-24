export default function assets(key) {
  const assetsMock = {
    // './images/sibi.png': '/_karma_webpack_/atomicjolt-92b4dadbb4b4c6bc62bcd225dbefa9d3.png'
  };
  return assetsMock[key];
}

assets.keys = () => ([
  './images/sibi.png'
]);
