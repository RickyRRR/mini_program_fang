//index.js
//获取应用实例
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';
function initChart(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);

    var option = {
        color: ['#37a2da', '#32c5e9', '#67e0e3'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            confine: true
        },
        legend: {
            data: ['热度', '正面', '负面']
        },
        grid: {
            left: 20,
            right: 20,
            bottom: 15,
            top: 40,
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            }
        ],
        series: [
            {
                name: '热度',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data: [300, 270, 340, 344, 300, 320, 310],
                itemStyle: {
                    // emphasis: {
                    //   color: '#37a2da'
                    // }
                }
            },
            {
                name: '正面',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: [120, 102, 141, 174, 190, 250, 220],
                itemStyle: {
                    // emphasis: {
                    //   color: '#32c5e9'
                    // }
                }
            },
            {
                name: '负面',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'left'
                    }
                },
                data: [-20, -32, -21, -34, -90, -130, -110],
                itemStyle: {
                    // emphasis: {
                    //   color: '#67e0e3'
                    // }
                }
            }
        ]
    };
    chart.setOption(option);
    return chart;
}
Page({
    data: {
        ec: {
            onInit: initChart
        },
        productHref:'',
        array: ['链家', '我爱我家', '豪世华邦'],
        objectArray: [
            {
                id: 0,
                name: '链家'
            },
            {
                id: 1,
                name: '我爱我家'
            },
            {
                id: 2,
                name: '豪世华邦'
            }
        ],
        index: 0,
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
        previousMargin: 0,
        nextMargin: 0
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
    goDetail: function (){
        wx.navigateTo({
            url: '../tldetail/tldetail' + "?id=" + Math.floor(Math.random() * 100)
        })
    },

    //获取用户输入的用户名
    productHrefInput:function(e)
    {
        this.setData({
            productHref: e.detail.value
        })
    },
    bindKeyInput(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    queryPrice:function (e){

        console.log(this.data.productHref)
        wx.request({
            url: 'https://www.peapocket.com/historyprice',
            data: { href: 'https://hz.lianjia.com/ershoufang/103103768762.html' },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },// 设置请求的 header
            success: function (res) {
                if (res.statusCode == 200) {
                    console.log(res.data)
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



})

