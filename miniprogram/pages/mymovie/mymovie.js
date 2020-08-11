// pages/mymovie/mymovie.js
const db=wx.cloud.database();
Page({
  /*页面的初始数据*/
  data: {
    imglist:[],  //图片列表
    fileIDs:[],  //上传文件的fileID
    content:"",   //留言
    list:[],      //保存我喜爱的电影列表
  },
  // 跳转至我喜欢的电影列表组件 
  jumpDetail:function(){
    //创建新组件movielist
    wx.navigateTo({
      url: '/pages/movielist/movielist',
    })
  },
  upload:function(){
    // 
    wx.showLoading({ //加载提示框
      title: '图片上传中...',
    })
    wx.chooseImage({ //选中图片
      count:9,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success: (res)=> { //选中成功
        this.setData({
          imglist:res.tempFilePaths,  //保存到imglist中
        })
        wx.hideLoading();//隐藏加载提示框
      },
    })
  },
  submit:function(){
    // 功能一：将选中的图片上传云存储
    // 功能二：将用户信息fileid添加云数据为咗
    wx.showLoading({
      title: '加载中..',
    })
    var rows=[]; //保存promise对象
    for(var i=0;i<this.data.imglist.length;i++){
      rows.push(new Promise((resolve,reject)=>{
        var item=this.data.imglist[i];      //文件名
        var suffix=item.match(/\.\w+$/)[0]; //后缀
        var newfile=new Date().getTime()+Math.floor(Math.random()*999)+suffix; //新文件名
        wx.cloud.uploadFile({  //上传云
          cloudPath:newfile,    //新文件名
          filePath:item,       //原文件名
          success:(res)=>{  //上传成功将fileID保存到fileIDs中
            this.data.fileIDs.push(res.fileID);
            resolve();
          }
        })
      }))
    }
    // 功能：等待所有Promise对象执行完
    Promise.all(rows).then(res=>{
      db.collection("mymovie").add({
        data:{
          msg: this.data.content,
          fileid: this.data.fileIDs,
        }
      })
      .then(res=>{
        msg:"";
        fileid:[];
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',

        })
      })
      .catch(err=>{console.log(err)})
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})