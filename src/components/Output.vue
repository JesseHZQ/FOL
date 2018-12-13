<template>
  <div>
    <!-- <Menu theme="light" active-name="1-2" :style="{ minHeight: menuHeight + 'px'}" width="180px" :open-names="['1']">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper" />
          内容管理
        </template>
        <MenuItem name="1-1">文章管理</MenuItem>
        <MenuItem name="1-2">评论管理</MenuItem>
        <MenuItem name="1-3">举报管理</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-people" />
          用户管理
        </template>
        <MenuItem name="2-1">新增用户</MenuItem>
        <MenuItem name="2-2">活跃用户</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-stats" />
          统计分析
        </template>
        <MenuGroup title="使用">
          <MenuItem name="3-1">新增和启动</MenuItem>
          <MenuItem name="3-2">活跃分析</MenuItem>
          <MenuItem name="3-3">时段分析</MenuItem>
        </MenuGroup>
        <MenuGroup title="留存">
          <MenuItem name="3-4">用户留存</MenuItem>
          <MenuItem name="3-5">流失用户</MenuItem>
        </MenuGroup>
      </Submenu>
    </Menu>
    <Input placeholder="Enter something..." style="width: 300px" /> -->
    <div>
      <Menu @on-select="selectMenu" :active-name="activeName" theme="dark" :style="{ minHeight: menuHeight + 'px'}"
        width="180px">
        <MenuItem v-for="(item, index) in tool.outputMenu" :key="index" :name="item.item">{{ item.item }}</MenuItem>
      </Menu>
    </div>
    <div style="position: absolute; top: 90px; left: 180px; right: 0;" class="clearfix">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {
    config
  } from '../config/app.js'
  export default {
    name: 'Output',
    data() {
      return {
        menuHeight: 0,
        version: '2018-11',
        tool: config,
        activeName: config.outputMenu[0].item,
      }
    },
    
    mounted() {
      this.menuHeight = window.innerHeight - 80;
    },

    methods: {
      selectMenu(name) {
        this.activeName = name;
        this.$router.push(this.tool.outputMenu.find(i => i.item == name).url)
        // this.secondList = this.tool.inputMenu.find(i => i.item == name).subItem
        // this.secondSelected = this.secondList[0]
        // this.getTypedList()
      },
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
