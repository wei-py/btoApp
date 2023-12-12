<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <uniForm :form="_.businessReconnaissanceForm">
      <template #title>
        <view
          class="h-[90rpx] justify-center flex flex-col bg-[#ffab30] pl-[15px] text-white font-bold text-[30rpx] rounded-t">
          <view>安装地址</view>
          <view>确保项目定位准确否则施工无法扫码收货</view>
        </view>
      </template>
      <template #detailedAddressSlotTitle="{ scope }">
        <view>
          {{ scope.title }}
        </view>
      </template>
      <template #detailedAddressSlotValue="{ scope }">
        <view class="mt-[5rpx]">
          {{ _.name('latLngAddress').value || '定位的地理地址(自动获取)' }}
        </view>
        <view>纬度: {{ _.name('latitude').value || '未获取' }} 经度: {{ _.name('longitude').value || '未获取' }}</view>
        <view class="mb-[5rpx]">
          <wd-button @tap="scope.iconClick" size="small" custom-class="!bg-[#ffab30] !text-white" type="warning">
            获取定位
          </wd-button>
        </view>
      </template>
    </uniForm>

    <uniForm :form="_.panoramaForm" title="房屋外观图">
      <template #panoramaSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>房屋外观全景水印相机定位(必填)</view>
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-1"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.innerStructureForm" title="房屋内部结构">
      <template #innerStructureSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>内部横梁立柱(必填)</view>
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-1"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.interneMilieuForm" title="房屋内部环境">
      <template #interneMilieuSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>生活生产环境(必填)</view>
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-1"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.roofForm" title="屋顶连贯照">
      <template #roofSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>站东南角往西北拍、站北往正南拍、站西南角往东北(必填)</view>
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-3"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.roofWholeForm" title="屋顶面整体照">
      <template #roofWholeSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>风化和防水(必填)</view>
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-1"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.dimensionalDrawingForm" title="楼板厚度照">
      <template #dimensionalDrawingSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <!-- <view>风化和防水(必填)</view> -->
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-1"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.explorationTableForm" title="光伏勘察表">
      <template #explorationTableSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>勘察表正面、屋面尺寸照(必填)</view>
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-2"></uniCard>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.otherImagesForm" title="其他踏勘影像件">
      <template #otherImagesSlot="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <!-- <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view> -->
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-1"></uniCard>
        </uniCell>
      </template>
    </uniForm>
    <uniBtn />
  </view>
</template>

<script setup>
import uniCell from '@/components/uniCell.vue'
import uniCard from '@/components/uniCard.vue'
import notice from '@/components/notice.vue'
import uniForm from '@/components/uniForm.vue'
import uniBtn from '@/components/uniBtn/uniBtn.vue'
import {
  businessReconnaissanceForm, // 定位
  panoramaForm, // 房屋外观图
  innerStructureForm, // 房屋内部结构
  interneMilieuForm, // 房屋内部环境
  roofForm, // 屋顶连贯图
  roofWholeForm, // 屋顶整体图
  dimensionalDrawingForm, // 楼板厚度图
  explorationTableForm, // 光伏勘察图
  otherImagesForm // 其他踏勘影像件
} from './businessReconnaissance'

const _ = util.data({
  businessReconnaissanceForm, // 定位
  panoramaForm, // 房屋外观图
  innerStructureForm, // 房屋内部结构
  interneMilieuForm, // 房屋内部环境
  roofForm, // 屋顶连贯图
  roofWholeForm, // 屋顶整体图
  dimensionalDrawingForm, // 楼板厚度图
  explorationTableForm, // 光伏勘察图
  otherImagesForm // 其他踏勘影像件
})

util.onceShow(async () => {
  await _.getData()
})

_.getData = async () => {
  const url = 'order/get-takan'
  const params = xx.serialize({ orderId: _.option.orderId })
  const { data } = await http.get(url + '?' + params)
  data.data = { ...data.data, ...data.data.explorationTable, ...data.data.otherImages }
  util.initRoot(_, data.data)
  console.log(util.getParams(util._))
}

_.save = async (params) => {
  const url = 'order/put-takan'
  params.explorationTable = {
    front: params.front,
    back: params.back
  }
  params.otherImages = {
    imageAddr: params.imageAddr || []
  }
  const { data } = await http.post(url, params)
  util.toastSave(data)
}

_.putApproval = async (params) => {
  const url = 'approval/put-approval/pre/takan'
  const { data } = await http.post(url + '?' + params)
  util.toastPutApproval(data)
}

_.approval = async (params) => {
  const url =
    params.approvalType == 'APPROVAL_BTO' ? 'approval/do-approval/bto/takan' : 'approval/do-approval/pre/takan'
  const { data } = await http.post(url, params)
  util.toastApproval(data)
}
</script>
