import request from '@/utils/request'

let basePath = '/warehousing/parts';

// 查询机件号记录列表
export function listParts(data) {
  return request({
    url: `${basePath}/findPartsList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 新增查询机件号记录列表
export function addListParts(data) {
  return request({
    url: `${basePath}/findAddPartsList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询机件号记录详细
export function getParts(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增机件号记录
export function addParts(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改机件号记录
export function updateParts(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 修改机件号记录
export function updatePartsPrint(data) {
  return request({
    url: `${basePath}/editPrint`,
    method: 'put',
    data: data
  })
}

// 删除机件号记录
export function delParts(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
//获取打印数据
export function getPrintData(data){
  return request({
    url: `${basePath}/getPrintData`,
    method: 'post',
    data:data
  })
}

//IO获取打印数据
export function getIoPrintData(data){
  return request({
    url: `${basePath}/getIoPrintData`,
    method: 'post',
    data:data
  })
}

//级联获取物品类型
export function getCategoryCode(data){
  return request({
    url: `${basePath}/getCategoryCode`,
    method: 'post',
    data:data
  })
}

//初始化获取入库单号
export function findInbillCode(data){
  return request({
    url: `${basePath}/findInbillCode`,
    method: 'post',
    data:data
  })
}

//新增初始化获取入库单号
export function findAddInbillCode(data){
  return request({
    url: `${basePath}/findAddInbillCode`,
    method: 'post',
    data:data
  })
}

//请求打印机
export function printDataList(data){
  return request({
    url: `${basePath}/printDataList`,
    method: 'post',
    data:data
  })
}
