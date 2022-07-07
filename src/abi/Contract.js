import {customHttpProvider,ADDRESS} from './Provider';
import {UniswapV2Router} from './UniswapV2Router';
import {ethers} from 'ethers';
import {Erc20Abi} from './Erc20';


const swapContract = new ethers.Contract(ADDRESS,UniswapV2Router.abi,customHttpProvider);


function getBalance(address,provide,account){
    let contract = new ethers.Contract(address, Erc20Abi.abi, provide.getSigner());
    return contract.balanceOf(account);
}


export {swapContract,getBalance};