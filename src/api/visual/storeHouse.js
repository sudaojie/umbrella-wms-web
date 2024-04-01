import request from '@/utils/request'

// 预警信息
export function getWarningList() {
  return request({
    url: `/basics/viewController/getWarningList`,
    method: 'get',
  })
}

// 任务列表
export function getTaskList() {
  return request({
    url: `/basics/viewController/getTaskList`,
    method: 'get',
  })
}

// 设备情况
export function getDeviceStatus() {
  return request({
    url: `/basics/viewController/getDeviceStatus`,
    method: 'get',
  })
}

// 库位情况
export function selectLocationInfo() {
  return request({
    url: `/basics/viewController/selectLocationInfo`,
    method: 'get',
  })
}

// 库存周转率
export function getInventoryTurnover() {
  return request({
    url: `/basics/viewController/getInventoryTurnover`,
    method: 'get',
  })
}

// 出入库统计
export function getInboundAndOutboundStatistics(dateType) {
  return request({
    url: `/basics/viewController/getInboundAndOutboundStatistics`,
    method: 'get',
    params: {
      dateType
    }
  })
}



