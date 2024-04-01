import request from '@/utils/request'

let basePath = '/stock/dryoutbill';

// 查询晾晒出库单列表
export function listOutbill(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询晾晒出库单详细
export function getOutbill(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

//查询晾晒出库单货物数据详细
export function getDryOutbillGoods(data){
  return request({
    url: `${basePath}/getDryOutbillGoods?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 新增晾晒出库单
export function addOutbill(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改晾晒出库单
export function updateOutbill(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除晾晒出库单
export function delOutbill(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

//删除晾晒出库货物
export function removeDetail(id){
  return request({
    url: `${basePath}/removeDetail/${id}`,
    methods: 'get'
  })
}
//校验晾晒库区是否能容纳选择的托盘
export function checkData(data){
  return request({
    url: `${basePath}/checkData`,
    method: 'post',
    data:data
  })
}

// 点击按钮，开始晾晒出库
export function clickStart(data) {
  return request({
    url: `${basePath}/clickStart`,
    method: 'post',
    data: data
  })
}

// 查询货物信息
export function getGoodsList(data) {
  return request({
    url: `${basePath}/getGoodsList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

//获取初始化货区信息
export function getAreaData(){
  return request({
    url: `${basePath}/getAreaData`,
    method: 'post'
  })
}

// 查询货物详细信息
export function goodsDetailList(data) {
  return request({
    url: `${basePath}/goodsDetailList`,
    method: 'post',
    data: data
  })
}
