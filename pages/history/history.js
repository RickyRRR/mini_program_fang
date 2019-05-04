//index.js
//获取应用实例  adf
const app = getApp()
import * as echarts from '../../ec-canvas/echarts' ;

Page({
    data: {
        ec: {
            lazyLoad: true // 延迟加载
        },
        productHref:'103102793936',
        array: ['链家', '我爱我家', '豪世华邦'],
        postArr:['lianjia','5i5j','hshb'],
        /*objectArray: [
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
        ],*/
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
    //////////////////----------------------//////////
    queryPrice:function (e){

        wx.showLoading({
            title: '加载中',
        })
        let that = this
        this.echartsComponnet = this.selectComponent('#mychart');

        wx.request({
            url: 'https://www.peapocket.com/minihistoryprice',
            data: { houseNo: this.data.productHref ,houseFrom:this.data.postArr[this.data.index]},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },// 设置请求的 header
            success: function (res) {
                if (res.statusCode == 200) {
                    wx.hideLoading()
                    console.log(res.data)
                    let jsondata = res.data;
                    var arrprice = []
                    for(var key in jsondata){
                        if(key.substring(0,4) == 'time'){
                            var objprice = {}

                            var keydate = key.substring(4,key.length)
                            objprice['date'] = jsondata[key]
                            objprice[key] = jsondata[key]
                            objprice['squarePrice'] =jsondata['squarePrice'+keydate]
                            objprice['totalPrice'] =jsondata['totalPrice'+keydate]
                            arrprice.push(objprice)
                        }

                    }
                    arrprice.sort(function (a,b) {
                        return new Date(a.date).getTime() - new Date(b.date).getTime()
                    })
                    var dateArr = []
                    var totalPriceArr = []
                    var squarePriceArr = []
                    var info = {}
                    for(let item of arrprice){
                        dateArr.push(item.date)
                        totalPriceArr.push(item.totalPrice)
                        squarePriceArr.push(item.squarePrice)
                    }
                   /// info = {"time":dateArr,"totalprice":totalPriceArr,"squareprice":squarePriceArr}



                    that.init_echarts(dateArr,totalPriceArr,squarePriceArr);//初始化图表
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

    getOption: function (xData,yDataTotal,yDataSquare) {

        // 指定图表的配置项和数据
        let option = {
            tooltip: {
                trigger: 'axis',
               /* axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'

                    }

                },*/
                formatter: function (params, ticket, callback) {
                    //x轴名称
                    /*                  console.log(params)*/
                    var result = '';
                    params.forEach(function (item,index) {
                        if(index == 0){
                            result += item.name+ "\n"  + item.seriesName + " : " + item.value +" 万元\n";
                        }else if(index ==1){
                            result +=  item.seriesName + " : " + item.value +" 元";
                        }

                    });
                    return result
                    /*  var name = params[0].name
                     //图表title名称
                     var seriesName = params[0].seriesName
                     //值
                     var totalValue = params[0].value
                     var squareValue = params[1].value
                     //var valueFliter = formatter(value)
                     return   '<br />' + name + '<br />' + totalValue+ '<br />' +squareValue*/
                }


            },
            toolbox: {
                feature: {
                    //dataView: {show: true, readOnly: false},
                    //magicType: {show: true, type: ['line', 'bar']},
                    //restore: {show: true},
                    //saveAsImage: {show: true}
                }
            },
            legend: {
                data:['总价','均价']
            },
            xAxis: [
                {

                    boundaryGap: false,   //是否从0开始
                    type: 'category',
                    //data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                    data:xData,
                    /*axisPointer: {
                     type: 'shadow'
                     }*/
                }
            ],
            yAxis: [
                {
                    "axisTick":{       //y轴刻度线
                        "show":false
                    },
                    type: 'value',
                    //name: '总价/万元',
                    min: 0,
                    max: 1000,
                    //interval: 50,
                    axisLabel: {
                        show:false,
                        formatter: '{value}'
                    }
                },
                {
                    "axisTick":{       //y轴刻度线
                        "show":false
                    },
                    /* splitLine:{
                     show:false
                     },*/
                    type: 'value',
                   // name: '均价/元',
                    min: 0,
                    max: 80000,
                    //interval: 5,
                    axisLabel: {
                        show:false,
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name:'总价',
                    type:'line',
                    //data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    data:yDataTotal,
                    /* markLine: {
                     data: [
                     {type: 'min', name: '最低值'}
                     ]
                     }*/
                },
                /* {
                 name:'降水量',
                 type:'bar',
                 data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                 },*/
                {
                    name:'均价',
                    type:'line',
                    yAxisIndex: 1,
                    //data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    data:yDataSquare
                }
            ]
        };



        return option;
    },

//初始化图表
    init_echarts: function (xdata,ydata1,ydata2) {
        this.echartsComponnet.init((canvas, width, height) => {
            // 初始化图表
            const Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            Chart.setOption(this.getOption(xdata,ydata1,ydata2));
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
    },


})

