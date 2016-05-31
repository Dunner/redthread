'use strict';

var mongoose = require('mongoose'),
  Story = mongoose.model('Story');


// Clear old Settings, then add a default Story
Story.find({}).remove(function() {
   
   // create the Story
   var password = 'test',
       name = 'Jonathan\'s Story',
       slug = 'Jonathan\'s-Story',
       newStory  = new Story();
   
   // set the Story's local credentials
   newStory.password = newStory.generateHash(password);
   newStory.name = name;
   newStory.slug = slug;
   
   // save the Story
   newStory.save(function(err) {
      if (err)
         console.log(err);
      console.log('dummy story with password: test');
   });

});