import moment from 'moment';
import { toast } from '../snackbar.js';

Template.inspections.onRendered(function() {
  $("#inspection-date").datepicker();
});

Template.inspections.helpers({
  getUsers: function() {
    return Meteor.users.find({},{sort: {"profile.firstname":1}});
  },
  tableSettings: function(){
    return {
      collection: 'inspections-rt',
      rowsPerPage: 5,
      showFilter: true,
      showNavigation: 'auto',
      fields: [
        { key: '_id', hidden: true },
        { key: 'inspectiondate', label: 'Date', sortOrder: 1, sortDirection: 'descending', tmpl: Template.inspectionDate, headerClass: 'col-xs-2' },
        { key: 'building', label: 'Building', headerClass: 'col-xs-3' },
        { key: 'author', label: 'Inspector', headerClass: 'col-xs-2' },
        { key: 'status', label: 'Status', headerClass: 'col-xs-2' },
        { key: 'type', label: 'Type', headerClass: 'col-xs-2' },
        { key: '_id', label:"", tmpl: Template.inspectionDetailsBtn, headerClass: 'col-xs-1' }
      ],
      useFontAwesome: true,
    };
  }
});

Template.inspections.events({
  'click #addinspectionbtn': function(e) {
    e.preventDefault();
    $("#new-inspection").addClass("show");
  },
  'click #addinspectioncancel': function(e) {
    e.preventDefault();
    $("#new-inspection").removeClass("show");
  },
  'click #addinspection': function(e) {
    var tests = [
      {name: "Test Results", status: "n/a", trackrecords: false, form: "testresults"},
      {name: "Fire Alarm Panel/Control Unit Test", status: "n/a", trackrecords: false, form: "firealarmpaneltest"},
      {name: "Voice Communication Test", status: "n/a", trackrecords: false, form: "voicecommunicationtest"},
      {name: "Fire Alarm Panel/Control Unit Inspection", status: "n/a", trackrecords: false, form: "firealarmpanelinspection"},
      {name: "Power Supply Inspection", status: "n/a", trackrecords: false, form: "powersupplyinspection"},
      {name: "Annunciator, Remote Trouble Signal Unit, Display and Control Centre Test and Inspection", status: "n/a", trackrecords: false, form: "annunciatorremotetrouble"},
      {name: "Annunciator or Sequential Display", status: "n/a", trackrecords: false, form: "annunciatorsequential"},
      {name: "Emergency Power Supply Test and Inspection", status: "n/a", trackrecords: false, form: "emergencypowersupply"},
      {name: "Remote Trouble Signal Unit Test and Inspection", status: "n/a", trackrecords: false, form: "remotetroublesignal"},
      {name: "Printer Test", status: "n/a", trackrecords: false, form: "printertest"},
      {name: "Operation Test for Data Communication Link", status: "n/a", trackrecords: false, form: "operationtest"},
      {name: "Interconnection to the Fire Signal Receiving Centre", status: "n/a", trackrecords: false, form: "interconnectionfiresignal"},
      {name: "Ancillary Device Unit Tests", status: "n/a", trackrecords: true, count:0, form: "ancillarydeviceunit"},
      {name: "Fire Alarm System Inspection", status: "n/a", trackrecords: true, count:0, form: "firealarminspection"},
      {name: "Signalling Device Sound Level Measurements", status: "n/a", trackrecords: true, count:0, form: "signallingdevicesound"},
      {name: "EM Lighting", status: "n/a", trackrecords: true, count:0, form: "emlighting"},
      {name: "After Test Report Card", status: "n/a", trackrecords: false, form: "aftertestreport"},
      {name: "Last Inspection Date", status: "n/a", trackrecords: false, form: "lastinspectiondate"},
      {name: "Summary", status: "n/a", trackrecords: false, form: "summary"}
    ];
    var author = Meteor.users.findOne({_id: $("#inspection-author").val()});
    if(author) {
      var authorname = author.profile.firstname+" "+author.profile.lastname;
      var newinspection = {
        inspectiondate: moment( $("#inspection-date").val(), 'MM/DD/YYYY').toDate(),
        author: authorname,
        authorid: $("#inspection-author").val(),
        number: $("#inspection-number").val(),
        po: $("#inspection-po").val(),
        building: $("#inspection-building").val(),
        address: $("#inspection-address").val(),
        contact: $("#inspection-contact").val(),
        contactnumber: $("#inspection-contact-number").val(),
        manufacturer: $("#inspection-manufacturer").val(),
        model: $("#inspection-model").val(),
        operation: $("#inspection-operation").val(),
        circuit: $("#inspection-circuit").val(),
        wire: $("#inspection-wire").val(),
        type: "Fire Inspection",
        status: $("#inspection-status").val(),
        tests: tests
      };
      Meteor.call('createInspection',newinspection);
      toast("Inspection created");
      $("#inspection-client").val("");
      $("#new-inspection").removeClass("show");
    }else{
      toast("Cannot find inspector");
    }
  }
});

Template.inspectionDate.helpers({
  formattedDate: function(date) {
    return moment(date).format('MM/DD/YYYY');
  }
});
