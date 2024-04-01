import request from '@/utils/request'

// 行政区划 加载下级
export function listChildren(pId) {
  return request({
    url: '/system/district/listChildren',
    method: 'get',
    params: {
      pId: pId
    }
  })
}

// 行政区划 加载下级
export function listChildrenIds(pIds) {
  return request({
    url: '/system/district/listChildrenIds',
    method: 'get',
    params: {
      pIds: pIds
    }
  })
}
