import Vue from 'vue'
import Router from 'vue-router'
import Input from '@/components/Input'
import Output from '@/components/Output'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'Input'
    },
    {
      path: '/Input',
      name: 'Input',
      component: Input
    },
    {
      path: '/Output',
      name: 'Output',
      component: Output
    }
  ]
})
