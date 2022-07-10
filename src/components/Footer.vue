<template>
    <div>
        <div class="line2">

        </div>
        <div class="footer fc1">
            <flexbox>
                <flexbox-item :span="2">
                    <img src="../assets/logo4 2.png" height="32" />
                </flexbox-item>
                <flexbox-item :span="10">
                    <div class="tr fc3">
                        <i class="iconfont icon-telegram" @click="openWeb(0)" style="font-size:24px"></i>

                        <i class="iconfont icon-shejiaotubiao-20" @click="openWeb(1)"
                            style="font-size:24px; margin-left: 8px;"></i>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
import { Icon, Flexbox, FlexboxItem } from 'vux'
export default {
    name: 'HelloWorld',
    components: {
        Icon, Flexbox, FlexboxItem
    },
    data() {
        return {

        }
    }, methods: {
        openWeb(type) {
            if (type)
                open('https://twitter.com/Coolswap2022');
            else
                open('https://t.me/CoolswapCN');
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
    padding: 12px;
}
</style>
