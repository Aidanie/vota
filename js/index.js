var React = require('react');
var ReactDOM = require('react-dom');
require('bootstrap');

var RoomInput = React.createClass({
  render: function(){
    return (
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <input type="text" value="Hello!" onChange={goToRoom()}/>
          </div>
        </div>
    );
  }
});

ReactDOM.render(
  <RoomInput />,
  document.getElementById('content')
);
