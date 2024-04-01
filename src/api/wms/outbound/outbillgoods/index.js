import request from '@/utils/request'

let basePath = '/outbound/outbillgoods';

// 查询出库单货物列表
export function listOutbillgoods(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询出库单货物详细
export function getOutbillgoods(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增出库单货物
export function addOutbillgoods(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改出库单货物
export function updateOutbillgoods(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除出库单货物
export function delOutbillgoods(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
