MDM - MongoDB Document Mapper
=============================

A super flexible MongoDB Document Mapper (Similar to ROM; Most of the code were
actually reused). It's all about model method DRY-ness.

Usage
-----

    var db = require('mdm').createDatabase('mongodb://localhost:27017', 'myDatabase');

    var User = db.Model.extend('User', {
      hello: function() {
        return "Hello, " + this.get('first_name');
      }
    });

    var mr_awesome = new User({first_name: "Awesome"});

    mr_awesome.save(function(err, mr_awesome) {
        console.log(mr_awesome.hello());
        console.log("Mr awesome mongo id: " + mr_awesome.get('_id'));
    });

    mr_awesome.destroy();


Installation
------------

    $ npm install mom

Todo
----

Stuff to do (Need help on this one).

  * More Documentation!
  * Testing


License
-------

(MIT License)

Copyright (c) 2013 Jesse Panganiban <me@jpanganiban.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
