// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 引入第三方库
const rp = require("request-promise")
// 创建主函数
exports.main=async(event,context)=>{
  var url =`http://api.douban.com/v2/movie/subject/${event.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`;
  return rp(url).then(res=>{ //使用request-promise发送请求
    return res;  //返回结果
  }).catch(err=>{console.log(err)})
}
