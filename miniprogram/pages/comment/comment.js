// pages/comment/comment.js
const db=wx.cloud.database(); //创建云数据对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1:"",  //文本框内容
    score:0,  //评分
    movieid: 30261964,  //电影id
    detail:{},     //保存当前电影信息
    images:[],     //保存预览图片
    fileIDs:[],    //保存上传文件id
  },
  // 当用户在文本框输入内容触发此事件
  onContentChange:function(e){
    console.log(e.detail)
    this.setData({
      value1:e.detail
    })
  },
  // 获取当前用户评分
  onChangeScore:function(e){
    this.setData({
      score:e.detail
    });
  },
  // 调用云函数
  loadMore:function(){
    wx.showLoading({ //数据加载提示框
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({ //调用云函数
      name:"findDetail",  
      data:{id:this.data.movieid}
    }).then(res=>{
      this.setData({
        detail:JSON.parse(res.result)//将数据转换并保存到detail中
      })
      wx.hideLoading(); //加载完成后隐藏加载提示框
    })
    .catch(err=>{console.log(err)})
  },
  // 选中图片并实现预览图片
  uploadFile:function(){
    wx.chooseImage({ //选取图片
      count:9,
      sizeType:["original","compressed"], 
      sourceType:["album","camera"],
      success:(res)=>{
        var list=res.tempFilePaths;  //临时路径 
        console.log(list)
        this.setData({
          images:list  //将图片保存到images中 
        })
      }
    })
  },
  // 用户发表评论
  comment:function(){

    //可选功能： 判断如果当前用户没选择图片，提示：请先选择图片
    /*if(this.data.images.length==0){
      wx.showToast({
        title: '请选择图片',
      })
      return;
    }*/
    // 功能1：获取用户评论信息
    // 功能2：上传多张图片
    // 1.在云数据库创建集合comment
    // 2.在data添加 fileID:[]    保存上传文件id
    // 3.显示数据加载提示框   
    wx.showLoading({
      title: '评论发表中..',
    })
    // 4.创建数据rows  保存Promise对象
    var rows=[];
    // 5.创建循环遍历每张选中图片
    for(var i=0;i<this.data.images.length;i++){
      // 6.为每张图片创建Promise对象完成上传
      rows.push(new Promise((resolve,reject)=>{
        // 6.1获取当前图片名称
        var item=this.data.images[i]
        // 6.2获取后缀(拆分、搜索、正则)
        // 正则：XXX.jpg  .jpg=> exec()函数进行解析返回数组  =>[.jpg]
        //var suffix=/\.\w+$/.exec(item)[0]
        var suffix=item.match(/\.\w+$/)[0]
        console.log(suffix)
        // 6.3创建新文件名 时间+随机数+后缀名
        var newFile=new Date().getTime()+Math.floor(Math.random()*999)+suffix;
        // 6.4上传图片
        wx.cloud.uploadFile({
          cloudPath:newFile,  //新文件名
          filePath:item,      //原文件名
          success:(res=>{
        // 6.5上传成功保存fileID,执行解析
            this.data.fileIDs.push(res.fileID) //将返回的fileID保存到fileIDs数组中
            resolve();  //成功就执行 解析
          })
        })
      }))
    }
    // 功能3：将用户评论信息与图片fileID保存云数据库
    Promise.all(rows).then(res=>{//由于异步，所以必须等rows执行完成后才执行以下代码
      db.collection("comment")
      .add({
        data: {
          context:this.data.value1 === "" ? "用户没有填写评价" : this.data.value1,  //用户评论内容
          score: this.data.score === 0 ? 5 : this.data.score, //用户评分
          movieid: this.data.movieid, //电影id
          fileIDs: this.data.fileIDs  //图片fileIds.
        }
      })
      .then(res => {
        wx.hideLoading(); //隐藏加载提示框
        wx.showToast({title:"发表成功"})
        
      })
      .catch(err => { console.log(err) })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid:options.id   //获取home组件传递id并保存
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})