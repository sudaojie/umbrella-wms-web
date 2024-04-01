import request from '@/utils/request'

let basePath = '/stock/outbill';

// 查询出库单信息列表
export function listOutbill(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询出库单信息详细
export function getOutbill(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增出库单信息
export function addOutbill(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改出库单信息
export function updateOutbill(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除出库单信息
export function delOutbill(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
