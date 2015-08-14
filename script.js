$(function(){
	//init background

	//init parameter
	var blockWidth = 150;
	var blockHeight = 150;
	var numBlockRow = 0;
	var numBlockCol = 0;
	var index_table = {};
	var randomIter = 100;
	var animate_duration = 150;
	var animate_counter = 0;
	var complete = false;
	var step = 0;

	//init method
	function initImages(width, height) {
		$('#plane').css('width',width);
		$('#plane').css('height',height);
		$('#answer_view').css('width', width);
		$('#answer_view').css('height', height);
		$('#container').css('height', height);
		generateTable(blockWidth,blockHeight,width,height);
	}

	//init framwork
	var img = $('<img>');
	img.attr('src', 'src/source.jpg');
	$('#end_message').hide();
	$('#answer_view').append(img);
	//end image load here
	var endImage = $('<img>');
	endImage.attr('src', 'src/end_img.png');
	endImage.hide();
	$('#end_animate').append(endImage);
	img.load(function() {
		// resources loaded, now initialize the board
		updateBlockVariables(this.width,this.height);
		initImages(this.width, this.height);
		scramblePlane();
		$(document).keydown(onKeyDown);
		updateView();
		bgmPlaying();
	});

	//setSlideSound
	var slide = new buzz.sound("src/sound/slide",{formats:["ogg"]});	
	slide.setVolume(5);

	//function announce
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//setEndingSound
	var endSound = new buzz.sound("src/sound/chitoge_saigodesita",{formats:["ogg"]});
	endSound.setVolume(70);

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
			$block.animate({left: left, top: top}, {
				duration: duration,
				always: function() {
					animate_counter--;
				}
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

	function isComplete(){
		for(var i=0;i<numBlockCol*numBlockRow;i++){
			if(i!=index_table[i].data('index'))
				return false;
		}
		return true;
	}

	function onComplete(){
		var index = getEmptyBlockPosition();
		index_table[index].finish().show();
	}

	function updateView() {
		$('#count').text(step);
	}

	//keyboard control
	function moveEmptyBlock(drow, dcol, duration) {
		var index = getEmptyBlockPosition();
		var row = Math.floor(index / numBlockCol);
		var col = index % numBlockCol;
		var newRow = row + drow;
		var newCol = col + dcol;
		if (newRow<numBlockRow && newRow>=0 && newCol<numBlockCol && newCol>=0) {
			//var newIndex = newRow * numBlockCol + newCol;
			swapBlock(row , col , newRow , newCol, duration);
			return true;
		}
		return false;
	}

	function move_right(duration){
		return moveEmptyBlock(0, -1, duration);
	}

	function move_up(duration){
		return moveEmptyBlock(1, 0, duration);
	}

	function move_down(duration){
		return moveEmptyBlock(-1, 0, duration);
	}

	function move_left(duration){
		return moveEmptyBlock(0, 1, duration);
	}

	function isArrowKeys(keyCode) {
		return [38, 40, 37, 39].indexOf(keyCode) != -1;
	}

	function onKeyDown(event) {
		// prevent scrolling when an arrow key is pressed
		if (isArrowKeys(event.which)&&complete==0)
			event.preventDefault();
		if(animate_counter>=2) return;
		if(complete) return;
		var moved = false;
		switch (event.which) {
			case 38: //Up arrow
				moved = move_up(animate_duration); break;
			case 40: //Down arrow
				moved = move_down(animate_duration); break;
			case 37: //Left arrow
				moved = move_left(animate_duration); break;
			case 39: //Right arrow
				moved = move_right(animate_duration); break;
			default: return;
		}
		if (moved) {
			step++;
			updateView();
			slideSoundStop();
			slideSoundStart();
			if(isComplete()){
				complete = true;
				onComplete();
				endingAnimation();
			}
		}
	};

	function endingAnimation(){
			$(endImage).show();
			$('#end_text').hide();
			$('#end_animate').animate({'margin-top': '-=500px'}, 800,function(){
				endSoundStart();
				$('#end_animate').animate({'margin-top':'+=20px'},200,function(){
				endingText();
				});
			});
	}

	function endingText(){
		$('#end_text').attr('src','src/congrats.png');
		$('#end_text').slideDown();
		setTimeout(function(){
				endMessage();
		},800);
	}

	function bgmPlaying(){
		var myBGM = new buzz.sound("src/sound/chitoge_bgm",{
			formats:["ogg","mp3"]});	
		var volume = 0;
		$('#booster').attr('src','src/volume_off.png');
		myBGM.setVolume(volume);
		myBGM.play().loop();
		//volume button
		$('#booster').click(function(){		
			if(volume==50){
				volume=30;
				myBGM.setVolume(volume);
				$('#booster').attr('src','src/volume_mid.png');
			}else if(volume==30){
				volume=0;
				myBGM.setVolume(volume);
				$('#booster').attr('src','src/volume_off.png');
			}else{
				volume=50;
				myBGM.setVolume(volume);
				$('#booster').attr('src','src/volume_on.png');
			}
				});
	}

	function endMessage(){
		$('#end_message').slideDown();
		}
	//yes no button
	$('#yes').click(function(){
			$('#end_message').hide();
			index_table[numBlockCol*numBlockRow -1].hide();
			step=0;
			updateView();
			scramblePlane();
			complete=false;
			$('#end_animate').animate({'margin-top': '600px'}, 500);
			});
	$('#no').click(function(){
			$('#end_message').slideUp();
			});

	function slideSoundStart(){
		slide.play();
	}

	function slideSoundStop(){
		slide.stop();
	}

	function endSoundStart(){
		//endSound.play();
	}

});
