import request from '@/utils/request'

let basePath = '/nolist/offshelfnolist';

// 查询无单下架列表
export function listOffshelfnolist(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询无单下架详情列表
export function listDetail(data) {
  return request({
    url: `${basePath}/listDetail?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询无单下架详细
export function getOffshelfnolist(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增无单下架
export function addOffshelfnolist(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改无单下架
export function updateOffshelfnolist(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除无单下架
export function delOffshelfnolist(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
