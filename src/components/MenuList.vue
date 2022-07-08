<template>
    <div>
        <div class="line"></div>
        <div v-for="item in menuList" :key="item.name" @click="toView(item.path)">
            <div class="menu-item">
                <div>
                    <div class="icon-block tr">
                        <i :class="item.icon"></i>
                    </div>
                </div>
                <div class="tml">
                    <span class="font-or">{{ item.name }}</span>
                    <br />
                    <small class="c-info fs14">{{ item.description }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon, Flexbox, FlexboxItem } from 'vux'
export default {
    name: 'MenuList',
    components: {
        Icon, Flexbox, FlexboxItem
    },
    data() {
        return {
            menuList: [
                {
                    name: "Swap",
                    description: "Trade tokens in an instant",
                    icon: 'icon iconfont icon-zhihuan',
                    path : 'Swap'
                },
                {
                    name: "Lunchpad",
                    description: "Buy new unique NFTs",
                    icon: 'icon iconfont icon-huojian',
                    path : 'Ido'
                },
                {
                    name: "Notice",
                    description: "Coolswap activities",
                    icon: 'icon iconfont icon-shengyin',
                    path : 'Announcement'
                }
            ]
        }
    },
    methods: {
        toView(path) {
            this.$router.push(path);
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu-item {
    padding: 16px 32px;
    display: flex;
}
.menu-item > div{
    flex-direction: column;
}
.tml{
    margin-left: 8px;
}
</style>
