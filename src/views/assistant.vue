<template>
  <div class="content-box">
    <div style="display: flex;align-items: center;justify-content: flex-end;margin-bottom: 25px;">
      <div class="card-name">爆闪灯：</div>
      <div class="switch-box">
        <el-button size="mini" type="primary" @click="openAlarm">开启</el-button>
        <el-button size="mini" type="danger" @click="closeAlarm">关闭</el-button>
      </div>
    </div>

    <div class="flex-box">
      <div class="top-box">
        <div class="title-box">
          <div class="title-name">温湿度监测</div>
          <div class="select-box">
            <el-select v-model="monitorValue" placeholder="请选择" @change="monitorChange">
              <el-option
                v-for="dict in dict.type.wms_area_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </div>
        </div>
        <div class="monitor-box">
          <div class="monitor-list">
            <div class="monitor-img"><img src="@/assets/images/temperature.png" alt=""></div>
            <div class="monitor-name">平均温度°C</div>
            <div class="monitor-num temperature-num">{{Number(monitorList.averageTemplature).toFixed(2)}}</div>
            <div class="monitor-change" v-if="monitorList.humidityRatio == 'NaN'">
              <span  v-if="monitorList.humidityFlag == 'up'">+</span>
              <span  v-if="monitorList.humidityFlag == 'down'">-</span>
              0%
            </div>
            <div class="monitor-change" v-else>
              <span  v-if="monitorList.humidityFlag == 'up'">+</span>
              <span  v-if="monitorList.humidityFlag == 'down'">-</span>
              {{Math.abs(monitorList.humidityRatio).toFixed(2)}}%
            </div>
          </div>
          <div class="monitor-list">
            <div class="monitor-img"><img src="@/assets/images/humidity.png" alt=""></div>
            <div class="monitor-name">平均湿度%rh</div>
            <div class="monitor-num humidity-num">{{Number(monitorList.averageHumidity).toFixed(2)}}</div>
            <div class="monitor-change" v-if="monitorList.temperatureRatio == 'NaN'">
              <span  v-if="monitorList.templatureFlag == 'up'">+</span>
              <span  v-if="monitorList.templatureFlag == 'down'">-</span>
              0%
            </div>
            <div class="monitor-change" v-else>
              <span  v-if="monitorList.templatureFlag == 'up'">+</span>
              <span  v-if="monitorList.templatureFlag == 'down'">-</span>
              {{Math.abs(monitorList.humidityRatio).toFixed(2)}}%
            </div>
          </div>
        </div>
      </div>
      <div class="top-box">
        <div class="title-box">
          <div class="title-name">碳排量监测</div>
          <div class="tab-box">
            <span v-for="item in carbonEmissionMonitorDayList"
                  :key="item.id"
                  :class="{tabActive:carbonEmissionMonitorIndex === item.id}"
                  @click="carbonEmissionMonitorTab(item.id)">{{item.title}}</span>
          </div>
        </div>
        <div id="echarts-bar"> </div>
      </div>
    </div>
    <div class="flex-box">
      <div class="center-box">
        <div class="title-box">
          <div class="title-name">温湿度与晾晒时长分析</div>
        </div>
        <div id="analysis-echarts"></div>
        <div class="analysis-box">
          <div class="analysis-text">最佳晾晒<br/>环境预测</div>
          <div class="analysis-temperature">
            <div class="analysis-img"><img src="@/assets/images/temperature.png" alt=""></div>
            <div class="analysis-info">
              <div class="analysis-name">最佳晾晒温度</div>
              <div class="analysis-num">{{ templatureMin}}°C</div>
            </div>
          </div>
          <div class="analysis-humidity">
            <div class="analysis-img"><img src="@/assets/images/humidity.png" alt=""></div>
            <div class="analysis-info">
              <div class="analysis-name">最佳晾晒湿度</div>
              <div class="analysis-num">{{ humidityArrMin }}%rh</div>
            </div>
          </div>
          <div class="analysis-time">
            <div class="analysis-img"><img src="@/assets/images/time_icon.png" alt=""></div>
            <div class="analysis-info">
              <div class="analysis-name">最佳晾晒时长</div>
              <div class="analysis-num">{{timeMin}}h</div>
            </div>
          </div>
        </div>
      </div>
      <div class="center-box">
        <div class="title-box">
          <div class="center-title">
            <div class="title-name">能耗与碳排放量分析</div>
            <div class="select-box">
              <el-select v-model="centerValue" placeholder="请选择" @change="carbonEmissionsChange">
                <el-option
                  v-for="dict in dict.type.wms_area_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
          </div>
          <div class="tab-box">
            <span v-for="item in carbonEmissionsDayList"
                  :key="item.id"
                  :class="{tabActive:currentIndex === item.id}"
                  @click="setTabIndex(item.id)">{{item.title}}</span>
          </div>
        </div>
        <div id="energy-echarts"></div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="title-box">
        <div class="title-name">设备列表</div>
        <div class="select-box">
          <el-select v-model="deviceValue" placeholder="请选择" @change="deviceChange">
            <el-option
              v-for="dict in dict.type.wms_area_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          stripe
          :header-cell-style="{
           background:'#e7ecf3',color:'#666'}"
          style="width: 100%">
          <el-table-column
            prop="deviceName"
            label="设备名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <div
                :class="scope.row.enableStatus === '0' ? 'normal' : 'fault'"
                disable-transitions>
                <span v-if="scope.row.enableStatus =='0'">正常</span>
                <span v-if="scope.row.enableStatus =='1'||scope.row.enableStatus ==null">故障</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="deviceType"
            label="设备类型"
            align="center">
            <template slot-scope="scope">
             <span>{{scope.row.deviceType == 4? "烟雾检测传感器": scope.row.deviceType == 3? "温湿度传感器": scope.row.deviceType == 5? "照明传感器":"新风"}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="templature"
            label="温度（%rh）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="humidity"
            label="湿度（°C）"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl';
import {monitoringList,carbonEmissionMonitorList, dryingTime, deviceList, carbonEmissionsList} from "../api/assiatant/assistant";
import {openAlarmLight,closeAlarmLight} from '../api/wcs/alarmLight'
export default {
  dicts: ['wms_area_type', 'device_type'],
  data() {
    return {
      carbonEmissionsDayList: [
        // { id: 1, title: '本日'},
        { id: 2, title: '近七天'},
        { id: 3, title: '本月'}
      ],
      currentIndex:2,
      carbonEmissionMonitorDayList: [
        // { id: 1, title: '本日'},
        { id: 2, title: '近七天'},
        { id: 3, title: '本月'}
      ],
      carbonEmissionMonitorIndex:2,
      monitorOptions: [{
        value: '0',
        label: '理货区'
      }, {
        value: '1',
        label: '存储区'
      }, {
        value: '2',
        label: '晾晒区'
      }],
      monitorValue: '',
      monitorList:{ },
      //饼图数据+颜色
      optionData:[
        // {
        //   name: '理货区',
        //   value: 7.42,
        //   itemStyle: {
        //     color: 'rgba(38, 203, 184,1)'
        //   }
        // },
        // {
        //   name: '存储区',
        //   value: 6.60,
        //   itemStyle: {
        //     color: 'rgba(64, 158, 255,1)'
        //   }
        // },
        // {
        //   name: '晾晒区',
        //   value: 1.02,
        //   itemStyle: {
        //     color: 'rgba(64, 158, 255,1)'
        //   }
        // }
      ],
      // centerOptions:[{
      //   value: '1',
      //   label: '理货区'
      // }, {
      //   value: '2',
      //   label: '存储区'
      // }, {
      //   value: '3',
      //   label: '晾晒区'
      // }],
      centerValue: '',
      // deviceOptions:[{
      //   value: '0',
      //   label: '理货区'
      // }, {
      //   value: '1',
      //   label: '存储区'
      // }, {
      //   value: '2',
      //   label: '晾晒区'
      // }],
      deviceValue: '',
      tableData: [],
      collectTime:[],
      humidity:[],
      templature:[],
      yTime:'',
      templatureMin:'',
      humidityArrMin:'',
      timeMin:'',
      carbonEmissionsTime:'',
      energyNum:[],
      carbonEmissionsNum:[],
    };
  },
  mounted() {
    this.analysisBox()
    this.deviceListTable()
    this.monitoring()
    this.carbonEmissionsApi()
    this.carbonEmissionMonitorApi()
  },
  methods: {
    openAlarm(){
      openAlarmLight().then(res => {
        this.$modal.msgSuccess("开启成功");
      })
    },
    closeAlarm(){
      closeAlarmLight().then(res => {
        this.$modal.msgSuccess("关闭成功");
      })
    },
    // 碳排量监测
    carbonEmissionMonitorApi(){
      carbonEmissionMonitorList(this.carbonEmissionMonitorIndex).then(res => {
        this.optionData = []
        res.data.forEach(item => {
          if(item.deviceArea === "存储区"){
            let optionData ={
              name: item.deviceArea,
              value: JSON.parse(Number(item.num).toFixed(2)),
              itemStyle: {
                color: 'rgba(38, 203, 184,1)'
              }
            }
            this.optionData.push(optionData)
          }else if(item.deviceArea === "晾晒区") {
            let optionData = {
              name: item.deviceArea,
              value: JSON.parse(Number(item.num).toFixed(2)),
              itemStyle: {
                color: 'rgba(64, 158, 255,1)'
              }
            }
            this.optionData.push(optionData)
          }else if(item.deviceArea === "理货区") {
            let optionData = {
              name: item.deviceArea,
              value: JSON.parse(Number(item.num).toFixed(2)),
              itemStyle: {
                color: 'rgba(255, 205, 85,1)',
              }
            }
            this.optionData.push(optionData)
          }
        })
        this.draw3d()
      })
    },
    carbonEmissionMonitorTab(id){
      this.carbonEmissionMonitorIndex=id
      this.carbonEmissionMonitorApi()
    },
    draw3d() {
      //构建3d饼状图
      let myChart = echarts.init(document.getElementById('echarts-bar'));
      // 传入数据生成 option ; getPie3D(数据，透明的空心占比（调节中间空心范围的0就是普通饼1就很镂空）)
      this.option = this.getPie3D(this.optionData, 0.85);
      //将配置项设置进去
      myChart.setOption(this.option);
      //鼠标移动上去特效效果
      // this.bindListen(myChart);
    },
    //配置构建 pieData 饼图数据 internalDiameterRatio:透明的空心占比
    getPie3D(pieData, internalDiameterRatio) {
      let that = this;
      let series = [];
      let sumValue = 0;
      let startValue = 0;
      let endValue = 0;
      let legendData = [];
      let legendBfb = [];
      let k = 1 - internalDiameterRatio;
      pieData.sort((a, b) => {
        return (b.value - a.value);
      });
      // 为每一个饼图数据，生成一个 series-surface(参数曲面) 配置
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;
        let seriesItem = {
          //系统名称
          name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
          type: 'surface',
          //是否为参数曲面（是）
          parametric: true,
          //曲面图网格线（否）上面一根一根的
          wireframe: {
            show: false
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k: k
          },
          //设置饼图在容器中的位置(目前没发现啥用)
          //   center: ['50%', '100%']
        };

        //曲面的颜色、不透明度等样式。
        if (typeof pieData[i].itemStyle != 'undefined') {
          let itemStyle = {};
          typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
          typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
          seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
      }
      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      legendData = [];
      legendBfb = [];
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
          false, false, k, series[i].pieData.value);
        startValue = endValue;
        let bfb = that.fomatFloat(series[i].pieData.value / sumValue, 4);
        legendData.push({
          name: series[i].name,
          value: bfb
        });
        legendBfb.push({
          name: series[i].name,
          value: bfb
        });
      }
      //(第二个参数可以设置你这个环形的高低程度)
      let boxHeight = ''
      if(boxHeight == false){
        boxHeight = 10
      }else{
        boxHeight = this.getHeight3D(series, 13);//通过传参设定3d饼/环的高度
      }
      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      let option = {
        //图例组件
        legend: {
          data: legendData,
          //图例列表的布局朝向。
          orient: 'vertical',
          height: '80%',
          right: '10%',
          top: 'center',
          //图例文字每项之间的间隔
          itemGap: 15,
          textStyle: {
            color: '#8f8f8f',
            fontSize:14,
          },
          show: true,
          itemWidth: 14,
          itemHeight: 8,
          //格式化图例文本（我是数值什么显示什么）
          formatter: function (name) {
            var target;
            for (var i = 0, l =pieData.length; i < l; i++) {
              if (pieData[i].name == name) {
                target = pieData[i].value;
              }
            }
            return `${name}            ${target}吨`;
          }
          // 这个可以显示百分比那种（可以根据你想要的来配置）
          //   formatter: function(param) {
          //       let item = legendBfb.filter(item => item.name == param)[0];
          //       let bfs = that.fomatFloat(item.value * 100, 2) + "%";
          //       return `${item.name} :${bfs}`;
          //   }
        },
        //移动上去提示的文本内容(我没来得及改 你们可以根据需求改)
        tooltip: {
          formatter: params => {
            if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
              let bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) *
                100).toFixed(2);
              if(isNaN(bfb)){
                return `${params.seriesName}<br/>` +
                  `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                  `0`+`%`;
              }else{
                return `${params.seriesName}<br/>` +
                  `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                  `${bfb}`+`%`;
              }
            }
          }
        },
        //这个可以变形
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        //此处是修改样式的重点
        grid3D: {
          show: false,
          boxHeight: boxHeight, //圆环的高度
          //这是饼图的位置
          top: '-8%',
          left:'-15%',
          viewControl: { //3d效果可以放大、旋转等，请自己去查看官方配置
            alpha: 30, //角度(这个很重要 调节角度的)
            distance: 140,//调整视角到主体的距离，类似调整zoom(这是整体大小)
            rotateSensitivity: 0, //设置为0无法旋转
            zoomSensitivity: 0, //设置为0无法缩放
            panSensitivity: 0, //设置为0无法平移
            autoRotate: false //自动旋转
          }
        },
        series: series
      };
      return option;
    },
    //获取3d丙图的最高扇区的高度
    getHeight3D(series, height) {
      series.sort((a, b) => {
        return (b.pieData.value - a.pieData.value);
      })
      return height * 25 / series[0].pieData.value;
    },

    // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
      // 计算
      let midRatio = (startRatio + endRatio) / 2;
      let startRadian = startRatio * Math.PI * 2;
      let endRadian = endRatio * Math.PI * 2;
      let midRadian = midRatio * Math.PI * 2;
      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
      }
      // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
      k = typeof k !== 'undefined' ? k : 1 / 3;
      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
      let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      let hoverRate = isHovered ? 1.05 : 1;
      // 返回曲面参数方程
      return {
        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32
        },
        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20
        },
        x: function(u, v) {
          if (u < startRadian) {
            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        y: function(u, v) {
          if (u < startRadian) {
            return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
            return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        z: function(u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u) * h * .1;
          }
          return Math.sin(v) > 0 ? 1 * h * .1 : -1;
        }
      };
    },

    //这是一个自定义计算的方法
    fomatFloat(num, n) {
      var f = parseFloat(num);
      if (isNaN(f)) {
        return false;
      }
      f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
      var s = f.toString();
      var rs = s.indexOf('.');
      //判定如果是整数，增加小数点再补0
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + n) {
        s += '0';
      }
      return s;
    },
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    // bindListen(myChart) {
    //   let that = this;
    //   let selectedIndex = '';
    //   let hoveredIndex = '';
    //   // 监听点击事件，实现选中效果（单选）
    //   myChart.on('click', function(params) {
    //     // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
    //     let isSelected = !that.option.series[params.seriesIndex].pieStatus.selected;
    //     let isHovered = that.option.series[params.seriesIndex].pieStatus.hovered;
    //     let k = that.option.series[params.seriesIndex].pieStatus.k;
    //     let startRatio = that.option.series[params.seriesIndex].pieData.startRatio;
    //     let endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
    //     // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
    //     if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
    //       that.option.series[selectedIndex].parametricEquation = that.getParametricEquation(that.option.series[
    //         selectedIndex].pieData
    //         .startRatio, that.option.series[selectedIndex].pieData.endRatio, false, false, k, that.option.series[
    //         selectedIndex].pieData
    //         .value);
    //       that.option.series[selectedIndex].pieStatus.selected = false;
    //     }
    //     // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
    //     that.option.series[params.seriesIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
    //       isSelected,
    //       isHovered, k, that.option.series[params.seriesIndex].pieData.value);
    //     that.option.series[params.seriesIndex].pieStatus.selected = isSelected;
    //     // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
    //     isSelected ? selectedIndex = params.seriesIndex : null;
    //     // 使用更新后的 option，渲染图表
    //     myChart.setOption(that.option);
    //   });
    //   // 监听 mouseover，近似实现高亮（放大）效果
    //   myChart.on('mouseover', function(params) {
    //     // 准备重新渲染扇形所需的参数
    //     let isSelected;
    //     let isHovered;
    //     let startRatio;
    //     let endRatio;
    //     let k;
    //     // 如果触发 mouseover 的扇形当前已高亮，则不做操作
    //     if (hoveredIndex === params.seriesIndex) {
    //       return;
    //       // 否则进行高亮及必要的取消高亮操作
    //     } else {
    //       // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
    //       if (hoveredIndex !== '') {
    //         // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
    //         isSelected = that.option.series[hoveredIndex].pieStatus.selected;
    //         isHovered = false;
    //         startRatio = that.option.series[hoveredIndex].pieData.startRatio;
    //         endRatio = that.option.series[hoveredIndex].pieData.endRatio;
    //         k = that.option.series[hoveredIndex].pieStatus.k;
    //         // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
    //         that.option.series[hoveredIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
    //           isSelected,
    //           isHovered, k, that.option.series[hoveredIndex].pieData.value);
    //         that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
    //         // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
    //         hoveredIndex = '';
    //       }
    //       // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
    //       if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
    //         // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
    //         isSelected = that.option.series[params.seriesIndex].pieStatus.selected;
    //         isHovered = true;
    //         startRatio = that.option.series[params.seriesIndex].pieData.startRatio;
    //         endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
    //         k = that.option.series[params.seriesIndex].pieStatus.k;
    //         // 对当前点击的扇形，执行高亮操作（对 option 更新）
    //         that.option.series[params.seriesIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
    //           isSelected, isHovered, k, that.option.series[params.seriesIndex].pieData.value + 5);
    //         that.option.series[params.seriesIndex].pieStatus.hovered = isHovered;
    //         // 记录上次高亮的扇形对应的系列号 seriesIndex
    //         hoveredIndex = params.seriesIndex;
    //       }
    //       // 使用更新后的 option，渲染图表
    //       myChart.setOption(that.option);
    //     }
    //   });
    //   // 修正取消高亮失败的 bug
    //   myChart.on('globalout', function() {
    //     // 准备重新渲染扇形所需的参数
    //     let isSelected;
    //     let isHovered;
    //     let startRatio;
    //     let endRatio;
    //     let k;
    //     if (hoveredIndex !== '') {
    //       // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
    //       isSelected = that.option.series[hoveredIndex].pieStatus.selected;
    //       isHovered = false;
    //       k = that.option.series[hoveredIndex].pieStatus.k;
    //       startRatio = that.option.series[hoveredIndex].pieData.startRatio;
    //       endRatio = that.option.series[hoveredIndex].pieData.endRatio;
    //       // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
    //       that.option.series[hoveredIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
    //         isSelected,
    //         isHovered, k, that.option.series[hoveredIndex].pieData.value);
    //       that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
    //       // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
    //       hoveredIndex = '';
    //     }
    //     // 使用更新后的 option，渲染图表
    //     myChart.setOption(that.option);
    //   });
    // },

    //获取数组最小值下标
    getMinIndex(arr, arr1, arr2) {
      let min = arr[0];
      //声明变量 保存下标值
      let index = 0;
      for (let i = 0; i < arr.length; i++) {
        if (min >= arr[i] && Number(arr1[i]) > 0 && Number(arr2[i]) > 0) {
          min = arr[i];
          index = i;
        }
      }
      return index;
    },

    // 温湿度与晾晒时长分析
    analysisBox(){
      dryingTime().then(res => {
        if(res){
          this.collectTime = []
          this.humidity = []
          this.templature = []
          this.yTime = []
          res.data.list.forEach(item =>{
            this.collectTime.push(item.collectTime ? item.collectTime.substring(item.collectTime.indexOf('-') + 1) : '')
            this.humidity.push(Number(item.humidity).toFixed(2))
            this.templature.push(Number(item.templature).toFixed(2))
          })
          res.data.result.forEach(item =>{
            this.yTime.push(Number(item.hour))
          })

          let index = this.getMinIndex(this.yTime, this.humidity, this.templature)
          this.timeMin = this.yTime[index]
          this.templatureMin = this.templature[index]
          this.humidityArrMin = this.humidity[index]

          let analysisChart = echarts.init(document.getElementById('analysis-echarts'));
          let Xdata = this.collectTime;
          let data1 = this.humidity;
          let data2 = this.templature;
          let data3 = this.yTime;
          let option = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: '#f0f7ff',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle:{
                color:'#8f8f8f'
              },
              //  formatter: (params) => {
              //  console.log(params)
              //  }
            },
            legend: {
              show: true,
              itemGap: 15,
              textStyle: {
                color: '#8f8f8f',
                fontSize:14,
              },
              itemWidth: 14,
              itemHeight: 8,
              icon: 'squre'
            },
            grid: {
              left: '5%',
              right: '5%',
              top: '15%',
              bottom: '5%',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                data: Xdata,
                axisTick: {
                  show:false,
                  alignWithLabel: true,
                },
                axisLine: {
                  lineStyle: {
                    color: '#ddd',
                  },
                },
                axisLabel: {
                  //坐标轴刻度标签的相关设置。
                  textStyle: {
                    color: '#888',
                    fontStyle: 'normal',
                    fontSize: 14,
                  },
                },
              },
            ],
            yAxis: [
              {
                type: 'value',
                name: '%rh',
                nameTextStyle: {
                  color: '#409eff',
                  fontSize: 14,
                  padding: [0, 0, 0, -35]
                },
                position: 'left',
                offset: 30,
                min: 0,
                max: 100,
                splitNumber: 5,
                axisTick: {
                  show:false,
                  alignWithLabel: true,
                },
                axisLabel: {
                  //坐标轴刻度标签的相关设置。
                  textStyle: {
                    color: '#409eff',
                    fontSize: 14,
                  },
                },
                axisLine: {
                  lineStyle: {
                    color: '#ddd',
                  },
                },
                splitLine: {
                  show: false
                },
              },
              {
                type: 'value',
                name: '°C',
                nameTextStyle: {
                  color: '#26cbb8',
                  fontSize: 14,
                  padding: [0, 0, 0, -35]
                },
                position: 'left',
                offset: -5,
                min: 0,
                max: 40,
                interval: 8,
                splitNumber: 5,
                axisTick: {
                  show:false,
                  alignWithLabel: true,
                },
                axisLabel: {
                  textStyle: {
                    color: '#26cbb8',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 14,
                  },
                },
                axisLine: {
                  show: false
                },
                splitLine: {
                  show: false
                },
              },
              {
                name: 'h',
                // 单位 显示位置
                // nameLocation: 'start',
                nameTextStyle: {
                  color: '#888',
                  fontSize: 14,
                },
                type: 'value',
                min: 0,
                max: 60,
                interval: 12,
                splitNumber: 5,
                axisLabel: {
                  // formatter: '{value}%',
                  textStyle: {
                    color: '#888',
                    fontSize: 14,
                  },
                },
                axisLine: {
                  show:false
                },
                splitLine: {
                  show:false
                },
                axisTick: {
                  show:false,
                  alignWithLabel: true,
                },
              }
            ],
            series: [
              // 湿度
              {
                name: '湿度',
                type: 'pictorialBar',
                symbolSize: [22, 6],
                symbolOffset: [0, -4],
                symbolPosition: 'end',
                z: 12,
                label: {
                  show: false,
                },
                data: data1,
                color: '#8ec5ff',
                tooltip: {
                  show: false,
                },
              },
              {
                name: '湿度',
                type: 'pictorialBar',
                symbolSize: [22, 6],
                symbolOffset: [0, 5],
                z: 12,
                data: data1,
                color: '#409eff',
                tooltip: {
                  show: false,
                },
              },
              {
                type: 'bar',
                name: '湿度',
                itemStyle: {
                  normal: {
                    color: function (params) {

                      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: 'rgba(71,161,255,1)',
                        },
                        {
                          offset: 1,
                          color: 'rgba(59,199,255,.5)',
                        },
                      ]);
                    },
                    // opacity: 0.7,
                  },
                },
                barWidth: '22',
                data: data1,
              },
              {
                name: '温度',
                type: 'line',
                data: data2,
                yAxisIndex: 1,
                z: 99,
                symbol: 'none',
                color: '#26cbb8',
              },
              {
                name: '晾晒时间',
                type: 'line',
                data: data3,
                z: 99,
                symbol: 'none',
                color: '#ffcd55',
              },
            ],
          };
          analysisChart.setOption(option);
          window.addEventListener('resize', () => {
            // console.log('浏览器大小改变了')
            analysisChart.resize()
          })
        }
      })
    },

    // 能耗与碳排放量分析
    carbonEmissionsApi(){
      carbonEmissionsList(this.centerValue,this.currentIndex).then(res => {
        if(res) {
          this.carbonEmissionsTime = []
          this.energyNum = []
          this.carbonEmissionsNum = []
          res.data.forEach(item => {
            // this.carbonEmissionsTime.push(item.time ? item.time.substring(item.time.indexOf('-') + 1): '')
            this.carbonEmissionsTime.push(item.time)
            this.energyNum.push(Number(item.num).toFixed(2))
            this.carbonEmissionsNum.push(Number(item.num*0.75).toFixed(2))
          })
          this.energyBox(this.carbonEmissionsTime,this.energyNum,this.carbonEmissionsNum)
        }
      })
    },
    energyBox() {
      let energyChart = echarts.init(document.getElementById('energy-echarts'));
      let xData = this.carbonEmissionsTime
      let energyData = this.energyNum
      let eMaxNum = Math.max(...energyData) ? Math.max(...energyData) * Number(3) : 0
      let energyMaxNum = eMaxNum.toFixed()
      let carbonEmissionsData = this.carbonEmissionsNum
      let cMaxNum = Math.max(...carbonEmissionsData ) ? Math.max(...carbonEmissionsData ) * Number(2) : 0
      let carbonEmissionsMaxNum = cMaxNum.toFixed()
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          itemGap: 20,
          itemWidth: 14,
          itemHeight: 8,
          icon: 'rect',
          textStyle: {
            color: '#8f8f8f',
            fontSize: 14,
          },
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '8%',
          containLabel: true
        },
        dataZoom: [//滚动条
          {
            show: true,
            type: 'slider',
            realtime: true,
            startValue: 0,
            endValue: 3,
            xAxisIndex: [0],
            bottom: '5%',
            left: '50',
            height: 10,
            borderColor: 'rgba(0,0,0,0)',
            textStyle: {
              color: '#05D5FF',
            },
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: false,
            axisLine: {
              lineStyle: {
                color: '#dddddd'
              }
            },
            axisLabel: {
              // interval: 0,
              // rotate: 50, // 主要是这个 设置角度即可 - 90 ~ 90 旋转方向也不同
              formatter:function(value)  //X轴的内容
              {
                let ret = ""; //拼接加\n返回的类目项
                let max = 10;  //每行显示的文字字数
                let val = value.length;  //X轴内容的文字字数
                let rowN = Math.ceil(val / max);  //需要换的行数
                if(rowN > 1)  //判断 如果字数大于2就换行
                {
                  for(let i = 0; i<rowN;i++){
                    let temp = "";  //每次截取的字符串
                    let start = i * max;  //开始截取的位置
                    let end = start + max;  //结束截取的位置
                    temp = value.substring(start,end)+ "\n";
                    ret += temp;  //最终的字符串
                  }
                  return ret;
                }
                else {return value}
              },
              color: '#888',
              fontSize: 14
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: energyMaxNum,
            // interval: 2,
            name: '吨',
            nameTextStyle: {
              padding: [0, 0, 0, -35] // 上右下左与原位置距离
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(52,78,130,0.2)',
                width: 1,
                type: 'dashed'
              }
            }
          },
          {
            type: 'value',
            name: 'KW/h',
            nameTextStyle: {
              padding: [0, 0, 0, 35] // 上右下左与原位置距离
            },
            min: 0,
            max: carbonEmissionsMaxNum,
            // interval: 2,
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(52,78,130,0.2)',
                width: 1,
                type: 'dashed'
              }
            }
          },
        ],
        series: [
          {
            name: '能耗',
            type: 'line',
            // barWidth: 14,
            symbol: "none",
            smooth: true,
            data:  energyData,
            itemStyle: {
              barBorderRadius: [30, 30, 0, 0],
              color: '#409eff'
            }
          },
          {
            name: '碳排放量',
            type: 'line',
            // barWidth: 14,
            symbol: "none",
            smooth: true,
            yAxisIndex: 1,
            data: carbonEmissionsData,
            itemStyle: {
              barBorderRadius: [30, 30, 0, 0],
              color: '#26cbb8'
            },
          }
        ]
      }
      energyChart.setOption(option);
      setTimeout(function () {
        window.onresize = function () {
          energyChart.resize();
        }
      }, 200)
    },
    setTabIndex(id){
      this.currentIndex=id
      this.carbonEmissionsApi()
    },
    carbonEmissionsChange(){
      this.carbonEmissionsApi()
    },
    // 设备列表
    deviceListTable(){
      deviceList().then(res => {
        if(res){
          this.tableData = res.data;
        }
      })
    },
    // 设备列表下拉选择
    deviceChange(value){
      deviceList(value).then(res => {
        if(res){
          this.tableData = res.data;
        }
      })
    },
    // 温湿度监测
    monitoring(){
      monitoringList().then(res => {
        if(res){
          this.monitorList = res.data
        }
      })
    },
    monitorChange(value){
      monitoringList(value).then(res => {
        if(res){
          this.monitorList = res.data
        }
      })
    },
  }
};
</script>

<style scoped>
.content-box {
}
.flex-box{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.top-box{
  width: 49%;
  background: #fff;
  border-radius: 5px;
  min-height: 300px;
}
.title-box{
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.title-box .title-name{
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
.title-box .select-box{
  height: 24px;
  width: 100px;
}
::v-deep .title-box .select-box .el-input--medium .el-input__inner{
  height: 24px;
  line-height: 24px;
}
::v-deep .title-box .select-box .el-input--medium .el-input__icon{
  line-height: 24px;
}
.monitor-box{
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
}
.monitor-list{
  width: 49%;
  border-radius: 5px;
  background: #effaf9;
  text-align: center;
  padding: 20px;
}
.monitor-list .monitor-img{
  margin: 15px 0;
}
.monitor-list .monitor-name,
.monitor-list .monitor-change{
  color: #aaa;
  font-size: 16px;
}
.monitor-list .monitor-num{
  font-size: 30px;
  margin: 10px 0;
  font-weight: bold;
}
.temperature-num{
  color: #26cbb8;
}
.humidity-num{
  color: #409eff;
}
.tab-box{
  width: 178px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #dfe4ed;
  border-radius: 5px;
  background:#f5f7fa;
  display: flex;
  overflow: hidden;
}
.tab-box span{
  flex: 1 1 33.33%;
  text-align: center;
  font-size: 12px;
  color: #333;
  cursor: pointer;
}
.tab-box span.tab-active,
.tab-box span:hover{
  background: #3599ff;
  color: #fff;
}
.tab-box span.tabActive,
.tab-box span:hover{
  background: #3599ff;
  color: #fff;
}
#echarts-bar{
  width: 100%;
  height: 220px;
}
.center-box{
  width: 49%;
  background: #fff;
  border-radius: 5px;
  height: 400px;
}
#analysis-echarts{
  width: 100%;
  height: 230px;
}
.analysis-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 20px 0;
}
.analysis-text{
  font-size: 16px;
  color: #333;
  font-weight: bold;
  line-height: 25px;
}
.analysis-temperature,
.analysis-humidity,
.analysis-time{
  height: 65px;
  background: #effaf9;
  width: 26%;
  display: flex;
  align-items: center;
}
.analysis-temperature{
  border-left:3px solid #26cbb8;
}
.analysis-humidity{
  border-left:3px solid #409eff;
}
.analysis-time{
  border-left:3px solid #ffcd55;
}
.analysis-img{
  margin: 0 10px;
  width: 30px;
  height: 30px;
}
.analysis-img img{
  width: 100%;
  height: 100%;
  display: inline-block;
}

.analysis-info{

}
.analysis-info .analysis-name{
  font-size: 14px;
  color: #666;
  font-weight: bold;
}
.analysis-info .analysis-num{
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
}
.analysis-temperature .analysis-info .analysis-num{
  color: #26cbb8;
}
.analysis-humidity .analysis-info .analysis-num{
  color: #409eff;
}
.analysis-time .analysis-info .analysis-num{
  color: #ffcd55;
}
.center-title{
  display: flex;
}
.center-title .title-name{
  margin-right: 10px;
}
#energy-echarts{
  width: 100%;
  height: 320px;
}
.bottom-box{
  width: 100%;
  background: #fff;
  border-radius: 5px;
  min-height: 200px;
  padding: 1px 0 20px;
}
.table-box{
  margin: 0 20px;
}
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table td.el-table__cell{
  border-bottom: none;
}
::v-deep .el-table::before{
  height: 0;
}
::v-deep .el-table .el-table__header-wrapper th{
  font-size: 14px;
}
::v-deep .el-table{
  color: #000;
  font-weight: bold;
}
.normal,
.fault{
  width: 48px;
  height: 24px;
  border-radius: 12px;
  text-align: center;
  font-size: 12px;
  display: inline-block;
}
.normal{
  color: #26cbb8;
  border:1px solid rgb(153, 218, 211);
  background-color: rgb(239, 250, 249);
}

.fault{
  color: #ff5555;
  border:1px solid rgb(255, 187, 187);
  background-color: rgb(250, 239, 239);
  border-radius: 12px;
}

</style>
