import request from '@/utils/request'

let basePath = '/outbound/outbill';

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
// 查询打印出库单信息详细
export function getPrintData(id) {
  return request({
    url: `${basePath}/getPrintData/${id}`,
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
// 删除出库单详情信息
export function removeDetail(id) {
  return request({
    url: `/outbound/outbillgoods/remove/${id}`,
    method: 'delete'
  })
}
// 查询地址列表
export function getAddressList() {
  return request({
    url: `/basics/address/getAddressList`,
    method: 'post'
  })
}
// 查询车辆列表
export function getVehicleList() {
  return request({
    url: `/basics/vehicle/getVehicleList`,
    method: 'post'
  })
}
// 查询库存总览列表
export function getGoodsList(data) {
  return request({
    url: `/stock/tblstock/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询可出库库存总览列表
export function geCanOutGoodsList(data) {
  return request({
    url: `/stock/tblstock/canOutList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}


// 查询出库单详情列表
export function getDetailGoodsList(data) {
  return request({
    url: `/outbound/outbillgoods/selectList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询唯一码详情列表
export function getDetailGoodsList1(data) {
  return request({
    url: `/outbound/outbillgoods/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询唯一码详情列表
export function getDetailGoodsList2(data) {
  return request({
    url: `/outbound/outbillgoods/listGroup?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
