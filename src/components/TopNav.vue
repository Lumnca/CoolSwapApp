<template>
    <div class="top">
        <flexbox>
            <flexbox-item>
                <div class="flex-demo">
                    <img src="../assets/cool.png">
                    <span class="pd8" @click="openMenu()">
                        <i class="fs32 iconfont icon-caidan1"></i>
                    </span>
                </div>
            </flexbox-item>
            <flexbox-item>
                <div class="topb tr">
                    <button @click="toConnectWallet()" class="button-m">
                        <span v-if="account"> <i class="iconfont icon-qianbao1"></i> {{ account }}<i
                                class="el-icon-arrow-down"></i></span>
                        <span v-else>Connect Wallet</span>
                    </button>
                </div>
            </flexbox-item>
        </flexbox>
        <div>
            <x-dialog v-model="showToast" class="dialog-demo">
                <div>
                    <div>
                        <div class="dialog-title">You Wallet <span class="close" @click="showToast = false">
                                <i class="iconfont icon-guanbi"></i>
                            </span></div>
                        <div class="dialog-body  itxst">
                            Your Address : {{ account }} &nbsp;<i @click="copy()" class="iconfont icon-fuzhi"></i>
                        </div>
                        
                        <div class="dialog-footer">
                            <button class="button-s">logout <i class="iconfont icon-tuichu"></i> </button>
                        </div>


                    </div>

                </div>
            </x-dialog>
        </div>
        <toast v-model="tipVisible" :type="type" :time="3000" is-show-mask>{{ msg }}</toast>
    </div>
</template>

<script>
import { Icon, Flexbox, FlexboxItem, XButton, Toast, XDialog } from 'vux'
import Clipboard from "clipboard";
export default {
    name: 'TopNav',
    components: {
        Icon,
        Flexbox,
        FlexboxItem,
        XButton,
        Toast,
        XDialog
    },
    data() {
        return {
            active: 'ido',
            account: null,
            flag: true,//防止多次调用
            tipVisible: false,
            logoutFlag: false,
            msg: '',
            type: 'success',
            showToast: false
        }
    },
    methods: {
        tipMessage(txt, type) {
            this.msg = txt;
            this.type = type ? 'warn' : 'success';
            this.tipVisible = true;
        },
        openMenu() {
            this.$router.push('/');
        },
        toConnectWallet() {
            if (this.hasAccount() && !this.logoutFlag) {
                this.showToast = true;
                return;
            }
            if (ethereum) {
                if (this.logoutFlag) {
                    this.logoutFlag = false;
                    this.tipMessage('connect wallet success!')
                    this.setAccount(this.getAccount());
                }
                ethereum.request({ method: 'eth_requestAccounts' });
            }
            else {
                this.tipMessage('Server Error', true);
            }
        },
        getAccount() {
            if (!ethereum) return null;
            return ethereum.selectedAddress;
        },
        setAccount(str) {
            this.account = str.substr(0, 4) + "..." + str.substr(str.length - 4, str.length);
            window.sessionStorage.setItem('_account', str.toString());
        },
        hasAccount() {
            return this.getAccount() ? true : false;
        },
        clearAccount() {
            this.account = null;
            window.sessionStorage.removeItem('_account');
        },
        addNetwork() {
            try {
                ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x61',
                            chainName: 'chain97',
                            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                        },
                    ],
                });
            }
            catch (err) {
                this.tipMessage('Service exception!', true)
            }

        },
        changeNetwork() {
            if (ethereum) {
                try {
                    ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                        } catch (addError) {
                        }
                    }
                }
            } else {
                alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
            }
        },
        copy() {
            let clipboard = new Clipboard(".itxst", {
                text: () => {
                    //返回需要复制的字符串
                    return this.getAccount();
                },
            });
            clipboard.on("success", () => {

                this.tipMessage('copy success!')
                clipboard.destroy();
            });
            clipboard.on("error", () => {
                this.tipMessage("copy fail!", true);
                clipboard.destroy();
            });
        },
        logout() {
            this.tipVisible = false;
            this.logoutFlag = true;
            this.tipMessage("lose connect!", true);
            this.clearAccount();
        }
    },
    mounted() {
        //插件检测
        if (typeof ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            ethereum.on('accountsChanged', (res) => {
                if (this.flag) {
                    if (res[0]) {
                        this.tipMessage("connect wallet success!");
                        this.setAccount(res[0]);
                        if (ethereum.chainId !== 97) {
                            this.changeNetwork();
                        }
                    }
                    else {
                        this.tipMessage("lose connect!", true);
                        this.clearAccount();
                    }
                    this.flag = false;
                }

            })
            ethereum.on('chainChanged', (res) => {
                console.log('=====================chainChanged====================')
                console.log(res);
            })
            ethereum.on('disconnect', () => {
                console.log('=====================disconnect====================')
                this.clearAccount();
            })
        }
        else {
            this.tipMessage('MetaMask is not installed!', true);
        }
        //网络检测
        if (Number(ethereum.chainId) !== 97) {
            this.addNetwork();
        }
        //账户信息获取
        setTimeout(() => {
            var account = this.getAccount();
            this.flag = true;
            if (account && !this.logoutFlag) {
                this.setAccount(account);
            }
        }, 3000);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
    padding: 32px;
    font-family: 'Orbitron';
    font-size: 24px;
}

.topb {
    padding-bottom: 8px;
}
</style>
