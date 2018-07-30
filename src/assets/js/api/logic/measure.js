import baseApi from "../baseApi"
export default {

  addNewMeasure:function(userFrom){
    return baseApi({
      url: '/MeasureService/AddNewMeasure',
      method: 'post',
      data:userFrom
    })
  },
  queryMeasureInfo:function(measureId,isNeedPay = false){
    return baseApi({
      url: '/MeasureService/QueryMeasureInfo',
      method: 'post',
      data:{
        orderId:measureId,
        isNeedPay:isNeedPay
      },
    })
  }
}
