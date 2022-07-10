<template>
  <div>
    <div class="item-box">
      <div>
        <div class="item-row">
          <img :src="ido.imgData" height="243" width="100%" class="img-m" />
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="2">
              <div class="tl fs20">Stage</div>
            </flexbox-item>
            <flexbox-item :span="10">
              <div class="tr fc3">
                <span class="tag-block fs16">{{ stateInfo }} </span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="6">
              <div class="tl fs20">Inprogress</div>
            </flexbox-item>
            <flexbox-item :span="6">
              <div class="tr fc3 fs16">
                <span class="tag-block"> {{ progress }}% ({{ buyNumber }}/{{ totalNumber }})</span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="top-but" style="padding: 8px;font-size: 20px;">
        <button-tab v-model="model">
          <button-tab-item><b>Buy</b></button-tab-item>
          <button-tab-item><b>Sell</b></button-tab-item>
          <button-tab-item><b>Exchange</b></button-tab-item>
        </button-tab>
      </div>
      <!--BUY-->
      <div v-if="model === 0">
        <div class="item-row">
          <div class="tip fs16 fc3"><i class="iconfont icon-dengpao1"></i> {{ stateInfo }} </div>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item>
              <div class="tl fc2 fs14">Current Price</div>
            </flexbox-item>
            <flexbox-item>
              <div class="tr fs16 fc3">
                {{ price }} {{ tokenName }} per NFT
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="4">
              <div class="tl fc2 fs16">Quantity<br /><span class="fs10"> Balance: {{ tokenBalance }}</span> </div>
            </flexbox-item>
            <flexbox-item :span="8">
              <div class="tr">
                <i class="iconfont icon-jianhao icon-but" @click="changeV(-1)"></i>
                <input type="number" placeholder="0" class="input-x" style="width: 80px;" v-model="num" />
                <i class="iconfont icon-zengjia icon-but" @click="changeV(1)"></i>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <!--BUY END-->
      <!--EXchange -->
      <div v-else-if="model === 2">
        <div class="item-row">
          <div class="tip fc3 fs16"><i class="iconfont icon-zhihuan fs16"></i>
            Exchange Rate： 1 NFT = <b style="color: rgba(148, 111, 206,1);">{{ bv }}</b> {{
                tokenName2
            }}
          </div>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="4">
              <div class="tl fc fs14">NTF<br /><span class="fs10">Balance: {{ ntfBalance }}</span> </div>
            </flexbox-item>
            <flexbox-item :span="8">
              <div class="tr">
                <i class="iconfont icon-jianhao icon-but" @click="changeV(-1)"></i>
                <input type="number" placeholder="0" class="input-x" style="width: 80px;" v-model="ntfValue" />
                <i class="iconfont icon-zengjia icon-but" @click="changeV(1)"></i>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <!--EXchange END -->
      <!--sell-->
      <div v-else>
        <div class="item-row">
          <div class="tip fs16 fc3"><i class="iconfont icon-dengpao2"></i> Unexchanged NFTs can be sold back within 7
            days </div>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item>
              <div class="tl fc2 fs16">Current Price</div>
            </flexbox-item>
            <flexbox-item>
              <div class="tr fs16 fc3">
                {{ price }} {{ tokenName }} per NFT
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="4">
              <div class="tl fc2 fs16">Quantity<br /><span class="fs10">Balance:{{ ntfBalance }}</span> </div>
            </flexbox-item>
            <flexbox-item :span="8">
              <div class="tr">
                <i class="iconfont icon-jianhao icon-but" @click="changeV(-1)"></i>
                <input type="number" class="input-x" placeholder="0" style="width: 80px;" v-model="num" />
                <i class="iconfont icon-zengjia icon-but" @click="changeV(1)"></i>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <!--sell end-->
      <div style="padding: 16px 8px;">
        <div class="line2"></div>
      </div>
      <div class="item-row fc3 fs16">
        <flexbox>
          <flexbox-item :span="4">
            <div class="tl">
              <span v-if="model == 1"> Receive </span>
              <span v-else-if="model == 2">Token</span>
              <span v-else> Aumont</span>
            </div>
          </flexbox-item>
          <flexbox-item :span="8">
            <div class="tr">
              <span v-if="model == 1"> {{ (aumout * (1 - refundRate)).toPrecision(5) }} {{ tokenName
              }}</span>
              <span v-else-if="model == 2">
                {{ bv * ntfValue }}
              </span>
              <span v-else> {{ aumout }} {{ tokenName }}</span>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="item-row fc3">
        <div>
          <div v-if="model === 0">
            <button class="button-l" :dis="buttonInfo == 'Buy Now' ? '' : '1'" @click="buyBatch()">
              {{ buttonInfo }}
            </button>
          </div>
          <div v-else-if="model === 1">
            <button class="button-l" :dis="ntfBalance >= num ? '' : '1'" @click="buyBatch()">
              <span v-if="ntfBalance < num">Insufficient NFT Balance</span>
              <span v-else-if="outTime">Purchase Older Than 7 Days</span>
              <span v-else>Sell Back</span>
            </button>
          </div>
          <div v-else>
            <button @click="tokeRate()" class="button-l" :dis="ntfBalance >= ntfValue && ntfBalance > 0 ? '' : '1'">
              <span v-if="ntfBalance >= ntfValue && ntfBalance > 0">
                Exchange</span>
              <span v-else>
                Insufficient NFT Balance
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item-row">
        <b>Description</b>
      </div>
      <div class="item-row fs14 wap fc3">
        {{ ido.description }}
      </div>
      <div class="item-row">
        <span v-if="ido.telegram" @click="websiteHerf(ido.telegram)"><i class="iconfont icon-telegram"></i></span>
        <span v-if="ido.twitter" @click="websiteHerf(ido.twitter)" class="ml"><i
            class="iconfont icon-shejiaotubiao-20"></i></span>
        <span v-if="ido.website" @click="websiteHerf(ido.website)" class="ml"><i
            class="iconfont icon-shejiao-wangluo"></i></span>
        <span v-if="ido.facebook" @click="websiteHerf(ido.facebook)" class="ml"><i
            class="iconfont icon-facebook"></i></span>
      </div>
      <div style="padding: 16px 8px;">
        <div class="line2"></div>
      </div>
      <div class="item-row">
        <b> Details</b>
      </div>
      <div class="item-row info-text fc3 itxst">
        <div> <span class="fc2">ProjtcName: </span> {{ ido.title }} </div>
        <div> <span class="fc2">Developer: </span> {{ ido.developer }}</div>
        <div> <span class="fc2">Category: </span> {{ ido.category }} </div>
        <div> <span class="fc2">Language: </span> {{ ido.language }} </div>
        <div> <span class="fc2">Total Supply: </span> {{ totalSupply }}</div>
        <div> <span class="fc2">NFT address: </span>{{ ido.nftAddress.substr(0, 10) }}... <i class="iconfont icon-fuzhi"
            @click="copy(ido.nftAddress)"></i></div>
        <div> <span class="fc2">Contract Add: </span> {{ ido.address.substr(0, 10) }}...<i class="iconfont icon-fuzhi"
            @click="copy(ido.address)"></i>
        </div>
        <div> <span class="fc2">Token address:</span> {{ ido.paymentAddress.substr(0, 10) }}... <i
            class="iconfont icon-fuzhi" @click="copy(ido.paymentAddress)"></i></div>
      </div>
      <div style="padding: 16px 8px;">
        <div class="line2"></div>
      </div>
      <div class="item-row ">
        <b> Rule</b>
      </div>
      <div class="item-row fs14 wap fc3">
        {{ ido.rule }}
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Flexbox, FlexboxItem, ButtonTab, ButtonTabItem, Divider, XButton } from 'vux'
import { Project } from '../abi/Project';
import { ethers } from 'ethers';
import { ERC20, Erc20Abi } from '../abi/Erc20';
import { ERC721 } from '../abi/ERC721';
import { getBalance } from '../abi/Contract';
import Clipboard from "clipboard";
import Global from '../abi/Global';
String.prototype.padZero = function (length) {
  var s = this;
  while (s.length < length) {
    s = '0' + s;
  }
  return s;
};
export default {
  name: 'IdoItem',
  components: {
    Icon, Flexbox, FlexboxItem, ButtonTab, ButtonTabItem, Divider, XButton
  },
  data() {
    return {
      name: 'x',
      num: '',
      model: 0,
      ido: {
        address: "0x2946CF1e470c58042D0001510f07Df1b4430D32b",
        category: "Cigarette",
        description: "",
        developer: "Adripok",
        discord: null,
        doc: null,
        endTime: "2022-07-08 16:15:52",
        exchangeAddress: "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7",
        facebook: "https://facebook.com",
        img: null,
        imgData: "https://airnfts.s3.amazonaws.com/nft-images/20220313/Lazy_Anteater_15_1647179098137.png",
        language: "English",
        listingTime: "2022-07-06 16:15:52",
        medium: null,
        nftAddress: "0xc9338419b1132323d8b747dbbbcbaa0d4faa7493",
        paymentAddress: "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684",
        pid: 7,
        rule: "",
        startTime: "2022-07-06 14:15:52",
        status: "LIVE",
        telegram: "https://t.me",
        title: "Lazy Anteater",
        twitter: null,
        website: null,
      },
      stateInfo: 'State Info',
      buttonInfo: 'Buy',
      progress: 0,
      ntfValue: '',
      tokenValue: '',
      tokenId: '',
      model: 0,
      bv: 10,
      tokenName: 'Unknow',
      tokenName2: 'Unknow',
      priceName: '',
      price: 1,
      aumout: 0,
      buyNumber: 0,
      totalNumber: 0,
      ntfBalance: 0,
      isWhiteList: false,
      refundRate: 0,
      loading: false,
      totalSupply: 0,
      whitetingState: 'Start in 0d 00:00:00',
      startSaleTime: 'Start in 0d 00:00:00',
      tokenBalance: 0,
      state: [0, 0],//0:未开始,1:正在开始，-1:结束,
      stateInfo: 'Button',
      approves: [false, false]//NTF 与 Token的授权
    }
  },
  methods: {
    changeV(value) {
      this.num = Number(this.num);
      if (this.model === 2) {
        if (!this.ntfValue) this.ntfValue = 0;
        this.ntfValue += value;
        this.ntfValue = Math.floor(this.ntfValue > 0 ? this.ntfValue : 0);
        this.ntfChange();
      }
      else {
        this.num += value;
        this.num = (this.num > 0 ? this.num : 0);
        this.changeNum();
      }
    },
    websiteHerf(url) {
      open(url);
    },
    isApprove() {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      var contract = new ethers.Contract(this.ido.nftAddress, ERC721, provider.getSigner())
      contract.isApprovedForAll(this.getAccount(), this.ido.address).then(res => {
        console.log("NTF:" + res);
        this.approves[0] = res;
      });
    },
    isBuyApprove() {
      var contract = this.getEFC20Priveder();
      contract.allowance(this.getAccount(), this.ido.address).then(data => {
        if (data >= this.aumout) {
          this.approves[1] = true;
          console.log("Token YES")
        }
        else {
          this.approves[1] = false;
          console.log("Token NO")
        }
      });
    },
    successTip(txt) {
      this.$vux.toast.show({
        text: txt ? txt : 'success!'
      })
    },
    approve() {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      var contract = new ethers.Contract(this.ido.paymentAddress, ERC20, provider.getSigner())
      contract.approve(this.ido.address, ethers.utils.parseEther(Number(9999999999).toFixed(4))).then(res => {
        this.loadWaitTip();
        res.wait(1).then(v => {
          this.approves[1] = true;
          this.successTip('approve success!')
          this.buyBatch();
        })

      });
    },
    approve2(flag) {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      var contract = new ethers.Contract(this.ido.nftAddress, ERC721, provider.getSigner())
      contract.setApprovalForAll(this.ido.address, true).then(res => {
        this.loadWaitTip();
        res.wait(1).then(v => {
          this.approves[0] = true;
          this.successTip('approve success!')
          if (flag) this.tokeRate();
          else this.buyBatch();
        })

      });
    },
    getAccount() {
      if (!ethereum) return null;
      return ethereum.selectedAddress;
    },
    getProjectCurrentPriveder() {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      let contract = new ethers.Contract(this.ido.address, Project, provider.getSigner());
      return contract;
    },
    getEFC20Priveder() {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');

      let contract = new ethers.Contract(this.ido.paymentAddress, ERC20, provider.getSigner());
      return contract;
    },
    getExchangePriveder() {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      let contract = new ethers.Contract(this.ido.exchangeAddress, ERC20, provider.getSigner());
      return contract;
    },
    getNFTPriveder() {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      let contract = new ethers.Contract(this.ido.nftAddress, ERC721, provider.getSigner());
      return contract;
    },
    getOutTime() {
      let contract = this.getProjectCurrentPriveder();
      contract.refundDeadline().then(v => {
        let date = new Date().getTime();
        this.outTime = (v * 1000 - date > 0) ? false : true;
        console.log(v);
      })
    },
    getWhiteListTimestamp() {
      let date = Math.floor(new Date().getTime() / 1000);
      let endTime = 0;
      let contract = this.getProjectCurrentPriveder();
      //结束的时间
      contract.endTimestamp().then(res => {
        endTime = Number(res);
        console.log("end time:" + new Date(endTime * 1000));
        if (endTime < date) {
          this.whitetingState = 'End of sale';
          this.startSaleTime = 'End of sale';
          this.state = [-1, -1];
          this.getStateInfo();
        }
        else {
          //得到白名单发售的时间
          contract.startTimestamp().then(res => {
            let startTime = Number(res);
            contract.listingTimestamp().then(res => {
              //得到公开发售时间
              let listingTime = Number(res);
              if (date > startTime) {


                if (date > listingTime) {
                  this.startSaleTime = "End in " + this.getDateTime(endTime - date);
                  this.whitetingState = "End Of sale";
                  this.state[1] = 1;
                  this.state[0] = -1;
                }
                else {
                  this.startSaleTime = "Start in " + this.getDateTime(listingTime - date);
                  this.whitetingState = "End in " + this.getDateTime(listingTime - date);
                  this.state[1] = 0;
                  this.state[0] = 1;
                }
              }
              else {
                this.whitetingState = "Start in " + this.getDateTime(startTime - date);
                this.startSaleTime = "Start in " + this.getDateTime(listingTime - date);
                this.state[0] = 0;
                this.state[1] = 0;
              }
              this.getStateInfo();
            })
          })
        }
      })
    },
    getStateInfo() {
      if (this.progress == 100 || this.totalNumber === this.buyNumber) {
        this.stateInfo = 'Sold Out';
        this.buttonInfo = 'Sold Out';
      }
      else if (this.state[0] === -1 && this.state[1] === -1) {
        this.stateInfo = 'End Of Sale';
        this.buttonInfo = 'End Of Sale';
      }
      else if (this.state[0] === 0 && this.state[1] === 0) {
        this.stateInfo = 'Not on sale';
        this.buttonInfo = 'Not on sale';
      }
      else if (this.state[0] === 1 && this.isInWhitelist) {
        this.stateInfo = 'You are whitelisting allows user ';
        this.buttonInfo = 'Buy Now';
      }
      else if (this.state[0] === 1 && !this.isInWhitelist && this.state[1] === 0) {
        this.stateInfo = 'You are not whitelist allowed user, public sale ' + this.startSaleTime;
        this.buttonInfo = 'Only Whitelist Allowed';
      }
      else if (this.state[1] === 1) {
        this.stateInfo = 'Public Sale ' + this.startSaleTime;
        this.buttonInfo = 'Buy Now';
      }
      else {
        this.stateInfo = 'Unkown Error';
        this.buttonInfo = 'Not Buy';
      }
    },
    getProgress() {
      let contract = this.getProjectCurrentPriveder();
      contract.progress().then((res) => {
        this.buyNumber = res[0];
        this.totalNumber = res[1];
        this.progress = Math.floor((res[0] / res[1] * 100));
      })
    },
    userIsInWhitelist() {
      let contract = this.getProjectCurrentPriveder();
      contract.isInWhitelist(this.getAccount()).then((res) => {
        this.isInWhitelist = res;
      })
    },
    getNftPrice() {
      let contract = this.getProjectCurrentPriveder();
      contract.nftPrice().then((res) => {
        this.price = ethers.utils.formatEther(res);
        this.changeNum();
        this.isBuyApprove();
      })
    },
    getPayment() {
      let contract = this.getEFC20Priveder();
      contract.symbol().then(res => {
        this.tokenName = res;
        this.tokenId = this.getTokenAddress(res);
        this.getBalance();
      })
    },

    getTokenName() {
      let contract = this.getExchangePriveder();
      contract.symbol().then(res => {
        this.tokenName2 = res;
      })
    },
    //汇率比
    exchange() {
      let contract = this.getProjectCurrentPriveder();
      contract.tokeRate().then((res) => {
        let bv = ethers.utils.formatUnits(res);
        this.bv = bv;
        this.tokenValue = this.tokenValue * bv;
      })
    },
    toIDOItem() {
      this.$router.push('/IdoItem');
    },
    getNTFBalance() {
      let contract = this.getNFTPriveder();
      contract.balanceOf(this.getAccount()).then((res) => {
        this.ntfBalance = Number(res);
        if (this.ntfValue > this.ntfBalance) {
          this.ntfValue = this.ntfBalance;
        }
      })
    },
    getBalance(address) {
      let provider = new ethers.providers.Web3Provider(ethereum, 'any');
      getBalance(address ? address : this.tokenId, provider, this.getAccount()).then(res => {
        this.tokenBalance = Number(ethers.utils.formatEther(res)).toFixed(5);
      });
    },
    canBuy() {
      //检查数量
      if (this.num == '' || this.num == 0) {
        this.toast('please input buy count!');
        return false;
      }
      if (this.state[0] == 1 && this.isInWhitelist) {
        if (!this.approves[1]) {
          this.toast('you need approve!');
          this.approve();
          return false;
        }
        return true
      }
      else if (this.state[1] == 1 && this.tokenBalance >= this.aumout) {
        if (!this.approves[1]) {
          this.toast('you need approve!');
          this.approve();
          return false;
        }
        return true;
      }
      else {
        //this.$message.error("You can't buy it now!");
        return false;
      }
    },
    canSell() {
      if (this.ntfBalance < this.num || !this.num) {
        //this.$message.error("You don't have enough NTF");
        this.toast('You dont have enough NTF');
        return false;
      }
      else {
        if (this.approves[0]) return true;
        else {
          this.toast('you need approve!');
          this.approve2(false);
          return false;
        }
      }
    },
    buyBatch() {
      if (this.model === 1) {
        if (!this.canSell()) return;
        let contract = this.getProjectCurrentPriveder();
        contract.refund(this.num).then((res) => {
          this.loadWaitTip();
          res.wait(1).then(v => {
            this.openWebsite(res.hash);
            this.ntfBalance -= this.num;
            this.getBalance();
          })
        }).catch(err => {
          this.error(err);
        })
      }
      else if (this.model === 0) {
        console.log(this.num);
        if (!this.canBuy()) return;
        let contract = this.getProjectCurrentPriveder();
        contract.buyBatch(this.num).then((res) => {
          this.loadWaitTip();
          res.wait(1).then(v => {
            this.openWebsite(res.hash);
            this.ntfBalance += this.num;
            this.getBalance();
          })
        }).catch(err => {
          this.error(err);
        })
      }
    },
    getTokenAddress(symbol) {
      let tokens = localStorage.getItem('_tokens');
      let res = null;
      if (tokens) {
        tokens = [...JSON.parse(tokens)];
        tokens.forEach(t => {
          if (t.symbol === symbol) res = t.address;
        });
      }
      return res;
    },
    tokeRate() {
      if (this.ntfBalance <= 0 || this.ntfValue <= 0 || this.ntfValue > this.ntfBalance) {
        //this.$message.error("You don't have enough NTF!")
        return;
      }
      if (this.approves[0]) {

        let contract = this.getProjectCurrentPriveder();
        contract.exchange(this.ntfValue).then((res) => {
          this.loadWaitTip();
          res.wait(1).then(() => {
            this.openWebsite(res.hash);
            this.ntfBalance -= this.ntfValue;
            this.getBalance();
          });
        }).catch(err => {
          this.error(err);
        })
      }
      else {
        this.approve2(true);
      }
    },
    geTrefundFeeRate() {
      let contract = this.getProjectCurrentPriveder();
      contract.refundFeeRate().then((res) => {
        this.refundRate = res / 10000;
      });
    },
    getTotalSupply() {
      let contract = this.getNFTPriveder();
      contract.totalSupply().then(res => {
        this.totalSupply = res;
      })
    },
    ntfChange() {
      /*if (this.ntfValue > this.ntfBalance) {
          this.ntfValue = this.ntfBalance;
      }*/
      if (!this.ntfValue) return;
      this.tokenValue = this.ntfValue * this.bv;
    },
    tokenChange() {
      this.tokenValue = this.ntfValue * this.bv;
    },
    changeNum() {
      this.aumout = this.num * this.price;
      if(this.tokenBalance<this.aumout){
        this.buttonInfo = "Insufficient Token Balance";
      }
      else{
        this.getStateInfo();
      }
      this.isBuyApprove();
    },
    error(err) {
      console.log(err);
      this.toast('Service exception');
    },
    openWebsite(address) {
      this.refreash();
      this.$vux.toast.show({
        text: 'success!'
      })
      this.$vux.loading.hide();
    },
    getDateTime(secord) {
      let d = Math.floor(secord / (60 * 60 * 24));
      let h = Math.floor(secord / (60 * 60)) % 24;
      let m = Math.floor(secord / 60) % 60;
      let s = secord % 60;
      return `${d}d ${h.toString().padZero(2)}:${m.toString().padZero(2)}:${s.toString().padZero(2)}`;
    },
    copy(txt) {
      let clipboard = new Clipboard(".itxst", {
        text: () => {
          //返回需要复制的字符串
          return txt;
        },
      });
      clipboard.on("success", () => {
        this.toast("copy success!");
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.toast("copy fail!");
        clipboard.destroy();
      });
    },
    loadWaitTip(txt) {
      this.$vux.loading.show({
        text: 'Loading'
      });
    },
    toast(txt) {
      this.$vux.toast.text(txt, 'top');
    },
    refreash() {
      this.isApprove();
      this.getWhiteListTimestamp();
      this.getProgress();
      this.userIsInWhitelist();
      this.getNftPrice();
      this.getPayment();
      this.exchange();
      this.getTokenName();
      this.getNTFBalance();
      this.geTrefundFeeRate();
      this.getTotalSupply();
      this.getOutTime();
    }
  },
  mounted() {
    this.$vux.loading.show({
      text: 'Loading'
    });
    let pid = this.$router.currentRoute.query.pid;
    this.$http.get(Global.RequestApi + '/web/project', {
      params: {
        pid: pid
      }
    }).then(({ data }) => {
      console.log(data.data);
      this.ido = data.data;
      if (!this.getAccount()) {
        //this.$message("you should connect wallet!");
      }
      else {
        this.refreash();
      }
      this.$vux.loading.hide();
    }).catch(err => {
      console.log(err);
      //this.$message.error("Network error!");
      this.$vux.loading.hide();
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-box {
  border: 1px solid #ececec;
  /*filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));*/
  border-radius: 10px;
  margin: 16px;
  padding: 8px;
}

.ml {
  margin-left: 16px;
}

.info-text div {
  padding: 8px 0px;
}

.item-row {
  padding: 12px 16px;
}
</style>
