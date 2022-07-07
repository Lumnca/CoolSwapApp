<template>
    <div>
        <div class="top-but">
            <button-tab v-model="status">
                <button-tab-item @on-item-click="changeType(0)">Live</button-tab-item>
                <button-tab-item @on-item-click="changeType(1)">Upcoming</button-tab-item>
                <button-tab-item @on-item-click="changeType(2)">Ended</button-tab-item>
            </button-tab>
        </div>
        <div class="ido-box">
            <div v-if="list.length === 0">
                暂无数据
            </div>
            <flexbox>
                <flexbox-item>
                    <div v-for="item, i in list" :key="item.pid" :class="(i === 0 ? 'first' : 'ido-item')">
                        <div class="pd8">
                            <img :src="item.imgData"   height="240" width="260" style="object-fit: fill;" />
                        </div>
                        <div class="fs20 item-text">
                            {{ item.title }}
                        </div>
                         <div class="item-text fd">
                          <span class="tag-m"> End in {{ item.endTime }}</span>
                        </div>
                        <div class="fc3 item-text fs14 ">
                            {{ item.description }}
                        </div>
                       
                        <div class="tc item-text bd">
                            <button @click="toItem(item.pid)" class="button-m">
                                Check
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
        toItem(id) {
            this.$router.push({
                path: 'IdoItem',
                query: { pid : id }
            });
        },
        changeType(index) {
            this.$vux.loading.show({
                text: 'Loading'
            });
            let that = this;
            this.$http.get('/api/web/projects', {
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

        this.$http.get('/api/web/projects', {
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

.first {
    border: 1px solid #ececec;
    border-radius: 10px;
    padding: 8px;
}

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
