import request from '@/utils/request'

let basePath = '/check';

// 查询库存盘点列表
export function listCheck(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存盘点修改界面数据
export function getCheck(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}
// 查询库存盘打印数据
export function getPrintData(id) {
  return request({
    url: `${basePath}/getPrintData/${id}`,
    method: 'get'
  })
}

// 查询库存盘点详细
export function getCheckDetailData(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 明细
export function getCheckGoodsList(data) {
  return request({
    url: `${basePath}/getCheckGoodsList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 新增库存盘点(全盘)
export function addAllCheck(data) {
  return request({
    url: `${basePath}/addAllCheck`,
    method: 'post',
    data: data
  })
}

// 新增库存盘点(按库位)
export function addLocationCheck(data) {
  return request({
    url: `${basePath}/addLocationCheck`,
    method: 'post',
    data: data
  })
}

// 新增库存盘点(按货物类型)
export function addGoodsTypeCheck(data) {
  return request({
    url: `${basePath}/addGoodsTypeCheck`,
    method: 'post',
    data: data
  })
}

// 修改库存盘点
export function updateCheck(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库存盘点
export function delCheck(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

// 删除库存盘点详细信息
export function delCheckDetail(ids) {
  return request({
    url: `${basePath}/delCheckDetail/${ids}`,
    method: 'delete'
  })
}

// 删除库存盘点配置信息
export function delCheckConfig(ids) {
  return request({
    url: `${basePath}/delCheckConfig/${ids}`,
    method: 'delete'
  })
}


// 查询库位列表
export function getLocationList(data) {
  return request({
    url: `${basePath}/getLocationList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存总览列表
export function getGoodsList(data) {
  return request({
    url: `${basePath}/getGoodsList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存总览列表
export function getAllCheckbill() {
  return request({
    url: `${basePath}/getAllCheckbill`,
    method: 'post'
  })
}

// 查询库存明细列表
export function getCheckDetailInfo(data) {
  return request({
    url: `${basePath}/getCheckDetailInfo?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询库存明细列表
export function getDetailListData(data) {
  return request({
    url: `${basePath}/getDetailListData?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 开始盘点任务
export function startCheck(data) {
  return request({
    url: `${basePath}/checkDetail/startCheck`,
    method: 'post',
    data: data
  })
}
// 结束盘点任务
export function endCheck(data) {
  return request({
    url: `${basePath}/checkDetail/endCheck`,
    method: 'post',
    data: data
  })
}
// 获取库区选项
export function getAreaCode() {
  return request({
    url: `${basePath}/getAreaCode`,
    method: 'post'
  })
}
// 结束盘点任务
export function getLocationData() {
  return request({
    url: `${basePath}/getLocationData`,
    method: 'post'
  })
}