var $ = jQuery.noConflict();
var loaddata_clrs = [['b','b','r','r','b','b'],['y','y','b','b','y','y'],['p','p','y','y','p','p'],['g','g','r','r','g','g'],['r','r','b','b','r','r']];

var def_clrs = ['r','g','b','p','p','p','p','y']; //紅,綠,藍,紫,黃
var dim_x = 6; //盤面x顆數
var dim_y = 5; //盤面y顆數
var tile_w = 60; //每塊寬px
var tile_h = 80; //每塊高px
var tile_b = 1; //每塊框線px

var sky_speed = 800; // 天降珠的速度
var grav_speed = 800; // 自然落珠的速度
var move_speed = 160; // 移動珠子的速度
var gone_speed = 300; // 珠子消除的速度
var myrng = new Math.seedrandom('cits');
var combo_cnt;
var score;
var moveHistory = new Array();



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
    alert( e.id);
    $(e).addClass('sel');
  }
$(function() {
    init();
    $('.tile_edit').css('width', tile_w-tile_b*2);
    $('.tile_edit').css('height', tile_h-tile_b*2);
    $('.tile_edit').css('border', tile_b+'px solid #333');
});
$('.tile').click(function() {
    alert( this.id);
  });

$('.tile_edit').click(function() {
    alert( this.id);
  });

