// pages/home/home.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pno:0,    //页码
    list:[]  //电影列表
  },
  // 加载电影列表
  loadMore:function(){
    var pno=this.data.pno+1;//每次加载时页面加1
    this.setData({   //修改data中的页码
      pno:pno   //pno:pno
    }) 
    var offset=(pno-1)*4;
    // 调用云函数
    wx.cloud.callFunction({
      name:"movielist",
      data:{ //传到云函数的event.start和event.count
        start:offset,   //起始行数
        count:4
        }
    }).then(res=>{
      // 云函数返回json string ,需将json string转换为js对象 
      var rows = JSON.parse(res.result); 
      this.setData({ 
      //使用concat拼接下一页内容 
      list: this.data.list.concat(rows.subjects) //保存云函数返回的结果
       })
    }) 
    .catch(err=>{console.log(err)})
  },
  /*跳转至详情页 */
  jumpComment:function(e){
    console.log(e)
    var id=e.target.dataset.id;
    wx.navigateTo({url:`/pages/comment/comment?id=${id}`});
  },
  /* 生命周期函数*/
  onLoad: function (options) {
    this.loadMore();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})