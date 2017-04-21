<template>
    <div class="hello">
        <img src="../assets/logo.png">
        <h1>{{ msg }}</h1>
        <br>
        <p>
            单页面路由 SPA Routers:
            <!-- 使用 router-link 组件来导航. -->
            <!-- 通过传入 `to` 属性指定链接. -->
            <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        </p>
        <router-link to="/detail">Go to Detail</router-link>
        <!-- <router-link to="/video">Go to Video</router-link> -->
    </div>
</template>

<script>
export default {
    name: 'hello',
    data () {
        return {
            msg: '欢迎来到多页面Vue web-app demo！'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
