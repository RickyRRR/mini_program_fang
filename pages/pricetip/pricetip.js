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
    longPressDel(event){
        var that = this
        var item = event.currentTarget.dataset.item
        var openid = wx.getStorageSync('openid');
        var href = item.href
        wx.showModal({ //使用模态框提示用户进行操作
            title:'警告',
            content:'你将删除此房源降价提醒？',
            success:function(res){
                if(res.confirm){ //判断用户是否点击了确定
                    wx.request({
                        url: 'https://www.peapocket.com/minipricetip',
                        //url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+this.globalData.appid+'&secret='+this.globalData.secret+'&js_code='+res.code+'&grant_type=authorization_code',
                        method: 'POST',
                        data: {
                            openid: openid,
                            href: href,
                            type: 'deleteTip'
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },// 设置请求的 head
                        success(v){
                            for(let i=0;i< that.data.tipList.length;i++){
                                if(that.data.tipList[i].href == href){
                                    that.data.tipList.splice(i,1)
                                    break;
                                }
                            }
                            that.setData({
                                tipList:that.data.tipList
                            })
                            //console.log(that.data.tipList);

                            wx.showToast({
                                title: '删除成功！',
                                icon:'none',
                                duration: 2000
                            })
                            // console.log(v)
                        }
                    });
                }
            }
        })


    },


    updatepriceTipSubmit(event){
        var item = event.currentTarget.dataset.item;
        var formId = event.detail.formId;


        var openid = wx.getStorageSync('openid');
        var href = item.href

        var lastUpdatePrice;
      var nowPrice  = item.nowPrice;
        if(nowPrice == 0){
            lastUpdatePrice = item.registerPrice;
        }else {
            lastUpdatePrice = item.nowPrice;
        }

        wx.request({
            url: 'https://www.peapocket.com/minipricetip',
            //url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+this.globalData.appid+'&secret='+this.globalData.secret+'&js_code='+res.code+'&grant_type=authorization_code',
            method:'POST',
            data: {
                formId:formId,
                openid: openid,
                href:href,

                registerPrice:lastUpdatePrice,

                type:'setTip'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },// 设置请求的 header

            success(v){
                //var openid = v.data.openid;
                wx.showToast({
                    title: '设置成功！',
                    icon:'none',
                    duration: 2000
                })
                //console.log(v)
            }
        })

    },
    EchartDetail(e){
        wx.showLoading({
            title: '价格曲线加载中',
        })
        var houseNo = e.currentTarget.dataset.no;
        var houseFrom = e.currentTarget.dataset.source;
        wx.request({
            url: 'https://www.peapocket.com/minihistoryprice',
            data: { houseNo: houseNo ,houseFrom:houseFrom,methods:"methodsNo"},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },// 设置请求的 header
            success:res=>{
                wx.hideLoading()
                wx.navigateTo({
                    url: '../echartsdetail/echartsdetail?item='+JSON.stringify(res.data)
                })
            }
        })


    },
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
        console.log('onload')
        // this.getTipList();
    },
    onShow(){
        console.log('onshow')
        this.getTipList();
    }






})

