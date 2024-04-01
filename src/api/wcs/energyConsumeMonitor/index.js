import request from '@/utils/request'

let basePath = '/wcs/energyConsumeMonitor';

// 查询左侧设备树
export function listSideDeviceInfoTree() {
  return request({
    url: `${basePath}/listSideDeviceInfoTree`,
    method: 'get'
  })
}

// 加载右侧历史记录
export function loadHistoryRecords(data) {
  return request({
    url: `${basePath}/loadHistoryRecords`,
    method: 'get',
    // headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    params: data
  })
}

// 加载能耗头部数据
export function loadEnergyHeaderData(data) {
  return request({
    url: `${basePath}/loadEnergyHeaderData`,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: data
  })
}

// 加载能耗图表
export function loadEnergyChartData(data) {
  return request({
    url: `${basePath}/loadEnergyChartData`,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: data
  })
}

// 加载右侧电压电流历史记录
export function loadVoltageCurrentRecords(data) {
  return request({
    url: `${basePath}/loadVoltageCurrentRecords`,
    method: 'get',
    params: data
  })
}

// 加载右侧电压电流历史记录
export function loadPowerRecords(data) {
  return request({
    url: `${basePath}/loadPowerRecords`,
    method: 'get',
    params: data
  })
}

// 加载电压电流图表
export function loadVoltageCurrentChartData(data) {
  return request({
    url: `${basePath}/loadVoltageCurrentChartData`,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: data
  })
}

// 加载功耗图表
export function loadPowerChartData(data) {
  return request({
    url: `${basePath}/loadPowerChartData`,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: data
  })
}


