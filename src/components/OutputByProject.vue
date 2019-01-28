<template>
  <div>
    <!-- 加载中 -->
    <Spin fix v-if="spinShow">
      <Icon type="logo-apple" size=32 class="demo-spin-icon-load"/>
      <!-- <Icon type="ios-loading" size=32 class="demo-spin-icon-load"></Icon> -->
      <div><span style="font-size: 18px;">Loading...</span></div>
    </Spin>
    <div style="position: fixed; left: 180px; top: 30px; z-index: 1000;">
      <span style="color: #fff; font-size: 14px;">Version : </span>
      <DatePicker @on-change="versionChange" :value="version" size="small" type="month" placeholder="Select month"
        style="width: 120px"></DatePicker>
    </div>
    <div class=" clearfix">
      <span style="float: left; height: 30px; line-height: 30px; margin-left: 10px;">Project : </span>
      <Select v-model="project" @on-change="projectChange" style="float: left; width: 120px; margin: 0 10px 10px;">
        <Option v-for="item in projectList" :value="item.OutputCode" :key="item.ID">{{ item.OutputCode }}</Option>
      </Select>
      <span style="float: left; height: 30px; line-height: 30px; margin-left: 10px;">File Type : </span>
      <Select v-model="fileType" style="float: left;width:120px; margin: 0 10px 10px;">
        <Option value="Actual" key="1">Actual</Option>
        <Option value="PriorFcst" key="2">PriorFcst</Option>
      </Select>
      <Upload
        style="float: left; margin-left: 10px;"
        :before-upload="beforeUpload"
        action="666">
        <Button icon="ios-cloud-upload-outline">Upload File</Button>
      </Upload>
      <Button style="float: left; margin-left: 10px;" :icon="hasActual ? 'md-checkmark' : 'md-close'">Actual</Button>
      <Button style="float: left; margin-left: 10px;" :icon="hasPriorFcst ? 'md-checkmark' : 'md-close'">PriorFcst</Button>
      <Button type="success" style="float: left; margin-left: 10px;" @click="calculate">Calculate</Button>
    </div>
    <Table ref="table" class="picktab" border size="small" highlight-row :height="tableHeight" :width="tableWidth" :columns="table.column"
         :data="table.data"></Table>
  </div>
</template>

<script>
  import {
    config
  } from '../config/app.js'
  export default {
    data() {
      return {
        version: '2018-12',
        fileType: '',
        spinShow: false,
        isTableShow: false,
        hasActual: false,
        hasPriorFcst: false,
        projectList: [],
        project: 'TDN',
        tableHeight: 0,
        tableWidth: 0,
        table: {
          loading: false,
          column: [
            // {
            //   title: 'BPCCode',
            //   width: 200,
            //   fixed: 'left',
            //   align: 'center',
            //   render: (h, params) => {
            //     if (params.row.BPCCode.indexOf('_') > -1) {
            //       return h('span', {
            //         style: {
            //           fontWeight: 700,
            //           color: '#f00'
            //         }
            //       }, params.row.BPCCode)
            //     }
            //     return h('span', params.row.BPCCode)
            //   }
            // },
            // {
            //   title: 'BPCDescription',
            //   width: 200,
            //   fixed: 'left',
            //   align: 'center',
            //   tooltip: true,
            //   key: 'BPCDescription'
            // }
          ],
          data: []
        }
      }
    },

    mounted() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 120
      this.tableWidth = window.innerWidth - this.$refs.table.$el.offsetLeft - 180
    },

    created() {
      this.getProjectList()
      this.checkDataUpload()
      // this.getResult()
      // this.getDataByProject()
    },

    methods: {
      versionChange(date) {
        this.version = date
        // this.getTypedList()
      },

      projectChange() {
        this.checkDataUpload()
        // this.getResult()
      },

      getResult() {
        this.$http.get(config.baseUrl + `FOL_Output/getResult?version=${this.version}&project=${this.project}`).then(res => {
          if (res.body.Data.length > 0) {
            this.table.column = JSON.parse(res.body.Data[0].Col)
            this.table.column.splice(0, 0)
            this.table.data = JSON.parse(res.body.Data[0].Value).slice(0, 10)
            this.table.data.splice(0, 0)
            this.isTableShow = true
          }
        })
      },

      calculate() {
        if (this.hasActual && this.hasPriorFcst) {
          this.getDataByProject()
        } else {
          this.$Message.error('数据不全！');
        }
      },

      checkDataUpload() {
        this.$http.get(config.baseUrl + `FOL_Output/getOutputData?version=${this.version}&project=${this.project}&fileType=${this.fileType}`).then(res => {
          this.hasActual = res.body.Actual.length > 0
          this.hasPriorFcst = res.body.PriorForcast.length > 0
        })
         
      },

      beforeUpload(file) {
        if (!this.fileType) {
          return this.$Message.error('请选择上传文件的类型！');
        }
        let fd = new FormData();
        fd.append('file', file);
        fd.append('project', this.project);
        fd.append('fileType', this.fileType);
        fd.append('version', this.version);
        this.$http.post(config.baseUrl + 'FOL_Output/uploadFile', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if (res.body.Code == 200) {
            this.checkDataUpload()
          } else {
            alert('Fail')
          }
        })
        return false;
      },

      getDataByProject() {
        this.table.data = []
        this.table.column = [{
          title: 'BPCCode',
          width: 200,
          fixed: 'left',
          align: 'center',
          render: (h, params) => {
            if (params.row.BPCCode.indexOf('_') > -1) {
              return h('span', {
                style: {
                  fontWeight: 700,
                  color: '#f00'
                }
              }, params.row.BPCCode)
            }
            return h('span', params.row.BPCCode)
          }
        },{
          title: 'BPCDescription',
          width: 200,
          fixed: 'left',
          align: 'center',
          tooltip: true,
          key: 'BPCDescription'
        }]
        this.table.loading = true
        this.spinShow = true
        this.$http.get(config.baseUrl + `FOL_Output/getOutputData?version=${this.version}&project=${this.project}&fileType=${this.fileType}`).then(res => {
          var acdata = JSON.parse(res.body.Actual[0].Value)
          var formulas = res.body.OutputModules
          var cfdata = res.body.CurrentForcast
          var pfdata = JSON.parse(res.body.PriorForcast[0].Value)
          var acarr = acdata[0].Details
          var pfarr = pfdata[0].Details

          // 添加actual的数据列
          acarr.forEach(i => {
            this.table.column.push({
              title: i.month,
              key: i.month,
              width: 130,
              align: 'center',
              renderHeader: (h, params) => {
                return h('div', [
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, i.month.split(',')[0]),
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, i.month.split(',')[1])
                ])
              }
            })
          })

          // 
          pfarr.forEach((i, e) => {
            this.table.column.push({
              title: i.month,  // cfarr['Period'+ (e + 1)]
              key: 'Period'+ (e + 1),
              width: 130,
              align: 'center',
              className: 'columnActual',
              renderHeader: (h, params) => {
                return h('div', [
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, i.month.split(',')[0]),
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, 'CurrentFcs')
                ])
              }
            })
            this.table.column.push({
              title: i.month,
              key: i.month,
              width: 130,
              align: 'center',
              className: 'columnPrio',
              renderHeader: (h, params) => {
                return h('div', [
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, i.month.split(',')[0]),
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, 'PrioFsc')
                ])
              }
            })
            this.table.column.push({
              title: i.month,
              key: i.month,
              width: 130,
              align: 'center',
              // className: 'columnPrio',
              renderHeader: (h, params) => {
                return h('div', [
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, i.month.split(',')[0]),
                  h('p', {
                    style: {
                      textAlign: 'center'
                    }
                  }, 'Variance')
                ])
              },
              render: (h, params) => {
                return h('div', get_thousand_num(+getNumber(params.row['Period'+ (e + 1)]) - +getNumber(params.row[i.month])))
              }
            })
          })

          acdata.forEach((i, index) => {
            var temp = pfdata.find(e => e.BPCCode == i.BPCCode)
            i.Details = [...i.Details, ...temp.Details]
            // TODO: 计算currentForcast
            var formulasItem = formulas[index]
            if (formulasItem) {
              i.BPCDescription = formulasItem.BPCDescription
              var isHasPercent = formulasItem.BPCDescription.indexOf('%') > -1
              if (formulasItem.ForecastDataSource) {
                var tempData = cfdata.find(i => i.Type.indexOf(formulasItem.ForecastDataSource) > -1)
                if (tempData) {
                  for (let count = 1; count < 19; count++) {
                    // i.Details['Period' + count] = tempData['Period' + count] == undefined ? 0 : tempData['Period' + count]
                    i.Details.push({
                      month: 'Period' + count,
                      isHasPercent: isHasPercent,
                      money: tempData['Period' + count] == undefined ? 0 : tempData['Period' + count]
                    })
                  }
                } else {
                  for (let count = 1; count < 19; count++) {
                    // i.Details['Period' + count] = tempData['Period' + count] == undefined ? 0 : tempData['Period' + count]
                    i.Details.push({
                      month: 'Period' + count,
                      isHasPercent: isHasPercent,
                      money: 0
                    })
                  }
                }
              }

              else if (formulasItem.Formulas) {
                // formulasItem.Formulas = formulasItem.Formulas.replace('+', ',+,').replace('-', ',-,').replace('*', ',*,').replace('/', ',/,')
                var tempArr = formulasItem.Formulas.split(',')
                var resultArr = []
                var st = ''
                tempArr.forEach((e, i) => {
                  if (i % 2 == 0) {
                    var tempData = cfdata.find(i => i.GLBPCCode.indexOf(e) > -1)
                    if (tempData) {
                      resultArr.push(tempData)
                    } else {
                      resultArr.push({
                        Period1: 0,
                        Period2: 0,
                        Period3: 0,
                        Period4: 0,
                        Period5: 0,
                        Period6: 0,
                        Period7: 0,
                        Period8: 0,
                        Period9: 0,
                        Period10: 0,
                        Period11: 0,
                        Period12: 0,
                        Period13: 0,
                        Period14: 0,
                        Period15: 0,
                        Period16: 0,
                        Period17: 0,
                        Period18: 0,
                      })
                    }
                    st = st + '${resultArr['+ i / 2 + ']["PeriodCount"]}'
                  } else {
                    st = st + e
                  }
                })
                for (var count = 1; count < 19; count++) {
                  var reg = new RegExp('Count' , 'g')
                  st = st.replace(reg, count)
                  console.log(eval('`' + st + '`'))
                  i.Details.push({
                    month: 'Period' + count,
                    isHasPercent: isHasPercent,
                    money: eval('`' + st + '`') == '0/0' ? 0 : eval(eval('`' + st + '`'))
                  })
                }
              }

              else {
                for (let count = 1; count < 19; count++) {
                  i.Details.push({
                    month: 'Period' + count,
                    isHasPercent: isHasPercent,
                    money: 0
                  })
                }
              }
            }
            
            i.Details.forEach(item => {
              if (!item.isHasPercent) {
                i[item.month] = get_thousand_num(item.money).toString().substr(0, get_thousand_num(item.money).indexOf('.') == -1 ? get_thousand_num(item.money).toString().length : get_thousand_num(item.money).indexOf('.'))
              } else {
                i[item.month] = (item.money * 100).toFixed(2) + '%'
              }
            })
          })

          this.table.data = acdata
          this.table.loading = false
          this.spinShow = false

          // debugger
          // this.$http.post(config.baseUrl + 'FOL_Output/saveOutputResult', {
          //   version: this.version,
          //   project: this.project,
          //   column: JSON.stringify(this.table.column),
          //   result: JSON.stringify(this.table.data)
          // }).then(res => {
          //   if (res.body.Code == 200) {
          //     this.$Message.error('计算成功！');
          //   }
          // })

          function get_thousand_num(num) {
            return num.toString().replace(/\d+/, function (n) { // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
                return $1 + ",";
              });
            });
          }

          function getNumber(num) {
            if (num) {
              num = num.replace(/,/g, '')
              return num.replace(/%/g, '')
            }
            return 0
          }
        })
      },

      getProjectList() {
        this.$http.get(config.baseUrl + 'FOL_Output/getProjectList').then(res => {
          this.projectList = res.body.Data.sort((a, b) => a.OutputCode - b.OutputCode)
        })
      }
    }
  }

</script>

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

  /deep/ .ivu-table .columnActual {
    background-color: #ddd;
  }

  /deep/ .ivu-table .columnPrio {
    background-color: #ccc;
  }

</style>
