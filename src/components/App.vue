<template>
    <div>
        <router-view></router-view>
        <br>
        <p>多页面跳转 Multiple Entries：</p>
        <a href="/index_player.html">another SPA</a>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style lang="stylus">
// 公共样式
@import "../css/base.css"
@import "../css/common.css"

a
    color: blue

</style>
