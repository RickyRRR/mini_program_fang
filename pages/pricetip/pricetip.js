//index.js
//获取应用实例  adf
const app = getApp()
import * as echarts from '../../ec-canvas/echarts' ;

Page({
    data: {
        tipList:[],

        imgUrls: [
            '../../image/banner.png',
            '../../image/banner.png',
            '../../image/banner.png',
        ],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        circular: false,
        interval: 2000,
        duration: 500,

    },
   /* changeProperty:
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
    goDetail: function (){
        wx.navigateTo({
            url: '../tldetail/tldetail' + "?id=" + Math.floor(Math.random() * 100)
        })
    },*/
getTipList(){
        var openid = wx.getStorageSync('openid');
        var that = this;
    wx.request({
        url: 'https://www.peapocket.com/minipricetip',
        data: {
            openid:openid,
            type:'getTip'
        },
        //method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

        success: function (res) {
            if (res.statusCode == 200) {
                wx.hideLoading()
                //console.log(res.data)
                let jsondata = res.data;
                if(jsondata.isExist == 0){
                    wx.showToast({
                        title: '暂未设置需要降价提醒的房源！',
                        icon:'none',
                        duration: 3000
                    })
                    return
                }
                that.setData({
                    tipList:jsondata.datalist
                })


            } else {
                console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
            }
        },
        fail: function () {
            console.log("index.js wx.request CheckCallUser fail");
        },
        complete: function () {
            // complete
        }
    })
},
    onLoad(){
        this.getTipList();
    }






})

