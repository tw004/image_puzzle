$(function(){
	//init background
	$('body').css("background-color","#F2F5A9");

	//init parameter
	var blockWidth = 100;
	var blockHeight = 100;
	var numBlockRow = 0;
	var numBlockCol = 0;
	var index_table = {};

	//init method
	function initImages(width, height) {
		$('#plane').css('width',width);
		$('#plane').css('height',height);
		generateTable(blockWidth,blockHeight,width,height);
	}

	//init framwork
	var img = $('<img>');
	img.attr('src', 'src/source.jpg');
	img.load(function() {
		alert(this.width+'x'+ this.height);
		updateBlockVariables(this.width,this.height);
		initImages(this.width, this.height);
	});

	//function announce
	function setBlockPosition($block, col, row) {
		var x = col * blockWidth, y = row * blockHeight;
		var offset = $('#plane').offset();
		$block.css({left: x + offset.left, top: y + offset.top});
	}

	function generateTable(){
		for(var row=0;row<numBlockRow;row++){
			for(var col=0;col<numBlockCol;col++){
				var $block = $('<div class="block"></div>');
				var x = col*blockWidth;
				var y = row*blockHeight;
				$block.css({
						"width":blockWidth+"px",
						"height":blockHeight+"px",
						"background-image":"url('src/source.jpg')",
						"background-position":(-x)+"px "+(-y)+"px" 
				});
				setBlockPosition($block, col, row);
				$('#plane').append($block);
				var index = row * numBlockCol + col;
				$block.data('index',index);
				index_table[index]=$block;
			}
		}
		index_table[numBlockCol*numBlockRow -1].hide();
	}


	function updateBlockVariables(width,height){
		numBlockCol = Math.floor(width/blockWidth);
		blockWidth = Math.floor(width/numBlockCol);
		numBlockRow= Math.floor(height/blockHeight);
		blockHeight = Math.floor(height/numBlockRow);
	}
});
