var React = require('react');
var ReactDOM = require('react-dom');
require('bootstrap');

var RoomInput = React.createClass({
  goToRoom: function(){
    console.log("going to room");
    var room = $("#room").val()
    if(room != undefined){
      window.location.href ="/poll.html?"+room;
    }
  },
  render: function(){
    return (
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <input id="room" type="text" />
            <button type="button" className="btn btn-default" onClick={this.goToRoom}>Submit</button>
          </div>
        </div>
    );
  }
});

ReactDOM.render(
  <RoomInput />,
  document.getElementById('content')
);
