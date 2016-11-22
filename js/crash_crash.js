//关闭弹框
$('.js_alert_con_close').on('click',function(){
    $('.alert_con').hide();
    $('.alert_con .alert_con_br').html();
    $('.zheceng').hide();
});
function hideMenu() {
  WeixinJSBridge.call('hideOptionMenu');
  WeixinJSBridge.call('hideToolbar');
}
if (typeof WeixinJSBridge == "undefined") {
  if ( document.addEventListener ) {
    document.addEventListener('WeixinJSBridgeReady', hideMenu, false);
  } else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', hideMenu);
    document.attachEvent('onWeixinJSBridgeReady', hideMenu);
  }
} else {
  hideMenu();
}
//刮刮卡----------------------------------------------------------------------------------------
$(document).ready(function(){
    var bodyStyle = document.body.style;
    bodyStyle.mozUserSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    //guaguaka();
});
function guaguaka(){
    // var can_width=$('.guaguaka').width();
    // var can_height=$('.guaguaka').height();
    //$('#myCanvas').css({'width':can_width,'height':can_height});
    var myCanvas = document.getElementById('myCanvas');
    myCanvas.width=myCanvas.clientWidth;
    myCanvas.height=myCanvas.clientHeight;
    var can_width=myCanvas.clientWidth;
    var can_height=myCanvas.clientHeight;
    var gray = myCanvas.getContext('2d');
    gray.beginPath();
    gray.fillStyle = "#999";
    gray.fillRect(0,0,can_width,can_height); 
    var image = new Image();
    image.src = "img/crash_gua.png";  
    image.onload = function () {
        var ptrn = gray.createPattern(image, 'repeat');
        gray.fillStyle = ptrn;
        gray.fillRect(0,0,can_width,can_height);
    } 
    gray.closePath();

    myCanvas.addEventListener('touchstart', function (e) {
        myCanvas.addEventListener('touchmove', function(e){  
            // if(e.changedTouches){
            //     e=e.changedTouches[e.changedTouches.length-1];
            // }
            // var topY = document.getElementById("guaguaka").offsetTop;
            // var oX = c1.offsetLeft,
            // oY = c1.offsetTop+topY;
            // var x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
            // y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0; 
            //console.log(e);    
            gray.clearRect(e.targetTouches[0].clientX, e.targetTouches[0].clientY, 60,60);
        });
        myCanvas.addEventListener('touchend', function (e) {     
            $('.js_gua_button').show();
            $('#myCanvas').hide();
        });
    });    
}
var c1; //画布
var ctx; //画笔
var ismousedown; //标志用户是否按下鼠标或开始触摸
var isOk=0; //标志用户是否已经刮开了一半以上
var fontem = parseInt(window.getComputedStyle(document.documentElement, null)["font-size"]);//这是为了不同分辨率上配合@media自动调节刮的宽度
//页面加载后开始初始化画布（这样子就可以在页面创建一个画布了）
window.onload = function(){ 
    c1 = document.getElementById("myCanvas");
    //这里很关键，canvas自带两个属性width、height,我理解为画布的分辨率，跟style中的width、height意义不同。
    //最好设置成跟画布在页面中的实际大小一样
    //不然canvas中的坐标跟鼠标的坐标无法匹配
    c1.width=c1.clientWidth;
    c1.height=c1.clientHeight;
    ctx = c1.getContext("2d");
    //PC端的处理
    c1.addEventListener("mousemove",eventMove,false);
    c1.addEventListener("mousedown",eventDown,false);
    c1.addEventListener("mouseup",eventUp,false);
    //移动端的处理
    c1.addEventListener('touchstart', eventDown,false);
    c1.addEventListener('touchend', eventUp,false);
    c1.addEventListener('touchmove', eventMove,false);
    //初始化
    initCanvas();
} 
//画灰色的矩形铺满
function initCanvas(){//网上的做法是给canvas设置一张背景图片，我这里的做法是直接在canvas下面另外放了个div
     //c1.style.backgroundImage="url(中奖图片.jpg)";
     var image = new Image();
     image.src = "img/crash_gua.png";
     ctx.globalCompositeOperation = "source-over";
     ctx.fillStyle = '#CFD2D4';
     ctx.fillRect(0,0,c1.clientWidth,c1.clientHeight);
     ctx.fill();
     ctx.font = "italic 0.5rem Arial";
     ctx.textAlign = "center";
     ctx.fillStyle = "#c2c2c2";
     var c1width=c1.clientWidth*2;
     var c1height=c1.clientHeight*2; 
     for(var i=0;i<8;i++){
      for(var j=0;j<10;j++){
        ctx.fillText("好近",(c1width/10)*j,(c1height/8)*i);
      }
     }
     //ctx.fillText("好近",c1.width/2,50);
     //把这个属性设为这个就可以做出圆形橡皮擦的效果
     //有些老的手机自带浏览器不支持destination-out,下面的代码中有修复的方法
     ctx.globalCompositeOperation = 'destination-out';
}
 
//鼠标按下 和 触摸开始
function eventDown(e){
    e.preventDefault();
    ismousedown=true;
}
//鼠标抬起 和 触摸结束
function eventUp(e){
    e.preventDefault();
    //得到canvas的全部数据
    var a = ctx.getImageData(0,0,c1.width,c1.height);
    // console.log(a.data);
    // console.log(a.data.length);
    var j=0;
    for(var i=3;i<a.data.length;i+=4){
        if(a.data[i]==0)j++;
    }
    //当被刮开的区域等于一半时，则可以开始处理结果
    if(j>=a.data.length/8){
        isOk = 1;
        //console.log(j);
        $('.js_gua_button').show();
        $('#myCanvas').hide();
        //alert();
    }
    ismousedown=false;
}
//鼠标移动 和 触摸移动
function eventMove(e){
     e.preventDefault();
     if(ismousedown) {
         if(e.changedTouches){
             e=e.changedTouches[e.changedTouches.length-1];
         }
         var topY = document.getElementById("guaguaka").offsetTop;
         var oX = c1.offsetLeft,
         oY = c1.offsetTop+topY;
         var x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
         y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0;

         //画360度的弧线，就是一个圆，因为设置了ctx.globalCompositeOperation = 'destination-out';
         //画出来是透明的
         ctx.beginPath();
         ctx.arc(x, y, fontem*1.2, 0, Math.PI * 2,true);

         //下面3行代码是为了修复部分手机浏览器不支持destination-out
         c1.style.display = 'none';
         c1.offsetHeight;
         c1.style.display = 'inherit'; 
         ctx.fill();
     }
     if(isOk){    
        
     }
}
