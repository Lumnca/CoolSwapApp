<template>
    <div style="border: 1px solid #fff;">
        <swiper :list="demo01_list" v-model="demo01_index" @on-index-change="demo01_onIndexChange"></swiper>
    </div>
</template>

<script>
import { Swiper, GroupTitle, SwiperItem, XButton, Divider } from 'vux'
import Global from '../abi/Global'

const baseList = [{
    url: 'javascript:',
    img: '',
    title: 'CoolSwap'
}, {
    url: 'javascript:',
    img: '',
    title: 'CoolSwap'
}, {
    url: 'javascript:',
    img: '/static/cs.png', // 404
    title: 'CoolSwap',
}]

export default {
    components: {
        Swiper,
        SwiperItem,
        GroupTitle,
        XButton,
        Divider
    },
    ready() {

    },
    methods: {
        onSwiperItemIndexChange(index) {
            console.log('demo item change', index)
        },
        demo01_onIndexChange(index) {
            this.demo01_index = index
        }
    },
    data() {
        return {
            demo01_list: baseList,
            demo01_index: 0,
            slider: []
        }
    },
    mounted() {
        this.slider = [];
        this.$http.get(Global.RequestApi + '/web/slider').then(({ data }) => {
            let list = data.data.mobile[this.$i18n.locale];
            list.forEach(e => {
                this.slider.push({
                    url: 'javascript:',
                    img: e,
                    title: ''
                })
            })
            this.demo01_list = this.slider;
        })
    },
}
</script>

<style scoped>
.copyright {
    font-size: 12px;
    color: #ccc;
    text-align: center;
}

.text-scroll {
    border: 1px solid #ddd;
    border-left: none;
    border-right: none;
}

.text-scroll p {
    font-size: 12px;
    text-align: center;
    line-height: 30px;
}

.black {
    background-color: #000;
}

.title {
    line-height: 100px;
    text-align: center;
    color: #fff;
}

.animated {
    animation-duration: 1s;
    animation-fill-mode: both;
}

.vux-indicator.custom-bottom {
    bottom: 30px;
}

@-webkit-keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }

    100% {
        opacity: 1;
        transform: none;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }

    100% {
        opacity: 1;
        transform: none;
    }
}

.fadeInUp {
    animation-name: fadeInUp;
}

.swiper-demo-img img {
    width: 100%;
}
</style>