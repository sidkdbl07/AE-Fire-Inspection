import { SSR, Template } from 'meteor/meteorhacks:ssr';
import { Picker } from 'meteor/meteorhacks:picker';
import moment from 'moment';

Picker.route('/generate/pdf/:id', function(params, req, res, next) {
  var Future, Webshot, fileName, fs, fut, html, options;
  fs = Npm.require('fs');
  Future = Npm.require('fibers/future');
  Webshot = Npm.require('webshot');
  fut = new Future();
  SSR.compileTemplate('report', Assets.getText('report.html'));
  var css = Assets.getText('report.css');

  Template.report.helpers({
    dateSentence: function(date) {
      return moment(date).format('Do')+" day of "+moment(date).format('MMMM, YYYY');
    },
    deviceInitial: function(dev) {
      return dev.split(' - ')[0];
    },
    formatDate: function(date) {
      return moment(date).format('MMM D, YYYY')
    },
    getForms: function(inspectionid, name) {
      return Forms.find({inspectionid: inspectionid, form: name}).fetch();
    },
    getFormsWithIndex: function(inspectionid, name) {
      return Forms.find({inspectionid: inspectionid, form: name},{sort: {dateentered: -1}}).map(function(doc, index) {
        doc.index = index + 1;
        return doc;
      });
    },
    getInspectionItems: function(inspectionid, name) {
      return InspectionItems.find({inspectionid: inspectionid, type: name},{sort: {dateentered: -1}}).fetch();
    },
    getListRowYN: function() {
      return "<tr>" +
        "<td>"+this.value.type+"</td>" +
        "<td><div class='align-center'>"+((this.value.confirm == "Yes")?"<span class='green'>&#10004;</span>":"")+"</div></td>" +
        "<td><div class='align-center'>"+((this.value.confirm == "No")?"<span class='red'>&#10006;</span>":"")+"</div></td>" +
      "</tr>";
    },
    getRowYNNA: function(text, inspectionid, name) {
      var f = Forms.findOne({inspectionid: inspectionid, name: name});
      if(f && f.value) {
        return "<tr>" +
          "<td>"+text+"</td>" +
          "<td><div class='align-center'>"+((f.value == "Yes")?"<span class='green'>&#10004;</span>":"")+"</div></td>" +
          "<td><div class='align-center'>"+((f.value == "No")?"<span class='red'>&#10006;</span>":"")+"</div></td>" +
          "<td><div class='align-center'>"+((f.value == "N/A")?"&#10134;":"")+"</div></td>" +
        "</tr>";
      }
    },
    getRowForQ: function(text, field, units, inspectionid) {
      var value = "--";

      return "<tr>" +
        "<td>"+text+"</td>" +
        "<td colspan='3' style='background-color: #eee;'><div class='align-right'><label>"+field+" </label>"+value+" "+units+"</div></td>" +
      "</tr>";
    },
    getRowValue: function(text, inspectionid, name) {
      var f = Forms.findOne({inspectionid: inspectionid, name: name});
      if(f && f.value) {
        return "<tr>" +
          "<td>"+text+"</td>" +
          "<td colspan='3' style='background-color: #eee;'><div class='align-center'>"+f.value+"</div></td>" +
        "</tr>";
      }
    },
    getRowValueWithUnits: function(text, field, units, inspectionid, name) {
      var f = Forms.findOne({inspectionid: inspectionid, name: name});
      if(f && f.value) {
        return "<tr>" +
          "<td>"+text+"</td>" +
          "<td colspan='3' style='background-color: #eee;'><div class='align-right'><label>"+field+" </label>"+f.value+" "+units+"</div></td>" +
        "</tr>";
      }
    },
    getValue: function(text, inspectionid, name, linebreak) {
      var f = Forms.findOne({inspectionid: inspectionid, name: name});
      if(f && f.value)
        return "<label>"+text+"</label>"+f.value+((linebreak)?"<br/>":"");
    },
    logo: function() {
      return Meteor.absoluteUrl('images/logo-horiz.png');
    },
    isAlarmConfirmed: function(state) {
      if(state == "Yes") {
        return "<span class='green'>&#10004;</span>";
      }
      return "<span class='red'>&#10006;</span>";
    },
    isCorrectlyInstalled: function(state) {
      if(state == "C - Correctly Installed") {
        return "<span class='green'>&#10004;</span>";
      }
      return "";
    },
    isMissing: function(state) {
      if(state == "M - Missing") {
        return "<span class='red'>&#10006;</span>";
      }
      return "";
    },
    isRequiringMaintenance: function(state) {
      if(state == "R - Requires Service or Repair") {
        return "<span class='red'>&#10006;</span>";
      }
      return "";
    },
    isYesNoNotTested: function(state) {
      if(state == "Yes") {
        return "<span class='green'>&#10004;</span>";
      }
      if(state == "Not OK" || state == "No") {
        return "<span class='red'>&#10006;</span>";
      }
      return "&#10134;";
    },
    testNA: function(inspectionid, test) {
      var insp = Inspections.findOne({_id: inspectionid});
      for(var i=0; i<insp.tests.length; i++) {
        if(insp.tests[i].form == test) {
          if(insp.tests[i].status == 'n/a') {
            return true;
          }else{
            return false;
          }
        }else{
          continue;
        }
      }
    }
  });

  html = SSR.render('report', {
    css: css,
    insp: Inspections.findOne({_id: params.id}),
    testresults: Forms.find({inspectionid: params.id, formname: 'testresults'}).fetch()
  });

  // comment two lines
  res.setHeader( 'Content-Type', 'text/html; charset=utf-8' );
  res.end(html);
});
