<template>
  <div>
    <div style="position: fixed; left: 180px; top: 30px; z-index: 1000;">
      <span style="color: #fff; font-size: 14px;">Version : </span>
      <DatePicker @on-change="versionChange" :value="version" size="small" type="month" placeholder="Select month"
        style="width: 120px"></DatePicker>
    </div>
    <div>
      <span style="float: left; height: 24px; line-height: 24px; margin-left: 10px;">Project : </span>
      <Select v-model="project" size="small" style="width:120px; margin: 0 10px 10px;">
        <Option v-for="item in projectList" :value="item.OutputCode" :key="item.ID">{{ item.OutputCode }}</Option>
      </Select>
      <Table ref="table" class="picktab" border size="small" :height="tableHeight" :width="tableWidth" :columns="table.column"
        :loading="table.loading" :data="table.data"></Table>
    </div>
  </div>
</template>

<script>
  import {
    config
  } from '../config/app.js'
  export default {
    data() {
      return {
        version: '2018-11',
        projectList: [],
        project: 'TDN',
        tableHeight: 0,
        tableWidth: 0,
        table: {
          loading: false,
          column: [{
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
          }],
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
      this.getDataByProject()
    },

    watch: {
      project(o, n) {
        this.getDataByProject()
      }
    },

    methods: {
      versionChange(date) {
        this.version = date
        // this.getTypedList()
      },

      getDataByProject() {
        this.table.loading = true
        this.$http.get(config.baseUrl + `FOL_Output/getOutputData?version=${this.version}&project=${this.project}`).then(res => {
          var acdata = JSON.parse(res.body.Actual[0].Value)
          var formulas = res.body.OutputModules
          var cfdata = res.body.CurrentForcast
          var pfdata = JSON.parse(res.body.PriorForcast[0].Value)
          var acarr = acdata[0].Details
          var pfarr = pfdata[0].Details

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

          pfarr.forEach((i, e) => {
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
          })

          acdata.forEach((i, index) => {
            var temp = pfdata.find(e => e.BPCCode == i.BPCCode)
            i.Details = [...i.Details, ...temp.Details]
            // TODO: 计算currentForcast
            var formulasItem = formulas[index]
            if (formulasItem) {
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
                  i.Details.push({
                    month: 'Period' + count,
                    isHasPercent: isHasPercent,
                    money: eval(eval('`' + st + '`'))
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

          function get_thousand_num(num) {
            return num.toString().replace(/\d+/, function (n) { // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
                return $1 + ",";
              });
            });
          }
        })
      },

      getProjectList() {
        this.$http.get(config.baseUrl + 'FOL_Output/getProjectList').then(res => {
          this.projectList = res.body.Data
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
