<template>
  <view>
    <view v-if="showApprovalModule">
      <!-- <uniApproval v-if="_.btns.rejectReason && _.btns.hasApprovalModule" v-model:btns="_.btns" :orderState="_.orderState" ref="approvalDom" /> -->
      <uniForm :form="get(util, '_.approvalModule') || []" title="审核">
        <template #rejectFilesSlot="item">
          <uniCell>
            <view class="pt-[15rpx] pb-[15rpx]">附件</view>
            <uniCard :form="item.scope.data"></uniCard>
          </uniCell>
        </template>
      </uniForm>
    </view>
    <view class="flex-1 flex pb-[20rpx] w-[80%] mx-auto">
      <wd-button
        v-if="hasEditBtn && canEdit"
        @tap="save"
        :disabled="!canEdit"
        custom-class="!bg-[#ffab30] !text-white"
        type="warning">
        保存
      </wd-button>
      <wd-button
        v-if="hasEditBtn && canEdit"
        @tap="putApproval"
        :disabled="!canEdit"
        custom-class="!bg-[#ffab30] !text-white"
        type="warning">
        提交
      </wd-button>
      <wd-button
        v-if="hasApprovalBtn && !canEdit"
        @tap="approval"
        :disabled="!canApproval"
        :custom-class="['!text-white !w-[230rpx]', canApproval ? '!bg-[#ffab30]' : '!bg-[#fbd186]'].join(' ')"
        type="warning">
        <!-- :disabled="!_.btns.canApproval" -->
        审核
      </wd-button>
    </view>
  </view>
</template>

<script setup>
import { get } from 'lodash'
import { util } from '@/utils/util'
import uniForm from '../uniForm.vue'
import uniCell from '../uniCell.vue'
import uniCard from '../uniCard.vue'
import approvalModule from './uniBtn' // 审核表单
// const props = defineProps()
const hasEditBtn = computed(() => lo.get(util, '_.btns.hasEditBtn'))
const canEdit = computed(() => lo.get(util, '_.btns.canEdit'))
const hasApprovalBtn = computed(() => lo.get(util, '_.btns.hasApprovalBtn'))
const canApproval = computedAsync(() => lo.get(util, '_.btns.canApproval'))
const showApprovalModule = computed(
  () =>
    lo.get(util, '_.btns.rejectReason') && lo.get(util, '_.btns.hasApprovalModule') && lo.has(util, '_.approvalModule')
)

let approvalModuleEnhance = null

util.onceShow(async () => {
  approvalModuleEnhance = enhance(approvalModule)
  util._.approvalModule = computed(() => approvalModuleEnhance)
  util._.allPath = lo.concat(util._.allPath, ...approvalModule.map((n) => 'approvalModule.' + n.name), 'rejectFiles')
  lo.forIn(['name', 'option', 'title', 'allPath'], (n) => {
    delete approvalModuleEnhance[n]
  })

  computedAsync(() => {
    const flag = lo.get(util, `_.btns.rejectReason.rejectReason`)
    getData()
    return flag
  })

  approvalModuleEnhance.map((formItem) => {
    formItem.disabled = computed(() => !canApproval.value)
  })

  computedAsync(() => {
    const stateId = lo.get(util, '_.orderState.stateId')
    const params = util.getParams(util._)

    if (stateId && !params.approvalType) {
      util._.name('approvalType').value =
        params.approvalType || (stateId == 'WAITING_APPROVAL_BTO' ? 'APPROVAL_BTO' : 'APPROVAL_INNER')
    }
    return stateId
  })
})

async function getData() {
  lo.forIn(approvalModuleEnhance, async (formItem) => {
    if (formItem.formType == 'slot') {
      formItem.data[0].value = (lo.get(util, `_.btns.rejectReason.rejectFiles`) || []).map((img) => {
        return img.fileSrc
      })
    } else {
      if (formItem.name != 'orderId') {
        formItem.value = computedAsync(() => lo.get(util, `_.btns.rejectReason.${formItem.name}`) || '')
      }
    }
  })
}

async function save() {
  const params = util.getParams(util._)
  await util._.save(params)
}

async function putApproval() {
  const saveParams = util.getParams(util._)
  await util._.save(saveParams)
  util.valid(util._)
  const params = xx.serialize({ orderId: util._.option.orderId })
  await util._.putApproval(params)
  await util._.getData()
  uni.pageScrollTo({ scrollTop: 0 })
}

async function approval() {
  const pickValue = ['approvalType', 'result', 'rejectReason', 'rejectFiles', 'orderId']
  const params = util.getParams(util._)
  params.rejectFiles = params.rejectFiles.map((n) => {
    const img = util.formatImg(n)
    return {
      fileName: img.name,
      fileSrc: img.src
    }
  })
  await util._.approval(lo.pick(params, pickValue))
  uni.pageScrollTo({ scrollTop: 0 })
}
</script>

<style lang="scss" scoped>
:deep(.lsj-file) {
  * {
    z-index: 9 !important;
  }
}
</style>
