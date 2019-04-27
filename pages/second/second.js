// pages/third/second.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: false,
        vertical: false,
        autoplay: false,
        circular: false,
        interval: 2000,
        duration: 300,
        previousMargin: 0,
        nextMargin: 0,
        currentData: 0,
        areaHeight0: 0,
        areaHeight: 0,
    },
    slide: function (e){
        const that = this;
        // console.log(e.target.dataset.current);//获取nav当前绑定的 currentData
        if (e.target.dataset.current === e.detail.current) {
            return false
        } else {
            that.setData({
                currentData: e.target.dataset.current
            })
        }
    },
    //获取当前滑块的index
    bindchange: function (e){
        // console.log(e.detail.current);//获取当前活动swiper的index
        this.setData({
            currentData: e.detail.current
        })
    },
    changeProperty:
        function (e){
            var propertyName = e.currentTarget.dataset.propertyName
            var newData = {}
            newData[propertyName] = e.detail.value
            this.setData(newData)
        }
    ,
    changeIndicatorDots: function (e){
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    }
    ,
    changeAutoplay: function (e){
        this.setData({
            autoplay: !this.data.autoplay
        })
    }
    ,
    intervalChange: function (e){
        this.setData({
            interval: e.detail.value
        })
    }
    ,
    durationChange: function (e){
        this.setData({
            duration: e.detail.value
        })
    },
    //事件处理函数
    info: function (){
        // wx.showToast({
        //     title: '成功',
        //     icon: 'success',
        //     duration: 2000
        // })
        wx.navigateTo({
            url: 'http://www.baidu.com',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success: function (){
            },        //成功后的回调；
            fail: function (){
            },         //失败后的回调；
            complete: function (){
            }      //结束后的回调(成功，失败都会执行)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options){
        var that = this
        wx.getSystemInfo({
            success(res){
                var w = res.windowWidth
                var h = res.windowHeight
                var calHeight = (h / w * 750 - 57).toFixed(2)
                console.log(calHeight);
                that.setData({
                    areaHeight0: (h / w * 750).toFixed(2),
                    areaHeight: calHeight
                });
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (){
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (){
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function (){
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function (){
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (){
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function (){
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (){
    }
})