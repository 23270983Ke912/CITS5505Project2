var $ = jQuery.noConflict();
var loaddata_clrs = [['b','b','r','r','b','b'],['y','y','b','b','y','y'],['p','p','y','y','p','p'],['g','g','r','r','g','g'],['r','r','b','b','r','r']];

var dim_x = 6; 
var dim_y = 5; 
var tile_w = 60; 
var tile_h = 60; 
var tile_b = 1; 

var selectid


      
var loadColor = function(i,j){
    return loaddata_clrs[i][j];
}
function To2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date = new Date()) {
    return [
      date.getFullYear(),
      To2Digits(date.getMonth() + 1),
      To2Digits(date.getDate()),
    ].join('-');
  }

//init board
var init = function(){
    document.getElementById('datepicker').value= formatDate()
    
    var params = location.href.split('?')[1];
    userId = params.split('=')[1]


    $(".tile").removeClass("endblur")

    $('.demoedit').css('width', dim_x*tile_w).css('height', dim_y*tile_h);

    for(i=0; i<dim_y; i++){
        for(j=0; j<dim_x; j++){
            var clr = loadColor(i,j);
            $('.demoedit').append('<div id="'+j+'-'+i+'" data-clr="'+clr+'" class="'+clr+' tile" style="left:'+j*tile_w+'px; top:'+i*tile_h+'px;" onclick="selectDiv(this)" ></div>');
        }
    }


    $('.tile').css('width', tile_w-tile_b*2);
    $('.tile').css('height', tile_h-tile_b*2);
    $('.tile').css('border', tile_b+'px solid #333');
    combo_cnt=0;
    score=0;
}
function selectDiv(e) {
    $('.tile').removeClass('sel')
    $(e).addClass('sel');
    $('.tile_edit').addClass('tile_edit_sel')
    selectid=e.id;
  }
$(function() {
    init();
    $('.tile_edit').css('width', tile_w-tile_b*2);
    $('.tile_edit').css('height', tile_h-tile_b*2);
    $('.tile_edit').css('border', tile_b+'px solid #333');
});

$('.tile_edit').click(function() {
    $('.tile_edit').removeClass('tile_edit_sel')
    $('#'+selectid).removeClass('r g b p y gone');
    $('#'+selectid).attr('data-clr',this.id)
    $('#'+selectid).addClass(this.id);
    
  });

  function submit() {
    console.log(document.getElementById('datepicker').value)
    var submitedit="";
    for (  y = 0; y < dim_y; y++) {
        var xrow= new Array();
        for ( x = 0; x < dim_x; x++) {
            submitedit+="'"+$('#'+x+'-'+y).attr('data-clr')+"',";
        }
            
    }
    var jsondata = JSON.stringify({
        puzzle: submitedit.substring(0, submitedit.length - 1),
        creator_id: userId,
        puzzledate:document.getElementById('datepicker').value
    });
    $.ajax({
        url: "/editAdd",
        method: "POST",        
        data: {json: jsondata},
        contentType: "application/json",
        success: function(data){
            console.log("Success");
            alert("Puzzle created");
        },
        error: function(errMsg) {
            if(errMsg.status==405){
                alert("Puzzle for this day is already created");
            }
            console.log(errMsg.status)
        }
    });
  };
