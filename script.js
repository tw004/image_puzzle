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
	function setBlockPosition($block, row , col) {
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
				setBlockPosition($block,row,col);
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

	function getEmptyBlockPosition(){
		var total_length = numBlockRow * numBlockCol;
		for(var index=0;index<total_length;index++){
			if(index_table[index].data('index')==(total_length-1)){
				return index;
			}
		}
		alert("getEmptyBlockPosition error");
	}

	function swapBlock(row_A , col_A , row_B , col_B){
		var in_A = getIndex(row_A , col_A);
		var in_B = getIndex(row_B , col_B);
		var $block1 = index_table[in_A];
		var $block2 = index_table[in_B];
		var tmp = index_table[in_A];
		index_table[in_A] = index_table[in_B];
		index_table[in_B]=tmp;
		setBlockPosition($block1 , row_B , col_B);
		setBlockPosition($block2 , row_A , col_A);
	}

	function getIndex(row , col){
		return row * numBlockCol + col;
	}

	//keyboard control
	function moveEmptyBlock(drow, dcol) {
		var index = getEmptyBlockPosition();
		var row = Math.floor(index / numBlockCol);
		var col = index % numBlockCol;
		var newRow = row + drow;
		var newCol = col + dcol;
		if (newRow<numBlockRow && newRow>=0 && newCol<numBlockCol && newCol>=0) {
			//var newIndex = newRow * numBlockCol + newCol;
			swapBlock(row , col , newRow , newCol);
		}
	}

	function move_right(){
		moveEmptyBlock(0, -1);
	}

	function move_up(){
		moveEmptyBlock(1, 0);
	}

	function move_down(){
		moveEmptyBlock(-1, 0);
	}

	function move_left(){
		moveEmptyBlock(0, 1);
	}
	$('body').keydown(function(event) {
		switch (event.which) {
			case 38: //Up arrow
				move_up(); break;
			case 40: //Down arrow
				move_down(); break;
			case 37: //Left arrow
				move_left(); break;
			case 39: //Right arrow
				move_right(); break;
		}
	});
});
