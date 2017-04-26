<template>
    <div>
        <router-view></router-view>
        <br>
        <p>多页面跳转 Multiple Entries：</p>
        <a href="./player.html">another SPA</a>
        <MyFooter></MyFooter>
    </div>
</template>

<script>
import MyFooter from '../common/Footer.vue'

export default {
    name: 'app',
    components: { MyFooter }
}
</script>

<style lang="stylus">
// 公共样式
@import "../../css/base.css"
@import "../../css/common.css"

a
    color: blue

body
    background-color: #f0f0f0

hr
    margin: 15px 0

</style>
