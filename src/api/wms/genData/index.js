import request from '@/utils/request'

let basePath = '/gen/data';

// 删除出库单详情信息
export function genData(data) {
  return request({
    url: `${basePath}/genData`,
    method: 'post',
    data: data
  })
}

export function boolAgv() {
  return request({
    url: `${basePath}/boolAgv/`,
    method: 'get'
  })
}

