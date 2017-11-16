import { toast } from '../snackbar.js';

Template.user.helpers({
  user: function(){
    return Meteor.users.findOne({_id: FlowRouter.getParam('userid')});
  },
  isCurrentUser: function() {
    user = Meteor.users.findOne({_id: FlowRouter.getParam('userid')});
    return (user._id === Meteor.userId());
  }
});

Template.user.events({
  'click #save-user-details-btn': function(e) {
    e.preventDefault();
    var user = {
      _id: FlowRouter.getParam('userid'),
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
      Accounts.setPassword(FlowRouter.getParam('userid'),$("#new-password").val());
      toast("User's password updated");
      $("#new-password").val("");
      $("#confirm-password").val("");
    }else{
      $("#password-error").show();
    }

  }
});
