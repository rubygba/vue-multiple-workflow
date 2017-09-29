<template>
<div>
  Hello vue-multiple workflow
</div>
</template>

<script>
import * as API from '@/common/js/api.js'

export default {
  components: {
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
    pad2: function(n) {
      return n < 10 ? '0' + n : n
    },
 
    generateBeforeDate: function() {
      let date = new Date()

      return date.getFullYear().toString() + this.pad2(date.getMonth() + 1) + this.pad2(date.getDate()) + this.pad2(date.getHours()) + this.pad2(date.getMinutes()) + this.pad2(date.getSeconds())
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

