
	var picBox = document.getElementById('container');
	var message = document.getElementById('msg');
	var pics = document.querySelectorAll('.pic');
	var btn = document.getElementById('btn');
	//click the button to start this game
	btn.addEventListener('touchstart',function(){
		//messge not show for now
		message.style.display="none";
		//show the 12 pieces of the picture
		for(var i=0;i<pics.length;i++){
			pics[i].style.display = "block";
		}
		//change the container's background as "#fff" to cover the original background 
		picBox.style.background = "#fff";
		//randomly change the order of the 12 pieces of the pictures
		for(var i = 0;i<15;i++){
			//randomly get two numbers:a,b
			var a=Math.floor(Math.random()*12);
			var b=Math.floor(Math.random()*12);
			if(a != b){
				//if a!=b, pics[a] will change the position with pics[b];
				var tempL = pics[a].style.left;
				var tempT = pics[a].style.top;
				var tempIndex = pics[a].getAttribute('data-index');
				//change the left and top 
				pics[a].style.left = pics[b].style.left;
				pics[a].style.top = pics[b].style.top;
				//change the index number
				pics[a].setAttribute('data-index',pics[b].getAttribute('data-index'));
				pics[b].style.left = tempL;
				pics[b].style.top = tempT;
				pics[b].setAttribute('data-index',tempIndex);
			}
		}



	})
	
	//add event to each piece so that to move and change the pieces
	for(var i=0;i<pics.length;i++){
		var dx,dy;
		
		pics[i].addEventListener('touchstart',function(e){
			//stop the default event
			e.preventDefault();
			e.stopPropagation();
			//each time before move the piece, need to cancel transition effect
			this.style.transition = "none";
			//change the index to big number so that when moving this piece, it will show on the top
			this.style.zIndex = 100;
			//save the initial left and top value, index number before moving
			this.iniLeft = this.style.left;
			this.iniTop = this.style.top;
			this.iniIndex = this.getAttribute('data-index');
			//get the distance between the touch point and the left/top of that piece
			dx = e.targetTouches[0].pageX - this.offsetLeft;
			dy = e.targetTouches[0].pageY - this.offsetTop
		})
		pics[i].addEventListener('touchmove',function(e){
			//move the piece based on the new touch point
			//the newX/newY is the new left/top value of the piece so that the piece is moving with the touch point 
			var newX = e.targetTouches[0].pageX - dx;
			var newY = e.targetTouches[0].pageY - dy;
			this.style.left = newX +"px";
			this.style.top = newY +"px";
		})
		pics[i].addEventListener('touchend',function(e){
			//change the index back to small number
			this.style.zIndex = 0;
			//get the touch point's position relative to the parent container
			var nowX = e.changedTouches[0].pageX-picBox.offsetLeft;
			var nowY = e.changedTouches[0].pageY - picBox.offsetTop;
			//e.target=the moving piece

			var t = getEle(e.target,nowX,nowY);
			//if the moving piece(e.target) is not moved to other piece(t)'s place 
			if(t==e.target){
				//put the piece back to it's own position
				//this.iniLeft is saved when starting to move
				t.style.left = this.iniLeft;
				t.style.top = this.iniTop;
				//add transition effect
				t.style.transition = "all 0.5s";
			}else{
				t.style.transition = "all 0.5s";
				e.target.transition = "all 0.5s";
				//if the moving piece(e.target) is moved to other piece(t)'s place
				//change their positions and index numbers
				var tempL = t.style.left;
				var tempT = t.style.top;
				var tempIndex = t.getAttribute('data-index');
				t.style.left = this.iniLeft;
				t.style.top = this.iniTop;
				t.setAttribute('data-index',this.iniIndex);
				e.target.style.left = tempL;
				e.target.style.top = tempT;
				e.target.setAttribute('data-index',tempIndex);

			}
			//when finishing the puzzle, show the message
			if(isSuccess(pics)){
				message.style.display="block";
				//hide the 12 pieces
				for(var i=0;i<pics.length;i++){
					pics[i].style.display = "none";
				}
				//show the parent container's background picture
				picBox.style.background = 'url("img/2.jpg")';
				// message.style.transition = "all 5s";
				// message.style.left = "300px";
			}

		})
	}
	//check if the piece is moved to other pieces position
	function getEle(ele,nowX,nowY){
		for(var i = 0; i<pics.length;i++){
			//if the moving piece is not itself
			if(ele != pics[i]){
				//get each piece's position
				var left = parseInt(pics[i].offsetLeft);
				var top = parseInt(pics[i].offsetTop);
				//check which piece's position the current touch point is in
				//pics[i].left < touch point's left < pics[i].left + 100
				if(nowX>left&&nowX<left+100){
					if(nowY>top&&nowY<top+100){
						//if it's in pics[i] area, return pics[i]
						return pics[i];
					}
				}
			}
		}
		//return itself
		return ele;
	}
	//check the order of index number and decided if the puzzle is finished
	function isSuccess(pics){
		var str="";
		//add each index number to str
		for(var i=0; i<pics.length;i++){
			str += pics[i].getAttribute('data-index');
		}
		//the correct order is 1 to 12
		if(str=="123456789101112"){
			return true;
		}else{
			return false;
		}

	}
