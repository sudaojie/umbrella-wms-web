import request from '@/utils/request'

let basePath = '/basics/transfer';

// 查询传输带库位信息列表
export function listTransfer(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询传输带库位信息详细
export function getTransfer(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增传输带库位信息
export function addTransfer(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改传输带库位信息
export function updateTransfer(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除传输带库位信息
export function delTransfer(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

// 获取存储库区编码
export function getAreaCcq() {
  return request({
    url: `${basePath}/getAreaCcq`,
    method: 'get'
  })
}
