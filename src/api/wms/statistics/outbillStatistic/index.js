import request from '@/utils/request'

let basePath = '/statistic/outbillStatistic';

// 查询出库单信息列表
export function listOutbill(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data,
  })
}

//查询供应商数据
export function getSupplierData(){
  return request({
    url: `/basics/supplier/getSupplierData`,
    method: 'post'
  })
}
