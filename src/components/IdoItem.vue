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
              <div class="tl fs20">{{ $t('stage') }}</div>
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
              <div class="tl fs20">{{ $t('inprogress') }}</div>
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
          <button-tab-item><b>{{ $t('buy') }}</b></button-tab-item>
          <button-tab-item><b>{{ $t('sell') }}</b></button-tab-item>
          <button-tab-item><b>{{ $t('Exchange') }}</b></button-tab-item>
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
              <div class="tl fc2 fs14">{{ $t('cp') }}</div>
            </flexbox-item>
            <flexbox-item>
              <div class="tr fs16 fc3">
                {{ price }} {{ tokenName }}
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="4">
              <div class="tl fc2 fs16">{{ $t('quantity') }}<br /><span class="fs10"> {{ $t('balance') }}: {{
                  tokenBalance
              }}</span> </div>
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
            {{ $t('ER') }}： 1 NFT = <b style="color: rgba(148, 111, 206,1);">{{ bv }}</b> {{
                tokenName2
            }}
          </div>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="4">
              <div class="tl fc fs14">NTF<br /><span class="fs10"> {{ $t('balance') }}: {{ ntfBalance }}</span> </div>
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
          <div class="tip fs16 fc3"><i class="iconfont icon-dengpao2"></i> {{ $t('u7') }}</div>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item>
              <div class="tl fc2 fs16">{{ $t('cp') }}</div>
            </flexbox-item>
            <flexbox-item>
              <div class="tr fs16 fc3">
                {{ price }} {{ tokenName }}
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="item-row">
          <flexbox>
            <flexbox-item :span="4">
              <div class="tl fc2 fs16">{{ $t('quantity') }}<br /><span class="fs10">{{ $t('balance') }}: {{ ntfBalance
              }}</span> </div>
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
              <span v-if="model == 1"> {{ $t('Receive') }} </span>
              <span v-else-if="model == 2">Token</span>
              <span v-else> {{ $t('Aumont') }}</span>
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
            <button class="button-l" :dis="buttonInfo == ('Buy Now' || '立即购买') && tokenBalance >= aumout ? '' : '1'"
              @click="buyBatch()">
              {{ buttonInfo }}
            </button>
          </div>
          <div v-else-if="model === 1">
            <button class="button-l" :dis="ntfBalance >= num && !outTime && releaseState ? '' : '1'"
              @click="buyBatch()">
              <span v-if="!releaseState">{{ $t('Locked') }}</span>
              <span v-else-if="ntfBalance < num">{{ $t('INB') }}</span>
              <span v-else-if="outTime">{{ $t('po7') }}</span>
              <span v-else>{{ $t('SB') }}</span>
            </button>
          </div>
          <div v-else>
            <button @click="tokeRate()" class="button-l"
              :dis="ntfBalance >= ntfValue && ntfBalance > 0 && releaseState ? '' : '1'">
              <span v-if="!releaseState">{{ $t('Locked') }}</span>
              <span v-else-if="ntfBalance >= ntfValue && ntfBalance > 0">
                {{ $t('Exchange') }}</span>
              <span v-else>
                {{ $t('INB') }}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
    <div class="item-box">
      <div class="item-row">
        <b>{{ $t('description') }}</b>
      </div>
      <div class="item-row fs14 wap fc3">
        {{ $i18n.locale == 'en' ? ido.description : ido.descriptionCN }}
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
        <b> {{ $t('details') }}</b>
      </div>
      <div class="item-row info-text fc3 itxst">
        <div> <span class="fc2">{{ $t('pn') }}: </span> {{ $i18n.locale == 'en' ? ido.title : ido.titleCN }} </div>
        <div> <span class="fc2">{{ $t('developer') }}: </span> {{ $i18n.locale == 'en' ? ido.developer : ido.developerCN
        }}
        </div>
        <div> <span class="fc2">{{ $t('category') }}: </span> {{ $i18n.locale == 'en' ? ido.category : ido.categoryCN }}
        </div>
        <div> <span class="fc2">{{ $t('language') }}: </span> {{ ido.language }} </div>
        <div> <span class="fc2">Total Supply: </span> {{ totalSupply }} {{ ido.exchangeSymbol }}</div>
        <div> <span class="fc2">{{ $t('na') }}: </span>{{ ido.nftAddress.substr(0, 10) }}... <i
            class="iconfont icon-fuzhi" @click="copy(ido.nftAddress)"></i></div>
        <div> <span class="fc2">{{ $t('cs') }}: </span> {{ ido.address.substr(0, 10) }}...<i class="iconfont icon-fuzhi"
            @click="copy(ido.address)"></i>
        </div>
        <div> <span class="fc2">{{ $t('ts2') }}:</span> {{ ido.paymentAddress.substr(0, 10) }}... <i
            class="iconfont icon-fuzhi" @click="copy(ido.paymentAddress)"></i></div>
      </div>
      <div style="padding: 16px 8px;">
        <div class="line2"></div>
      </div>
      <div class="item-row ">
        <b> {{ $t('rules') }}</b>
      </div>
      <div class="item-row fs14 wap fc3">
        {{ $i18n.locale == 'en' ? ido.rule : ido.ruleCN }}
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
        imgData: "",
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
        exchangeSymbol: '',
        releaseTime: null
      },
      stateInfo: 'State Info',
      buttonInfo: 'Buy',
      progress: 0,
      ntfValue: '',
      tokenValue: '',
      tokenId: '',
      model: 0,
      bv: 10,
      outTime: false,
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
      whilteBuyNumber: 0,
      whilteCanBuyNumber: 0,
      maxSellNumber: 999,
      state: [0, 0],//0:未开始,1:正在开始，-1:结束,
      stateInfo: 'NO INFO',
      releaseState: true,
      approves: [false, false]//NTF 与 Token的授权
    }
  },
  methods: {
    deplyLoad(method) {
      setTimeout(() => {
        method();
      }, 100);
    },
    changeV(value) {
      this.num = Number(this.num);
      if (this.model === 2) {
        if (!this.ntfValue || this.ntfValue>=this.ntfBalance) this.ntfValue = 0;
      
        this.ntfValue += value;
        this.ntfValue = Math.floor(this.ntfValue > 0 ? this.ntfValue : 0);
        this.ntfChange();
      }
      else {
        if (this.model === 0) {
          if (this.num < this.maxSellNumber) {
            this.num += value;
            this.num = (this.num > 0 ? this.num : 0);
          }
          else{
            this.num = 0;
          }
        }
        else {
          if (this.num < this.ntfBalance) {
            this.num += value;
            this.num = (this.num > 0 ? this.num : 0);
          }
          else{
            this.num = 0;
          }
        }
        this.changeNum();
      }
    },
    websiteHerf(url) {
      open(url);
    },
    isApprove() {
      let provider = new ethers.providers.Web3Provider(ethereum, "any");
      var contract = new ethers.Contract(this.ido.nftAddress, ERC721, provider.getSigner());
      contract.isApprovedForAll(this.getAccount(), this.ido.address).then(res => {
        console.log("NTF授权加载结果：" + res);
        this.approves[0] = res;
        this.deplyLoad(this.getProgress);
      });
    },
    isBuyApprove() {
      var contract = this.getEFC20Priveder();
      contract.allowance(this.getAccount(), this.ido.address).then(data => {
        console.log("获取TOKEN权限结果成功！")
        if (data > this.aumout) {
          this.approves[1] = true;
          console.log("Token YES");
        }
        else {
          this.approves[1] = false;
          console.log("Token NO");
        }
        this.deplyLoad(this.getBalance);

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
          this.successTip(this.$t('tips.as'));
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
          this.successTip(this.$t('tips.as'));
          if (flag) this.tokeRate();
          else this.buyBatch();
        })

      });
    },
    getWaitAccount() {
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
    getAccount() {
      return this.accountAddress;
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
        console.log("获取项目超时信息成功！")
        let date = new Date().getTime();
        this.outTime = (v * 1000 - date > 0) ? false : true;
        this.deplyLoad(this.isBuyApprove);
      }).catch(err => {
        this.error("获取项目超时信息成功！")
      });
    },
    getWhiteListTimestamp() {
      let date = Math.floor(new Date().getTime() / 1000);
      //结束时间
      let endTime = Math.floor(new Date(this.ido.endTime).getTime() / 1000);
      //得到公开发售时间
      let startTime = Math.floor(new Date(this.ido.startTime).getTime() / 1000);
      //得到公开发售时间
      let listingTime = Math.floor(new Date(this.ido.listingTime).getTime() / 1000);
      if (endTime < date) {
        this.whitetingState = this.$t('eso');
        this.startSaleTime = this.$t('eso');
        this.state = [-1, -1];
      }
      else {
        if (date > startTime) {
          if (date > listingTime) {
            this.startSaleTime = this.$t('edin') + " " + this.getDateTime(endTime - date);
            this.whitetingState = this.$t('eso');
            this.state[1] = 1;
            this.state[0] = -1;
          }
          else {
            this.startSaleTime = this.$t('stin') + " " + this.getDateTime(listingTime - date);
            this.whitetingState = this.$t('edin') + " " + this.getDateTime(listingTime - date);
            this.state[1] = 0;
            this.state[0] = 1;
          }
        }
        else {
          this.whitetingState = this.$t('stin') + " " + this.getDateTime(startTime - date);
          this.startSaleTime = this.$t('stin') + " " + this.getDateTime(listingTime - date);
          this.state[0] = 0;
          this.state[1] = 0;
        }
      }
    },
    getStateInfo() {
      if (this.progress == 100 || this.totalNumber === this.buyNumber) {
        this.stateInfo = this.$t('So');
        this.buttonInfo = this.$t('So');
      }
      else if (this.state[0] === -1 && this.state[1] === -1) {
        this.stateInfo = this.$t('So');
        this.buttonInfo = this.$t('So');
      }
      else if (this.state[0] === 0 && this.state[1] === 0) {
        this.stateInfo = this.$t('nos');
        this.buttonInfo = this.$t('nos');
      }
      else if (this.maxSellNumber == 0) {
        this.stateInfo = this.$t('rsl');
        this.buttonInfo = this.$t('rsl');
      }
      else if (this.state[0] === 1 && this.isInWhitelist) {
        if (this.whilteCanBuyNumber <= this.whilteBuyNumber) {
          this.stateInfo = this.$t('rwsl');
          this.buttonInfo = this.$t('rwsl');
        }
        else {
          this.stateInfo = this.$t('wlu');
          this.buttonInfo = this.$t('buynow')
        }
      }
      else if (this.state[0] === 1 && !this.isInWhitelist && this.state[1] === 0) {
        this.stateInfo = this.$t('wnlu') + " " + this.startSaleTime;
        this.buttonInfo = this.$t('owa');
      }
      else if (this.state[1] === 1) {
        this.stateInfo = this.$t('psa') + " " + this.startSaleTime;
        this.buttonInfo = this.$t('buynow');
      }
      else {
        this.stateInfo = "Unkown Error";
        this.buttonInfo = "Not Buy";
      }
      this.releaseState = this.ido.releaseTime || false;

      if (this.ido.releaseTime) {
        this.releaseState = (new Date(this.ido.releaseTime).getTime() < new Date().getTime());
      }
    },
    getProgress() {
      let contract = this.getProjectCurrentPriveder();
      contract.progress().then((res) => {
        console.log("获取售卖进度成功")
        this.deplyLoad(this.userIsInWhitelist);
        this.buyNumber = res[0];
        this.totalNumber = res[1];
        this.whilteBuyNumber = res[2];
        this.whilteCanBuyNumber = res[3];
        this.progress = Math.floor((res[0] / res[1] * 100));
      }).catch(err => {
        this.error('获取售卖进度失败!');
      });
    },
    getCanSellMaxNumber() {
      let contract = this.getProjectCurrentPriveder();
      contract.canBuy().then((res) => {
        console.log("获取最大售卖数" + res)
        this.maxSellNumber = res;
        this.getStateInfo();
      }).catch(err => {
        this.error('获取最大售卖数失败!');
      });
    },
    userIsInWhitelist() {
      let contract = this.getProjectCurrentPriveder();
      contract.isInWhitelist(this.getAccount()).then((res) => {
        console.log("获取白名单信息成功！");
        this.isInWhitelist = res;
        this.deplyLoad(this.getOutTime)
      });
    },
    getNftPrice() {
      this.price = this.ido.nftPrice;
    },
    getPayment() {
      this.tokenName = this.ido.paymentSymbol;
      this.tokenId = this.ido.paymentAddress;
    },

    getTokenName() {
      this.tokenName2 = this.ido.exchangeSymbol;
    },
    //汇率比
    exchange() {
      this.bv = this.ido.exchangeRate;
      this.tokenValue = this.tokenValue * this.bv;
    },
    toIDOItem() {
      this.$router.push('/IdoItem');
    },
    getNTFBalance() {
      let contract = this.getNFTPriveder();
      contract.balanceOf(this.getAccount()).then((res) => {
        this.ntfBalance = Number(res);
        console.log("获取NFT余额成功！")
        this.deplyLoad(this.getCanSellMaxNumber);
        if (this.ntfValue > this.ntfBalance) {
          this.ntfValue = this.ntfBalance;
        }
      }).catch(err => {
        this.error('获取NFT数量失败!');
      });
    },
    getBalance(address) {
      let provider = new ethers.providers.Web3Provider(ethereum, "any");
      getBalance(address ? address : this.tokenId, provider, this.getAccount()).then(res => {
        console.log("获取余额成功！")
        this.tokenBalance = Number(ethers.utils.formatEther(res)).toFixed(5);
        this.deplyLoad(this.getNTFBalance);
      }).catch(err => {
        this.error('获取余额失败!');
      });
    },
    canBuy() {
      //检查数量
      if (this.num == '' || this.num == 0) {
        this.toast('please input buy count!');
        return false;
      }
      else if (this.maxSellNumber === 0) {
        this.toast(this.$t('rsl'));
        return false;
      }
      else if (this.state[0] == 1 && this.isInWhitelist) {
        if (this.whilteCanBuyNumber <= this.whilteBuyNumber) {
          this.toast(this.$t('rwsl'));
          return false;
        }
        if (!this.approves[1]) {
          this.toast(this.$t('tips.yna'));
          this.approve();
          return false;
        }
        return true
      }
      else if (this.state[1] == 1 && this.tokenBalance >= this.aumout) {
        if (!this.approves[1]) {
          this.toast(this.$t('tips.yna'));
          this.approve();
          return false;
        }
        return true;
      }
      else {
        //this.toast.error("You can't buy it now!");
        return false;
      }
    },
    canSell() {
      if (!this.releaseState) {
        return false;
      }
      else if (this.ntfBalance < this.num || !this.num) {
        //this.toast.error("You don't have enough NTF");
        this.toast('You dont have enough NTF');
        return false;
      }
      else {
        if (this.approves[0]) return true;
        else {
          this.toast(this.$t('tips.yna'));
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
        if (!this.canBuy()) return;
        let contract = this.getProjectCurrentPriveder();
        contract.buyBatch(this.num).then((res) => {
          this.loadWaitTip();
          res.wait(1).then(v => {
            this.openWebsite(res.hash);
            this.ntfBalance += this.num;
            this.getProgress();
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
        //this.toast.error("You don't have enough NTF!")
        return;
      }
      if (!this.releaseState) {
        return
      }
      if (this.approves[0]) {

        let contract = this.getProjectCurrentPriveder();
        contract.exchange(this.ntfValue).then((res) => {
          this.loadWaitTip();
          res.wait(1).then(() => {
            this.openWebsite(res.hash);
            this.ntfBalance -= this.ntfValue;
            this.getProgress();
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
      this.refundRate = this.ido.refundFeeRate / 10000;
    },
    getTotalSupply() {
      this.totalSupply = this.ido.nftTotalSupply;
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
      if (this.tokenBalance < this.aumout && this.aumout > 0) {
        this.buttonInfo = this.$t('ITB', { type: this.tokenName });
      }
    },
    error(err) {
      console.log(err);
      this.toast('Service exception');
    },
    openWebsite(address) {
      this.refreash();
      this.$vux.toast.show({
        text: this.$t('tips.s')
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
        this.toast(this.$t('tips.cs'));
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.toast(this.$t('tips.cf'));
        clipboard.destroy();
      });
    },
    loadWaitTip(txt) {
      this.$vux.loading.show({
        text: this.$t('tips.l')
      });
    },
    toast(txt) {
      this.$vux.toast.text(txt, 'top');
    },
    refreash() {

    }
  },
  mounted() {
    this.$vux.loading.show({
      text: this.$t('tips.l')
    });
    let pid = this.$router.currentRoute.query.pid;
    this.$http.get(Global.RequestApi + '/web/project', {
      params: {
        pid: pid
      }
    }).then(({ data }) => {
      this.ido = data.data;
      console.log(this.ido)
      let res = this.getWaitAccount();
      if (!res) {
        this.toast(this.$t('tips.cw'));
      }
      else {
        res.then(a => {
          setTimeout(() => {
            this.getWhiteListTimestamp();
            this.getNftPrice();
            this.getPayment();
            this.exchange();
            this.geTrefundFeeRate();
            this.getTotalSupply();
            this.getTokenName();
            this.changeNum();
            //延时加载
            this.isApprove();
          }, 200);
        })
      }
      this.$vux.loading.hide();
    }).catch(err => {
      console.log(err);
      this.toast(err);
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
