<template>
  <div>
    <div class="father">
      <div class="left">开奖结果</div>
      <div class="right">
        <div class="right-leftbox">
          <!-- 遍历这个数组 -->
          <template v-for="i in boxs">
            <!-- v-if判断条件 -->
            <template v-if="curcode === i.code">
              <!-- 最后是渲染你想要的图  -->
              <div class="imgbox" :key="i.code">
                <img :src="i.url" alt="" />
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <button @click="aleat">按钮</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curcode: 101,
      boxs: [
        {
          name: '散牌大',
          code: 101,
          url: require('../assets/img_sanpai_da.png')
        },
        {
          name: '散牌小',
          code: 102,
          url: require('../assets/img_sanpai_xiao.png')
        },
        {
          name: '对子',
          code: 103,
          url: require('../assets/img_duizi.png')
        },
        {
          name: '顺子',
          code: 104,
          url: require('../assets/img_shunzi.png')
        },
        {
          name: '金花',
          code: 105,
          url: require('../assets/img_jinhua.png')
        },
        {
          name: '顺金',
          code: 106,
          url: require('../assets/img_shunjin.png')
        },
        {
          name: '豹子',
          code: 999,
          url: require('../assets/img_baozi.png')
        }
      ]
    }
  },
  methods: {
    aleat() {
      alert('11')
    }
  }
}
</script>

<style>
.father {
  width: 1170px;
  height: 135px;
  padding: 0 50px;
  background: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.left {
  width: 170px;
  font-size: 30px;
  text-align: center;
  flex: 0 0 auto;
}
.right {
  width: calc(1170px - 360px);
  margin-left: 120px;
  height: 100%;
  display: flex;
  align-items: center;
}
.right-leftbox {
  width: 75px;
  height: 34px;
  margin-right: 30px;
}
.imgbox {
  width: 100%;
  height: 100%;
  position: relative;
}
.imgbox img {
  position: absolute;
  width: 75px;
  height: 34px;
  left: 0;
  top: 0;
}
</style>
