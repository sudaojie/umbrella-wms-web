import request from '@/utils/request'

// 查询系统附件列表
export function listFile(query) {
  return request({
    url: '/system/file/list',
    method: 'get',
    params: query
  })
}

// 查询系统附件详细
export function getFile(id) {
  return request({
    url: '/system/file/' + id,
    method: 'get'
  })
}

// 查询系统附件详细
export function getFileByIds(ids) {
  return request({
    url: '/system/file/getFileByIds',
    method: 'post',
    data:{ ids }
  })
}


// 新增系统附件
export function addFile(data) {
  return request({
    url: '/system/file',
    method: 'post',
    data: data
  })
}

// 修改系统附件
export function updateFile(data) {
  return request({
    url: '/system/file',
    method: 'put',
    data: data
  })
}

// 删除系统附件
export function delFile(id) {
  return request({
    url: '/system/file/' + id,
    method: 'delete'
  })
}

/**
 * 附件上传
 * @param tempIds  临时附件编号集合
 * @param buniessId 业务编号
 */
export function uploadFormal(tempIds,buniessId) {
  return request({
    url: '/formal/upload',
    method: 'post',
    data: {tempIds,buniessId}
  })
}
