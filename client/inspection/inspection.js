import moment from 'moment';
import { toast } from '../snackbar.js';

Template.inspection.onRendered(function() {
  $("#inspection-date").datepicker();
});

Template.inspection.helpers({
  formattedDate: function(date) {
    return moment(date).format('MMM D, YYYY');
  },
  formformattedDate: function(date) {
    return moment(date).format('MM/DD/YYYY');
  },
  formatRoute: function(form) {
    return "/inspection/"+FlowRouter.getParam("inspectionid")+"/"+form;
  },
  getUsers: function() {
    return Meteor.users.find({},{sort: {"profile.firstname":1}});
  },
  icon: function(status) {
    if(status === "n/a")
      return "times red";
    if(status === "pending")
      return "circle-o blue";
    return "check green";
  },
  inspection: function(){
    return Inspections.findOne({_id: FlowRouter.getParam('inspectionid')});
  },
  isAuthor: function(form_id) {
    insp = Inspections.findOne({_id: FlowRouter.getParam('inspectionid')});
    if(form_id == insp.authorid) {
      return "selected";
    }
    return "";
  },
  isComplete: function() {
    return (this.status == "complete");
  },
  isStatus: function(text) {
    if(this.status == text)
      return "selected";
    return "";
  },
  isNA: function() {
    return (this.status == "n/a");
  },
  isOperation: function(text) {
    if(this.operation == text)
      return "selected";
    return "";
  },
  isCircuit: function(text) {
    if(this.circuit == text)
      return "selected";
    return "";
  },
  isSid: function() {
    var user = Meteor.users.findOne({_id: Meteor.userId()});
    var name = user.profile.firstname+" "+user.profile.lastname;
    if(name == "Sidney Kwakkel")
      return true;
    return false;
  },
  isWeb: function() {
    return !Meteor.isCordova;
  },
  isWire: function(text) {
    if(this.wire == text)
      return "selected";
    return "";
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

Template.inspection.events({
  'click #edit-inspection-btn': function(e) {
    e.preventDefault();
    $("#edit-inspection").addClass("show");
  },
  'click #editinspectioncancel': function(e) {
    e.preventDefault();
    $("#edit-inspection").removeClass("show");
  },
  'click #editinspection': function(e) {
    var insp = Inspections.findOne({_id: FlowRouter.getParam('inspectionid')});
    var author = Meteor.users.findOne({_id: $("#inspection-author").val()});
    if(author && insp) {
      var authorname = author.profile.firstname+" "+author.profile.lastname;
      insp.inspectiondate = moment( $("#inspection-date").val(), 'MM/DD/YYYY').toDate(),
      insp.author = authorname,
      insp.authorid = $("#inspection-author").val(),
      insp.number = $("#inspection-number").val(),
      insp.po = $("#inspection-po").val(),
      insp.building = $("#inspection-building").val(),
      insp.address = $("#inspection-address").val(),
      insp.contact = $("#inspection-contact").val(),
      insp.contactnumber = $("#inspection-contact-number").val(),
      insp.manufacturer = $("#inspection-manufacturer").val(),
      insp.model = $("#inspection-model").val(),
      insp.operation = $("#inspection-operation").val(),
      insp.circuit = $("#inspection-circuit").val(),
      insp.wire = $("#inspection-wire").val(),
      insp.type = "Fire Inspection",
      insp.status = $("#inspection-status").val()
      Meteor.call('updateInspection',insp);
      toast("Inspection updated");
      $("#edit-inspection").removeClass("show");
    }else{
      toast("Cannot find inspector");
    }
  },
  'click #remove-inspection': function(e) {
    e.preventDefault();
    Meteor.call('removeInspection', FlowRouter.getParam('inspectionid'));
    FlowRouter.go('Inspections');
  }
});
