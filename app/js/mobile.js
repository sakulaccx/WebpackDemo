import '../css/common/global.css';
import '../css/common/flatpickr.css';
import '../css/mobile.css';

//$("#root").text("jQuery is working!");

//测试underscore
_.map($(".list_item"),function(v,i){
	$(v).text("List item " + (i+1));
});

//flatpickr
flatpickr(".flatpickr_input",{
	altInput: true,
	dateFormat: "Y-m-d",
	altFormat: "Y-m-d",
	//weekNumbers: true,//显示周数
	/*locale: { //日历上的一周从星期几开始
        firstDayOfWeek: 1
    }*/
    onChange: function(selectedDates,dateStr,instance){
    	//测试Date.js
    	$(".show_date_txt").text("What the next day for your selected is "+new _Date(dateStr).addDays(1).toString("yyyy-MM-dd"));
    }
});

//测试url
$(".url_show").text("Port of this url is: "+url("port"));

//測試IScroll
var myScroll = new IScroll(".iscroll_obj",{
	mouseWheel: true, //鼠标滚轮，移动端不需要，测试用
    scrollbars: true,
    disableMouse: true, //移动端不需要监听鼠标事件
    disablePointer: true, //移动端不需要监听指针
    tap: true //移动端要打开tap事件监听
});

//测试template
$(".content").append(template("test",{data:"Arttemplate test"}));