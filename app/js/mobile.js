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
});

//测试url
$(".url_show").text("Port of this url is: "+url("port"));

//測試IScroll
var myScroll = new IScroll(".iscroll_obj",{
	mouseWheel: true,
    scrollbars: true
});