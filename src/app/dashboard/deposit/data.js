"use client";

import { FaGooglePay } from "react-icons/fa6";
import { FaPaypal } from "react-icons/fa";
import { RiVisaFill } from "react-icons/ri";
import { SiWise } from "react-icons/si";
import { BsBank2 } from "react-icons/bs";
import { v4 as uuid } from "uuid";

export const cryptoDeposits = [
  // { id: 1, name: 'USDT - BEP20', network:"evm",currency:"USDT", chain:'bsc', isNative:false,contractAddress:"0x55d398326f99059ff775485246999027b3197955" },
  // { id: 2, name: 'USDT - TRC20', network:"evm",currency:"USDT", chain:'trc', isNative:false,contractAddress:"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"},
  // { id: 5, name: 'SOLANA - SOL', network:"solana",currency:"SOL", chain:'sol', isNative:true,contractAddress:""},
  // { id: 3, name: 'BNB - BEP20', network:"evm",currency:"BNB", chain:'bsc', isNative:true,contractAddress:"" },
  // {
  //   id: uuid(),
  //   name: 'Ton',
  //   symbol: 'Ton',
  //   pair: 'TONUSDT',
  //   currency: "ton",
  //   network: "ton",
  //   icon: '/assets/images/crypto/ton.svg',
  //   disabled: true,
  //   isNative: true,

  // },
  {
    id: uuid(),
    name: "BNB",
    symbol: "bnb",
    pair: "BNBUSDT",
    currency: "BNB",
    network: "evm",
    chain: "bsc",
    icon: "/assets/images/crypto/bnb.svg",
    disabled: true,
    isNative: true,
    minDeposit: 0.1,
  },
  {
    id: uuid(),
    name: "ETH",
    symbol: "eth",
    pair: "BETHUSDT",
    currency: "ETH",
    network: "evm",
    chain: "mainnet",
    icon: "/assets/images/crypto/eth.svg",
    disabled: true,
    isNative: true,
    minDeposit: 0.1,
  },
  {
    id: uuid(),
    name: "Solana",
    symbol: "sol",
    network: "solana",
    chain: "sol",
    currency: "SOL",
    isNative: true,
    pair: "SOLUSDT",
    icon: "/assets/images/crypto/solana.svg",
    disabled: true,
    minDeposit: 0.25,
  },

  {
    id: uuid(),
    name: "Matic Polygon",
    symbol: "matic",
    pair: "MATICUSDT",
    network: "evm",
    chain: "polygon",
    currency: "MATIC",
    icon: "/assets/images/crypto/matic.svg",
    disabled: true,
    minDeposit: 150,
  },
  // {
  //   id: uuid(),
  //   name: "BTC",
  //   symbol: "bitcoin",
  //   pair: "BTCUSDT",
  //   network: "btc",
  //   chain: "btc",
  //   currency: "BTC",
  //   icon: "/assets/images/crypto/btc.svg",
  //   disabled: true,
  //   isNative: true,
  //   minDeposit: 0.1,
  // },
  // {
  //   id: uuid(),
  //   name: "XRP",
  //   symbol: "Ripple",
  //   pair: "XRPUSDT",
  //   network: "evm",
  //   chain: "bsc",
  //   currency: "XRP",
  //   icon: "/assets/images/crypto/xrp.svg",
  //   disabled: true,
  //   isNative: false,
  //   minDeposit: 10,
  //   contractAddress:"0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE"
  // },
  // {
  //   id: uuid(),
  //   name: 'Avalanche',
  //   symbol: 'avax',
  //   pair: 'AVAXUSDT',
  //   network: "evm",
  //   icon: '/assets/images/crypto/avalanch.svg',
  //   disabled: true
  // },
  // { id: 4, name: 'SOLANA - BEP20', network:"evm",currency:"SOL", chain:'bsc', isNative:false,contractAddress:"0x570A5D26f7765Ecb712C0924E4De545B89fD43dF" },
  // { id: 6, name: 'TON - TON', network:"ton",currency:"TON", chain:'ton', isNative:true,contractAddress:""},
  // { id: 7, name: 'Zaq - BEP20', network:"evm",currency:"ZAQTOK", chain:'bsc', isNative:false,contractAddress:"0xb7F2F74eAE83074eDe6e04b76ECB80320185b0AF"},
  // {
  //   id: uuid(),
  //   name: 'Tron',
  //   symbol: 'trc',
  //   pair: 'TRXUSDT',
  //   network: "trc20",
  //   icon: '/assets/images/crypto/tron.svg',
  //   disabled: true
  // },
  // {
  //   id: uuid(),
  //     name: 'Ton',
  //     symbol: 'ton',
  //     pair: 'TONUSDT',
  //     icon: '/assets/images/crypto/ton.svg',
  //     disabled:true
  // },
];

export const onlinePayments = [
  {
    title: "Paypal",
    icon: <FaPaypal className="text-3xl text-white/80" />,
    desc: "",
  },
  {
    title: "Google Pay",
    icon: <FaGooglePay className="text-3xl text-white/80" />,
    desc: "",
  },
  {
    title: "Wise",
    icon: <SiWise className="text-3xl text-white/80" />,
    desc: "",
  },
  {
    title: "Bank Transfer",
    icon: <BsBank2 className="text-3xl text-white/80" />,
    desc: "",
  },
  {
    title: "Local Cards",
    icon: <RiVisaFill className="text-3xl text-white/80" />,
    desc: "",
  },
];
