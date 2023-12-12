import { computed } from '@vue/reactivity'
import { computedAsync } from '@vueuse/core'
import { nextTick, watchEffect } from 'vue'

export const reconnaissanceUserForm = [
  {
    formType: 'select',
    title: '技术勘察员',
    value: '',
    required: true,
    emptyValue: '',
    columns: [],
    placeholder: '请选择技术勘察员',
    name: 'userId',
    async mounted(_) {
      // const params = util.getParams(util._)
      nextTick(async () => {
        const { data } = await http.get(`user/get-by-permission?permissions=PER_JSKC&orderId=${util._.option.orderId}`)
        this.columns = data.data.map((item) => {
          return { ...item, label: item.name, value: item.userId }
        })
      })
    },
    confirm(e) {
      const { phone } = lo.find(this.columns, (n) => n.value == e.value)
      util._.name('phone').value = phone
    }
  },
  {
    formType: 'input',
    title: '技术勘察员手机号码',
    value: '',
    disabled: true,
    placeholder: '系统抓取技术勘察员手机号码',
    name: 'phone',
    suffix: 'phone',
    suffixTap() {
      util.callPhone(this.value)
    }
  },
  {
    formType: 'slot',
    ignoreParam: true,
    value: '',
    disabled: true,
    name: 'appointBtn',
    async mounted() {
      const stageId = lo.get(util, '_.orderState.stageId')
      const stateId = lo.get(util, '_.orderState.stateId')
      const { userId } = util.getStore('user')
      const orderBaseUserId = util._.orderBase.userId

      if (stageId == 'KAN_CHA') {
        this.value = stateId == 'WAITING_APPOINT' ? '指派' : '重新指派'
      }

      this.disabled = computed(() => {
        return !(orderBaseUserId == userId || userId == util._.name('userId').value) || !util._.btns.canEdit
      })
    },
    async tap() {
      const query = xx.serialize({
        userId: util._.name('userId').value,
        orderId: util._.option.orderId
      })
      const { data } = await http.post(`appoint/jskc?${query}`)
      if (data.code == 200) {
        await util._.getData()
        await this.mounted()
      }
    }
  }
]

export const basicMessageForm = [
  {
    formType: 'select',
    title: '拟安装逆变器品牌',
    name: 'inverterBrand',
    columns: [],
    value: '',
    async mounted() {
      const { data } = await http.post('/sto/device-args/list?option=manufacturerShortName', { deviceType: 'NBQ' })
      this.columns = data.data.map((n) => {
        return { label: n, value: n }
      })
    },
    confirm(e) {
      this.value = e.value
    }
  },
  {
    formType: 'input',
    title: '拟安装组件功率(W)',
    value: '',
    placeholder: '请输入',
    name: 'modulePower',
    type: 'number'
  },
  {
    formType: 'input',
    title: '拟安装组件数量(块)',
    value: '',
    placeholder: '请输入',
    name: 'moduleNumberReckon',
    type: 'number'
  },
  {
    formType: 'input',
    title: '拟安装容量(kW)',
    value: '',
    disabled: true,
    placeholder: '自动计算',
    realValue: 0,
    name: 'installedCapacityReckon',
    type: 'number',
    mounted(_) {
      this.realValue = computedAsync(() => _.name('moduleNumberReckon').value * _.name('modulePower').value)
      computedAsync(() => {
        let value = this.realValue * 1
        const unitList = ['W', 'kW', 'mW']
        let unit = unitList.shift()
        while (value > 1000 && unitList.length) {
          value /= 1000
          unit = unitList.shift()
        }
        this.title = `拟安装容量(${unit})`
        this.value = value
        return this.realValue
      })
    }
  }
].map((item) => {
  return { ...item, required: true }
})
