<template>
    <div>
        <div class="top-but">
            <button-tab v-model="status">
                <button-tab-item @on-item-click="changeType(0)">{{$t('live')}}</button-tab-item>
                <button-tab-item @on-item-click="changeType(1)">{{$t('upcoming')}}</button-tab-item>
                <button-tab-item @on-item-click="changeType(2)">{{$t('ended')}}</button-tab-item>
            </button-tab>
        </div>
        <div class="ido-box">
            <div v-if="list.length === 0">
                Coming soon
            </div>
            <flexbox>
                <flexbox-item>
                    <div v-for="item, i in list" :key="item.pid" :class="(i === 0 ? 'first' : 'ido-item')">
                        <div class="pd8">
                            <img :src="item.imgData" height="243" width="100%" style="object-fit: fill;" />
                        </div>
                        <div class="fs20 item-text fc4">
                            {{  $i18n.locale=='en'?item.title:item.titleCN }}
                        </div>
                        <div class="item-text fd">
                            <span v-if="status == 2" class="tag-l"> {{$t('eso')}} </span>
                            <span v-else-if="status == 1" class="tag-l">{{$t('stin')}}  {{ timeShow(item.startTime)}}</span>
                            <span v-else class="tag-l">{{$t('edin')}} {{ timeShow(item.endTime) }}</span>
                        </div>
                        <div class="fc3 item-text fs14 item-desw">
                            {{ $i18n.locale=='en'?item.description:item.descriptionCN }}
                        </div>

                        <div class="tc item-text bd">
                            <button @click="toItem(item.pid)" class="button-l">
                                {{$t('check')}}
                            </button>
                        </div>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
import { Group, Cell, Icon, ButtonTab, ButtonTabItem, XButton, Loading, Flexbox, FlexboxItem } from 'vux'
import Global from '../abi/Global';
String.prototype.padZero = function (length) {
    var s = this;
    while (s.length < length) {
        s = '0' + s;
    }
    return s;
};
export default {
    components: {
        Group,
        Cell,
        Icon, ButtonTab, ButtonTabItem, XButton, Loading, Flexbox, FlexboxItem
    },
    data() {
        return {
            list: [],
            page: 0,
            status: 0,
            texts: ['LIVE', 'UPCOMING', 'ENDED']
        }
    },
    methods: {
        timeShow(time) {
            let date = new Date(time);
            let now = new Date();
            let secord = Math.abs(Math.floor((date.getTime()-now.getTime())/1000));
            let d = Math.floor(secord / (60 * 60 * 24));
            let h = Math.floor(secord / (60 * 60)) % 24;
            let m = Math.floor(secord / 60) % 60;
            let s = secord % 60;
            return `${d}d ${h.toString().padZero(2)}:${m.toString().padZero(2)}:${s.toString().padZero(2)}`;
        },
        toItem(id) {
            this.$router.push({
                path: 'IdoItem',
                query: { pid: id }
            });
        },
        changeType(index) {
            this.$vux.loading.show({
                text: 'Loading'
            });
            let that = this;
            this.$http.get(Global.RequestApi + '/web/projects', {
                params: {
                    pageIndex: 0,
                    status: this.texts[index]
                }
            }).then(({ data }) => {
                this.list = data.data.list;
                console.log(this.list);
            }).catch(function (error) {
                console.log(error);
            }).then(function () {
                that.$vux.loading.hide();
            });
        }
    },
    mounted() {
        this.$http.get(Global.RequestApi + '/web/projects', {
            params: {
                pageIndex: 0,
                status: 'LIVE'
            }
        }).then(({ data }) => {
            this.list = data.data.list;
        })

    },
}
</script>

<style >
.top-but {
    padding: 8px 32px;
}

.bd {
    width: 100%;
    margin: auto;
}

.bf {
    border-radius: 32px;
}


.ido-box {
    padding: 8px 32px;
}

.first {
    border: 1px solid #ececec;
    border-radius: 10px;
    padding: 8px;
}

.item-desw{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    line-height: 20px;
}


.ido-item {
    border: 1px solid #ececec;
    border-radius: 10px;
    padding: 8px;
    margin: 16px 0px;
}

.item-text {
    padding: 4px 0px;
}
</style>
