FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../db/models/user')

const strategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(token, tokenSecret, profile, done) {
    // testing
    console.log('===== FACEBOOK PROFILE =======')
    console.log(profile)
    console.log('======== END ===========')
    // code
    const { id, name, photos } = profile
    User.findOne({ 'facebook.id': profile.id }, (err, userMatch) => {
        // handle errors here:
        if (err) {
            console.log('Error!! trying to find user with googleId')
            console.log(err)
            return done(null, false)
        }
        // if there is already someone with that googleId
        if (userMatch) {
            return done(null, userMatch)
        } else {
            // if no user in our db, create a new user with that googleId
            console.log('====== PRE SAVE =======')
            console.log(id)
            console.log(profile)
            console.log('====== post save ....')
            const newFacebookUser = new User({
                'facebook.id': profile.id,
                firstName: name.givenName,
                lastName: name.familyName,
                photos: photos
            })
            // save this user
            newFacebookUser.save((err, savedUser) => {
                if (err) {
                    console.log('Error!! saving the new facebook user')
                    console.log(err)
                    return done(null, false)
                } else {
                    return done(null, savedUser)
                }
            })
        }
    }) // closes User.findONe
}
);
  

// User.findOne({'facebook.id':profile.id},function(err,user){
//     if(err)
//     {
//         console.log("Error when finding facebook user in verify callback");
//         done(err);
//     }   
//     if(user)
//     {
//         console.log("User has been found in facebook verify callback");
//         done(null,user);
//     }   

//     else
//     {
//         console.log("Creating new user in facebook verify callback");
//         var payload = {
//             facebook:{
//                 id:profile.id,
//                 token:profile.token,
//                 name: profile.name.givenName,
//                 email:profile.emails[0].value
//             }
//         };
//         console.log(payload);
//         var user = new User(payload);
//         user.save(function(err,user){
//             if(err){
//                 console.log("Error occured when creating new user in facebook verify callback");
//                 done(err);
//             }
//             else
//             {   
//                 console.log("New facebook user added successfully");
//                 done(null,user);
//             }
//         })
//     }
// });