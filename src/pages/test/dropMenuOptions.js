import { toValue } from '@vueuse/core'
export default [
  {
    formType: 'slot',
    name: 'companyId',
    title: '所属组织',
    value: "null",
    option: [{ value: "null", label: '所属组织', tip: '所属组织' }],
    async mounted() {
      const { data } = await http.get('/company/infos')
      this.option.push(
        ...data.data.records.map((item) => {
          return {
            value: item.companyId,
            label: this.title,
            tip: item.name,
          }
        })
      )
    }
  },
  {
    formType: 'slot',
    name: 'prjCompanyId',
    title: '项目公司',
    value: 'null',
    option: [{ label: '项目公司', tip: "项目公司", value: 'null' }],
    async mounted() {
      const { data } = await http.get('/leaseLessor/get')
      this.option.push(
        ...data.data.list.map((item) => {
          return {
            value: item.code,
            label: this.title,
            tip: item.companyName
          }
        })
      )
      this.value = this.option[0].value
    }
  },
  {
    formType: 'slot',
    name: 'leaseProductCode',
    title: '产品地区',
    value: 'null',
    option: [{ label: '产品地区', tip: "产品地区", value: 'null' }],
    async mounted() {
      const { data } = await http.get('/leasePrjProjectProduct/get')
      this.option.push(
        ...data.data.list.map((item) => {
          return {
            value: item.code,
            label: this.title,
            tip: `${item.code}  -  ${item.areaType}  -  ${item.area}`
          }
        })
      )
    }
  },
  {
    formType: 'slot',
    name: 'stageId',
    title: '项目阶段',
    value: 'null',
    option: [{ label: '项目阶段', tip: "项目阶段", value: 'null' }],
    async mounted() {
      const { data } = await http.get('/order-state/stage')
      this.option.push(
        ...data.data.map((item) => {
          return {
            value: item.stageId,
            label: this.title,
            tip: item.stageName
          }
        })
      )
    }
  }
]
