import request from '@/utils/request'

let basePath = '/stock/dryInbill';

// 查询晾晒入库单列表
export function listDryInbill(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询晾晒入库单详情列表
export function getDeatilList(data) {
  return request({
    url: `/stock/dryGoods/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询晾晒出库单以及详情列表
export function getDryOutbillList() {
  return request({
    url: `/stock/dryoutbill/getDryOutbillList`,
    method: 'post'
  })
}

// 查询晾晒入库单详细
export function getDryInbill(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增晾晒入库单
export function addDryInbill(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}
// 开始执行晾晒入库单
export function startTask(data) {
  return request({
    url: `${basePath}/startTask`,
    method: 'post',
    data: data
  })
}

// 修改晾晒入库单
export function updateDryInbill(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除晾晒入库单
export function delDryInbill(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
// 删除晾晒入库单
export function deleteDetail(id) {
  return request({
    url: `/stock/dryGoods/remove/${id}`,
    method: 'delete'
  })
}
