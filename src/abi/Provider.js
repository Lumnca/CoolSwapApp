import {ethers} from 'ethers';

const ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
const BNBAbiADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
const HTTPNODE = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
//自己定义的合约节点提供者
const customHttpProvider = new ethers.providers.JsonRpcProvider(HTTPNODE);


export { ADDRESS,HTTPNODE,customHttpProvider,BNBAbiADDRESS };