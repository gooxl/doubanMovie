// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    controls: [//地图控件
      {  
        id:0,  //控件id
        iconPath:"/images/1.png",
        position:{ //控件坐标
          left:50,
          top:60,
          width:30,
          height:30,
        }
      }
    ],
    polyline:[//两点间的折线
      {
        points:[ //坐标点
          { longitude: 116.300901,latitude: 39.926225},
          { longitude: 116.320971, latitude: 39.916881},
        ],
        color:"#faa",
        width:5
      }
]
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