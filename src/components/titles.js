const columns = [
  {
    title: '接入商名称',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 151
  },
  {
    title: '局号',
    dataIndex: 'roundNum',
    key: 'roundNum'
  },
  {
    title: '玩家编号',
    dataIndex: 'playerId',
    key: 'playerId'
  },
  {
    title: '玩家昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '玩家账号',
    dataIndex: 'account',
    key: 'account'
  },
  {
    title: '游戏ID',
    dataIndex: 'gameId',
    key: 'gameId'
  },
  {
    title: '游戏名称',
    dataIndex: 'gameName',
    key: 'gameName',
    width: 110
  },
  {
    title: '总下注',
    dataIndex: 'totalBet',
    key: 'totalBet'
  },
  {
    title: '开始额度',
    dataIndex: 'startCoin',
    key: 'startCoin'
  },
  {
    title: '输赢额度',
    dataIndex: 'winCoin',
    key: 'winCoin'
  },
  {
    title: '结算额度',
    dataIndex: 'endCoin',
    key: 'endCoin'
  },
  {
    title: '有效下注',
    dataIndex: 'validBet',
    key: 'validBet'
  },
  {
    title: '游戏佣金',
    dataIndex: 'pumpPoint',
    key: 'pumpPoint'
  },
  {
    title: '是否庄家',
    dataIndex: 'isBanker',
    key: 'isBanker'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 162
  },
  {
    title: '记录时间',
    dataIndex: 'dataTime',
    key: 'dataTime',
    width: 162
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default columns
