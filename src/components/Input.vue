<template>
  <div>
    <div>
      <Menu @on-select="selectMenu" :active-name="activeName" theme="dark" :style="{ minHeight: menuHeight + 'px'}"
        width="180px">
        <MenuItem v-for="(item, index) in tool.inputMenu" :key="index" :name="item.item">{{ item.item }}</MenuItem>
      </Menu>
    </div>
    <div style="position: absolute; top: 90px; left: 179px; right: 0;" class="clearfix">
      <span v-show="secondSelected == '6.0 Total MOH($)' || secondSelected == '6.1 IDL(%&#)'" style="float: left; height: 30px; line-height: 30px; margin-left: 10px;">Cost Center:</span>
      <Select v-show="secondSelected == '6.0 Total MOH($)' || secondSelected == '6.1 IDL(%&#)'" v-model="costCenter" style="width:80px; margin-left: 10px; float: left;">
        <Option value="CC31">Facilities</Option>
        <Option value="CC33">Engineering</Option>
        <Option value="CC34">Quality</Option>
        <Option value="CC37">Security</Option>
        <Option value="CC42">Planning</Option>
        <Option value="CC43">Procurement</Option>
        <Option value="CC47">Logistics</Option>
        <Option value="CC50">Operations Management</Option>
        <Option value="CC52">Program Management</Option>
        <Option value="CC53">Information Systems/Technology</Option>
      </Select>
      <span v-show="secondSelected == '7.0 Total SG&A($)'" style="float: left; height: 30px; line-height: 30px; margin-left: 10px;">Cost Center:</span>
      <Select v-show="secondSelected == '7.0 Total SG&A($)'" v-model="costCenter" style="width:80px; margin-left: 10px; float: left;">
        <Option value="CCSM">Business Development</Option>
        <Option value="CC61">Finance</Option>
        <Option value="CC62">HR</Option>
        <Option value="CC63">IT ShareService</Option>
      </Select>
      <span v-show="secondSelected == '7.1 G.A.(%)' || secondSelected == '7.2 S.M.(%)'" style="float: left; height: 30px; line-height: 30px; margin-left: 10px;">Cost Center:</span>
      <Select v-show="secondSelected == '7.1 G.A.(%)' || secondSelected == '7.2 S.M.(%)'" v-model="costCenter" style="width:80px; margin-left: 10px; float: left;">
        <Option value="4606">IDL</Option>
        <Option value="4607">Depn&Amor.</Option>
        <Option value="4608">F.U.C.</Option>
        <Option value="4610">MOH Other</Option>
        <Option value="4611">Other Equip.</Option>
        <Option value="4612">Electricity</Option>
      </Select>
      <span style="float: left; height: 30px; line-height: 30px; margin-left: 10px;">File Type:</span>
      <Select v-model="fileType" style="width:80px; margin: 0 10px; float: left;">
        <Option value="1">Forecast</Option>
        <Option value="2">Percent</Option>
        <Option value="3">Amount</Option>
      </Select>
      <Upload
        style="margin-left: 10px;"
        :before-upload="beforeUpload"
        action="666">
        <Button icon="ios-cloud-upload-outline">Upload File</Button>
      </Upload>
      
      <div style="position: absolute; left: 40%; top: 0; z-index: 99;">
        <ButtonGroup shape="circle">
          <Button @click="changeDataType('forecast')" :type="currentPage == 'forecast' ? 'primary' : 'default'" :disabled="forecastData.length == 0">Forecast</Button>
          <Button @click="changeDataType('percent')" :type="currentPage == 'percent' ? 'primary' : 'default'" :disabled="percentData.length == 0">Percent</Button>
          <Button @click="changeDataType('amount')" :type="currentPage == 'amount' ? 'primary' : 'default'" :disabled="amountData.length == 0">Amount</Button>
        </ButtonGroup>
        <Button style="margin-left: 20px;" icon="ios-calculator" type="success" @click="calculateData">Calculate</Button>
      </div>
      <!-- tab栏 -->
      <Tabs type="card" @on-click="changeType" :value="secondSelected">
        <TabPane v-for="(item, index) in secondList" :key="index" :name="item" :label="item"></TabPane>
      </Tabs>
      <Table ref="table" class="picktab" border size="small" :height="tableHeight" :width="tableWidth" :columns="activeColumn"
        :loading="table.loading" :data="table.data"></Table>
    </div>
    <div style="position: fixed; left: 180px; top: 30px; z-index: 1000;">
      <span style="color: #fff; font-size: 14px;">Version : </span>
      <DatePicker @on-change="versionChange" :value="version" size="small" type="month" placeholder="Select month" style="width: 120px"></DatePicker>
    </div>
    <Spin fix v-if="spinShow">
      <Icon type="ios-loading" size=32 class="demo-spin-icon-load"></Icon>
      <div><span style="font-size: 18px;">Calculating...</span></div>
    </Spin>
    <!-- 编辑发送通知Modal -->
    <Modal :title="formValidate['GLOutputCode'] + ' Edit window'" width="500" v-model="editShow" @on-ok="submit">
      <Form ref="formValidate" :rules="ruleValidate" :model="formValidate" :label-width="120">
        <FormItem label="GL Output Code:">
          <Input v-model="formValidate['GLOutputCode']" disabled style="width:100px" />
        </FormItem>
        <FormItem v-for="(item, index) in activeColumn.slice(9, 25)" :key="index" :label="item.title + ':'" :prop="'Period' + (index + 1)">
          <Input v-model="formValidate['Period' + (index + 1)]" number style="width:100px" />
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
        spinShow: false,
        version: '2018-12',
        costCenter: '', // 考虑到 6.0 & 7.0 加入这个字段
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
          GLOutputCode: ''
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
        fileType: null,
        currentPage: '',
        isHasForecast: true,
        isHasPercent: true,
        isHasAmount: true,
        forecastData: [],
        percentData: [],
        amountData: []
      }
    },

    computed: {
      activeColumn() {
        if (this.secondSelected == '6.0 Total MOH($)' || this.secondSelected == '7.0 Total SG&A($)') {
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
            title: 'PARENTH1',
            width: 120,
            // fixed: 'left',
            align: 'center',
            key: 'PARENTH1'
          },
          {
            title: 'Upload Code',
            width: 120,
            // fixed: 'left',
            align: 'center',
            key: 'UploadCode'
          },
          {
            title: 'BPC Output Code',
            width: 160,
            align: 'center',
            ellipsis: true,
            key: 'BPCOutputCode'
          }
        ]
        } else {
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
        }
        
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
            if (this.currentPage == 'percent') {
              return h('div', (params.row['Period1'] * 100).toFixed(2) + '%')
            }
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
              if (this.currentPage == 'percent') {
                return h('div', (params.row['Period' + (i + 2)] * 100).toFixed(2) + '%')
              }
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
                    this.$http.get(config.baseUrl + `FOL_Input/getItemById?id=${this.editId}&type=${this.currentPage}&menuType=${this.secondSelected}`).then(res => {
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
          if (num.toString().indexOf('%') > -1) {
            return num
          }
          return num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
              return $1 + ",";
            });
          });
        }

        return result
      }
    },

    watch: {
      costCenter(newVal, oldVal) {
        if (newVal) {
          this.getTypedList()
        }
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
      getTypedList(isCalculate) {
        this.table.loading = true
        this.currentPage = ''
        var str = this.secondSelected.replace('&', '%26').replace('#', '%23')
        console.log(str)
        this.$http.get(config.baseUrl + 'FOL_Input/getTypedList?version=' + this.version + '&type=' + str + '&cc=' + this.costCenter).then(res => {
          this.forecastData = res.body.DataForecast
          this.percentData = res.body.DataPercent
          this.amountData = res.body.DataAmount
          if (this.amountData.length > 0) {
            this.currentPage = 'amount'
          }
          if (this.percentData.length > 0) {
            this.currentPage = 'percent'
          }
          if (this.forecastData.length > 0) {
            this.currentPage = 'forecast'
          }
          this.table.data = this[this.currentPage + 'Data']
          this.table.loading = false
        })
      },

      calculateData() {
        this.spinShow = true;
        var str = this.secondSelected.replace('&', '%26').replace('#', '%23')
        this.$http.get(config.baseUrl + `FOL_Input/calculateByType?type=${str}&version=${this.version}&cc=${this.costCenter}`).then(res => {
          this.spinShow = false;
          if (res.body.Code == '200') {
            this.$Message.success(res.body.Message);
            this.getTypedList()
          } else {
            this.$Message.success(res.body.Message);
          }
        })
      },

      submit() {
        this.formValidate.DataType = this.currentPage
        this.formValidate.MenuType = this.secondSelected  // 添加 6.0 & 7.0 的标识
        this.$http.post(config.baseUrl + 'FOL_Input/updateItemById', this.formValidate).then(res => {
          if (res.body.Code == 200) {
            this.$Message.success(res.body.Message);
            this.calculateData()
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
        if (this.secondSelected.indexOf('7.1') > -1 || this.secondSelected.indexOf('7.2') > -1) {
          this.costCenter = '4606'
        } else if (this.secondSelected.indexOf('7.0') > -1) {
          this.costCenter = 'CCSM'
        } else {
          this.costCenter = 'CC31'
        }
        this.getTypedList()
      },

      selectMenu(name) {
        this.activeName = name;
        if (this.activeName.indexOf('7.0') > -1) {
          this.costCenter = 'CCSM'
        } else {
          this.costCenter = 'CC31'
        }
        this.secondList = this.tool.inputMenu.find(i => i.item == name).subItem
        this.secondSelected = this.secondList[0]
        this.getTypedList()
      },

      beforeUpload(file) {
        if (!this.fileType) {
          return this.$Message.error('请选择上传文件的类型！');
        }
        debugger
        let fd = new FormData();
        fd.append('file', file);
        fd.append('fileType', this.fileType);
        fd.append('type', this.secondSelected);
        fd.append('version', this.version);
        fd.append('cc', this.costCenter);
        this.$http.post(config.baseUrl + 'FOL_Input/uploadFile', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if (res.body.Code == 200) {
            this.getTypedList()
          } else {
            alert('Fail')
          }
        })
        return false;
      },

      changeDataType(type) {
        this.currentPage = type
        this.table.data = this[this.currentPage + 'Data']
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

  /deep/ .ivu-spin-fix {
    z-index: 999999;
  }

</style>
