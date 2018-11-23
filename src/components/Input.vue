<template>
  <div>
    <div>
      <Menu @on-select="selectMenu" :active-name="activeName" theme="dark" :style="{ minHeight: menuHeight + 'px'}"
        width="180px">
        <MenuItem v-for="(item, index) in tool.inputMenu" :key="index" :name="item.item">{{ item.item }}</MenuItem>
      </Menu>
    </div>
    <div style="position: absolute; top: 90px; left: 179px; right: 0;" class="clearfix">
      <!-- tab栏 -->
      <Tabs type="card" @on-click="changeType" :value="secondSelected">
        <TabPane v-for="(item, index) in secondList" :key="index" :name="item" :label="item"></TabPane>
      </Tabs>
      <Table ref="table" class="picktab" border size="small" :height="tableHeight" :width="tableWidth" :columns="activeColumn"
        :loading="table.loading" :data="table.data"></Table>
    </div>
    <div style="position: fixed; left: 180px; top: 25px; z-index: 1000;">
      <span style="color: #fff; font-size: 14px;">Version : </span>
      <DatePicker @on-change="versionChange" :value="version" type="month" placeholder="Select month" style="width: 200px"></DatePicker>
    </div>
    <!-- 编辑发送通知Modal -->
    <Modal :title="formValidate['GLOutputCode'] + ' Edit window'" width="500" v-model="editShow" @on-ok="submit">
      <Form ref="formValidate" :rules="ruleValidate" :model="formValidate" :label-width="120">
        <FormItem label="GL Output Code:">
          <Input v-model="formValidate['GLOutputCode']" disabled style="width:100px" />
        </FormItem>
        <FormItem v-for="i in 16" :key="i" :label="'Period' + i + ':'" :prop="'Period' + i">
          <Input v-model="formValidate['Period' + i]" number style="width:100px" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {
    config
  } from '../config/app.js'
  export default {
    data() {
      return {
        version: '2018-07',
        tool: config,
        activeName: config.inputMenu[0].item,
        secondSelected: config.inputMenu[0].subItem[0],
        secondList: config.inputMenu[0].subItem,
        menuHeight: 0,
        tableHeight: 0,
        tableWidth: 0,
        table: {
          data: [],
          loading: false
        },
        editShow: false,
        editId: null,
        value: '123',
        formValidate: {
          period1: 123
        }, // 表单对象
        ruleValidate: { // 表单验证对象
          Period1: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period2: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period3: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period4: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period5: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period6: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period7: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period8: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period9: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period10: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period11: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period12: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period13: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period14: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period15: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
          Period16: [{
            required: true,
            type: 'number',
            message: 'The value must be a number',
            trigger: 'change'
          }],
        },
      }
    },

    computed: {
      activeColumn() {
        var result = [
          {
            title: 'GL BPC Code',
            width: 100,
            // fixed: 'left',
            align: 'center',
            key: 'GLBPCCode'
          },
          {
            title: 'GL BPC Desc',
            width: 140,
            // fixed: 'left',
            align: 'center',
            ellipsis: true,
            key: 'GLBPCDescription'
          },
          {
            title: 'GL Output Code',
            width: 120,
            fixed: 'left',
            align: 'center',
            key: 'GLOutputCode'
          },
          {
            title: 'Customer BPC Code',
            width: 160,
            align: 'center',
            ellipsis: true,
            key: 'CustomerBPCCode'
          },
          {
            title: 'DIM1',
            width: 60,
            align: 'center',
            key: 'DIM1'
          },
          {
            title: 'Order',
            width: 60,
            align: 'center',
            key: 'Order'
          },
          {
            title: 'Customer Output Code',
            width: 160,
            align: 'center',
            key: 'CustomerOutputCode'
          },
          {
            title: 'BU',
            width: 60,
            align: 'center',
            key: 'BU'
          },
          {
            title: 'Segment',
            width: 60,
            align: 'center',
            key: 'Segment'
          },
        ]
        var month = {
          1: 'Jan',
          2: 'Feb',
          3: 'Mar',
          4: 'Apr',
          5: 'May',
          6: 'Jun',
          7: 'Jul',
          8: 'Aug',
          9: 'Sep',
          10: 'Oct',
          11: 'Nov',
          12: 'Dec',
        }

        var arr = this.version.split('-')
        var y = parseInt(arr[0])
        var m = parseInt(arr[1])

        // result.push(month[m] + '-' + y)

        m = (m - 1) == 0 ? 12 : (m - 1)
        y = m == 12 ? (y - 1) : y

        result.push({
          title: month[m] + '-' + y,
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', get_thousand_num(parseInt(params.row['Period1'])))
          }
        })

        for (let i = 0; i < 15; i++) {
          m = (m + 1) == 13 ? 1 : (m + 1)
          y = m == 1 ? (y + 1) : y
          result.push({
            title: month[m] + '-' + y,
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', get_thousand_num(parseInt(params.row['Period' + (i + 2)])))
            }
          })
        }

        result.push({
          title: 'Action',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editId = params.row.ID
                    this.$http.get(config.baseUrl + 'FOL_Input/getItemById?id=' + this.editId).then(res => {
                      this.formValidate = res.body.Data[0]
                      this.editShow = true
                    })
                  }
                }
              }, 'EDIT')
            ])
          }
        })

        function get_thousand_num(num) {
          return num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
              return $1 + ",";
            });
          });
        }

        return result
      }
    },

    created() {
      this.getTypedList()
    },

    mounted() {
      this.menuHeight = window.innerHeight - 80;
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 110
      this.tableWidth = window.innerWidth - this.$refs.table.$el.offsetLeft - 180
    },

    methods: {
      getTypedList() {
        this.table.loading = true
        this.$http.get(config.baseUrl + 'FOL_Input/getTypedList?version=' + this.version + '&type=' + this.secondSelected)
          .then(res => {
            this.table.data = res.body.Data
            this.table.loading = false
          })
      },

      submit() {
        this.$http.post(config.baseUrl + 'FOL_Input/updateItemById', this.formValidate).then(res => {
          if (res.body.Code == 200) {
            this.$Message.success(res.body.Message);
            this.getTypedList();
          } else {
            this.$Message.error(res.body.Message);
          }
        })
      },

      versionChange(date) {
        this.version = date
        this.getTypedList()
      },

      changeType(name) {
        this.secondSelected = name;
        this.getTypedList()
      },

      selectMenu(name) {
        this.activeName = name;
        this.secondList = this.tool.inputMenu.find(i => i.item == name).subItem
        this.secondSelected = this.secondList[0]
        this.getTypedList()
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /deep/ .picktab .ivu-table-cell {
    padding: 3px 0;
  }

  /deep/ .picktab .ivu-table-small td {
    height: unset;
  }

  /deep/ .picktab .ivu-table {
    font-size: 12px;
  }

  /deep/ .picktab .ivu-table td,
  .ivu-table th {
    height: unset;
  }

  /deep/ .ivu-form-item-error-tip {
    top: 50%;
    transform: translateY(-50%);
    left: 110px;
  }

  /deep/ .ivu-form-item {
    margin-bottom: 5px;
  }

</style>
