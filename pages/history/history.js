//index.js
//获取应用实例  adf
const app = getApp()
import * as echarts from '../../ec-canvas/echarts' ;

Page({
    data: {
        ec: {
            lazyLoad: true // 延迟加载
        },
        houseInfo:'',
        priceTipView:true,

        pickMethodsType:true,
        houseList:[],
        showOrHide:true,
        keyword:'朝南',
        xqname:'金色江南',
        productHref:'103102793936',
        array: ['链家', '我爱我家', '豪世华邦'],
        postArr:['lianjia','5i5j','hshb'],
        postArrCity:['hz','nb','sh','su','qd','nj','gz','sz'],
        cityarray:['杭州','宁波','上海','苏州','青岛','南京','广州','深圳'],
        cityindex:0,
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
            '../../image/choice/5-2.jpg',
            '../../image/choice/6-1.jpg',
            '../../image/choice/5-2.jpg',
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









    priceTipSubmit(event){
        var formId = event.detail.formId;
        console.log('formId'+formId)
        var sourceNo = '';
        var sourceFrom = ''

        var openid = wx.getStorageSync('openid');
        var href = this.data.houseInfo.href;
        if(href.indexOf('lianjia') != -1){
            sourceNo = 'lianjiaNo'
            sourceFrom = 'lianjia'
        }else if(href.indexOf('5i5j') != -1){
            sourceNo = 'wawjNo'
            sourceFrom = '5i5j'
        }else if(href.indexOf('hshb') != -1){
            sourceNo = 'hshbNo'
            sourceFrom = 'hshb'
        }else{
            return;
        }
        //编号 和 来源
        var No = this.data.houseInfo[sourceNo];
        var source = sourceFrom;

        var arr = []
        for(var key in this.data.houseInfo) {
            if (key.substring(0, 10) == 'totalPrice') {
                var objprice = {}

                var keydate = key.substring(10, key.length)
                arr.push(keydate)
            }
        }
        arr.sort(function (a,b) {
            return Number(b) -   Number(a); //从大到小
        })
        var lastUpdateKey = 'totalPrice'+arr[0]
        //最近更新的总价
        var lastUpdatePrice = this.data.houseInfo[lastUpdateKey]
        var title = this.data.houseInfo.title;
        var name = this.data.houseInfo.name;
        console.log(No+source+lastUpdatePrice+openid+href)


        wx.request({
            url: 'https://www.peapocket.com/minipricetip',
            //url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+this.globalData.appid+'&secret='+this.globalData.secret+'&js_code='+res.code+'&grant_type=authorization_code',
            method:'POST',
            data: {
                formId:formId,
                openid: openid,
                href:href,
                No:No,
                source:source,
                registerPrice:lastUpdatePrice,
                title:title,
                name:name,
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
                    duration: 3000
                })
                console.log(v)
            }
        })

    },
    NoDetail: function (){
        wx.navigateTo({
            url: '../nodetail/nodetail'
        })
    },
    goEcharts(e){
        var item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '../echartsdetail/echartsdetail?item='+JSON.stringify(item)
        })
        console.log (item)
    },
    pickMethodsNo(){

        this.setData({
            showOrHide: true,
            pickMethodsType:true
        })
    },
    pickMethodsKeyword(){
        this.setData({
            showOrHide: false,
            pickMethodsType:false
        })
    },
    bindPickerChangeCity(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            cityindex: e.detail.value
        })
    },

    //获取用户输入的用户名
    keywordInput:function(e)
    {
        this.setData({
            keyword: e.detail.value
        })
    },
    //获取用户输入的用户名
    xqnameInput:function(e)
    {
        this.setData({
            xqname: e.detail.value
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
    formatEchartsData(jsondata){
        var arrprice = []
        for(var key in jsondata){
            if(key.substring(0,4) == 'time'){
                var objprice = {}

                var keydate = key.substring(4,key.length)
                objprice['date'] = jsondata[key]   //2019-03-01
                objprice[key] = jsondata[key]
                objprice['squarePrice'] =jsondata['squarePrice'+keydate]
                objprice['totalPrice'] =jsondata['totalPrice'+keydate]
                arrprice.push(objprice)
            }

        }
        arrprice.sort(function (a,b) {
            return new Date(a.date).getTime()-new Date(b.date).getTime()
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
        var info = {"time":dateArr,"totalprice":totalPriceArr,"squareprice":squarePriceArr}
        return info
    },
    queryPriceKeyword(e){
        console.log(this.data.xqname)
        console.log(this.data.keyword)
        if(this.data.xqname==""  || this.data.keyword==""){
            //lert("为了更加精确，请输入关键字和小区！")
            wx.showToast({
                title: '为了更加精确，请输入关键字和小区！',
                icon:'none',
                duration: 3000
            })
            return;
        }
        console.log(this.data.postArrCity[this.data.cityindex])
        wx.showLoading({
            title: '数据奔跑中...',
        })
        let that = this
        //this.echartsComponnet = this.selectComponent('#mychart');

        wx.request({
            url: 'https://www.peapocket.com/minihistoryprice',
            data: { methods:'methodsKeyword',city: this.data.postArrCity[this.data.cityindex] ,xqname:this.data.xqname,keyword:this.data.keyword},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },// 设置请求的 header
            success: function (res) {
                if (res.statusCode == 200) {
                    wx.hideLoading()
                    console.log(res.data)
                    let jsondata = res.data;
                    if(jsondata.isExist == 0){
                        wx.showToast({
                            title: '暂未收录相关信息',
                            icon:'none',
                            duration: 3000
                        })
                        return
                    }
                    that.setData({
                        houseList:res.data.infos
                    })

                   /* dateArr= info.time
                    totalPriceArr = info.totalprice
                    squarePriceArr = info.squareprice*/
                    //that.init_echarts(dateArr,totalPriceArr,squarePriceArr);//初始化图表
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
    queryPrice:function (e){
        if(this.data.houseNo=="" ){
            wx.showToast({
                title: '请您输入房源编号！',
                icon:'none',
                duration: 3000
            })
            return;
        }
        wx.showLoading({
            title: '加载中',
        })
        let that = this
        this.echartsComponnet = this.selectComponent('#mychart');

        wx.request({
            url: 'https://www.peapocket.com/minihistoryprice',
            data: { houseNo: this.data.productHref ,houseFrom:this.data.postArr[this.data.index],methods:"methodsNo"},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },// 设置请求的 header
            success: function (res) {
                if (res.statusCode == 200) {
                    wx.hideLoading()
                    //console.log(res.data)
                    let jsondata = res.data;
                    if(jsondata.isExist == 0){
                        wx.showToast({
                            title: '暂未收录相关信息',
                            icon:'none',
                            duration: 3000
                        })
                        return
                    }
                    that.setData({
                        houseInfo:jsondata
                    })

                    var info = that.formatEchartsData(jsondata);
                    var dateArr= info.time
                    var totalPriceArr = info.totalprice
                    var squarePriceArr = info.squareprice
                    //console.log(info)
                    that.init_echarts(dateArr,totalPriceArr,squarePriceArr);//初始化图表
                    that.setData({
                        priceTipView:false
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

    getOption: function (xData,yDataTotal,yDataSquare) {
        let maxTotalVal=yDataTotal[0],minTotalVal=yDataTotal[0];
        for(let i =0;i<yDataTotal.length;i++){
            if(yDataTotal[i]>maxTotalVal){
                maxTotalVal = yDataTotal[i];
            }
            if(yDataTotal[i]<minTotalVal){
                minTotalVal = yDataTotal[i];
            }
        }

        let maxSquareVal=yDataSquare[0],minSquareVal=yDataSquare[0];
        for(let i =0;i<yDataSquare.length;i++){
            if(yDataSquare[i]>maxSquareVal){
                maxSquareVal = yDataSquare[i];
            }
            if(yDataSquare[i]<minSquareVal){
                minSquareVal = yDataSquare[i];
            }
        }
        // 指定图表的配置项和数据
        let option = {
            tooltip: {
                trigger: 'axis',
                position: function (point, params, dom, rect, size) {
                    // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                    // 提示框位置
                    var x = 0; // x坐标位置
                    var y = 0; // y坐标位置

                    // 当前鼠标位置
                    var pointX = point[0];
                    var pointY = point[1];

                    // 外层div大小
                    // var viewWidth = size.viewSize[0];
                    // var viewHeight = size.viewSize[1];

                    // 提示框大小
                    var boxWidth = size.contentSize[0];
                    var boxHeight = size.contentSize[1];
// boxWidth > pointX 说明鼠标左边放不下提示框
                    if (boxWidth > pointX) {
                        x = 5;
                    } else { // 左边放的下
                        x = pointX - boxWidth;
                    }

                    // boxHeight > pointY 说明鼠标上边放不下提示框
                    if (boxHeight > pointY) {
                        y = 5;
                    } else { // 上边放得下
                        y = pointY - boxHeight;
                    }

                    return [x, y];
                },


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
                    name: '总价/万元',
                    min: Number(minTotalVal)-50,
                    max: Number(maxTotalVal)+100,
                    //interval: 50,
                    axisLabel: {
                        show:true,
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
                    min: Number(minSquareVal)-10000,
                    max: Number(maxSquareVal)+10000,
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
    onLoad(){
        console.log('hahah')
        console.log(app.globalData.userInfo)
    }


})

