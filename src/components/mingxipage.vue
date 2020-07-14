<template>
  <transition name="donghua">
    <div class="mingxipage" v-if="curshow" @click="hideShow">
      <div class="content">
        <!-- 标题栏 -->
        <div class="content-head">
          闲家记录结算
          <!-- 关闭按钮 -->
          <div class="closeImg" @click="closeImg"></div>
        </div>
        <!-- 开奖栏 -->
        <div class="openingColumn">
          <div class="openingColumn-left">开奖结果</div>
          <div class="openingColumn-right">
            <!-- 牌型类型 -->
            <template v-for="item in typeList">
              <template v-if="resultType === item.code">
                <div class="gamesType" :key="item.name">
                  <img :src="item.url" alt="" />
                </div>
              </template>
            </template>
            <!-- 牌型结果 -->
            <div class="three-imgs">
              <template v-for="imge in imgs">
                <template v-if="num1 === imge.num">
                  <div :key="'1' + imge.url">
                    <img :src="imge.url" alt="" />
                  </div>
                </template>
                <template v-if="num2 === imge.num">
                  <div :key="'2' + imge.url">
                    <img :src="imge.url" alt="" />
                  </div>
                </template>
                <template v-if="num3 === imge.num">
                  <div :key="'3' + imge.url">
                    <img :src="imge.url" alt="" />
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
        <!-- 数据列表 -->
        <div class="listbox">
          <div class="list">
            <template v-for="item in typeList">
              <template v-if="resultType === item.code">
                <div class="list-type" :key="item.name">
                  {{ item.name }}
                </div>
              </template>
            </template>

            <div class="list-xzSize">
              下注金额<span
                class="ml"
                :class="totalBet > 0 ? 'green' : 'red'"
                >{{ totalBet }}</span
              >
            </div>
            <div class="list-xzSize">
              输赢金额<span
                class="ml"
                :class="totalWin > 0 ? 'green' : 'red'"
                >{{ totalWin }}</span
              >
            </div>
          </div>
        </div>
        <div class="foot">
          <div>
            总下注金额<span
              class="ml"
              :class="allTotalBetNum > 0 ? 'green' : 'red'"
            >
              {{ betInfo.allTotalBet }}
            </span>
          </div>
          <div class="xian"></div>
          <div>
            总输赢金额<span
              class="ml"
              :class="allTotalWinNum > 0 ? 'green' : 'red'"
            >
              {{ betInfo.allTotalWin }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import imgs from './imgs'

export default {
  props: {
    curinfo: {
      type: Object,
      default() {
        return {
          account: null,
          betInfo: null,
          createTime: null,
          dataTime: null,
          endCoin: null,
          gameId: null,
          gameName: null,
          gameTableId: null,
          inBankerTimes: null,
          inBankerTimesTxt: null,
          isBanker: null,
          isBankerTxt: null,
          merchantId: null,
          merchantName: null,
          nickName: null,
          occasionName: null,
          openPokerInfo: null,
          operation: null,
          playerId: null,
          pumpPoint: null,
          resultId: null,
          roundNum: null,
          startCoin: null,
          totalBet: null,
          validBet: null,
          winCoin: null
        }
      }
    },
    curshow: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      obj: {},
      // 牌的类型(101~106,999)
      resultType: '',
      // 3张牌
      pukeResult: [],
      num1: '',
      num2: '',
      num3: '',
      // 接受下注金额/输赢金额的名称
      sonbetInfo: '',
      // 定义下注金额的值
      totalBet: '',
      // 定义输赢金额的值
      totalWin: '',
      // 接受总金额数据的名称
      betInfo: '',
      // 定义总下注金额的num值
      allTotalBetNum: '',
      // 定义总输赢金额的num值
      allTotalWinNum: '',
      // 定义接受props.openPokerInfo数据---开奖结果
      openPokerInfo: '',
      typeList: [
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
      ],
      imgs
    }
  },
  watch: {
    curinfo(a) {
      this.obj = a
      // console.log(this.obj)
      // 总的下注/输赢金额
      this.betInfo = JSON.parse(a.betInfo)
      // console.log(this.betInfo)
      this.allTotalBetNum = this.betInfo.allTotalBet
      this.allTotalWinNum = this.betInfo.allTotalWinNum
      // 下注金额与输赢金额
      // console.log(this.betInfo.betInfo[0])
      this.sonbetInfo = this.betInfo.betInfo[0]
      this.totalBet = this.sonbetInfo.totalBet
      this.totalWin = this.sonbetInfo.totalWin
      // 开奖结果
      this.openPokerInfo = JSON.parse(a.openPokerInfo)
      // console.log(this.openPokerInfo)
      // 扑克的类型
      this.resultType = this.openPokerInfo.resultType
      // console.log(this.resultType)
      // 扑克的数组
      this.pukeResult = this.openPokerInfo.result
      // console.log(this.pukeResult)
      // 扑克的具体数据
      this.num1 = this.pukeResult[0]
      // console.log(typeof this.num1)
      this.num2 = this.pukeResult[1]
      this.num3 = this.pukeResult[2]
    }
  },
  computed: {
    // 定义接受props.betInfo数据
    // betInfo() {
    //   return JSON.parse(this.betInfo)
    // }
    // newCurshow() {
    //   return this.curshow
    // }
  },
  methods: {
    // X图标关闭
    closeImg(e) {
      // console.log(e)
      var c = e.target
      if (c.className === 'closeImg') {
        // 此this.curshow为只读属性，不能取反，会警告提示，但不影响隐藏
        // this.curshow = !this.curshow
        this.$emit('update:curshow', false)
      }
    },
    // 点击背景关闭
    hideShow(e) {
      // console.log(e)
      var h = e.target
      if (h.className === 'mingxipage') {
        this.$emit('update:curshow', false)
      }
    }
  }
}
</script>

<style>
.mingxipage {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.35);
  color: rgba(0, 0, 0, 0.65);
}
.content {
  width: 1170px;
  height: 550px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.content-head {
  height: 77px;
  line-height: 77px;
  background: #c19462;
  color: #fff;
  text-align: center;
  font-size: 36px;
  position: relative;
}
.closeImg {
  position: absolute;
  right: 25px;
  top: 25px;
  width: 25px;
  height: 25px;
  background: url('../assets/timg.jpg') no-repeat;
  background-size: 100% 100%;
}
.openingColumn {
  width: 100%;
  height: 135px;
  display: flex;
  padding: 0 50px;
  /* justify-content: space-evenly; */
}
.openingColumn-left {
  font-size: 30px;
  margin: 0 120px 0 120px;
  line-height: 135px;
}
.openingColumn-right {
  width: 50%;
  height: 135px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gamesType {
  width: 75px;
  height: 34px;
  margin-right: 30px;
}
.gamesType img {
  width: 75px;
  height: 100%;
}
.three-imgs {
  height: 94px;
  display: flex;
  align-items: center;
}
.three-imgs div {
  /* width: 33.33%;
  height: 94px; */
  margin-right: 10px;
}
.three-imgs img {
  width: 64px;
  height: 84px;
}
/* 数据列表 */
.listbox {
  width: 100%;
  height: 250px;
  background: #f2f2f2;
  overflow: hidden;
}
.list {
  width: 80%;
  margin: auto;
  height: 74px;
  line-height: 74px;
  font-size: 24px;
  display: flex;
}
.list-type {
  flex: 4;
  text-align: center;
}
.list-xzSize {
  flex: 4;
}
.foot {
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
.xian {
  width: 1px;
  height: 38px;
  background: #5a5a5a;
  margin: 0 40px;
}
.ml {
  margin-left: 20px;
}
.red {
  color: red;
}
.green {
  color: green;
}
.typeurl {
  background: url('../assets/img_baozi.png');
}
.donghua-enter-active {
  transition: opacity 1s ease-in;
  /* transition: opacity 1.5s; */
}
.donghua-leave-active {
  /* transition: all 1s ease-in; */
}
.donghua-enter,
.donghua-leave {
  opacity: 0;
}
</style>
