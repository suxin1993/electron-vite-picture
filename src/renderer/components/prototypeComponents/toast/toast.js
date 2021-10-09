import Vue from 'vue'
import Toast from './toast.vue'
import store from "../../../store/index"

let ToastConstructor = Vue.extend(Toast) // 构造函数
let instance // 实例对象
let seed = 1 // 计数
const mapLevel =["info","warn","error"]
const createToast =(options)=>{
    let id = `toast_${seed++}`
  instance = new ToastConstructor({
    data: options
  })
  instance.id = id
  instance.vm = instance.$mount()
  instance.vm.speed=seed
  instance.vm.level=options.level
  instance.vm.$store =store
  
  instance.$watch('closed', newVal => {
      if(newVal) {
        instance.vm.visible=false
        instance.vm.destroyElement()
        deleate(options)
      }
   })
  return instance.vm
}

const deleate=(options)=>{
     myApp.commonStore.toastQueue.dequeue()
     const opts =  myApp.commonStore.toastQueue.front()
     if(opts){
          createToast(options = opts)
     }
}


const ToastDialog = (options = {},level) => {
  if (typeof options === 'string') {
    options = {
      msg: options
    }
  }
  myApp.commonStore.toastQueue.enqueue(options)
  if(myApp.commonStore.toastQueue.size()==1){
        const toast =createToast(options)
        return toast
  }
}



export default ToastDialog