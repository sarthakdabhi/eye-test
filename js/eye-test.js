(function() {

	function flanker()
	{

		this.element = document.getElementById('hammer');
		this.totalHeight = window.innerHeight;
		this.arrowHeight = 64;
		this.arrowWidth = 64;
		this.changeTime = 6; // total times to changes middle arrow
		this.allArrowDirection = [360, 90, 180, 270]; 
		this.midArrowDirection = [360, 90, 180, 270];
		this.middleArrowDir = [];
		this.inWord = {
			360: 'UP',
			90: 'RIGHT',
			180: 'DOWN',
			270: 'LEFT'
		};
		this.swipeDir = [];
		this.trueCount = 0;
		this.allArrowDir = ['UP'];
		this.newMiddleArrowDir = [];
		this.nocc = 0; // number of correct congruent
		this.noic = 0; // number of incorrect congruent
		this.noci = 0; // number of correct incongruent
		this.noii = 0; // number of incorrect incongruent
		this.trackTime = [];
		this.timeInc = 0;

		this.init = function() {
			this.element.style.height = this.totalHeight + 'px';
			this.loadScreen(1);
		}

		this.loadScreen = function(screenNo) {
			$('.screens').hide();
			$('#screen-' + screenNo).show();

			switch(screenNo) {
				case 1:
					this.splashScreen();
					break;
				case 2:
					this.gameZone();
					break;
				case 3:
					this.gameOver();
					break;
				default: 
					this.splashScreen();
					break;
			}
		}

		this.gameOver = function() {
			$('#title-1').css('padding-top', '100px');
		}

		this.splashScreen = function() {
			var that = this;
			$('#title').css('padding-top', '100px');

			$('#start-btn').on('click', function(e) {
				that.loadScreen(2);
			});

		    var md = new MobileDetect(window.navigator.userAgent);
		    if (md.mobile() === null) {
		    	alert("This Eye Test is only for mobiles.");
		    	window.location.reload();
		    }

		}

		this.startGame = function(middleRow, middleCol) {
			var that = this;

			// bind event attachment HAMMER.JS
			var options = {
			  preventDefault: true
			};
			var hammertime = new Hammer(this.element, options);
			hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
			hammertime.on("swipe", function(ev){
		
				that.trackTime.push(that.timeInc);

				// remove all rotation classes
				$('.arrows').removeClass('rotate360');
				$('.arrows').removeClass('rotate90');
				$('.arrows').removeClass('rotate180');
				$('.arrows').removeClass('rotate270');

				// rotate all arrows
				var dirr = that.allArrowDirection[Math.floor(Math.random() * that.allArrowDirection.length)];
				$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate360');
				$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate90');
				$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate180');
				$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate270');

				// $('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).addClass('rotate270');					
				// that.middleArrowDir.push(that.inWord[dirr]);




				switch(ev.offsetDirection)
				{
					case 2: 
						$('.arrows').addClass('rotate270');					
						that.allArrowDir.push('LEFT');
						that.swipeDir.push('LEFT');
						break;
					case 4:
						$('.arrows').addClass('rotate90');					
						that.allArrowDir.push('RIGHT');
						that.swipeDir.push('RIGHT');
						break;
					case 8:
						$('.arrows').addClass('rotate360');					
						that.allArrowDir.push('UP');
						that.swipeDir.push('UP');
						break;
					case 16:
						$('.arrows').addClass('rotate180');					
						that.allArrowDir.push('DOWN');
						that.swipeDir.push('DOWN');
						break;
					default:
						break;
				}

				setTimeout(function(){
					$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate360');
					$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate90');
					$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate180');
					$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).removeClass('rotate270');
				
					var dirr = that.allArrowDirection[Math.floor(Math.random() * that.allArrowDirection.length)];
					$('.rows').eq(middleRow-1).find('.arrows').eq(middleCol-1).addClass('rotate' + dirr);
					that.middleArrowDir.push(that.inWord[dirr]);
				}, 100);



				// console.log(that.swipeDir); to test it
			});
			
			var gameTimeNote = setInterval(function() {
				that.timeInc += 10;
				if(that.timeInc > 60000)
					clearInterval(gameTimeNote);
			}, 10);

			var gameTimeout = setTimeout(function(){
				// console.log("MIDDLE ARROW DIRECTIONs: " + that.middleArrowDir);
				// console.log("SWIPE DIRECTIONs: " + that.swipeDir);
				// console.log("ALL ARROWS: " + that.allArrowDir);

				that.middleArrowDir.pop();

				for(var i=0; i<that.swipeDir.length ; i++) {
					
					// same direction
					if(that.allArrowDir[i-1] === that.middleArrowDir[i]) {
						if(that.middleArrowDir[i] === that.swipeDir[i])
							that.nocc++;
						else
							that.noic++;
					} else {
						if(that.middleArrowDir[i] === that.swipeDir[i])
							that.noci++;
						else
							that.noii++;
					}
				}

				$('#p-1').html("Number of correct congruent: " + that.nocc);
				$('#p-2').html("Number of incorrect congruent: " + that.noic);
				$('#p-3').html("Number of correct incongruent: " + that.noci);
				$('#p-4').html("Number of incorrect incongruent: " + that.noii);

				var c = 0
				var timeT = [];
				for(var h=0; h<(that.trackTime.length-1); h++) {
					timeT.push(that.trackTime[h+1] - that.trackTime[h]);
					c++;
				}
				var sum = 0;
				for(var g=0; g<timeT.length; g++) {
					sum += timeT[g];
				}

				$('#p-5').html("Avarage TIME: " + (sum/timeT.length).toFixed(2) + "secs");

				that.loadScreen(3);				
			}, 60000);

			// var i = 0;
			// var gameInterval = setInterval(function(){

			// 	i++;

			// 	if(i<that.changeTime) {
			// 		// do nothing
			// 	} else {
			// 		// when over 60 sec
			// 		clearInterval(gameInterval);
			// 		console.log("MIDDLE ARROW DIRECTIONs: " + that.middleArrowDir);
			// 		console.log("SWIPE DIRECTIONs: " + that.swipeDir);
			// 		console.log("ALL ARROWS: " + that.allArrowDir);

			// 		that.middleArrowDir.pop();

			// 		for(var i=0; i<that.allArrowDir.length ; i++) {
						
			// 			// same direction
			// 			if(that.allArrowDir[i] === that.middleArrowDir[i]) {
			// 				if(that.middleArrowDir[i] === that.allArrowDir[i+1])
			// 					that.nocc++;
			// 				else
			// 					that.noic++;
			// 			} else {
			// 				if(that.middleArrowDir[i] === that.allArrowDir[i+1])
			// 					that.noci++;
			// 				else
			// 					that.noii++;
			// 			}

			// 			console.log(that.allArrowDir[i], that.middleArrowDir[i], that.allArrowDir[i+1]);
			// 		}

			// 		console.log("number of correct congruent: " + that.nocc);
			// 		console.log("number of incorrect congruent: " + that.noic);
			// 		console.log("number of correct incongruent: " + that.noci);
			// 		console.log("number of incorrect incongruent: " + that.noii);

			// 		that.loadScreen(3);

			// 	}
			// }, 60000/this.changeTime);
		}

		this.gameZone = function() {
			var that = this;

			// to make reponsive arrow
			var gameWidth = $('#game-zone').width();
			var gameHeight = $('#game-zone').height();

			// total number of cols and rows to fit the width and hieght
			var totalCols = (gameWidth-30) / this.arrowWidth;
			var totalRows = (gameHeight-30) / this.arrowHeight;

			// get only odd number of rows and arrows
			totalCols = (parseInt(totalCols)%2 === 0) ? parseInt(totalCols-1) : parseInt(totalCols);
			totalRows = (parseInt(totalRows)%2 === 0) ? parseInt(totalRows-1) : parseInt(totalRows);

			// craete cols
			for(var i=1; i<totalCols; i++) {
				$('.arrows').eq(0).clone().appendTo('.rows');
			}

			// craete rows
			for(var j=1; j<totalRows; j++) {
				$('.rows').eq(0).clone().appendTo('#game-zone');
			}

			// find middle one arrow
			var middleRow = parseInt(totalRows/2) + 1;
			var middleCol = parseInt(totalCols/2) + 1;
			
			$('#counter-container').css('top', that.totalHeight/2 + 'px');

			// counting interval
			var startsCount = 5;
			var countingInterval = setInterval(function() {
				startsCount--;
				if(startsCount > 0) {
					$('#counter-number').html(startsCount);
				} else {
					clearInterval(countingInterval);
					$('#counter').hide();
					that.middleArrowDir.push('UP');
					that.startGame(middleRow, middleCol);
				}
			}, 1000);
		}

	}

	// initialise game object
	var gameObj = new flanker();
	gameObj.init();

})();
