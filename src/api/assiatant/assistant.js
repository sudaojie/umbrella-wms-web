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

// 碳排量监测
export function carbonEmissionMonitorList(type) {
  return request({
    url: `/wcs/assistant/decision/carbonEmissionMonitor`,
    method: 'get',
    params: {
      type
    }
  })
}

// 温湿度与晾晒时长分析
export function dryingTime() {
  return request({
    url: `/wcs/assistant/decision/analysisOfTemperatureHumidityDryingTime`,
    method: 'get',
  })
}
// 能耗与碳排放量分析
export function carbonEmissionsList(deviceArea,dateType) {
  return request({
    url: `/wcs/assistant/decision/analysisOfEnergyConsumptionAndCarbonEmissions`,
    method: 'get',
    params: {
      deviceArea,
      dateType
    }
  })
}

// 设备列表表格
export function deviceList(deviceArea) {
  return request({
    url: `/wcs/assistant/decision/temperatureAndHumidityMonitorList`,
    method: 'get',
    params: {
      deviceArea
    }
  })
}
