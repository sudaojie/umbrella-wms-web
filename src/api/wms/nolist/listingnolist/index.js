import request from '@/utils/request'

let basePath = '/nolist/listingnolist';

// 查询无单上架列表
export function listListingnolist(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
// 查询无单上架详情列表
export function getDetailList(data) {
  return request({
    url: `${basePath}/listDetail?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询无单上架详细
export function getListingnolist(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增无单上架
export function addListingnolist(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改无单上架
export function updateListingnolist(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除无单上架
export function delListingnolist(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
