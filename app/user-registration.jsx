var React = require("react");

var UserRegistration = React.createClass({
    submit: function(evt) {
        evt.preventDefault();
        var newUser = {"username": $('#username').val(),"password": $('#password').val(), "email": $('#email').val()};

        var that = this;

        $.post('/signup',
            {newUser: newUser},
            function(response) {
                console.log(response);
                if (response == "success: user posted") {
                    return
                }
            }, 'text'
        );
    },

    render: function () {
        return (
                <form onSubmit="{this.submit}">
                    <input type="email" name="email" id="email" ></input>
                    <input type="text" name="username" id="username"></input>
                    <input type="text" name="password" id="password"></input>
                    <input type="submit" name="send"></input>
                </form>ß
        );
    }
});

module.exports = UserRegistration;