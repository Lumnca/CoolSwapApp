<template>
    <div>
        <div class="line"></div>
        <div  @click="toView('Swap')">
            <div class="menu-item">
                <div>
                    <div class="icon-block tr">
                        <i class="icon iconfont icon-zhihuan"></i>
                    </div>
                </div>
                <div class="tml">
                    <span class="font-or">{{ $t('swap')}}</span>
                    <br />
                    <small class="c-info fs14">{{ $t('ttii') }}</small>
                </div>
            </div>
        </div>
        <div  @click="toView('Ido')">
            <div class="menu-item">
                <div>
                    <div class="icon-block tr">
                        <i class="icon iconfont icon-huojian"></i>
                    </div>
                </div>
                <div class="tml">
                    <span class="font-or">Lunchpad</span>
                    <br />
                    <small class="c-info fs14">{{ $t('bnun') }}</small>
                </div>
            </div>
        </div>
        <div  @click="toView('Swap')">
            <div class="menu-item">
                <div>
                    <div class="icon-block tr">
                        <i class="icon iconfont icon-zhihuan"></i>
                    </div>
                </div>
                <div class="tml">
                    <span class="font-or">{{$t('notice')}}</span>
                    <br />
                    <small class="c-info fs14">{{ $t('cac') }}</small>
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
                    name: this.$t('swap'),
                    description: this.$t('ttii'),
                    icon: 'icon iconfont icon-zhihuan',
                    path : 'Swap'
                },
                {
                    name: "Lunchpad",
                    description: this.$t('bnun'),
                    icon: 'icon iconfont icon-huojian',
                    path : 'Ido'
                },
                {
                    name: this.$t('notice'),
                    description: this.$t('cac'),
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
