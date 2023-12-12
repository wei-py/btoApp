function goPhase(item) {
  if (item.value == '未开启') {
    util.toast.error(item.title + item.value)
    return
  }
  // console.log(util._.option, 333);
  util.go(item.path, { orderId: util._.option.orderId })
}
export const itemDetail = [
  {
    formType: 'text',
    name: 'name',
    title: '系统编号',
    value: '-'
  },
  {
    formType: 'text',
    name: 'name1',
    title: '进件编号',
    value: '-',
    suffixIcon: '',
    tap() {
      // console.log(util._)
    },
    mounted() {
      // this.value = '333'
    }
  }
] // 基本详情
export const inquiry = [
  {
    formType: 'text',
    name: 'inquiry',
    path: '/inquiry/inquiry',
    title: '预审信息',
    value: '未开启',
    tap() {
      goPhase(this)
    }
  }
] // 预审
export const customerInfo = [
  {
    formType: 'text',
    name: 'name2',
    title: '客户信息',
    value: '未开启',
    path: '/customerInfo/customerInfo',
    tap() {
      goPhase(this)
    }
  }
] // 客户信息
export const survey = [
  {
    formType: 'text',
    name: 'name2',
    // disabled: true,
    title: '业务踏勘',
    value: '未开启',
    path: '/businessReconnaissance/businessReconnaissance',
    tap() {
      goPhase(this)
    }
  },
  {
    formType: 'text',
    name: 'name2',
    title: '技术勘察',
    value: '未开启',
    path: '/technicalLnvestigation/technicalLnvestigation',
    tap() {
      goPhase(this)
    }
  }
] // 勘察
export const contractSign = [
  {
    formType: 'text',
    name: 'name3',
    disabled: true,
    title: '合同签约',
    value: '未开启',
    path: '/contractAward/contractAward',
    tap() {
      goPhase(this)
    }
  }
] // 合同签约
export const record = [
  {
    formType: 'text',
    name: 'name1',
    disabled: true,
    title: '备案证及权属证明',
    value: '未开启',
    path: '/certificate/certificate',
    tap() {
      goPhase(this)
    }
  }
] // 备案证
export const initReview = [
  {
    formType: 'text',
    name: 'name1',
    disabled: true,
    title: '初设评审信息',
    value: '未开启',
    path: '/InitialReview/InitialReview',
    tap() {
      goPhase(this)
    }
  },
  {
    formType: 'text',
    name: 'name2',
    style: {},
    disabled: true,
    title: '设计变更信息',
    value: '未开启',
    class: '!text-[#808080]',
    path: '/InitialReview/designChange',
    tap() {
      goPhase(this)
    }
  }
] // 初设评审
export const build = [
  {
    formType: 'text',
    name: 'name1',
    disabled: true,
    title: '施工信息',
    value: '未开启',
    class: '',
    path: '/build/build',
    tap() {
      goPhase(this)
    }
  },
  {
    formType: 'text',
    name: 'name2',
    disabled: true,
    title: '设备信息',
    value: '未开启',
    path: '/deviceInfo/deviceInfo',
    tap() {
      goPhase(this)
    }
  },
  {
    formType: 'text',
    name: 'name3',
    disabled: true,
    title: '施工影像件信息',
    value: '未开启',
    path: '/buildVideo/buildVideo',
    tap() {
      goPhase(this)
    }
  },
  {
    formType: 'slot',
    name: 'sgapproval',
    disabled: true,
    labelWidth: '0'
  }
] // 施工
export const grid = [
  {
    formType: 'text',
    name: 'name1',
    disabled: true,
    title: '并网信息',
    value: '未开启',
    path: '/gridConnected/gridConnected',
    tap() {
      goPhase(this)
    }
  }
] // 并网
export const ZYsettlement = [
  {
    formType: 'text',
    name: 'name2',
    disabled: true,
    title: '结算',
    value: '未开启',
    path: '/settlement/settlement',
    tap() {
      goPhase(this)
    }
  }
] //直营结算
export const DLSsettlement = [
  {
    formType: 'text',
    name: 'name2',
    disabled: true,
    title: '并网结算信息',
    value: '未开启',
    path: '/gridConnectedAccount/gridConnectedAccount',
    tap() {
      goPhase(this)
    }
  },
  {
    formType: 'text',
    name: 'name2',
    disabled: true,
    title: '资料结算信息',
    value: '未开启',
    path: '/gridSettlement/gridSettlement',
    tap() {
      goPhase(this)
    }
  }
] // 供应商结算
export const electricityContract = [
  {
    formType: 'text',
    name: 'name2',
    disabled: true,
    title: '购售电合同信息',
    value: '未开启',
    path: '/electricityContract/electricityContract',
    tap() {
      goPhase(this)
    }
  }
] // 购售电合同
