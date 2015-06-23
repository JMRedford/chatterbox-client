
var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: 'all',
  currentFriend: 'No Filter',
  rooms: {
    lobby: 1
  },
  friends: {
    noFilter: 1
  },

  init: function(){
    app.fetch(app.currentRoom, app.currentFriend); //on initialization, get the messages from all the rooms
    setInterval(function(){     //retrieve all the rooms in the drop-down list after 5 seconds
      app.fetch(app.currentRoom, app.currentFriend);
    },5000);
  },
  send: function(){
    var message = { //set up the message object to include the username, the text and the current room
      username: window.location.search.slice(10),
      text: $('#message').val(),
      roomname: app.currentRoom
    }
    $.ajax({  //posts messages from the server
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
    })
    app.clearMessages();  //call the clear messsage method to clear all the messages on the page
    app.fetch(app.currentRoom, app.currentFriend); //call the fetch method to retrieve all the messages for the current room
  },

  fetch: function(room, friend){
    var returnMessage;
    $.ajax({  //retrieve the messages based on a particular room
      url: this.server,
      type: 'GET'
    }).done(function(data){
      returnMessage = data;
      app.clearMessages(); //call the clear messages method to reduce flicker on page.
      for(var i = 0; i < returnMessage.results.length; i++) {
        //check for new rooms
        var msgRoom = returnMessage.results[i].roomname;
        var msgUser = returnMessage.results[i].username;
        if(msgRoom){
          app.rooms[msgRoom] = 1;
        }
        if(room === 'all' || (msgRoom && msgRoom === room)){ //check for all rooms or a specific room and return messages for that room
          if (app.currentFriend === 'No Filter' || (msgUser && msgUser === app.currentFriend)){ //check for messages of all friends or a specific friend
            app.addMessage(returnMessage.results[i]);
          }
        }
      }
    });
    //update drop down list
    var optionTagArray = [];
    $('#roomList > option').each(function(index,optionTag){
      optionTagArray.push($(optionTag).attr('value'));
    })
    for (roomname in app.rooms){
      var found = false;
      for (var i = 0; i < optionTagArray.length; i++){ //iterate through the room names to see if one is found
        if (roomname === optionTagArray[i]){
          found = true;
        }
      }
      if (!found){ //if roomname is not found add it to the DOM
        $('<option>').attr('value',roomname).html(roomname)
          .appendTo($('#roomList'));
      }
    }
    optionTagArray = [];
    $('#friendList > option').each(function(index,optionTag){
      optionTagArray.push($(optionTag).attr('value'));
    })
    for (friend in app.friends){
      var found = false;
      for (var i = 0; i < optionTagArray.length; i++){ //iterate through the room names to see if one is found
        if (friend === optionTagArray[i]){
          found = true;
        }
      }
      if (!found){ //if roomname is not found add it to the DOM
        $('<option>').attr('value',friend).html(friend)
          .appendTo($('#friendList'));
      }
    }
  },
  changeRoom: function() {  //selects a specific room the drop down menu
    app.currentRoom = $("#roomList :selected").text();
    app.fetch(app.currentRoom, app.currentFriend);
  },
  createRoom: function() {
    var newRoomname = $('#newRoomname').val();
    app.currentRoom = newRoomname;
  },
  addFriend: function(name){
    app.friends[name] = 1;
    app.fetch(app.currentRoom,app.currentFriend);
  },
  chooseFriend: function() {
    app.currentFriend = $('#friendList :selected').text();
    app.fetch(app.currentRoom, app.currentFriend);
  },
  clearMessages: function(){ //removes all messages from the page
    $('#messageCanvas > div').remove();
  },
  addMessage: function(message){

    var canvas = $('#messageCanvas');
    var msgElement = $("<div>").text("     \"" + message.text
      + "\"     Created at: "+ message.createdAt).attr("class", "chat").appendTo(canvas);
    $('<div>').attr('class',"chat username")
      .attr('onclick','app.addFriend("'+message.username+'")')
      .text(message.username).appendTo(msgElement);//adds a message to the page with the username and a timestamp
    if (app.friends[message.username]){
      msgElement.attr('class', 'chat friend');
    }
  }
}
