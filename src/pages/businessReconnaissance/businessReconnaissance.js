const businessReconnaissanceForm = [
  {
    formType: 'slot',
    name: 'detailedAddressSlot',
    wdCell: true,
    required: true,
    value: '123',
    title: '经纬度',
    placeholder: '请启用手机定位权限，否则无法调用',
    ignoreParam: true,
    disabled: true,
    iconClick() {
      const _this = this
      uni.getLocation({
        type: 'gcj02',
        geocode: true,
        async success(res) {
          const address = res.address
          // 地理位置
          util._.name('latLngAddress').value =
            `${address.province}${address.city}${address.district}${address.street}${address.streetNum}`
          // 经度
          util._.name('longitude').value = res.longitude
          // 纬度
          util._.name('latitude').value = res.latitude
          _this.value = '已获取'
        },
        async fail(error) {
          console.log(error, 'error 选择地图失败')
        }
      })
    }
  },
  {
    formType: 'slot',
    name: 'latLngAddress',
    // required: true,
    value: '定位的地理位置(自动获取)',
    emptyValue: ''
  },
  {
    formType: 'slot',
    name: 'longitude',
    // required: true,
    value: '',
    emptyValue: ''
  },
  {
    formType: 'slot',
    name: 'latitude',
    // required: true,
    value: '',
    emptyValue: ''
  }
]

const panoramaForm = [
  {
    formType: 'slot', // 房屋外观照
    name: 'panoramaSlot',
    labelWidth: '0',
    required: false,
    ignoreParam: true,
    data: [
      {
        formType: 'img',
        title: '房屋外观全景水印相机定位(必填)',
        name: 'panorama',
        required: true,
        emptyValue: '',
        value: [],
        count: 1,
        emptyValue: ''
      }
    ]
  }
]

const innerStructureForm = [
  {
    formType: 'slot', //
    name: 'innerStructureSlot',
    ignoreParam: true,
    required: false,
    data: [
      {
        formType: 'img',
        title: '内部横梁立柱(必填)',
        name: 'innerStructure',
        required: true,
        value: [],
        count: 1,
        emptyValue: ''
      }
    ]
  }
]

const interneMilieuForm = [
  {
    formType: 'slot', //
    name: 'interneMilieuSlot',
    ignoreParam: true,
    required: false,
    data: [
      {
        formType: 'img',
        title: '生活生产环境(必填)',
        name: 'interneMilieu',
        value: [],
        required: true,
        count: 1,
        emptyValue: ''
      }
    ]
  }
]

const roofForm = [
  {
    formType: 'slot', // 身份证
    name: 'roofSlot',
    ignoreParam: true,
    required: false,
    data: [
      {
        formType: 'img',
        title: '站东南角往西北拍',
        name: 'roofSoutheast',
        value: [],
        count: 1,
        emptyValue: ''
      },
      {
        formType: 'img',
        title: '站北往正南拍',
        name: 'roofNorth',
        value: [],
        count: 1,
        emptyValue: ''
      },
      {
        formType: 'img',
        title: '站西南角往东北拍',
        name: 'roofSouthwest',
        value: [],
        count: 1,
        emptyValue: ''
      }
    ].map((item) => {
      return {
        ...item,
        required: true
      }
    })
  }
]

const roofWholeForm = [
  {
    formType: 'slot',
    name: 'roofWholeSlot',
    ignoreParam: true,
    required: false,
    data: [
      {
        formType: 'img',
        title: '风化和防水(必填)',
        name: 'roofWhole',
        required: true,
        value: [],
        count: 1
      }
    ]
  }
]

const dimensionalDrawingForm = [
  {
    formType: 'slot', // 楼板厚度照
    name: 'dimensionalDrawingSlot',
    ignoreParam: true,
    required: false,
    data: [
      {
        formType: 'img',
        title: '楼板厚度照',
        required: true,
        count: 999,
        emptyValue: '',
        name: 'floorThickness',
        value: []
      }
    ]
  }
]

const explorationTableForm = [
  {
    formType: 'slot',
    name: 'explorationTableSlot',
    ignoreParam: true,
    required: false,
    data: [
      {
        formType: 'img',
        title: '勘察表正面',
        name: 'front',
        required: true,
        value: [],
        count: 1,
        emptyValue: ''
      },
      {
        formType: 'img',
        title: '屋面尺寸图',
        name: 'back',
        required: true,
        value: [],
        count: 1,
        emptyValue: ''
      }
    ]
  }
]

const otherImagesForm = [
  {
    formType: 'slot',
    name: 'otherImagesSlot',
    ignoreParam: true,
    data: [
      {
        formType: 'img',
        title: '其他踏勘影像件',
        name: 'imageAddr',
        count: 999,
        value: []
      }
    ]
  }
]

export {
  businessReconnaissanceForm,
  panoramaForm,
  innerStructureForm,
  interneMilieuForm,
  roofForm,
  roofWholeForm,
  dimensionalDrawingForm,
  explorationTableForm,
  otherImagesForm
}
