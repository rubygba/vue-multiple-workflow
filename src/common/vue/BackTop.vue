<template>
  <div class="backtop-icon" :class="{'hide': !isShow}" @click="backTop">
    <img src="~@/assets/backtop.png" alt="">
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      isShow: false
    }
  },
  mounted: function () {
    window.onscroll = () => {
      if (document.documentElement.scrollTop + document.body.scrollTop > 0) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  },
  methods: {
    backTop: function () {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.backtop-icon.hide {
  display: none;
}
.backtop-icon {
  position: fixed;
  bottom: .3rem;
  right: .24rem;
  img {
    width: .6rem;
    height: .6rem;
  }
}
</style>


