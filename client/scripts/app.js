
var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: 'lobby',
  rooms: {
    lobby: 1
  },
  init: function(){
    app.fetch();
    setInterval(function(){
      app.clearMessages();
      app.fetch();
    },5000);
  },
  send: function(){
    var message = {
      username: window.location.search.slice(10),
      text: $('#message').val(),
      roomname: app.currentRoom
    }
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
    })
    app.clearMessages();
    app.fetch();
  },
  fetch: function(room){
    if (room){
      var returnMessage;
      $.ajax({
        url: this.server,
        type: 'GET'
      }).done(function(data){
        returnMessage = data;
        for(var i = 0; i < returnMessage.results.length; i++) {
          //check for new rooms
          var msgRoom = returnMessage.results[i].roomname;
          if(msgRoom){
            app.rooms[msgRoom] = 1;
          }
          if(msgRoom && msgRoom === room){
            app.addMessage(returnMessage.results[i]);
          }
        }
      })
    } else {
      var returnMessage;
      $.ajax({
        url: this.server,
        type: 'GET'
      }).done(function(data){
        returnMessage = data;
        console.log(returnMessage);
        for(var i = 0; i < returnMessage.results.length; i++) {
          //check for new rooms
          var msgRoom = returnMessage.results[i].roomname;
          if(msgRoom && !app.rooms[msgRoom]){
            app.rooms[msgRoom] = 1;
          }
          app.addMessage(returnMessage.results[i]);
        }
      })
    }
    //update drop down list
    var optionTagArray = [];
    $('#roomList > option').each(function(index,optionTag){
      optionTagArray.push($(optionTag).attr('value'));
    })
    for (roomname in app.rooms){
      var found = false;
      for (var i = 0; i < optionTagArray.length; i++){
        if (roomname === optionTagArray[i]){
          found = true;
        }
      }
      if (!found){
        //not working
        $('#roomList').append('<option>').attr('value',roomname);
      }
    }
  },
  addFriend: function(){},
  addRoom: function(str){},
  clearMessages: function(){
    $('#messageCanvas > div').remove();
  },
  addMessage: function(message){
    var canvas = $('#messageCanvas');
    $("<div>").text(message.text).attr("class", "chat").appendTo(canvas);
  }
}
