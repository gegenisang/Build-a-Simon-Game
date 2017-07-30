$(document).ready(function () {

  var game = {
    count: 0,
    possibilities: ['#yellow', '#red', '#blue', '#green'],
    currentGame: [],
    player: [],
    sound: {
      blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    },
    errSound: new Audio("https://upload.wikimedia.org/wikipedia/commons/b/be/Sonnerie_classique_reveil.ogg"),
    winSound: new Audio("https://upload.wikimedia.org/wikipedia/commons/e/ec/MVG%2C_Sch%C3%A4fflermelodie%2C_1.ogg"),
    strict: false,
    lock: false,
    status: false,
  }

  $(".off-on").click(function () {
    $(".onOff").toggleClass("leftRight");
    if ($(".onOff").hasClass("leftRight") === false) {
      game.reset();
      $(".message").text("- -");
      $(".message").addClass("color-off");
      $(".message").removeClass("color-on");
      $(".dot").removeClass("bgColor");
      $("#start").off("click");
      $("#strict").off("click");

    } else {
      $(".message").removeClass("color-off");
      $(".message").addClass("color-on");
      $("#start").click(getStart);
      $("#strict").click(toggleStrict);
    }
  });


  function getStart() {
    resetTimers();
    $('.message').text('- -').removeClass('color-off');
    getMessage('- -', 1);
    game.init();
    addCount();
    game.lock = true;
  }

  function getMessage(msg, times) {
    $('.message').text(msg);
    var fontColor = function () {
      $('.message').addClass('color-off');
      game.hideMessage = setTimeout(function () {
        $('.message').removeClass('color-off');
      }, 250);
    };
    var cnt = 0;
    fontColor();
    game.showMessage = setInterval(function () {
      fontColor();
      cnt++;
      if (cnt === times)
        clearInterval(game.showMessage);
      console.log("miaomiao");
    }, 500)
  }

  function toggleStrict() {
    $(".dot").toggleClass("bgColor");
    game.strict = !game.strict;

  }

  function addCount() {
    game.count++;
    setTimeout(function () {
      displayCount();
    }, 700);

    generateMove();
  }

  function displayCount() {
    var p = (game.count < 10) ? '0 ' : ' ';
    $('.message').text(p + (game.count + ''));
    console.log($(".message").text());
  }

  function generateMove() {
    game.currentGame.push(game.possibilities[(Math.floor(Math.random() * 4))]);
    showMoves();
  }



  function sound(name) {
    console.log(name, "name");
    switch (name) {
      case '#green':
        game.sound.green.play();
        break;
      case '#blue':
        game.sound.blue.play();
        break;
      case '#red':
        game.sound.red.play();
        break;
      case '#yellow':
        game.sound.yellow.play();
        break;
    };
  }

  function playGame(field, times) {
    $(field).addClass('light');
    console.log("hahha", field);
    sound(field);
    setTimeout(function () {
      $(field).removeClass('light');
    }, times);
  }

  function addToPlayer(id) {

    var field = "#" + id;
    console.log(field);
    game.player.push(field);
    console.log(game.player, "aaaa");
    playerTurn(field);
  }

  function setStepTime(step) {
    var sTimes = [1000, 800, 600, 400];
    if (step < 4)
      return sTimes[0];
    if (step < 8)
      return sTimes[1];
    if (step < 12)
      return sTimes[2];
    return sTimes[3];
  }

  function showMoves() {
    var i = 0;
    var times = setStepTime(i);
    var moves = setInterval(function () {
      displayCount();
      game.status = true;
      playGame(game.currentGame[i], setStepTime(i));
      i++;
      if (i >= game.currentGame.length) {
        clearInterval(moves);
        game.status = false;
      }
    }, times + 100);
    console.log(times, "times");
    clearPlayer();
    
  }

  function clearPlayer() {
    game.player = [];
  }

  $(".btn").click(function () {
    console.log(game.status,"status");
    if (game.lock && !game.status) {
      clearInterval(game.showMessage);
      var keyButton = $(this).attr("id");
      console.log(keyButton, "keyButton");
      addToPlayer(keyButton);
    }
  });

  function errSound() {
    game.errSound.play();
  }

  function getErrplay() {
    game.toErrplay = setTimeout(function () {
      errSound();
      showMoves();
    }, 200);
    getMessage("! !", 2);
  }
  function getWin(){
    game.toWin = setTimeout(function(){
      game.winSound.play();
       getStart();
    },500);
    getMessage("W i n",2);
  }
  function playerTurn(x) {
    if (!game.status) {
      if (game.player[game.player.length - 1] !== game.currentGame[game.player.length - 1]) {
        if (game.strict) {
          game.toStrict = setTimeout(function () {
            game.errSound.play();
            getStart();
          }, 500);
          
          getMessage("! !", 2);
          console.log("1111");
        } else {
          getErrplay();
        }
      } else {
        playGame(x, 200);
        var check = game.player.length === game.currentGame.length;
        if (check) {
          if (game.count == 20) {
            getWin();
          } else {
            nextLevel();
          }
        }
      }
    }
  }

  function newGame() {
    game.init();
  }

  function nextLevel() {
    addCount();
  }

  function resetTimers() {

    clearInterval(game.showMessage);
    clearTimeout(game.hideMessage);
    clearTimeout(game.toErrplay);
    clearTimeout(game.toStrict);
    clearTimeout(game.getWin);
  };

  game.reset = function () {
    this.init();
    this.strict = false;

    resetTimers();
  }

  game.init = function () {
      game.currentGame = [],
      game.count = 0
      this.lock = false;
      this.status = false;
  }

  // newGame();
});