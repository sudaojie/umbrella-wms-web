import request from '@/utils/request'

let basePath = '/wms/move';

// 查询移库单列表
export function listMove(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询移库单详细
export function getMove(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增移库单
export function addMove(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改移库单
export function updateMove(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}
// 修改移库单状态
export function updateStatus(data) {
  return request({
    url: `${basePath}/updateStatus`,
    method: 'post',
    data: data
  })
}

// 删除移库单
export function delMove(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
// 删除移库单详情
export function removeDeatil(ids) {
  return request({
    url: `/wms/detail/remove/${ids}`,
    method: 'delete'
  })
}
// 移库单获取可选择的库位
export function getLocationData(data) {
  return request({
    url: `/basics/location/listByParams?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 移库单获取详情货物数据
export function getDetailGoodsList(data) {
  return request({
    url: `/wms/detailGoods/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 移库单获取详情数据
export function getDetaiList(data) {
  return request({
    url: `/wms/detail/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
//获取仓库
export function getWarehouseData(){
  return request({
    url: `/basics/warehouse/getWarehouseData`,
    method: 'post'
  })
}
// 根据可选择的仓库获取库区
export function getAreaData(data){
  return request({
    url: `/basics/area/getAreaData`,
    method: 'post',
    data:data
  })
}
// 移库单获取可选择的库位
export function getLocations(data){
  return request({
    url: `/basics/location/listsByParams`,
    method: 'post',
    data:data
  })
}
