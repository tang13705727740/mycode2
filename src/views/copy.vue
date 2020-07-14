<template>
  <div class="record-game container">
    <a-form
      class="search-bar-form"
      :form="form"
      layout="inline"
      autocomplete="off"
    >
      <a-row>
        <a-col :span="20">
          <a-form-item label="游戏种类">
            <a-select
              v-decorator="['gameType']"
              style="width: 160px"
              @change="handleChangeGameType"
              placeholder="请选择游戏种类"
            >
              <a-select-option
                v-for="item in gameTypeList"
                :value="item.typeId"
                :key="item.typeId"
                >{{ item.typeName }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="选择游戏">
            <a-select
              v-decorator="['gameIds']"
              style="width: 140px"
              @change="handleChangeGameId"
              :disabled="!gameSubList[0]"
              placeholder="请选择游戏"
            >
              <a-select-option
                v-for="item in gameSubList"
                :value="item.id"
                :key="item.key"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="选择日期">
            <a-range-picker
              v-decorator="['chooseTime']"
              :disabled-date="disabledDate"
            >
            </a-range-picker>
          </a-form-item>
        </a-col>
        <a-col :span="4" class="text-right">
          <a-button type="primary" icon="search" @click="handleSearchClick"
            >搜索</a-button
          >
          <a-button
            type="primary"
            icon="reload"
            @click="handleResetClick"
            :style="{ marginLeft: '10px' }"
            >重置</a-button
          >
        </a-col>
      </a-row>
    </a-form>

    <a-table
      :rowKey="buildRowKey"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      class="record-game__table"
    >
      <span slot="action" slot-scope="text, record">
        <a-button @click="handleDetailClick(record)" v-if="record.operation"
          >明细</a-button
        >
      </span>
    </a-table>
    <GameDetailModal
      :visible.sync="showDetailModal"
      :gameDetailData="gameDetailData"
      @afterClose="handleDetailAfterClose"
    />
  </div>
</template>

<script>
import columns from './columns'
import { mapState } from 'vuex'
import GameDetailModal from './components/GameDetailModal'
import { findGameAll, getHallPlayerGameResult } from '../../../api'
import moment from 'moment'
export default {
  name: 'record-game',
  components: {
    GameDetailModal
  },
  data() {
    return {
      loading: false,
      gameTypeLoading: false,
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      gameTypeList: [], // 游戏类型
      gameSubList: [], // 选择游戏子列表
      exportParams: {},
      showDetailModal: false,
      gameDetailData: {},
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40'],
        showQuickJumper: true,
        showSizeChanger: true,
        // position: 'center',
        showTotal: total => `共${total}条`,
        total: 0
      }
    }
  },
  computed: {
    ...mapState(['ciphertext'])
  },
  methods: {
    // 分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      const { current, pageSize } = pagination
      if (this.pagination.pageSize !== pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
      } else if (this.pagination.current !== current) {
        this.pagination.current = current
      }
      this.getGameRecordList()
    },

    // 判断额度显示的颜色
    getColor(text) {
      const str = text.toString()
      if (str === '0') {
        return ''
      }
      if (str.indexOf('-') > -1) {
        return 'red'
      }
      return 'green'
    },

    // 生成唯一id
    buildRowKey(record, idx) {
      return idx
    },

    // 是否显示游戏明细按钮
    showDetailButton(gameId) {
      const id = Number(gameId)
      if (id > 6000 && id < 7000) {
        return false
      }
      return true
    },

    // 获取所有游戏类型
    getGameType(params) {
      this.gameTypeLoading = true
      findGameAll(this.ciphertext)
        .then(res => {
          console.log(res)

          if (res.data.respCode === 0) {
            this.gameTypeList = res.data.datas
          } else {
            this.$_message.error(res.message)
          }
        })
        .finally(() => {
          this.gameTypeLoading = false
        })
    },

    // 获取游戏报表数据
    getGameRecordList(params) {
      this.loading = true
      const formData = this.form.getFieldsValue()

      const data = {
        gameIds: formData.gameIds ? [formData.gameIds] : [],
        roundNum: '',
        ciphertext: this.ciphertext,
        beginTime:
          formData.chooseTime && formData.chooseTime.length > 0
            ? formData.chooseTime[0].format('YYYY-MM-DD')
            : '',
        // startTime:
        //   formData.chooseTime && formData.chooseTime.length > 0
        //     ? formData.chooseTime[0].format('YYYY-MM-DD HH:mm:ss')
        //     : '',
        endTime:
          formData.chooseTime && formData.chooseTime.length > 0
            ? formData.chooseTime[1].format('YYYY-MM-DD')
            : '',
        // endTime:
        //   formData.chooseTime && formData.chooseTime.length > 0
        //     ? formData.chooseTime[1].format('YYYY-MM-DD HH:mm:ss')
        //     : '',
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      // 如果此时已选择游戏种类，但未选择具体游戏时
      if (formData.gameType && !formData.gameIds) {
        this.gameSubList.forEach(item => {
          data.gameIds.push(item.id)
        })
      }

      getHallPlayerGameResult(data)
        .then(res => {
          console.log(res)

          if (res.data.respCode === 0) {
            this.dataSource = res.data.datas.records
            this.pagination.total = res.data.datas.total
          } else {
            this.$_message.error(res.data.respMsg)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 搜索
    handleSearchClick() {
      // 去除输入项前后空格

      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.getGameRecordList()
    },

    // 重置
    handleResetClick() {
      this.form.resetFields()
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.getGameRecordList()
    },

    // Modal 完全关闭后的回调
    handleAfterClose() {
      this.exportParams = {}
    },

    // 查看游戏明细
    handleDetailClick(record) {
      this.showDetailModal = true
      this.gameDetailData = record
    },

    // 游戏明细 Modal 完全关闭后的回调
    handleDetailAfterClose() {
      this.gameDetailData = {}
    },
    //
    handleChangeGameType(type) {
      this.form.resetFields('gameIds')
      this.gameSubList = this.gameTypeList.find(item => {
        return item.typeId === type
      }).game
      // 选择游戏种类后，获取此游戏种类下的所以游戏ids
    },
    handleChangeGameId() {},
    disabledDate(current) {
      // Can not select days before last month
      return (
        current <
        moment()
          .subtract(31, 'days')
          .endOf('day')
      )
    }
  },
  mounted() {
    this.getGameType()
    this.getGameRecordList()
  }
}
</script>

<style lang="scss" scoped>
.record-game {
  padding: 20px;
  flex-grow: 1;
  background-color: #f2f2f2;
  .search-bar-form {
    background-color: #fff;
    padding: 10px;
  }
  &__table {
    background-color: #fff;
  }
  ::v-deep .ant-table-pagination.ant-pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
