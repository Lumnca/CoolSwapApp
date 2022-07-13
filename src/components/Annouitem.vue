<template>
    <div class="">
        <div class="item-box">
            <div class="item-row fc1">
                <b>{{  $i18n.locale=='en'?item.title:item.titleCN }}</b>
            </div>
            <div class="item-row">
                <span class="tag-m tag-block">{{ item.createTime }}</span>
            </div>
            <div class="item-row fs14 fc3 wap">
               {{ $i18n.locale=='en'?item.content :item.contentCN}}
            </div>
        </div>
    </div>
</template>

<script>
import { Group, Cell, Icon } from 'vux'

export default {
    name: 'Annouitem',
    components: {
        Group,
        Cell,
        Icon
    },
    data() {
        return {
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            item : {

            }
        }
    },
    mounted() {
        let data = window.localStorage.getItem('_curannou');
        //console.log(data);
        if(data){
            this.item = JSON.parse(data);
        }
    },
}
</script>

<style>
.item-box {
    border: 1px solid #ececec;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 10px;
    margin: 16px;
    padding: 8px;
    word-wrap: break-word;
}

.item-row {
    padding: 4px 16px;
}
</style>
