<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <!-- 搜索框 -->
    <wd-search
      light
      :cancel-txt="_.option.from == 'cjsj' ? '新增' : '搜索'"
      @search="search"
      @cancel="searchOrNew"
      v-model="_.queryTag"
      use-suffix-slot></wd-search>
    <!-- 预览项 -->
    <wd-segmented :options="_.overview" :value="_.overviewTag" size="large" @change="changeOverview">
      <template #label="{ option }">
        <view class="h-[32rpx]">{{ option.count || 0 }}</view>
        <view>{{ option.title }}</view>
      </template>
    </wd-segmented>
    <!-- 下拉菜单项 -->
    <view class="flex bg-white text-center items-center mb-2">
      <dropMenu @changeMenu="changeMenu" />
    </view>
    <!-- 列表组件 -->
    <uniList @request="request" ref="uniListDom">
      <template v-slot="{ item }">
        <wd-card
          custom-footer-class="!p-[10rpx]"
          custom-title-class="!p-0 !h-[60rpx] flex items-center w-full"
          custom-class="!px-3">
          <!-- 列表每一项的头部 -->
          <template #title>
            <view class="py-1 flex items-center justify-between w-full borderBottom">
              <view class="text-[26rpx]">
                <!-- 序号 -->
                <view class="inline-flex text-center">
                  <view class="bg-[#ffab30] p-[7rpx] text-white w-[18rpx] h-[18rpx] rounded-3xl center">
                    {{ item.idx }}
                  </view>
                </view>
                <!-- orderId 编号 -->
                {{ get(item, 'orderBase.orderId') }}
                <!-- 复制按钮 -->
                <wd-button
                  @tap="util.copyText(get(item, 'orderBase.orderId'))"
                  plain
                  custom-class="!p-1 !h-[40rpx]"
                  size="small"
                  type="warning">
                  复制
                </wd-button>
              </view>
              <view>
                <!-- 阶段按钮 -->
                <wd-button
                  @tap="goPhase(item)"
                  plain
                  custom-class="!p-1 flex-end !h-[40rpx]"
                  size="small"
                  type="warning">
                  {{ get(statusDic, get(item, 'currentOrderState[0].stageId')) || '-' }}
                </wd-button>
              </view>
            </view>
          </template>
          <!-- 列表每一项的内容 -->
          <view @tap="goDetail(item)">
            <!-- 名字 -->
            <view class="font-bold pt-1">
              {{ get(item, 'customer.name') }}
            </view>
            <view>进件编号：{{ get(item, 'leaseReview.contractNumber') }}</view>
            <view>
              当前阶段：
              <!-- 各个未完成阶段状态 -->
              <template v-for="i of item.currentOrderState" :key="i">
                <view :style="{ color: util.color[util.statusColor(statusDic[i.stateId])] }">
                  {{ statusDic[i.taskId] || statusDic[i.stageId] || '-' }}-{{ statusDic[i.stateId] || '-' }}
                </view>
              </template>
            </view>
            <view>所属组织：{{ get(item, 'company.name') }}</view>
            <view>详细地址：{{ get(item, 'orderBase.installationAddress') }}</view>
            <view>进入当前阶段时间：{{ get(item, 'currentOrderState[0].updateTime') }}</view>
          </view>
        </wd-card>
      </template>
    </uniList>
  </view>
</template>

<script setup>
import notice from '@/components/notice.vue'
import uniList from '@/components/uniList.vue'
import dropMenu from './dropMenu.vue'
import { get } from 'lodash'
import dropMenuOptions from './dropMenuOptions'
import { phaseTask, checkTask } from '../index/taskList'
import { util } from '@/utils/util'

const _ = util.data({ dropMenuOptions })
_.queryTag = '' // 输入框搜索
_.overviewTag = '' // 预览点击
_.overview = [
  // 预览的数据
  { count: '', title: '订单数量', value: 'orderCount' },
  { count: '', title: '签约量', value: 'statisticsSinged' },
  { count: '', title: '建设中', value: 'statisticsBuilding' },
  { count: '', title: '并网量', value: 'statisticsGridConnection' }
]
const uniListDom = ref(null) // 下拉列表组件的DOM
const statusDic = util.getStore('statusDic').data // 任务阶段的字典 无需响应

/**
 * @description 把所有的请求参数处理到这里
 */
_.getParams = () => {
  let params = util.getParams(_)
  params.excludeStateIds && (params.excludeStateIds = [params.excludeStateIds])
  // if (_.option.from != 'cjsj') {
  // }
  // params.queryTag = _.queryTag
  params.orderType = 'ZZD'
  return params
}

util.onceShow(async () => {
  util.setTitle(_.option.title) // 设置头部Title
  await uniListDom.value.search(_.getParams()) // 这里会回调到下面的 request 方法
  await getData()
})

onReachBottom(() => {
  uniListDom.value.getData(undefined, undefined, _.getParams())
})

/**
 * @description 回写列表数据
 * @param {*} pageNum 无需生命都在组件中
 * @param {*} pageSize 无需生命都在组件中
 * @param {*} filter 过滤条件
 * @param {*} callback 闭包 将数据回写到组件
 */
async function request(pageNum, pageSize, filter, callback = () => {}) {
  const url = _.option.from != 'cjsj' ? 'search-exclude-states' : 'search'
  const { data } = await http.post(`/order/${url}?pageNum=${pageNum}&pageSize=${pageSize}`, filter)
  callback(data.data.list, data.data.total)
}

/**
 * @description 回写预览项数据和下拉菜单项数据 - 非订单列表跳转进来会携带一些条件过来
 */
async function getData() {
  // 从任务大全或者是审核大全跳转过来的
  const isFromTaskOrCheck = _.option.from == 'rwdq' || _.option.from == 'shdq'
  if (isFromTaskOrCheck) {
    _.title('项目阶段').value = _.option.stageId
    // 初设评审 单独调用
    let orderStateUrl =
      _.option.title == '初设审核' ? 'order-state/stage-design-state?' : 'order-state/stage-task-state?'
    const { data } = await http.get(orderStateUrl + xx.serialize(_.getParams()))
    // 赋值预览项
    nextTick(() => {
      _.overview = data.data.map((n) => {
        return { title: n.stateName, count: n.count, value: n.stateId }
      })
    })
  } else {
    const { data } = await http.post('bi/app-order-page-head', _.getParams())
    const unitValue1 = util.uniConver(data.data.statisticsSinged)
    const unitValue2 = util.uniConver(data.data.statisticsBuilding)
    const unitValue3 = util.uniConver(data.data.statisticsGridConnection)
    _.overview[0].count = data.data.orderCount
    _.overview[1].count = `${unitValue1.value + unitValue1.unit}`
    _.overview[2].count = `${unitValue2.value + unitValue2.unit}`
    _.overview[3].count = `${unitValue3.value + unitValue3.unit}`
  }
  // 初始化条件选项
  _.overviewTag = _.overview[0].value
  _.option.stateId = _.overviewTag
}

/**
 * @description 顶部的输入框搜索
 */
function search() {
  uniListDom.value.search(_.getParams())
}

/**
 * @description 从常见数据中跳转过来的 就使用搜索 其他就是新建
 */
function searchOrNew() {
  if (_.option.from == 'cjsj') {
    util.go('/inquiry/inquiry')
  } else {
    uniListDom.value.search(_.getParams())
  }
}

/**
 * @description 点击预览项的事件
 * @param {*} overview 点击到的预览项数据
 */
function changeOverview(overview) {
  _.option.stateId = overview.value
  uniListDom.value.search(_.getParams())
}

/**
 * @description 点击下拉菜单选项的事件
 */
function changeMenu() {
  uniListDom.value.search(_.getParams())
}

/**
 * @description 点击列表项的复制按钮旁边的阶段按钮事件
 * @param {*} item
 */
function goPhase(item) {
  const stageId = get(item, 'currentOrderState[0].stageId')
  const taskId = get(item, 'currentOrderState[0].taskId')
  const orderId = get(item, 'currentOrderState[0].orderId')
  const taskList = [...phaseTask, ...checkTask]
  const stageTask = taskList.filter((n) => n.query.stageId == stageId)
  const taskTask = stageTask.filter((n) => n.query.taskId == taskId)
  const detail = taskTask[0] || stageTask[0]
  const detailPath = lo.get(detail, 'detailPath')
  if (!detailPath) {
    util.toast.error('系统出错, 有脏数据')
  } else {
    const routePath = `/${detailPath}/${detailPath}`
    util.go(routePath, { orderId })
  }
}

/**
 * @description 点击列表项的事件
 * @param {*} item
 */
function goDetail(item) {
  const orderId = get(item, 'currentOrderState[0].orderId')
  util.go('/itemDetail/itemDetail', { orderId })
}
</script>

<style scope lang="scss">
:deep(.wd-card__content) {
  * {
    font-size: 22rpx !important;
    color: black;
  }
}
.borderBottom {
  border-bottom: 1px solid #ccc;
}
:deep(.wd-card__title) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

//////////////////  menu //////////////////
:deep(.wd-segmented) {
  background: #eee !important;
  * {
    background: #eee !important;
  }
}
:deep(.wd-tabs__line) {
  background: #ffab30 !important;
}
:deep(.is-active) {
  .wd-segmented__item-label {
    color: #ffab30;
  }
}
//////////////////  dropMenu //////////////////
//////////////////  search //////////////////
:deep(.wd-search__cancel) {
  border: #ffab30 1rpx solid;
  border-radius: 30rpx;
  padding: 0 35rpx;
  margin: 0 10rpx;
  text-align: center;
  background: #ffab30;
  color: #fff !important;
}
//////////////////  search //////////////////
</style>
