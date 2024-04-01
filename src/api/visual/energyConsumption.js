import request from '@/utils/request'

// 温湿度监测
export function monitoringList(deviceArea) {
  return request({
    url: `/wcs/assistant/decision/temperatureHumidityMonitor`,
    method: 'get',
    params: {
      deviceArea
    }
  })
}

// 设备监控
export function deviceMonitorList() {
  return request({
    url: `/wcs/assistant/decision/deviceMonitor`,
    method: 'get',
  })
}

// 能耗分析
export function energyConsumptionAnalysis(dateType) {
  return request({
    url: `/basics/viewController/energyConsumptionAnalysis`,
    method: 'get',
    params: {
      dateType
    }
  })
}

// 用电情况
export function electricityConsumptionStatistics(dateType) {
  return request({
    url: `/basics/viewController/electricityConsumptionStatistics`,
    method: 'get',
    params: {
      dateType
    }
  })
}

// 能耗排名
export function energyConsumptionRanking(dateType) {
  return request({
    url: `/basics/viewController/energyConsumptionRanking`,
    method: 'get',
    params: {
      dateType
    }
  })
}

// 能耗与碳排放量分析
export function carbonEmissionList(deviceArea,dateType) {
  return request({
    url: `/wcs/assistant/decision/analysisOfEnergyConsumptionAndCarbonEmissions`,
    method: 'get',
    params: {
      deviceArea,
      dateType
    }
  })
}

