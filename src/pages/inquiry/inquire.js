import { computedAsync } from '@vueuse/core'
import { computed } from 'vue'

export const lessorInfo = [
  {
    formType: 'input',
    title: '姓名',
    name: 'name',
    placeholder: '扫描身份证或手动输入',
    value: '',
    type: 'text',
    required: true,
    rules: [],
    suffix: 'scan',
    suffixTap() {
      util.toast.error('功能开发中')
    }
  },

  {
    formType: 'select',
    title: '身份证类型',
    name: 'idCardType',
    placeholder: '请选择身份证类型',
    columns: [{ label: '中国大陆居民身份证', value: 0 }],
    rules: [],
    value: '',
    required: true,
    mounted() {
      // this.value = 0
    },
    confirm(e) {
      this.value = e.value
    }
  },
  {
    formType: 'input',
    title: '身份证号',
    suffix: 'scan',
    name: 'idNumber',
    placeholder: '扫描身份证或手动输入',
    value: '',
    type: 'text',
    required: true,
    suffixTap() {
      util.toast.error('功能开发中')
    }
  },
  {
    formType: 'input',
    title: '出租人电话',
    name: 'phone',
    placeholder: '请输入出租人电话',
    type: 'number',
    suffix: 'call',
    value: '',
    type: 'text',
    required: true,
    suffixTap() {
      util.callPhone(this.value)
    }
  }
]
export const salespersonInfo = [
  {
    formType: 'input',
    title: '销售人员姓名',
    name: 'salesman',
    placeholder: '请输入销售人员姓名',
    value: '',
    type: 'text',
    mounted() {
      // const user = uni.getStorageSync('user')
      const user = util.getStore('user')
      this.value = user.name
    }
  },
  {
    formType: 'input',
    title: '销售人员电话',
    type: 'number',
    required: true,
    name: 'saleTelephone',
    placeholder: '请输入销售人员电话',
    suffix: 'phone',
    value: '',
    mounted() {
      const user = util.getStore('user')
      this.value = user.phone
    },
    suffixTap() {
      util.callPhone(this.value)
    }
  }
]
export const guarantor = [
  {
    formType: 'select',
    title: '是否有保证人',
    name: 'isSurety',
    'popup-title': '保证人',
    placeholder: '请选择',
    value: 0,
    columns: [
      { label: '无', value: 0 },
      { label: '有', value: 1 }
    ],
    mounted() {
      this.value = 0
    },
    confirm(e) {
      // const selectItem = lo.find(this.localdata, (n) => n.text == e.value)
      // this.realValue = selectItem.value
    }
  }
]
export const signInfo = [
  {
    formType: 'text',
    // disabled: true,
    title: '信息使用授权协议',
    name: 'fddSignTaskId',
    value: 0,
    class: 'text-yellow-500',
    type: 'text',
    hasFdd: computedAsync(() => {
      return !['', '0', 'revoked', '已签署'].some((n) => {
        return this.value == n
      })
    }),
    dictionary: {
      0: '未签署',
      '': '未签署',
      revoked: '已作废',
      default: '已签署'
    },
    mounted() {}
  },
  {
    formType: 'slot',
    title: '签署方式',
    value: '',
    mode: 'tag',
    name: 'signeType',
    columns: [
      { label: '短信签署', value: 'sms' },
      { label: 'App', value: 'app' }
    ]
  },
  {
    formType: 'text',
    title: '已签署协议查看',
    required: '请选中签署方式后点击开始签署',
    wdCell: true,
    value: '',
    valueClass: 'text-[#ffab30]',
    dictionary: {
      // '': '未签署',
      default: '协议查看'
    },
    placeholder: '暂无数据',
    name: 'authorizationLetter',
    tap() {
      util.go('/webview/uniWebView', { pdfUrl: this.value })
    },
  }
]
