window.onload = function() {
    document.getElementById("success").volume = 0.1;
  };
  
  function Simon() {
    this.isOn = false;
    this.list = [];
    var self = this;
    this.waiting = false;
    this.count = 0;
    this.counter = 0;
    this.strict = false;
    this.startActive = false;
    this.buttonsActive = false;
  
    this.turnOn = function() {
      this.isOn = true;
      this.startActive = true;
      $("#switch").css("margin-left", "25px");
      $("#counter").html("--");
    };
  
    this.turnOff = function() {
      this.waiting = false;
      this.reset();
      this.startActive = false;
      this.isOn = false;
      $("#switch").css("margin-left", "1px");
      $("#counter").html("");
      $("#strictIndicator").css("background-color", "black");
    };
  
    this.chooseNext = function() {
      if (this.counter < 20) {
        var next = this.chooseColor();
        this.list.push(next);
        console.log("Current list is " + this.list);
        this.counter++;
        this.activateSeries();
      } else {
        setTimeout(function() {
          $("#counter").html("!!");
          document.getElementById("success").play();
        }, 500);
  
        setTimeout(function() {
          self.reset();
          self.chooseNext();
        }, 1000);
      }
    };
  
    this.activateSeries = function() {
      console.log("activating series and waiting is " + this.waiting);
      var int = setInterval(function() {
        self.lightUp(self.list[self.count]);
        $("#counter").html(("0" + parseInt(self.counter)).slice(-2));
        self.count++;
  
        if (self.count === self.list.length) {
          self.count = 0;
          self.waiting = true;
          console.log("series over and waiting is " + self.waiting);
          clearInterval(int);
        }
      }, 750);
    };
  
    this.lightUp = function(color) {
      var el = "#" + color;
      var audioEl = document.getElementById(color + "Sound");
      var oldRgb = getRgbValue(color);
  
      var newRgb = "rgba" + oldRgb.slice(3, -1) + ", 0.6)";
  
      // change color
      $(el).css("background-color", newRgb);
      audioEl.play();
  
      //change color back after 500ms
      setTimeout(function() {
        $(el).css("background-color", oldRgb);
      }, 250);
    };
    
    
    this.lightUpUser = function(color) {
      this.waiting = false;
      this.lightUp(color);
      setTimeout (function() {
        self.waiting = true
      }, 450)
      
    }
    this.checkInput = function(color) {
      console.log("checking input and waiting is " + this.waiting);
      if (color === this.list[this.count]) {
        this.count++;
        this.lightUpUser(color);
  
        if (this.count === this.list.length) {
          setTimeout(function() {
            self.waiting = false;
          }, 450);
          
          console.log("count reached and waiting is " + this.waiting);
          this.count = 0;
          this.chooseNext();
        }
      } else if (color != this.list[this.count]) {
        wrongSound.play();
        if (!this.strict) {
          this.waiting = false;
          this.count = 0;
          this.activateSeries();
        } else {
          this.reset();
          this.chooseNext();
        }
      }
    };
  
    this.chooseColor = function() {
      var num = Math.floor(Math.random() * 4);
      return ["green", "red", "yellow", "blue"][num];
    };
  
    this.reset = function() {
      this.list = [];
      this.counter = 0;
      this.count = 0;
    };
  
    this.success = function() {
      this.reset();
    };
  
    this.toggleStrict = function() {
      if (this.strict) {
        this.strict = false;
        $("#strictIndicator").css("background", "black");
      } else {
        this.strict = true;
        $("#strictIndicator").css("background", "red");
      }
    };
  }
  
  $("#switch").on("click", function() {
    if (simon.isOn) {
      simon.turnOff();
    } else {
      simon.turnOn();
    }
  });
  
  $("#startButton").on("click", function() {
    if (simon.startActive) {
      simon.startActive = false;
      simon.chooseNext();
    }
    
    
  });
  
  $("#strictButton").on("click", function() {
    if (simon.isOn) {
      simon.toggleStrict();
    }
  });
  
  $(".button").on("click", function() {
    if (simon.waiting) {
      simon.checkInput(this.id);
    }
  });
  
  $("#startButton")
    .mousedown(function() {
      $(this).css("background", "darkred");
    })
    .mouseup(function() {
      $(this).css("background", "red");
    });
  
  $("#strictButton")
    .mousedown(function() {
      $(this).css("background", "gold");
    })
    .mouseup(function() {
      $(this).css("background", "yellow");
    });
  
  function getRgbValue(elementId) {
    var el = "#" + elementId;
    var rgb = $(el).css("background-color");
  
    return rgb;
  }
  
  var wrongSound = document.getElementById("wrong");
  var successSound = document.getElementById("success");
  var simon = new Simon();
  