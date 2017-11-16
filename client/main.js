import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

BlazeLayout.setRoot('body');

Template.sidenav.onCreated(function() {
  Session.set('menuPinned',false);
  if(!Session.get("activeRoute")) {
    Session.set("activeRoute",FlowRouter.getRouteName());
  }
});

Template.sidenav.onRendered(function() {
  // detect if screen gets xtra small
  $(window).bind('resize', function() {
    Session.set('isScreenXS',isScreenXS());
  });
  // detect if mouse enters menu
  $("#sidenav").on('mouseenter', function() {
    $("#sidenav").addClass('show-menu');
  });
  $("#sidenav").on("mouseleave", function() {
    $("#sidenav").removeClass('show-menu');
  });

  this.autorun(function() {
    if(Session.get('menuPinned')) {
      $("#content").addClass('menu-pinned');
    }else{
      $("#content").removeClass('menu-pinned');
    }
  })
});

Template.sidenav.helpers({
  isMenuItemSelected: function(name) {
    if(Session.get("activeRoute") == name) {
      return true;
    }
    return false;
  },
  isWeb: function() {
    return !Meteor.isCordova;
  },
  menuIsPinned: function() {
    return Session.get('menuPinned');
  },
  screenIsXS: function() {
    return Session.get('isScreenXS');
  }
});

Template.sidenav.events({
  "click .menu-item": function(e) {
    e.preventDefault();
    var item = $(e.target).closest('div.menu-item');
    if(item) {
      if(item.attr('name') == "Signout") {
        AccountsTemplates.logout();
        return;
      }
      Session.set('activeRoute',item.attr('name'));
      FlowRouter.go(Session.get("activeRoute"));
    }
  },
  "click .menu-pinner": function(e) {
    e.preventDefault();
    if(Session.get('menuPinned')) {
      Session.set('menuPinned',false);
    }else {
      Session.set('menuPinned',true);
    }
  }
});

function isScreenXS() {
  if($("#screen-size-tester").is(":hidden"))
    return true;
  return false;
}
