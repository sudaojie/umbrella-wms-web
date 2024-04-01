import request from '@/utils/request'

let basePath = '/wcs/alarmLight';

// 开启爆闪灯
export function openAlarmLight() {
  return request({
    url: `${basePath}/open`,
    method: 'get'
  })
}

// 关闭爆闪灯
export function closeAlarmLight() {
  return request({
    url: `${basePath}/close`,
    method: 'get'
  })
}

