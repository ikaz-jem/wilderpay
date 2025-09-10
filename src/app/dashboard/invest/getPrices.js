"use server";

import axios from "axios";

export async function getPrices(tickers) {
  let symbols = JSON.stringify(tickers);
  let endpoint = `https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`;
  let prices = await axios.get(endpoint).then((res) => res.data);
  return prices;
}
