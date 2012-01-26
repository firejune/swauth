# Swauth

Swauth(Authentication middleware for Swift) REST client API for Node.JS

### Installing

GIT

    $ git clone git://github.com/firejune/swauth.git

NPM

    $ npm install swauth
    
### Code
    var Swauth = require('swauth');

    var swauth = new Swauth({
        user: '.super_user'
      , key:  'swauthkey'
      , host: '172.17.17.76'
      , port: 3030
    });

    // Admin Services
    swauth.getAdminInfo(handlerFunction);

    // Account Services
    swauth.getAccountDetails(account, handlerFunction);
    swauth.createAccount(account, handlerFunction);
    swauth.deleteAccount(account, handlerFunction);
    
    // User Services
    swauth.getUserDetails(account, user, handlerFunction);
    swauth.createUser(account, user, secret, handlerFunction);
    swauth.deleteUser(account, user, handlerFunction);

    // Other Services
    swauth.setServiceEndpoints(account, handlerFunction);
    swauth.getAccountGroups(account, handlerFunction);