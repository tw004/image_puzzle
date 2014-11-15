$(function(){
	//init background
	$('body').css("background-color","#F2F5A9");

	//init parameter
	var blockWidth = 150;
	var blockHeight = 150;
	var numBlockRow = 0;
	var numBlockCol = 0;
	var index_table = {};
	var randomIter = 100;
	var animate_duration = 150;
	var animate_counter = 0;

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
		scramblePlane();
	});

	//function announce
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function scramblePlane(){
		for(var i=0;i<randomIter;i++){
			var movement = getRandomInt(0,3);	
			switch(movement){
				case 0://up
					move_up();break;
				case 1: //down
					move_down();break;
				case 2: //right
					move_right();break;
				case 3: //left
					move_left();break;
			}
		}
	}

	function setBlockPosition($block, row , col, duration) {
		var x = col * blockWidth, y = row * blockHeight;
		var offset = $('#plane').offset();
		var left = x + offset.left, top = y + offset.top;
		if (duration) { // animation
			animate_counter++;
			$block.animate({left: left, top: top}, duration, function() {
				animate_counter--;
			});
		} else { // no animation
			$block.css({left: left, top: top});
		}
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

	function swapBlock(row_A , col_A , row_B , col_B, duration){
		var in_A = getIndex(row_A , col_A);
		var in_B = getIndex(row_B , col_B);
		var $block1 = index_table[in_A];
		var $block2 = index_table[in_B];
		var tmp = index_table[in_A];
		index_table[in_A] = index_table[in_B];
		index_table[in_B]=tmp;
		setBlockPosition($block1 , row_B , col_B, duration);
		setBlockPosition($block2 , row_A , col_A, duration);
	}

	function getIndex(row , col){
		return row * numBlockCol + col;
	}

	//keyboard control
	function moveEmptyBlock(drow, dcol, duration) {
		if(animate_counter>=2) return;
		var index = getEmptyBlockPosition();
		var row = Math.floor(index / numBlockCol);
		var col = index % numBlockCol;
		var newRow = row + drow;
		var newCol = col + dcol;
		if (newRow<numBlockRow && newRow>=0 && newCol<numBlockCol && newCol>=0) {
			//var newIndex = newRow * numBlockCol + newCol;
			swapBlock(row , col , newRow , newCol, duration);
		}
	}

	function move_right(duration){
		moveEmptyBlock(0, -1, duration);
	}

	function move_up(duration){
		moveEmptyBlock(1, 0, duration);
	}

	function move_down(duration){
		moveEmptyBlock(-1, 0, duration);
	}

	function move_left(duration){
		moveEmptyBlock(0, 1, duration);
	}

	$('body').keydown(function(event) {
		switch (event.which) {
			case 38: //Up arrow
				move_up(animate_duration); break;
			case 40: //Down arrow
				move_down(animate_duration); break;
			case 37: //Left arrow
				move_left(animate_duration); break;
			case 39: //Right arrow
				move_right(animate_duration); break;
		}
	});
});
