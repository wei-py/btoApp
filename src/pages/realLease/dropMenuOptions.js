export default [
  {
    formType: 'slot',
    name: 'companyId',
    title: '所属组织',
    activeColor: '#ffab30',
    value: '',
    activeindex: 0,
    child: [],
    async mounted() {
      this.activeIndex = computedAsync(() => this.child.findIndex((item) => item.value == this.value))
      const { data } = await http.get('/company/infos')
      this.child = data.data.records.map((item) => {
        return {
          value: item.companyId,
          label: item.name
        }
      })
      this.child.unshift({ value: '', label: '全部' })
    }
  },
  {
    formType: 'slot',
    name: 'prjCompanyId',
    title: '项目公司',
    activeColor: '#ffab30',
    activeindex: 0,
    value: '',
    child: [],
    async mounted() {
      this.activeIndex = computedAsync(() => this.child.findIndex((item) => item.value == this.value))
      const { data } = await http.get('/leaseLessor/get')
      this.child = data.data.list.map((item) => {
        return {
          value: item.code,
          label: item.companyName
        }
      })
      this.child.unshift({ value: '', label: '全部' })
    }
  },
  {
    formType: 'slot',
    name: 'leaseProductCode',
    title: '产品地区',
    activeindex: 0,
    value: '',
    activeColor: '#ffab30',
    child: [],
    async mounted() {
      this.activeIndex = computedAsync(() => this.child.findIndex((item) => item.value == this.value))
      const { data } = await http.get('/leasePrjProjectProduct/get')
      this.child = data.data.list.map((item) => {
        return {
          value: item.code,
          label: `${item.code}  -  ${item.areaType}  -  ${item.area}`
        }
      })
      this.child.unshift({ value: '', label: '全部' })
    }
  },
  {
    formType: 'slot',
    name: 'stageId',
    title: '项目阶段',
    activeindex: 0,
    activeColor: '#ffab30',
    value: '',
    child: [],
    async mounted() {
      this.activeIndex = computedAsync(() => this.child.findIndex((item) => item.value == this.value))
      const { data } = await http.get('/order-state/stage')
      this.child = data.data.map((item) => {
        return {
          value: item.stageId,
          label: item.stageName
        }
      })
      this.child.unshift({ value: '', label: '全部' })
    }
  }
]
