import request from '@/utils/request'

let basePath = '/basics/goodsinfo';

// 查询货物信息列表
export function listGoodsinfo(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询货物信息详细
export function getGoodsinfo(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增货物信息
export function addGoodsinfo(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改货物信息
export function updateGoodsinfo(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除货物信息
export function delGoodsinfo(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

//检查数据
export function checkData(data){
  return request({
    url: `${basePath}/checkData`,
    method: 'post',
    data: data
  })
}
//获取类别
export function getGoodscategoryData(){
  return request({
    url: `/basics/goodscategory/getGoodscategoryData`,
    method: 'post'
  })
}
//获取供应商
export function getSupplierData(){
  return request({
    url: `/basics/supplier/getSupplierData`,
    method: 'post'
  })
}
//获取仓库
export function getWarehouseData(){
  return request({
    url: `/basics/warehouse/getWarehouseData`,
    method: 'post'
  })
}
//获取库区
export function getAreaData(data){
  return request({
    url: `/basics/area/getAreaData`,
    method: 'post',
    data:data
  })
}