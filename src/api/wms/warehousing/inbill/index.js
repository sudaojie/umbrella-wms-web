import request from '@/utils/request'

let basePath = '/warehousing/inbill';

// 查询入库单信息列表
export function listInbill(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询入库单信息详细
export function getInbill(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增入库单信息
export function addInbill(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改入库单信息
export function updateInbill(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'post',
    data: data
  })
}
// 修改入库单信息
export function updateStatus(data) {
  return request({
    url: `${basePath}/updateStatus`,
    method: 'post',
    data: data
  })
}

// 删除入库单信息
export function delInbill(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

// 查询货物信息列表
export function getGoodsList(data) {
  return request({
    url: `/basics/goodsinfo/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询入库单货物分类信息列表
export function getInbillDetailList(data) {
  return request({
    url: `/warehousing/detail/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
//查询供应商数据
export function getSupplierData(){
  return request({
    url: `/basics/supplier/getSupplierData`,
    method: 'post'
  })
}
//查询入库详情货物数据
export function getInbillGoodsDetail(data){
  return request({
    url: `/warehousing/goods/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
//查询入库单货物上架数据
export function getInbillGoodsByLocation(data){
  return request({
    url: `/warehousing/detail/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
//打印pdf文件
export function printData(data){
  return request({
    url: `/warehousing/inbill/printData`,
    method: 'post',
    data: data
  })
}
//打印二维码
export function getPrintData(data){
  return request({
    url: `/warehousing/goods/getPrintData`,
    method: 'post',
    data: data
  })
}
//修改入库单详情的货物唯一码的打印状态
export function updateInbillGoods(data){
  return request({
    url: `/warehousing/goods/updateStatus`,
    method: 'post',
    data: data
  })
}
//获取入库单打印数据
export function getPrintData1(data){
  return request({
    url: `/warehousing/inbill/getPrintData`,
    method: 'post',
    data: data
  })
}
// 删除入库单详情信息
export function removeDetail(id) {
  return request({
    url: `/warehousing/detail/remove/${id}`,
    method: 'delete'
  })
}