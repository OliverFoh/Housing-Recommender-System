import data from './data'

// Page({
//     data: {
//         options1: data,
//         value1: [],
//     },
//     onOpen1() {
//         this.setData({ visible1: true })
//     },
//     onClose1() {
//         this.setData({ visible1: false })
//     },
//     onChange1(e) {
//         this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
//         console.log('onChange1', e.detail)
//     },
// //     onChange(e) {
// //       console.log('onChange', e.detail.value)
// //       this.setData({ value: e.detail.value })
// //   },
// //   afterChange(e) {
// //       console.log('afterChange', e.detail.value)
// //       this.setData({ value: e.detail.value })
// //   },
// })


Page({
    data: {
        location_options: data,
        location_value: [],

        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        displayValue1: '请选择',
        displayValue2: '请选择',
        displayValue3: '请选择',
        displayValue4: '请选择',
        displayValue5: '请选择',
        price_options:['0-2000','2000-3000','3000-5000','5000-20000','不限'],
        rental_options: ['整租','合租','不限'],
        decorate_options:['精装修','简单装修','不限'],
        ori_options:['朝南','朝北','东南','西北','不限'],
        house_options:['普通住宅','别墅','公寓','不限'],
    },
    onOpen1() {
        this.setData({ visible1: true })
    },
    onClose1() {
        this.setData({ visible1: false })
    },
    onChange1(e) {
        this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
        console.log('onChange1', e.detail)
    },
    setValue(values, key) {
        this.setData({
            [`value${key}`]: values.value,
            [`displayValue${key}`]: values.label,
        })
    },
    onConfirm(e) {
        console.log(e)
        const { index } = e.currentTarget.dataset
        this.setValue(e.detail, index)
        console.log(`onConfirm${index}`, e.detail)
    },
    onValueChange(e) {
        console.log(e)
        const { index } = e.currentTarget.dataset
        console.log(`onValueChange${index}`, e.detail)
    },
    onVisibleChange(e) {
        this.setData({ visible: e.detail.visible })
    },
    onClick() {
        this.setData({ visible: true })
    },
})
