import request from '@/utils/request'

let basePath = '/basics/tray';

// 查询托盘基本信息列表
export function listTray(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询托盘基本信息详细
export function getTray(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增托盘基本信息
export function addTray(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改托盘基本信息
export function updateTray(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除托盘基本信息
export function delTray(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
//数据验证
export function checkData(data){
  return request({
    url: `${basePath}/checkData`,
    method: 'post',
    data: data
  })
}
//获取仓库数据
export function getWarehouseData(){
  return request({
    url: `/basics/warehouse/getWarehouseData`,
    method: 'post'
  })
}
//获取库区数据
export function getAreaData(data){
  return request({
    url: `/basics/area/getAreaData`,
    method: 'post',
    data:data
  })
}
//获取库位数据
export function getLocationData(data){
  return request({
    url: `/basics/location/getLocationData`,
    method: 'post',
    data:data
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

// 查询托盘规格信息
export function getTrayModelData(id) {
  return request({
    url: `/basics/model/getTrayModelData`,
    method: 'post'
  })
}

// 查询托盘规格编号获取长、宽、高、容量、限重
export function getTrayModelByCode(data) {
  return request({
    url: `/basics/model/getTrayModelByCode`,
    method: 'post',
    data:data
  })
}

//请求打印
export function printDataList(data){
  return request({
    url: `${basePath}/printDataList`,
    method: 'post',
    data:data
  })
}
