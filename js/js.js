	  
$(document).ready(function() {  

	$('.cards_wrap').mouseleave(function () {
		var id = this.id;
		$('#'+id+' .cards').each(function () {
          $(this).stop(1,0).animate({bottom: '0px'}, 400)
          $(this).removeClass('active_slide');
		});
	});

//*********************************\\
// Adjust the Card Elements on Load \\
//***********************************\\

$(".cards_wrap").each(function () {
var abc = 0 + 1;
var w = parseInt($(this).css('width'))/parseInt($(this).children().length);
var margin = parseInt($(this).children('.cards').css('margin-left'));
var padding = parseInt($(this).children('.cards').css('padding-left'))*2;


// Some Safari Bug
var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}

window.is_safari = is_safari;

if (window.is_safari)
{
var margin = parseInt($(this).css('width'))*-.05;
 
 if ($(this).hasClass('wide-margin'))
  {
  var margin = parseInt($(this).css('width'))*-.12;
  }

}


var m = margin * 2 * (parseInt($(this).children().length));
var m = (- m + margin)/parseInt($(this).children().length);
var w = w + m - padding - 2;

if (parseInt(w)==0) { var w = {'width': 'auto'}; }
var w = {'width': w+'px'};
var id = $(this).attr("id");
$("#"+id+" .cards").css(w);

var hg = $(this).children('.cards').css('height');

if ($(this).hasClass('grayscale-images'))
{
	$(this).children('.cards').children('img').addClass('grayscale')
	$(this).children('.cards').children('a').children('img').addClass('grayscale')
}
});

   
//*************\\
// Card Effects \\
//***************\\
$('.cards').mouseenter(function () {

	if ($(this).hasClass('active_slide'))
	{
		return false;
	}
		
	var h_scale = parseInt($(this).css('height'))*parseInt($(this).css('width'));
	var h_scale = Math.sqrt(h_scale)*.09;
	
	if ($(this).parent('.cards_wrap').hasClass('no-bounce'))
	{
	h_scale = 0;
	}

	var w_card = parseInt($(this).css('width'));
	var m_card = parseInt($(this).css('margin-left'));
	if (window.is_safari)
	{
		var m_card = parseInt($(this).parent('.cards_wrap').css('width'))*-.05;

		if ($(this).parent('.cards_wrap').hasClass('wide-margin'))
		{
			var m_card = parseInt($(this).parent('.cards_wrap').css('width'))*-.12;
		}

	}

	var hovered = $(this).attr("id").split('_');
	var id2 = $(this).attr("id");
	var nos = $(this).parent('.cards_wrap').children('li').length;

	var nos2 = nos / 2;
	
	if (hovered[1]<=nos2) { var main_b = nos - parseInt(hovered[1]) ; } 
	                 else { var main_b = parseInt(hovered[1]) - 1; }
	
	$(this).animate({'bottom':h_scale*main_b+'px', 'z-index':'20','-ms-filter':'"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)"','filter':'alpha(opacity=100)','-moz-opacity':'1','-khtml-opacity':'1','opacity':'1'},400)
	var wrapper = $(this).parent('.cards_wrap').attr("id");
		   
				
	var i = hovered[1];
	var j = hovered[1];


	var a = 1;
	while (i<=nos)
	{
	  i++;
	  scale1 = main_b - a;
      var id = hovered[0]+"_"+i;
	  var b = 1 + a*.2;

	  var anim = new Object();
	  anim.right = '-'+Math.abs(m_card)*1.5*b+'px';

	  var anim2 = new Object();
	  anim2.right = '0px';
	  anim2.bottom = h_scale*scale1+'px';

	  scale1--;
	  var z = 20 - a;
	  stack (id,id2,anim,anim2,z,wrapper);
	  a++;
	}
	

	var a = 1;
	while (j>1)
	{
	  j--;
	  scale2 = main_b - a;
      var id = hovered[0]+"_"+j;
	  var b = 1 + a*.2;

	  var anim = new Object();
	  anim.right = Math.abs(m_card)*1.5*b+'px';

	  var anim2 = new Object();
	  anim2.right = '0px';
	  anim2.bottom = h_scale*scale2+'px';

	  scale2--;
	  var z = 20 - a;
	  stack (id,id2,anim,anim2,z,wrapper);
	  a++;
	}
   
   });

$('.cards').mouseleave(function () {
	  $(this).animate({
      }, 400);
});

});

function stack(id,hovered,anim,anim2,z,wrapper)
{
	 // GrayScale Image Effects
	 if ($("#"+wrapper).hasClass('grayscale-images'))
	 {
	 $("#"+wrapper+" #"+id).children('img').addClass('grayscale');
     $("#"+wrapper+" #"+hovered).children('img').removeClass('grayscale');
	 $("#"+wrapper+" #"+id+" a").children('img').addClass('grayscale');
     $("#"+wrapper+" #"+hovered+" a").children('img').removeClass('grayscale');
	 }

	 // Add a Class to the Hovered Element
	 $("#"+wrapper+" #"+id).removeClass('active_slide');
     $("#"+wrapper+" #"+hovered).addClass('active_slide');


     // First Animation
     $("#"+wrapper+" #"+id).stop(1,0).animate(anim, 320, function() {
	  $("#"+wrapper+" #"+id).css('z-index',z);


	  // Trigger Captions / Social Icons  
	  $("#"+wrapper+" #"+id+" .caption_right").fadeOut();
	  $("#"+wrapper+" #"+hovered+" .caption_right").fadeIn();
	  
	  $("#"+wrapper+" #"+id+" .caption_right_2").fadeOut();
	  $("#"+wrapper+" #"+hovered+" .caption_right_2").fadeIn();

	  $("#"+wrapper+" #"+id+" .social_base").fadeOut();
	  $("#"+wrapper+" #"+hovered+" .social_base").fadeIn();

	 // Second Animation
	 $("#"+wrapper+" #"+id).animate(anim2, 320);
     $("#"+wrapper+" #"+hovered).css('z-index','20');
	});
	
}