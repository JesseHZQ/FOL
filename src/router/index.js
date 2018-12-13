import Vue from 'vue'
import Router from 'vue-router'
import Input from '@/components/Input'
import Output from '@/components/Output'
import OutputByProject from '@/components/OutputByProject'
import OutputByBU from '@/components/OutputByBU'
import OutputBySite from '@/components/OutputBySite'

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
      redirect: 'Output/Project',
      component: Output,
      children: [
        {
          path: 'Project',
          component: OutputByProject
        },
        {
          path: 'BU',
          component: OutputByBU
        },
        {
          path: 'Site',
          component: OutputBySite
        },
      ]
    }
  ]
})
