<template>
  <!-- 游戏中心 -->
  <div class="g-con">
    <h1>游戏中心</h1>
    <button @click="go(1)">按钮1</button><br />
    <button @click="go(2)">按钮2</button><br />
    <button @click="go(3)">按钮3</button>
    <!-- <mingxipage :isShow="ppisShow"></mingxipage> -->
    <mingxipage :curshow.sync="isfalse" :curinfo="info"></mingxipage>
  </div>
</template>

<script>
import mingxipage from '../components/mingxipage'
export default {
  components: {
    mingxipage
  },
  data() {
    return {
      isfalse: false,
      // 定义其中任意一项数据
      info: {}
    }
  },
  methods: {
    go(target) {
      console.log(target)
      var token1 = sessionStorage.getItem('token')
      var data = {
        pageNo: 1,
        pageSize: 10,
        gameIds: [1004]
      }
      fetch('/system-admin/pgame/queryPageList', {
        method: 'POST',
        body: this.$qs.stringify(data),
        headers: new Headers({
          'X-Access-Token': token1,
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      })
        .then(res => {
          return res.json()
        })
        .then(res => {
          console.log(res)
          this.isfalse = true
          if (target === 1) {
            this.info = res.result.records[0]
          } else if (target === 2) {
            this.info = res.result.records[1]
          } else if (target === 3) {
            this.info = res.result.records[3]
          }
        })
    }
  }
}
</script>

<style>
.g-con button {
  margin-top: 20px;
}
</style>
