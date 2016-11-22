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
$('.js_pay_crash').on('click',function(){
	pay_now();
});
function pay_now(){
  var data = {};
  data.amt = 1;
  data.openid = $('#openid').val();
  data.sub_openid = $('#syssn').val();
  data.userid = $('#userid').val();
  $.ajax({
    url: location.pathname,
    type: 'post',
    dataType: 'json',
    data: data,
    beforeSend: function(){
        $('#loading').show();
        $('.zheceng').show();
    },
    success: function(data) {
        $('#loading').hide();
        $('.zheceng').hide();
        if (data.respcd != '0000') {
            $('.alert_con').show();
		    if(!data['respmsg']){
		  	  $('.alert_con .alert_con_br').html(data['resperr']);
		    }else{
		  	  $('.alert_con .alert_con_br').html(data['respmsg']);
		    }		            
		    $('.zheceng').show();
           // WeixinJSBridge.invoke('closeWindow',{},function(res){});
        } else {
            pay(data);
        }
    },
    error:function(data) {
        $('#loading').hide();
        $('.alert_con').show();		            
		$('.zheceng').show();
		if(!data['respmsg']){
			$('.alert_con .alert_con_br').html(data['resperr']);
		}else{
			$('.alert_con .alert_con_br').html(data['respmsg']);
		}
       // WeixinJSBridge.invoke('closeWindow',{},function(res){});
    },
    complete: function(){
        $('#loading').hide();
        $('.zheceng').hide();
    }
  })
}
function pay(d){
  var p = d.data.pay_params;
  WeixinJSBridge.invoke('getBrandWCPayRequest',{
    'package':p['package'],
    'timeStamp':p['timeStamp'],
    'signType':p['signType'],
    'paySign':p['paySign'],
    'appId':p['appId'],
    'nonceStr':p['nonceStr']
  },function(res){
    if(res.err_msg == "get_brand_wcpay_request:ok"){
      $.ajax({
        url : '/trade/wechat/v1/set_result',
        data : {
          "syssn": d.data.syssn,
          "userid" : $('#userid').val()
        },
        type : 'get'
      });
      WeixinJSBridge.invoke('closeWindow',{},function(res){});
    } else if(res.err_msg == "get_brand_wcpay_request:cancel"){
    } else {
      WeixinJSBridge.invoke('closeWindow',{},function(res){});
    }
  });
}
