;
passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
function(username, password, done) {
    app.db.driver.execQuery("select * from tbl_user where username='" + username + "'", function(err, result) {
        if (err)
            return done(err);

        if (result.length) {
            var data = result[0];
            if (data.password === password) {
                done(null, data.id_user.toString());
            }
            else {
                return done(null, false);
            }
        }
        else {
            return done(null, false);
        }
    });
}
));

passport.serializeUser(function(id_user, done) {
    done(null, id_user.toString());
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});
