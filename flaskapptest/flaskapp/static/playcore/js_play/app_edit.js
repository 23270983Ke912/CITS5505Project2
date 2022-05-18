var $ = jQuery.noConflict();
var loaddata_clrs = [['b','b','r','r','b','b'],['y','y','b','b','y','y'],['p','p','y','y','p','p'],['g','g','r','r','g','g'],['r','r','b','b','r','r']];

var dim_x = 6; //盤面x顆數
var dim_y = 5; //盤面y顆數
var tile_w = 60; //每塊寬px
var tile_h = 80; //每塊高px
var tile_b = 1; //每塊框線px

var selectid
var submitedit = new Array();


//隨機挑色
var pickRandColor = function(){
    var r = Math.floor(myrng()*def_clrs.length);
    return def_clrs[r];
}       
var loadColor = function(i,j){
    return loaddata_clrs[i][j];
}

//初始化盤面
var init = function(){
    $(".tile").removeClass("endblur")
    //盤面大小
    $('.demo').css('width', dim_x*tile_w).css('height', dim_y*tile_h);
    //產生珠子並指定位置、顏色
    for(i=0; i<dim_y; i++){
        for(j=0; j<dim_x; j++){
            //var clr = pickRandColor();
            var clr = loadColor(i,j);
            $('.demo').append('<div id="'+j+'-'+i+'" data-clr="'+clr+'" class="'+clr+' tile" style="left:'+j*tile_w+'px; top:'+i*tile_h+'px;" onclick="selectDiv(this)" ></div>');
        }
    }

    //設定所有珠子的尺寸及框線
    $('.tile').css('width', tile_w-tile_b*2);
    $('.tile').css('height', tile_h-tile_b*2);
    $('.tile').css('border', tile_b+'px solid #333');
    combo_cnt=0;
    score=0;
}
function selectDiv(e) {
    $('.tile').removeClass('sel')
    $(e).addClass('sel');
    selectid=e.id;
  }
$(function() {
    init();
    $('.tile_edit').css('width', tile_w-tile_b*2);
    $('.tile_edit').css('height', tile_h-tile_b*2);
    $('.tile_edit').css('border', tile_b+'px solid #333');
});

$('.tile_edit').click(function() {
    $('#'+selectid).removeClass('r g b p y gone');
    $('#'+selectid).attr('data-clr',this.id)
    $('#'+selectid).addClass(this.id);
  });

  function submit() {
    submitedit=new Array();
    for (  y = 0; y < dim_y; y++) {
        var xrow= new Array();
        for ( x = 0; x < dim_x; x++) {
            xrow.push("'"+$('#'+x+'-'+y).attr('data-clr')+"'");
        }
        submitedit.push('['+xrow+']');
    }
    alert('['+submitedit+']')
  };
