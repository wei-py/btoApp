export default [
  {
    formType: 'input',
    name: 'username',
    value: '蔡徐坤',
    title: '姓名',
    realValue: '',
    customRef: 'cxk',

    mounted() {
      this.error = true
      // console.log(this.dom);
    }
  },
  {
    formType: 'select',
    name: 'sex',
    value: '女',
    title: '性别',
    customRef: 'cxk',
    columns: ['男', '女'],
    confirm() {
      util._.title('图片').value = 3333
    },
    mounted() {
      this.error = true
      // console.log(this.dom);
    }
  },
  {
    formType: 'slot',
    name: 'picture',
    value: 'value',
    wdCell: true,
    title: '图片'
  }
]
