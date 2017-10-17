<template>
<div>
  Hello vue-multiple workflow
  <BackTop></BackTop>
</div>
</template>

<script>
import * as API from '@/common/js/api'
import BackTop from '@/common/vue/BackTop'

export default {
  components: {
    BackTop
  },
  data: function() {
    return {
    }
  },
  computed: {
  },
  created: function() {
  },
  mounted: function() {
  },
  methods: {
    // 个位数双位显示
    pad2: function(n) {
      return n < 10 ? '0' + n : n
    },
 
    generateBeforeDate: function() {
      let date = new Date()

      return date.getFullYear().toString() + this.pad2(date.getMonth() + 1) + this.pad2(date.getDate()) + this.pad2(date.getHours()) + this.pad2(date.getMinutes()) + this.pad2(date.getSeconds()) // getMonth() 返回索引值0-11，需要+1
    },

    backTop: function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/styles/gb-strap.css'
@import '../styles/index.styl'

a
  color: #333
</style>

