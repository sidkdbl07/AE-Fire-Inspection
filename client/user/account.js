import { Accounts } from 'meteor/accounts-base';

import { toast } from '../snackbar.js';

Template.account.helpers({
  user: function(){
    return Meteor.users.findOne();
  },
  isCurrentUser: function() {
    user = Meteor.users.findOne();
    return (user._id === Meteor.userId());
  }
});

Template.account.events({
  'click #save-user-details-btn': function(e) {
    e.preventDefault();
    var user = {
      _id: Meteor.userId(),
      firstname: $("#user-firstname").val(),
      lastname: $("#user-lastname").val(),
      email: $("#user-email").val()
    };
    toast("User updated");
    Meteor.call('updateUserDetails', user)
  },
  'click #save-user-password-btn': function(e) {
    e.preventDefault();
    if( ($("#new-password").val() === $("#confirm-password").val()) && $("#new-password").val() != "") {
      $("#password-error").hide();
      Accounts.changePassword($("#old-password").val(),$("#new-password").val(),function(err){
        if(err) {
          toast("Password was not changed");
        }else{
          toast("Password changed");
          $("#old-password").val("");
          $("#new-password").val("");
          $("#confirm-password").val("");
        }
      });
    }else{
      $("#password-error").show();
    }

  }
});
