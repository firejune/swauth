/*!
 * Swauth - Swauth REST API client for Node.JS
 *
 * @author firejune(to@firejune.com)
 * @license MIT Style
 * 
 */


/**
 * dependencies.
 */

var https = require('https')
  , clog = require('clog')
  , wrap = require('wrap');


/**
 * Class.
 */
 
function Swauth(options, callback) {
  this.options = extend({
      user: 'username'
    , key : 'userkey'
    , host: 'hostname'
    , port: 3000
  }, options);
}


/**
 * Util.
 */

function extend(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
}

function request(options, callback, pipe) {
  options = extend({
      host: this.options.host
    , port: this.options.port
    , path: '/auth/v2'
    , method: 'GET'
  }, options);

  if (!options.headers) options.headers = {};
  options.headers['X-Auth-Admin-User'] = this.options.user;
  options.headers['X-Auth-Admin-Key'] = this.options.key;
  options.headers['User-Agent'] = 'Node.JS Swauth API Client';
  options.path = encodeURI(options.path);

  var client = https.request(options, function(res) {
    var buffers = [];

    res.on('data', function(buffer) {
      buffers.push(buffer);
    });

    res.on('end', function(err){
      res.body = buffers.join('');
      callback && callback(err, res);
    });
  });

  client.on('error', function(err) {
    callback && callback(err);
    client.end();
  });

  client.end();
}

/**
 * Reseller/Admin Services
 */
// Get Admin Info
/*
{ "accounts":
  [
    { "name": "account1" },
    { "name": "account2" },
    { "name": "account3" }
  ]
}
*/
Swauth.prototype.getAdminInfo = function(callback) {
  request.call(this, {}, callback);
};


/**
 * Account Services
 */
/// Get Account Details
/*
{ "services":
  { "storage":
    { "default": "local",
      "local": "https://<storage endpoint>/v1/<account_id>" },
  },
  "account_id": "<account_id>",
  "users": [ { "name": "user1" },
             { "name": "user2" } ]
}
*/
Swauth.prototype.getAccountDetails = function(account, callback) {
  request.call(this, {
      path: '/auth/v2/' + account
  }, callback);
};

// Create Account
Swauth.prototype.createAccount = function(account, callback) {
  request.call(this, {
      path: '/auth/v2/' + account
    , method: 'PUT'
  }, callback);
};

// Delete Account
Swauth.prototype.deleteAccount = function(account, callback) {
  request.call(this, {
      path: '/auth/v2/' + account
    , method: 'DELETE'
  }, callback);
};

/**
 * User Services
 */
// Get User Details
/*
"groups": [  # List of groups the user is a member of
    {"name": "<act>:<usr>"},
        # The first group is a unique user identifier
    {"name": "<account>"},
        # The second group is the auth account name
    {"name": "<additional-group>"}
        # There may be additional groups, .admin being a
        # special group indicating an account admin and
        # .reseller_admin indicating a reseller admin.
 ],
 "auth": "plaintext:<key>"
 # The auth-type and key for the user; currently only
 # plaintext is implemented.
}
*/
Swauth.prototype.getUserDetails = function(account, user, callback) {
  request.call(this, {
      path: '/auth/v2/' + account + '/' + user
  }, callback);
};

// Create User
Swauth.prototype.createUser = function(account, user, secret, callback) {
  request.call(this, {
      path: '/auth/v2/' + account + '/' + user
    , method: 'PUT'
    , headers: {
      , "X-Auth-User-Key": secret
      , "X-Auth-User-Admin": true
    }
  }, callback);
};

// Delete User
Swauth.prototype.deleteUser = function(account, user, callback) {
  request.call(this, {
      path: '/auth/v2/' + account + '/' + user
    , method: 'DELETE'
  }, callback);
};

/**
 * Other Services
 */
// Set Service Endpoints
Swauth.prototype.setServiceEndpoints = function(account, callback) {
  request.call(this, {
      path: '/auth/v2/' + account + '/.services'
    , method: 'POST'
    , body: '{"storage": { "local": "<new endpoint>" }}'
  }, callback);
};

// Get Account Groups
/*
{ "groups": [ { "name": ".admin" },
              { "name": "<account>" },
              { "name": "<account>:user1" },
              { "name": "<account>:user2" } ] }
*/
Swauth.prototype.getAccountGroups = function(account, callback) {
  request.call(this, {
      path: '/auth/v2/' + account + '/.groups'
  }, callback);
};

module.exports = Swauth;