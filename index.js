/**
 * MongoDB Document Mapper
 */

var _ = require('underscore');
var mongo = require('mongodb');

var Model = function(obj) {
  // Apply defaults
  var defaults = this.defaults || {};
  this.attributes = _.extend({id: null}, defaults, obj || {});
  this.attributes.id = this.id = this.get('_id');
  this.initialize(obj);
};

Model.prototype.initialize = function(obj) {}

Model.extend = function(name, props) {
  var child;
  var parent = this;
  child = function() {
    parent.apply(this, arguments);
  }
  var ctor = function() {};
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  _.extend(child, parent);
  _.extend(child.prototype, props);
  child.prototype.constructor = child;
  child.extend = parent.extend;
  child._name = child.prototype._name = name;
  return child;
};

Model.prototype.get = function(attr) {
  if (this.attributes.hasOwnProperty(attr)) {
    return this.attributes[attr];
  }
  return undefined;
};

Model.prototype.set = function(attr, val) {
  this.attributes[attr] = val;
  return this.attributes[attr];
};

Model.find = function(query, callback) {
  var self = this;
  this.db.connect(this.connectionString, function(err, db) {
    if (err) {
      console.log("ERROR: " + err);
      return callback(err, null);
    }
    var collection = db.collection(self._name);
    collection.find(query).toArray(function(err, items) {
      if (err) {
        console.log("ERROR: " + err);
        return callback(err, null);
      }
      callback(null, _.map(items, function(item) {
        return new self(item);
      }));
    });
  });
};

Model.findAll = function(callback) {
  this.find({}, function(err, items) {
    if (err) {
      console.log("ERROR: " + err);
      return callback(err, null);
    }
    callback(null, items);
  });
};

Model.findById = function(id, callback) {
  this.find({_id: mongo.ObjectID(id)}, function(err, items) {
    if (err) {
      console.log("ERROR: " + err);
      return callback(err, null);
    }
    if (items.length) {
      callback(null, items[0]);
    } else {
      callback(null, null);
    }
  });
};

Model.prototype.save = function(obj, callback) {
  if (typeof obj === "function") {
    callback = obj;
    obj = null;
  }
  // Update model attributes with new obj if it exists.
  if (obj) {
    _.extend(this.attributes, obj);
  }
  // Now, time to save.
  var self = this;
  this.db.connect(this.connectionString, function(err, db) {
    if (err) {
      console.log("ERROR: " + err);
      if (callback) return callback(err, null);
    }
    var collection = db.collection(self._name);
    // Update
    if (self.id) {
      collection.update({_id: self.id}, self.attributes, {}, function(err, item) {
        if (err) {
          console.log("ERROR: " + err);
          return callback(err, null);
        }
        if (callback) callback(null, self);
      });
    // Create new
    } else {
      collection.insert(self.attributes, function(err, item) {
        if (err) {
          console.log("ERROR: " + err);
          if (callback) return callback(err, null);
        }
        _.extend(self.attributes, item[0]);
        self.id = self.get('_id');
        if (callback) callback(null, self);
      });
    }
  });
};

Model.prototype.destroy = function(callback) {
  if (this.id) {
    var self = this;
    this.db.connect(this.connectionString, function(err, db) {
      if (err) {
        console.log("ERROR: " + err);
        if (callback) return callback(err, null);
      }
      var collection = db.collection(self._name);
      collection.remove({_id: self.id}, function(err) {
        if (err) {
          console.log("ERROR: " + err);
          if (callback) return callback(err);
        }
        if (callback) callback(null);
      });
    });
  }
  if (callback) callback(err);
};

var ModelWrapper = function(connectionString) {
  Model.connectionString = Model.prototype.connectionString = connectionString;
  Model.db = Model.prototype.db = mongo.MongoClient;
  return Model;
};

module.exports = exports = {
  createDatabase: function(mongoUri, dbName) {
    var mongoUri = mongoUri || "mongodb://localhost:27017";
    var dbName = dbName || "test";
    var connectionString = mongoUri + "/" + dbName;
    return {
      connectionString: connectionString,
      Model: ModelWrapper(connectionString)
    };
  }
};
