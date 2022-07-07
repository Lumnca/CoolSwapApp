<template>
    <div>
        <div class="item-box" v-for="item in list" :key="item.id" @click="toItem(item)">
            <div class="item-row fc1">
                <b>{{ item.title.substr(0,28) }}...</b>
            </div>
            <div class="item-row">
                <span class="tag-m tag-block">{{ item.createTime }}</span>
            </div>
            <div class="item-row fs14 fc3 wap">
                {{ item.content }}
            </div>
        </div>
    </div>
</template>
<script>
import { Icon,Loading } from 'vux'
import Global from '../abi/Global';
export default {
    name: 'Announcement',
    components: {
        Icon,Loading
    },
    data() {
        return {
            list: []
        }
    },
    methods: {
        toItem(data){
            window.localStorage.setItem('_curannou',JSON.stringify(data));
            this.$router.push('/Announitem');
        }
    },
    mounted() {
        this.$vux.loading.show({
            text: 'Loading'
        });
        let that = this;
        this.$http.get(Global.RequestApi+ '/web/announcement?pageIndex=0').then(({ data }) => {
            this.list = data.data.list;
        }).catch(function (error) {
            console.log(error);
        }).then(function () {
            that.$vux.loading.hide();
        });
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-box {
    border: 1px solid #ececec;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 10px;
    margin: 16px;
    padding: 8px;
    word-wrap: break-word;
    height: 180px;
    overflow-y: hidden;
}

.item-row {
    padding: 4px 16px;
}
</style>
