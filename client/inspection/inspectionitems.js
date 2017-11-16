import moment from 'moment';
import { toast } from '../snackbar.js';

Template.inspectionitems.onRendered(function() {

});

Template.inspectionitems.helpers({
  backroute: function() {
    if(FlowRouter.getQueryParam('goback')) {
      return "/"+FlowRouter.getQueryParam('goback');
    }
    return "";
  },
  getComments: function() {
    return InspectionItems.find({inspectionid: FlowRouter.getParam('inspectionid'), type: 'comment'},{sort: {dateentered: -1}}).fetch();
  },
  getDeficiencies: function() {
    return InspectionItems.find({inspectionid: FlowRouter.getParam('inspectionid'), type: 'deficiency'},{sort: {dateentered: -1}}).fetch();
  },
  getRecommendations: function() {
    return InspectionItems.find({inspectionid: FlowRouter.getParam('inspectionid'), type: 'recommendation'},{sort: {dateentered: -1}}).fetch();
  },
  inspection: function(){
    return Inspections.findOne({_id: FlowRouter.getParam('inspectionid')});
  },
  numberOfComments: function() {
    return InspectionItems.find({inspectionid: FlowRouter.getParam('inspectionid'), type: 'comment'}).count();
  },
  numberOfDeficiencies: function() {
    return InspectionItems.find({inspectionid: FlowRouter.getParam('inspectionid'), type: 'deficiency'}).count();
  },
  numberOfRecommendations: function() {
    return InspectionItems.find({inspectionid: FlowRouter.getParam('inspectionid'), type: 'recommendation'}).count();
  }
});

Template.inspectionitems.events({
  'click #add-comment-btn': function(e) {
    e.preventDefault();
    $("#add-comment").addClass("show");
    clearAndCloseDeficiencies();
    clearAndCloseRecommendations();
  },
  'click #addcommentbtn': function(e) {
    e.preventDefault();
    Meteor.call('createInspectionItem', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      dateentered: new Date(),
      text: $("#newcomment").val(),
      type: "comment"
    });
    toast("Comment added");
    clearAndCloseComments();
  },
  'click #canceladdcommentbtn': function(e) {
    e.preventDefault();
    clearAndCloseComments();
  },
  'click #add-deficiency-btn': function(e) {
    e.preventDefault();
    $("#add-deficiency").addClass("show");
    clearAndCloseComments();
    clearAndCloseRecommendations();
  },
  'click #adddeficiencybtn': function(e) {
    e.preventDefault();
    Meteor.call('createInspectionItem', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      dateentered: new Date(),
      text: $("#newdeficiency").val(),
      type: "deficiency"
    });
    toast("Deficiency added");
    clearAndCloseDeficiencies();
  },
  'click #canceladddeficiencybtn': function(e) {
    e.preventDefault();
    clearAndCloseDeficiencies();
  },
  'click #add-recommendation-btn': function(e) {
    e.preventDefault();
    $("#add-recommendation").addClass("show");
    clearAndCloseComments();
    clearAndCloseDeficiencies();
  },
  'click #addrecommendationbtn': function(e) {
    e.preventDefault();
    Meteor.call('createInspectionItem', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      dateentered: new Date(),
      text: $("#newrecommendation").val(),
      type: "recommendation"
    });
    toast("Recommenation added");
    clearAndCloseRecommendations();
  },
  'click #canceladdrecommendationbtn': function(e) {
    e.preventDefault();
    clearAndCloseRecommendations();
  },
  'click .deleteitem': function(e) {
    e.preventDefault();
    var id = $(e.target).attr('itemid');
    if(!id) {
      id = $(e.target).parent('a').attr('itemid'); // user clicked on the icon
    }
    Meteor.call('removeInspectionItem', id);
    toast("Item removed");
  }
});

function clearAndCloseComments() {
  $("#newcomment").val("");
  $("#add-comment").removeClass("show");
}

function clearAndCloseDeficiencies() {
  $("#newdeficiency").val("");
  $("#add-deficiency").removeClass("show");
}

function clearAndCloseRecommendations() {
  $("#newrecommendation").val("");
  $("#add-recommendation").removeClass("show");
}
