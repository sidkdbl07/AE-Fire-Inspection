import { Accounts } from 'meteor/accounts-base';

import { toast } from '../snackbar.js';

Template.users.helpers({
  getUsers: function(){
     return Meteor.users.find();
  },
  tableSettings: function() {
    return {
      collection: 'users-rt',
      rowsPerPage: 5,
      showFilter: true,
      showNavigation: 'auto',
      fields: [
        { key: '_id', hidden: true },
        { key: 'profile.firstname', label: 'First Name', headerClass: 'col-xs-4' },
        { key: 'profile.lastname', label: 'Last Name', headerClass: 'col-xs-4' },
        { key: 'emails.0.address', label: 'E-mail', headerClass: 'col-xs-3' },
        { key: '_id', label:"", tmpl: Template.userDetailsBtn, headerClass: 'col-xs-1' }
      ],
      useFontAwesome: true,
    };
  }
});

Template.users.events({
  'click #adduserbtn': function(e) {
    e.preventDefault();
    $("#new-user").addClass("show");
  },
  'click #addusercancel': function(e) {
    e.preventDefault();
    $("#new-user").removeClass("show");
  },
  'click #adduser': function(e) {
    var newuser = {
      email: $("#user-email").val(),
      password: $("#user-passwd").val(),
      firstname: $("#user-firstname").val(),
      lastname: $("#user-lastname").val()
    };
    Meteor.call('addUser',newuser);
    toast("User created");
    $("#user-email").val("");
    $("#user-passwd").val("");
    $("#user-firstname").val("")
    $("#user-lastname").val("");
    $("#new-user").removeClass("show");
  }
});
