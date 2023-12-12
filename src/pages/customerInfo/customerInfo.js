import { computedAsync, watchDebounced } from '@vueuse/core'
import { computed, watch } from 'vue'

export const lessorInfo = [
  {
    formType: 'text',
    title: '姓名',
    value: '',
    name: 'name',
    required: true,
    placeholder: '带过来的保存的信息'
  },
  {
    formType: 'text',
    title: '身份证号',
    required: true,
    value: '',
    name: 'idNumber',
    placeholder: '带过来的保存的信息'
  },
  // 身份证正反面
  {
    formType: 'slot',
    name: 'idCard',
    title: '身份证照片',
    ignoreParam: true,
    data: [
      {
        formType: 'img',
        title: '身份证头像面',
        required: true,
        name: 'idCardBack',
        count: 1,
        value: []
      },
      {
        formType: 'file',
        title: '身份证国徽面',
        required: true,
        count: 1,
        name: 'idCardFront',
        value: []
      }
    ]
  },
  {
    formType: 'input',
    required: true,
    title: '客户电话',
    value: '',
    type: 'number',
    suffix: 'phone',
    placeholder: '带过来的保存的信息',
    name: 'phone',
    suffixTap() {
      util.callPhone(this.value)
    }
  },
  {
    formType: 'select',
    title: '婚姻信息',
    value: '',
    name: 'maritalStatus',
    placeholder: '请选择婚姻信息',
    columns: util.arrayTowotColumns(['已婚', '未婚'])
  },
  {
    formType: 'select',
    title: '教育程度',
    name: 'educationalBackground',
    placeholder: '请选择教育程度',
    value: '',
    columns: util.arrayTowotColumns(['初等教育', '中等教育', '高等教育'])
  },
  {
    formType: 'select',
    title: '职业',
    name: 'career',
    placeholder: '请选择职业',
    columns: util.arrayTowotColumns([
      '国家机关、党群组织、企业、事业单位负责人',
      '专业技术人员',
      '办事人员和有关人员',
      '商业、服务业人员',
      '农、林、牧、渔、水利业生产人员',
      '生产、运输设备操作人员及有关人员',
      '军人',
      '不便分类的其他从业人员'
    ]),
    value: ''
  },
  {
    formType: 'select',
    title: '家庭经济情况',
    name: 'economy',
    placeholder: '请选择家庭经济情况',
    columns: util.arrayTowotColumns(['赤贫', '很穷', '穷', '小康', '中产', '高产', '小富', '中富', '巨富']),
    value: ''
  },
  {
    formType: 'select',
    title: '健康情况',
    name: 'health',
    placeholder: '请选择健康情况',
    columns: util.arrayTowotColumns(['健康', '亚健康', '疾病']),
    value: ''
  },
  {
    formType: 'mulitSelect',
    title: '省市区',
    required: true,
    ignoreParam: true,
    name: 'code',
    value: [],
    columns: [],
    change(e, _this) {
      this.value = [e.detail.value[0].value, e.detail.value[1].value, e.detail.value[2].value]
      // this.provinceCode = e.detail.value[0].value
      // this.cityCode = e.detail.value[1].value
      // this.areaCode = e.detail.value[2].value
    },
    async mounted(_) {
      const { data } = await http.get('/area')
      this.columns = xx.mapTree(
        data.data,
        (item) => {
          return { ...item, text: item.name, value: item.code }
        },
        {
          children: 'childList',
          mapChildren: 'children'
        }
      )
    }
  },
  {
    formType: 'slot',
    name: 'provinceCode',
    title: '省份',
    value: computedAsync(() => this.value[0])
  },
  {
    formType: 'slot',
    name: 'cityCode',
    title: '市',
    value: computedAsync(() => this.value[1])
  },
  {
    formType: 'slot',
    name: 'areaCode',
    title: '区',
    value: computedAsync(() => this.value[2])
  },
  {
    formType: 'input',
    type: 'textarea',
    value: '',
    name: 'installationAddress',
    placeholder: '若无产权证, 需和房屋权属证明地址完全一致',
    required: true,
    title: '详细地址'
  }
]
export const bankInfo = [
  {
    formType: 'slot',
    name: 'bankCardFrontSlot',
    title: '',
    ignoreParam: true,
    data: [
      {
        formType: 'img',
        title: '银行卡照片',
        required: true,
        name: 'bankCardFront',
        count: 1,
        value: []
      }
    ]
  },
  {
    formType: 'text',
    title: '账户名',
    required: true,
    value: '',
    placeholder: '请输入账户名',
    name: 'bankAccount',
    async mounted() {
      this.value = computedAsync(() => util._.name('name').value)
    }
  },
  {
    formType: 'input',
    title: '银行卡号',
    required: true,
    // type: 'number',
    value: '',
    placeholder: '识别引擎自动填写或手动输入',
    name: 'bankCardNumber',
    mounted() {
      function addSpaces(str) {
        return str.replace(/(.{4})/g, '$1 ').trim()
      }
      nextTick(() => {
        this.value = addSpaces(this.value)
      })
    },
    input(e) {
      function pickNumber(number) {
        if (typeof number !== 'string') {
          return 'Input is not a string'
        }
        const regex = /\d+/g
        const numbers = number.match(regex)
        if (!numbers) {
          return ''
        }
        return numbers.join('') // returns '13'
      }
      function addSpaces(str) {
        return str.replace(/(.{4})/g, '$1 ').trim()
      }
      nextTick(() => {
        let value = pickNumber(e)
        value = addSpaces(value)
        if (value.length > 23) {
          util.toast.error('银行卡号最多为19位')
          value = value.slice(0, 23)
        }
        this.value = value
      })
    }
  },
  {
    formType: 'slot',
    title: '开户行名称',
    value: '',
    required: true,
    wdCell: true,
    popupShow: false,
    name: 'bankName',
    searchTag: '',
    bankNameList: [],
    placeholder: '识别引擎自动填写',
    tap() {
      this.popupShow = true
      this.search()
    },
    async search() {
      let url = this.searchTag ? `lease-bank/bank?queryTag=${this.searchTag}` : 'lease-bank/bank'
      const { data } = await http.get(url)
      this.bankNameList = data.data
    }
  },
  {
    formType: 'slot',
    title: '开户支行',
    required: true,
    fakeValue: '',
    value: '',
    placeholder: '请输入开户支行',
    name: 'accountOpeningBranch',
    wdCell: true,
    popupShow: false,
    accountOpeningBranchList: [],
    searchTag: '',
    tap() {
      this.popupShow = true
      this.search()
    },
    change(e) {
      const [jointLineNumber, value] = e.value.split('==')
      util._.name('jointLineNumber').value = jointLineNumber
      this.value = value
      this.popupShow = false
    },
    async search() {
      let url = this.searchTag ? `lease-bank/sub-bank?queryTag=${this.searchTag}` : 'lease-bank/sub-bank'
      const { data } = await http.get(url)
      this.accountOpeningBranchList = data.data
    }
  },
  {
    formType: 'input',
    title: '联行号',
    required: true,
    value: '',
    // disabled: true,
    placeholder: '自动填充',
    name: 'jointLineNumber'
  }
]
export const lesseeInfo = [
  {
    formType: 'select',
    title: '项目公司',
    value: '',
    required: true,
    placeholder: '请选择项目公司',
    columns: [],
    name: 'projectCompany',
    confirm(e) {
      this.value = e.value
    },
    async mounted(_) {
      const { data } = await http.get('leaseLessor/get?pageNum=1&pageSize=999')
      // // code companyName areaId
      this.columns = data.data.list.map((item) => ({
        ...item,
        label: `${item.code}, ${item.companyName}, ${item.areaId}`,
        value: item.code
      }))
    }
  }
]
export const productWithArea = [
  {
    formType: 'select',
    title: '产品地区',
    value: '',
    required: true,
    placeholder: '请选择产品方案',
    columns: [],
    name: 'productWithArea',
    async mounted(_) {
      const { data } = await http.get('/leasePrjProjectProduct/get?isPage=false')
      this.columns = data.data.map((item) => ({
        ...item,
        label: `${item.code}, ${item.areaType}, ${item.area}`,
        value: item.code
      }))
    }
  }
]
