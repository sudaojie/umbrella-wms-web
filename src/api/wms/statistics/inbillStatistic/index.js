import request from '@/utils/request'

let basePath = '/statistics/inbillStatistics';

// 查询入库单信息列表
export function listInbill(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

//查询供应商数据
export function getSupplierData(){
  return request({
    url: `/basics/supplier/getSupplierData`,
    method: 'post'
  })
}
