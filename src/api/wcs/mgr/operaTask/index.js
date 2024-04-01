import request from '@/utils/request'

let basePath = '/wcs/operateTask';

// 查询WCS任务信息列表
export function listTask(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询WCS任务信息详细
export function getTask(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增WCS任务信息
export function addTask(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改WCS任务信息
export function updateTask(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除WCS任务信息
export function delTask(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}


//强制手动完成WCS任务
export function forceCompleteStacker(id) {
  return request({
    url: `${basePath}/forceCompleteStacker/${id}`,
    method: 'post'
  })
}



//手动取消WCS任务
export function handleCancelStacker(id) {
  return request({
    url: `${basePath}/handleCancelStacker/${id}`,
    method: 'post'
  })
}
