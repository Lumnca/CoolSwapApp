<template>
    <div class="top">
        <flexbox>
            <flexbox-item>
                <div class="flex-demo">
                    <a href="/"><img src="../assets/cool.png" /></a>
                    <span class="pd8" @click="openMenu()">
                        <i class="fs32 iconfont icon-caidan1"></i>
                    </span>
                </div>
            </flexbox-item>
            <flexbox-item :span="7">
                <div class="topb tr">
                    <flexbox>
                        <flexbox-item>
                            <button @click="toConnectWallet()" class="button-m">
                                <span v-if="account"> <i class="iconfont icon-qianbao1"></i> {{ account }}<i
                                        class="el-icon-arrow-down"></i></span>
                                <span v-else>{{ $t('cw') }}</span>
                            </button>
                        </flexbox-item>
                        <flexbox-item :span="2">
                            <button class="button-m">
                                <span @click="changeLangage()">
                                    {{ $t('lang') }}
                                </span>
                            </button>
                        </flexbox-item>
                    </flexbox>


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
                            {{ $t('YourAddress') }} &nbsp;<i @click="copy()"
                                class="iconfont icon-fuzhi"></i> {{ accountAddress }} 
                        </div>

                        <div class="dialog-footer">
                            <button class="button-s" @click="logout()">{{ $t('Logout') }} <i
                                    class="iconfont icon-tuichu"></i>
                            </button>
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
import { Router, WBNB, strId, ChainId, ChainName, rpcUrl } from '../abi/Provider';
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
            flag: true,
            tipVisible: false,
            logoutFlag: false,
            msg: '',
            type: 'success',
            showToast: false,
            accountAddress: ''
        }
    },
    methods: {
        changeLangage() {
            this.$i18n.locale = (this.$i18n.locale == 'en' ? 'zh' : 'en');
            localStorage.setItem('_en', this.$i18n.locale);
            location.reload();
        },
        tipMessage(txt, type) {
            this.msg = txt;
            this.type = type ? 'warn' : 'success';
            this.tipVisible = true;
        },
        openMenu() {
            this.$router.push('/home');
        },
        toConnectWallet() {
            if (this.account) {
                this.showToast = true;
                return;
            }
            if (ethereum) {
                if (this.accountAddress) {
                    this.tipMessage(this.$t('tips.cws'))
                    this.setAccount(this.accountAddress);
                }
                ethereum.request({ method: 'eth_requestAccounts' });
            }
            else {
                this.tipMessage('NetWork Error', true);
            }
        },
        getAccount() {
            if (!ethereum) return null;
            else {
                return new Promise((res, rej) => {
                    ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
                        this.accountAddress = accounts[0];
                        res(accounts[0]);
                    });
                })
            }
        },
        setAccount(str) {
            this.accountAddress = str;
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
                            chainId: strId,
                            chainName: ChainName,
                            rpcUrls: [rpcUrl],
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
                        params: [{ chainId: strId }], // chainId must be in hexadecimal numbers
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
                    return this.accountAddress;
                },
            });
            clipboard.on("success", () => {
                this.tipMessage(this.$t('tips.cs'))
                clipboard.destroy();
            });
            clipboard.on("error", () => {
                this.tipMessage(this.$t('tips.cf'), true);
                clipboard.destroy();
            });
        },
        logout() {
            this.showToast = false; 
            this.tipMessage(this.$t('tips.nc'),true);
            this.clearAccount();
        }
    },
    mounted() {
        this.timer = setInterval(()=>{
            if(!this.account){
                this.setAccount(this.accountAddress||sessionStorage.getItem('_account')||ethereum.selectedAddress);
                console.log("获取id成功！")
            }
            else{
                console.log('清除')
                clearInterval(this.timer);
            }
        },1500);
        //语言检测
        this.$i18n.locale = localStorage.getItem('_en') || 'en';
        //插件检测
        if (typeof ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            ethereum.on('accountsChanged', (res) => {
                if (res[0]) {
                    this.tipMessage(this.$t('tips.cws'));
                    this.setAccount(res[0]);
                    if (Number(ethereum.chainId) !== ChainId) {
                        this.changeNetwork();
                    }
                }
                else {
                    this.tipMessage(this.$t('tips.nc'), true);
                    this.clearAccount();
                }
                location.reload();
            })
            ethereum.on('chainChanged', (res) => {
                console.log('=====================chainChanged====================')
                console.log(res);
                location.reload();
            })
            ethereum.on('disconnect', () => {
                console.log('=====================disconnect====================')
                this.clearAccount();
            })
            ethereum.on('connect', () => {
                let id = sessionStorage.getItem('_account');
                console.log('获取连接'+id);
                if(id){
                     this.setAccount(id);
                    return;
                }
                var res = this.getAccount();
                if (res) {
                    res.then(account => {
                        if (account && !this.logoutFlag) {
                            this.setAccount(account);
                        }
                        //网络检测
                        if (Number(ethereum.chainId) !== ChainId && ethereum.chainId) {
                            console.log(ethereum.chainId)
                            this.addNetwork();
                        }
                    })
                }
                else {
                    this.$message(this.$t('tips.cw'));
                }
            });
        }
        else {
            this.tipMessage('MetaMask is not installed!', true);
        }
    },
    destroyed() {
        ethereum.removeListener('connect');
        ethereum.removeListener('disconnect');
        ethereum.removeListener('chainChanged');
        ethereum.removeListener('accountsChanged');
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
    padding: 16px;
    font-family: 'Orbitron';
    font-size: 24px;
}

.topb {
    padding-bottom: 8px;
}
</style>
