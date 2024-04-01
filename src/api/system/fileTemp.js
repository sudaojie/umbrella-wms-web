import request from '@/utils/request'

// 查询系统临时附件列表
export function listFileTemp(query) {
  return request({
    url: '/system/fileTemp/list',
    method: 'get',
    params: query
  })
}

// 查询系统临时附件详细
export function getFileTemp(id) {
  return request({
    url: '/system/fileTemp/' + id,
    method: 'get'
  })
}

// 查询系统临时附件详细
export function getFileTempByIds(ids) {
  return request({
    url: '/system/fileTemp/getFileTempByIds',
    method: 'post',
    data:{ ids }
  })
}

// 新增系统临时附件
export function addFileTemp(data) {
  return request({
    url: '/system/fileTemp',
    method: 'post',
    data: data
  })
}

// 修改系统临时附件
export function updateFileTemp(data) {
  return request({
    url: '/system/fileTemp',
    method: 'put',
    data: data
  })
}

// 删除系统临时附件
export function delFileTemp(id) {
  return request({
    url: '/system/fileTemp/' + id,
    method: 'delete'
  })
}
