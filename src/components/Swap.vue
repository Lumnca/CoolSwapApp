<template>
    <div class="swap">
        <div class="swap-box">
            <flexbox>
                <flexbox-item>
                    <div class="flex-demo font-or fs20">
                        Swap
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <div class="flex-demo tr">
                        <i @click="clear()" class="iconfont icon-shuaxin1 fs20"></i>
                    </div>
                </flexbox-item>
            </flexbox>
            <br />
            <div>
                <div class="font-or fc1">
                    <img :src="to.logo" height="14" />
                    {{ to.symbol }}
                    <span @click="openList(0)">
                        <i class="iconfont icon-xiala icon-m"></i>
                    </span>
                    <span class="fr fc2">Balance: {{ balance }}</span>
                </div>
                <div>
                    <input v-model="toValue" :dis="isComputed2 ? '1' : ''" @input="changeV1()" placeholder="0"
                        type="number" class="input-s" style="width: 100%;" />
                </div>
                <div class="tc pd8">
                    <i @click="exchangeToken()" class="iconfont icon-igw-l-switch-1 fs20"></i>
                </div>
                <div class="font-or">
                    <img :src="from.logo" height="14" />
                    {{ from.symbol }}
                    <span @click="openList(1)">
                        <i class="iconfont icon-xiala  icon-m"></i>
                    </span>
                    <span class="fr fc2">Balance: {{ balance2 }}</span>
                </div>
                <div>
                    <input v-model="fromValue" :dis="isComputed1 ? '1' : ''" @input="changeV2()" placeholder="0"
                        type="number" class="input-s" style="width: 100%;" />
                </div>
                <br />
                <div>
                    <flexbox>
                        <flexbox-item>
                            <div class="font-or fs10">
                                Slippage Tolerance
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div class="tr font-or">
                                {{slippage*100}} % <i @click="setSlippage()" class="iconfont icon-shezhi fs20"></i>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
                <div class="but">
                    <button class="button-m" @click="swap()">
                        <span v-if="needApprove" class="font-or fs16">Approve</span>
                        <span v-else-if="isNullValue()" class="font-or fs16"> Enter Amount</span>
                        <span v-else-if="!isCanExchange()" class="font-or fs16">Insufficient {{ this.to.symbol }}
                            Balance
                        </span>
                        <span v-else class="font-or fs16">Swap</span>
                    </button>
                </div>
            </div>
        </div>
        <div>
            <div>
                <x-dialog v-model="dialogVisible" class="dialog-demo">
                    <div class="dialog-title">Token List <span class="close" @click="dialogVisible = false">
                            <i class="iconfont icon-guanbi"></i>
                        </span></div>

                    <div class="dialog-body" style="height: 300px;overflow-y: auto;">
                        <div>
                            Select a token
                        </div>
                        <div>
                            <input style="width: 95%;" @input="search()" v-model="searchValue" class="input-s"
                                placeholder="Search name or paste address" />
                        </div>
                        <div class="list-option tl font-or" v-for="item in filterList" :key="item.symbol"
                            @click="selectType(item)">
                            <img :src="item.logo" height="14" /> {{ item.symbol }}
                        </div>
                    </div>
                </x-dialog>
            </div>

        </div>
    </div>
</template>

<script>
import { Flexbox, FlexboxItem, Divider, XInput, Group, XButton, Cell, XDialog, XSwitch, AjaxPlugin, Panel, Radio } from 'vux'
import { swapContract, getBalance } from '../abi/Contract';
import { ethers } from 'ethers';
import { Erc20Abi } from '../abi/Erc20'
import { UniswapV2Router } from '../abi/UniswapV2Router';
import { ADDRESS, BNBAbiADDRESS, webHttpProvider } from '../abi/Provider';
import { BNBSwap } from '../abi/BNBSwap';
export default {
    name: 'Swap',
    components: {
        Flexbox, FlexboxItem, Divider, XInput, Group, XButton, Cell, XDialog,
        XSwitch, Panel, Radio
    },
    data() {
        return {
            dialogVisible: false,
            type: '',
            list: [],
            toValue: '',
            fromValue: '',
            to: { name: 'BNB', symbol: 'BNB', address: '', logo: '', decimals: 18 },
            from: { name: 'BNB', symbol: 'BNB', address: '', logo: '', decimals: 18 },
            currentValue: 0,
            filterList: [],
            searchValue: '',
            balance: 0,
            balance2: 0,
            isComputed1: false,
            isComputed2: false,
            tipVisible: false,
            needApprove: true,
            setVisible: false,
            slippage: 0.005,
            limit: 99999999,
        }
    },
    methods: {
        setSlippage(){
            this.slippage = ((this.slippage +0.0025)%0.0125)
            if(this.slippage === 0)this.slippage = 0.0025;
        },
        toast(txt) {
            this.$vux.toast.text(txt, 'top');
        },
        search() {
            if (this.searchValue == '') {
                this.filterList = [...this.list];
            }
            else {
                let s = this.searchValue;
                this.filterList = this.filterList.filter((v) => {
                    return v.symbol.toLocaleLowerCase().indexOf(s.toLocaleLowerCase()) >= 0;
                })
            }
        },
        openList(v) {
            this.dialogVisible = true;
            this.currentValue = v;
        },
        selectType(v) {
            this.toValue = '';
            this.fromValue = '';
            if (this.currentValue === 0) {
                this.to = v;
                this.getBalance(true);
            }
            else {
                this.from = v;
                this.getBalance(false);
            }
            this.isApprove();
            this.dialogVisible = false;
            this.toast('you select ' + v.symbol)
        },
        changeV1() {
            if (!this.toValue) {
                this.fromValue = '';
                return;
            }
            if (this.to.symbol === this.from.symbol) {
                this.toast('You use the same currency!')
                return;
            }
            if ((this.to.symbol === "BNB" && this.from.symbol === "WBNB") ||
                (this.from.symbol === "BNB" && this.to.symbol === "WBNB")) {
                let v = this.toValue;
                this.fromValue = v;
                this.per()
                return;
            }
            if (this.toValue > 0) {
                if (!this.to.address) this.to.address = BNBAbiADDRESS;
                if (!this.from.address) this.from.address = BNBAbiADDRESS;
                this.isComputed1 = true;
                swapContract.getAmountsOut(ethers.utils.parseEther(this.toValue), [this.to.address, this.from.address]).then(v => {
                    let v1 = ethers.utils.formatEther(v[1]);
                    this.fromValue = v1;
                    this.isComputed1 = false;
                    this.per()
                })

            }
            else {
                this.fromValue = 0;
            }
            this.isApprove();
        },
        changeV2() {
            if (!this.fromValue) {
                this.toValue = '';
                return;
            }
            if (this.to.symbol === this.from.symbol) {
                this.toast('You use the same currency!')
                return;
            }
            if ((this.to.symbol === "BNB" && this.from.symbol === "WBNB") ||
                (this.from.symbol === "BNB" && this.to.symbol === "WBNB")) {
                let v = this.fromValue;
                this.toValue = v;
                this.per()
                return;
            }
            if (this.fromValue >= 0) {
                if (!this.to.address) this.to.address = BNBAbiADDRESS;
                if (!this.from.address) this.from.address = BNBAbiADDRESS;

                this.isComputed2 = true;

                swapContract.getAmountsIn(
                    ethers.utils.parseEther(this.fromValue),
                    [this.to.address, this.from.address]
                )
                    .then(v => {
                        let v1 = ethers.utils.formatEther(v[0]);
                        this.toValue = v1;
                        this.isComputed2 = false;
                        this.per()
                    })

            }
            else {
                this.toValue = 0;
            }
            this.isApprove();
        },
        per() {
            this.perText = `${this.toValue === 0 ? 0 : 1} ${this.to.symbol} per ${this.toValue === 0 ?
                0 : (this.fromValue / this.toValue).toFixed(8)} ${this.from.symbol}`;
        },
        openWebsite(address) {
            this.$vux.toast.show({
                text: 'success!'
            })
            this.$vux.loading.hide();
        },
        getAccount() {
            if (!ethereum) return null;
            return ethereum._state.accounts[0] || null;
        },
        getBalance(type) {
            let provider = new ethers.providers.Web3Provider(ethereum, 'any');
            if (!this.getAccount()) {
                if (type) this.balance = 0.00;
                else this.balance2 = 0.00;
            }
            else {
                if (this.to.symbol === "BNB") {
                    provider.getBalance(this.getAccount()).then(res => {
                        this.balance = Number(ethers.utils.formatEther(res)).toFixed(5);
                    })
                }
                else {
                    getBalance(this.to.address, provider, this.getAccount()).then(res => {
                        this.balance = Number(ethers.utils.formatEther(res)).toFixed(5);
                    })
                }
                if (this.from.symbol === "BNB") {
                    provider.getBalance(this.getAccount()).then(res => {
                        this.balance2 = Number(ethers.utils.formatEther(res)).toFixed(5);
                    })
                }
                else {
                    getBalance(this.from.address, provider, this.getAccount()).then(res => {
                        this.balance2 = Number(ethers.utils.formatEther(res)).toFixed(5);
                    })
                }
            }
        },
        isNullValue() {
            return this.toValue === 0 || this.toValue === '';
        },
        isCanExchange() {
            return this.toValue <= this.balance && this.toValue;
        },
        getWeb3Provider() {
            return new ethers.providers.Web3Provider(ethereum, 'any');
        },
        swapWBNB() {
            //BNB-> WBNB交换合约
            let provider = new ethers.providers.Web3Provider(ethereum, 'any');
            let contract = new ethers.Contract(BNBAbiADDRESS, BNBSwap, provider.getSigner());
            contract.deposit({
                value: ethers.utils.parseEther(this.toValue.toString())
            }).then(res => {
                console.log(res);
                this.loadWaitTip();
                res.wait(1).then(() => {
                    this.openWebsite(res.hash);
                })
            })
        },
        swapBNB() {
            //WBNB->BNB取出
            let provider = new ethers.providers.Web3Provider(ethereum, 'any');
            let contract = new ethers.Contract(BNBAbiADDRESS, BNBSwap, provider.getSigner());
            contract.withdraw(
                ethers.utils.parseEther(this.toValue.toString())
            ).then(res => {
                console.log(res);
                this.loadWaitTip();
                res.wait(1).then(() => {
                    this.openWebsite(res.hash);
                })
            })
        },
        swapETHforToken() {
            let contract = new ethers.Contract(ADDRESS, UniswapV2Router.abi, this.getWeb3Provider().getSigner())
            contract.swapExactETHForTokens(
                ethers.utils.parseEther((this.fromValue * (1 - this.slippage)).toFixed(this.from.decimals)),//换多少钱
                //ethers.utils.parseUnits((this.fromValue * (1 - 0.005)).toString(), this.from.decimals),//转多少,多少位
                [BNBAbiADDRESS, this.from.address],//BNB->Token
                this.getAccount(),
                Math.floor((new Date().getTime() + 1000 * 60) / 1000)//响应时间
                , {
                    value: ethers.utils.parseEther(this.toValue.toString())//拿出多少值
                }).then(res => {
                    console.log(res);
                    this.loadWaitTip();
                    res.wait(1).then(() => {
                        this.openWebsite(res.hash);
                    })
                })
        },
        swapTokensForETH() {
            let contract = new ethers.Contract(ADDRESS, UniswapV2Router.abi, this.getWeb3Provider().getSigner())
            contract.swapExactTokensForETH(
                ethers.utils.parseEther(this.toValue.toString()),
                ethers.utils.parseEther((this.fromValue * (1 - this.slippage)).toFixed(this.from.decimals)),
                //ethers.utils.parseUnits(Number(this.toValue).toFixed(this.to.decimals), this.to.decimals),//转多少,多少位
                //ethers.utils.parseUnits((this.fromValue * (1 - 0.005)).toFixed(this.from.decimals), this.from.decimals),
                [this.to.address, BNBAbiADDRESS],
                this.getAccount(),
                Math.floor((new Date().getTime() + 1000 * 60) / 1000)
            ).then(res => {
                this.loadWaitTip();
                res.wait(1).then(() => {
                    this.openWebsite(res.hash);
                })
            })
        },
        swapTokensForTokens() {
            let contract = new ethers.Contract(ADDRESS, UniswapV2Router.abi, this.getWeb3Provider().getSigner());
            contract.swapExactTokensForTokens(
                ethers.utils.parseEther(this.toValue.toString()),
                ethers.utils.parseEther((this.fromValue * (1 - this.slippage)).toFixed(this.from.decimals)),
                [this.to.address, this.from.address],
                this.getAccount(),
                Math.floor((new Date().getTime() + 1000 * 60) / 1000)
            ).then(res => {
                this.loadWaitTip();
                res.wait(1).then(() => {
                    this.openWebsite(res.hash);
                })
            })
        },
        isApprove() {
            if (this.to.symbol === "BNB") {
                this.needApprove = false;
                return;
            }
            this.allowance(this.to.address, this.toValue).then(res => {
                console.log("allowance!")
                this.needApprove = false;
            }).catch(rej => {
                console.log("not allowance!")
                this.needApprove = true;
            })
        },
        approve(address) {
            var contract = new ethers.Contract(address || this.to.address, Erc20Abi.abi, this.getWeb3Provider().getSigner())
            contract.approve(ADDRESS, ethers.utils.parseEther(this.limit.toFixed(4))).then(res => {
                this.loadWaitTip();
                res.wait(1).then(() => {
                    this.needApprove = false;
                    this.toast('approve success!')

                    this.swap();
                })

            });
        },
        allowance(address, value) {
            var contract = new ethers.Contract(address || this.to.address, Erc20Abi.abi, this.getWeb3Provider().getSigner());
            return new Promise((res, rej) => {
                contract.allowance(this.getAccount(), ADDRESS).then(data => {
                    if (Number(data) > value) {
                        res(true);
                    }
                    else {
                        rej(false)
                    }
                }).catch(err => {
                    rej(err)
                })
            })
        },
        swap() {
            //余额
            if (!this.isCanExchange()) {
                return;
            }
            //验证
            if (this.needApprove) {
                this.approve();
                return;
            }
            if (this.to.symbol === "BNB" && this.from.symbol === "WBNB") this.swapWBNB();
            else if (this.to.symbol === "WBNB" && this.from.symbol === "BNB") this.swapBNB();
            else if (this.to.symbol === "BNB") this.swapETHforToken();
            else if (this.from.symbol === "BNB") this.swapTokensForETH();
            else this.swapTokensForTokens();
            return;
        },
        clear() {
             this.toValue = '';
            this.fromValue = '';
            this.getBalance(true);
            this.getBalance(false);
            this.changeV1();
            this.changeV2();
           
        },
        exchangeToken() {
            let temp = JSON.stringify(this.to);
            this.to = this.from;
            this.from = JSON.parse(temp);
            let tv = this.balance;
            this.balance = this.balance2;
            this.balance2 = tv;
        },
        loadWaitTip(txt) {
            this.$vux.loading.show({
                text: 'Loading'
            })
        }

    },
    mounted() {
        axios.get('/api/web/token')
            .then((response) => {
                this.list = [{ name: 'BNB', symbol: 'BNB', address: '', logo: 'https://assets.coingecko.com/coins/images/12591/thumb/binance-coin-logo.png?1600947313', decimals: 18 }];
                this.list = this.list.concat([...response.data.data]);
                this.to = this.list[0];
                this.from = this.list[1];
                this.filterList = [...this.list];
                this.getBalance(false);
                this.per()
                this.isApprove();
                  localStorage.setItem('_tokens', JSON.stringify(response.data.data));
            })
    },
}
import axios from 'axios';
</script>

<style>
.swap {
    padding: 32px;

}

.list-option {
    padding: 8px 16px;
    border: 1px solid #505050;
    border-radius: 3px;
    margin-top: 16px;
}


.swap-box {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 28px;
}

.but {
    margin-top: 12px;
}
</style>
