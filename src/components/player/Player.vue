<template lang="html">
    <div>
        <img src="../../assets/logo.png">
        <p>Player HTML ENTRY</p>
        <MyFooter></MyFooter>
    </div>
</template>

<script>
import MyFooter from '../common/Footer.vue'

export default {
    components: { MyFooter }
}
</script>

<style lang="stylus">
body
    background-color: #ff6
    width: 750px
    margin: 0 auto

div
    color: #c00
</style>
