var React = require("react");

var MessageForm = React.createClass({
    submit: function(evt) {

        evt.preventDefault();

        var newMessage = $('#msg').val();

        var that = this;


        console.log(that);
        $.post('/messages',
            {newMessage: newMessage},
            function(response) {
                console.log(response);
                if (response == "success-message posted") {
                    that.props.getMessages();
                }
            }, 'text'
        );
    },

    clearInput: function() {
        $('msg').val('');
    },

    render: function() {
        return (
            <form onSubmit={this.submit}>
                <input type="text" name="msg" id="msg"></input>
                <input type="submit" name="send"></input>

            </form>
        );
    }
});

module.exports = MessageForm;