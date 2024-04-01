import request from '@/utils/request'

let basePath = '/basics/goodscategory';

// 查询货物类别信息列表
export function listGoodscategory(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询货物类别信息详细
export function getGoodscategory(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增货物类别信息
export function addGoodscategory(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改货物类别信息
export function updateGoodscategory(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除货物类别信息
export function delGoodscategory(id) {
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