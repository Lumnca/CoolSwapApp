
import {ethers} from 'ethers';
import {Erc20Abi} from './Erc20';




function getBalance(address,provide,account){
    let contract = new ethers.Contract(address, Erc20Abi.abi, provide.getSigner());
    return contract.balanceOf(account);
}

export {getBalance};