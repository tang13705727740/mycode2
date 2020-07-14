<template>
  <!-- 游戏记录页面 -->
  <div>
    <div class="gamesPage">
      <div class="gamesContentBox">
        <a-form :form="form" autocomplete="off">
          <a-row>
            <a-col :span="20">
              <a-form-item label="游戏种类">
                <a-select
                  v-decorator="['gameType', { initialValue: '' }]"
                  style="width: 170px"
                  placeholder="请选择游戏种类"
                  @change="Changetypegame"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option
                    :value="item.typeId"
                    v-for="item in gamelists"
                    :key="item.typeId"
                  >
                    {{ item.typeName }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="游戏名字">
                <a-select
                  v-decorator="['game', { initialValue: '' }]"
                  style="width: 170px"
                  :disabled="disabled"
                  placeholder="请选择游戏"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option
                    :value="item.id"
                    v-for="item in gameNames"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="选择日期">
                <!-- <a-range-picker
                  @change="onChangeTime"
                  v-decorator="['rangeDate', { initialValue: [] }]"
                /> -->
                <a-range-picker
                  v-decorator="['rangeDate', { initialValue: [] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-button
                type="primary"
                icon="search"
                style="margin-right:10px"
                class="ant-btn-primary1"
                @click="sousuo"
              >
                搜索
              </a-button>
              <a-button
                type="primary"
                class="ant-btn-primary1"
                icon="reload"
                @click="resetForm"
              >
                重置
              </a-button>
            </a-col>
          </a-row>
        </a-form>
        <div class="titleHead">
          <a-table
            :columns="columns"
            :row-key="uuidKey"
            :data-source="datas"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <a-button
              slot="action"
              slot-scope="text, record"
              @click="open(record)"
              >明细</a-button
            >
          </a-table>
        </div>
        <mingxipage :curshow.sync="isfalse" :curinfo="info"></mingxipage>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import columns from '../components/titles'
import mingxipage from '../components/mingxipage'
export default {
  name: 'gamesContentBox',
  components: {
    mingxipage
  },
  data() {
    return {
      isfalse: false, // 控制明细数据显示
      // 定义明细数据其中的任意一项数据
      info: {},
      loading: false,
      gameTypeLoading: false,
      form: this.$form.createForm(this),
      // 定义接受所有游戏类型
      gamelists: [],
      // 定义所有游戏名字
      gameNames: [],
      disabled: true,
      // 数据列表
      datas: [],
      columns,
      // 分页
      pagination: {
        current: 1, //页码
        pageSize: 10, //每页条数
        pageSizeOptions: ['10', '20', '30', '40'],
        showSizeChanger: true, // 展示 pageSize 切换器
        showQuickJumper: true, // 快速跳转至某页
        showTotal: total => `共${total}条`,
        total: 0 // 总页数
      }
    }
  },
  methods: {
    // 时间
    onChangeTime(date, dateString) {
      console.log(date, dateString)
    },
    // 搜索  (传参时固定死id了，只有1004数据)
    sousuo() {
      this.pagination.pageNo = 1
      this.pagination.pageSize = 10
      this.getgameList()
    },
    // 重置表单
    resetForm() {
      // debugger
      this.form.resetFields()
      this.disabled = true
      this.gameNames = []
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.getgameList()
    },
    // 获取所有游戏类型
    allgames() {
      this.gameTypeLoading = true
      var token2 = sessionStorage.getItem('token')
      fetch('/system-admin/game/findGameAll', {
        method: 'POST',
        headers: new Headers({
          'X-Access-Token': token2 //token
        })
      })
        .then(res => {
          return res.json()
        })
        .then(res => {
          if (res.success) {
            this.gamelists = res.result
            // console.log(this.gamelists)
          }
        })
        .finally(() => {
          this.gameTypeLoading = false
        })
    },
    //   下拉框点击事件(获取所有游戏名字----子组件gameNames)
    Changetypegame(value) {
      // console.log(value)
      // 获取当前数组里的子数组  通过判断value值来获取对应的数据对象  当前typeId 与 value 是动态绑定的
      const obj = this.gamelists.find(item => item.typeId === value)
      // isEmpty是个插件，判断是否为空  （指令：npm i lodash  引入：import isEmpty from 'lodash/isEmpty'）
      if (!isEmpty(obj)) {
        this.disabled = false
        this.gameNames = obj.game
        // console.log(this.gameNames)
      } else {
        this.disabled = true
        this.gameNames = []
      }
    },
    //   获取游戏列表数据
    getgameList() {
      this.loading = true
      var token1 = sessionStorage.getItem('token')
      // 此getFieldsValue() 对应html的v-decorator="['rangeDate', { initialValue: [] }]"
      const { gameType, game, rangeDate } = this.form.getFieldsValue()

      var data = {
        beginTime: '', // 搜索的开始时间
        endTime: '', // 搜索的结束时间
        pageNo: this.pagination.current, //页码
        pageSize: this.pagination.pageSize, //每页条数
        gameIds: [1004]
      }

      if (rangeDate && rangeDate.length > 0) {
        data.beginTime = rangeDate[0].format('YYYY-MM-DD')
        data.endTime = rangeDate[1].format('YYYY-MM-DD')
      }

      fetch('/system-admin/pgame/queryPageList', {
        method: 'POST',
        body: this.$qs.stringify(data),
        headers: new Headers({
          'X-Access-Token': token1, //token
          'Content-Type': 'application/x-www-form-urlencoded' //固定
        })
      })
        .then(res => {
          return res.json()
        })
        .then(res => {
          if (res.success) {
            // const pagination = { ...this.pagination }
            // this.pagination = pagination
            this.datas = res.result.records
            this.pagination.total = res.result.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 生成唯一id
    uuidKey(record, idx) {
      return idx
    },
    // table表格--触发的事件--分页
    handleTableChange(pagination) {
      console.log(pagination)
      this.pagination.current = pagination.current
      // 此pagination是触发的事件对象
      // const { current, pageSize } = pagination
      // console.log(current)
      // console.log(pageSize)
      // if (this.pagination.pageSize !== pageSize) {
      //   this.pagination.current = 1
      //   this.pagination.pageSize = pageSize
      // } else if (this.pagination.current !== current) {
      //   this.pagination.current = current
      //   console.log(this.pagination.current)
      // }
      this.getgameList()
    },
    // 点击明细
    open(record) {
      this.isfalse = true
      this.info = record
    }
  },
  // 渲染html前调用(与dom没有关联，只有数据)    即通常初始化某些属性值，然后再渲染成视图。
  created() {
    // this.allgames()
  },

  mounted() {
    this.allgames()
    this.getgameList()
  }
}
</script>

<style>
.gamesPage {
  background: #f2f2f2;
  padding: 50px;
  box-sizing: border-box;
}
.gamesContentBox {
  width: 100%;
  height: 100%;
  background: #fff;
  flex-grow: 1;
}
.ant-form-item-label {
  width: 90px !important;
}
.ant-col-20 {
  display: flex;
  justify-content: space-around;
  margin-top: 22px;
}
.ant-form-item {
  display: flex;
}

.ant-btn-primary1 {
  width: 33%;
  margin: 24px 0;
}
</style>
