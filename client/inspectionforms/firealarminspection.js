import { toast } from '../snackbar.js';

Template.firealarminspection.onCreated(function() {
  if(!Session.set('fasisortby')) {
    Session.set('fasisortby',"device");
  }
});

Template.firealarminspection.events({
  'click #addfasdevice': function(e) {
    e.preventDefault();
    var value = {};
    value.type = $("#fasitype").val();
    value.cct = $("#fasicct").val();
    value.location = $("#fasilocation").val();
    value.state = $("#fasistate").val();
    var alarmconfirmed = $("#fasialarmconfirmed").children('label.btn.active').children('.radiobutton').attr('id');
    value.alarmconfirmed = ((alarmconfirmed)?alarmconfirmed.split('_')[1]:"N/A");
    var annunciator = $("#fasiannunciator").children('label.btn.active').children('.radiobutton').attr('id');
    value.annunciator = ((annunciator)?annunciator.split('_')[1]:"N/A");
    var supervisionwiring = $("#fasisupervisionwiring").children('label.btn.active').children('.radiobutton').attr('id');
    value.supervisionwiring = ((supervisionwiring)?supervisionwiring.split('_')[1]:"N/A");
    var ground = $("#fasiground").children('label.btn.active').children('.radiobutton').attr('id');
    value.ground = ((ground)?ground.split('_')[1]:"N/A");
    Meteor.call('saveForm', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      form: FlowRouter.getParam('formtemplate'),
      dateentered: new Date(), // now
      name: new Date(), // needs to be unique
      type: 'radiobutton',
      value: value
    });
    // reset values and provide feedback to user
    $("label.btn.active").removeClass('active');
    $("#fasicct").val("");
    $("#fasilocation").val("");
    toast("Answer saved");
  },
  'click .deleteform': function(e) {
    e.preventDefault();
    var id = $(e.target).attr('formid');
    if(!id) {
      id = $(e.target).parent('a').attr('formid'); // user clicked on the icon
    }
    Meteor.call('removeForm',id, FlowRouter.getParam('formtemplate'));
    toast("Unit removed");
  },
  'click .deficienciesform': function(e) {
    e.preventDefault();
    var id = $(e.target).attr('formid');
    if(!id) {
      id = $(e.target).parent('a').attr('formid'); // user clicked on the icon
    }
    form = Forms.findOne({_id: id});
    Session.set("selectedDevice", form);
    resetDeficienciesForm("newformdeficiency");
    $("#add-deficiency").addClass("show");
  },
  'click #adddeficiencybtn': function(e) {
    e.preventDefault();
    var sel = Session.get('selectedDevice');
    if(sel && $("#newformdeficiency").val() != "") {
      Meteor.call('createInspectionItem', {
        inspectionid: FlowRouter.getParam('inspectionid'),
        dateentered: new Date(),
        text: $("#newformdeficiency").val(),
        formid: sel._id,
        type: "deficiency"
      });
      toast("Deficiency added");
    }else{
      toast("Could not add deficiency");
    }
    $("#newformdeficiency").val("");
  },
  'click #canceladddeficiencybtn': function(e) {
    e.preventDefault();
    $("#add-deficiency").removeClass("show");
    Session.set("selectedDevice", {});
  },
  'click .editform': function(e) {
    e.preventDefault();
    var id = $(e.target).attr('formid');
    if(!id) {
      id = $(e.target).parent('a').attr('formid'); // user clicked on the icon
    }
    form = Forms.findOne({_id: id});
    Session.set("selectedDevice", form);
    $("#edit-device").addClass("show");
  },
  'click #editformbtn': function(e) {
    e.preventDefault();
    var updated_form = Session.get('selectedDevice');
    updated_form.value.type = $("#editfasitype").val();
    updated_form.value.cct = $("#editfasicct").val();
    updated_form.value.location = $("#editfasilocation").val();
    updated_form.value.state = $("#editfasistate").val();
    var alarmconfirmed = $("#editfasialarmconfirmed").children('label.btn.active').children('.radiobutton').attr('id');
    updated_form.value.alarmconfirmed = ((alarmconfirmed)?alarmconfirmed.split('_')[1]:"N/A");
    var annunciator = $("#editfasiannunciator").children('label.btn.active').children('.radiobutton').attr('id');
    updated_form.value.annunciator = ((annunciator)?annunciator.split('_')[1]:"N/A");
    var supervisionwiring = $("#editfasisupervisionwiring").children('label.btn.active').children('.radiobutton').attr('id');
    updated_form.value.supervisionwiring = ((supervisionwiring)?supervisionwiring.split('_')[1]:"N/A");
    var ground = $("#editfasiground").children('label.btn.active').children('.radiobutton').attr('id');
    updated_form.value.ground = ((ground)?ground.split('_')[1]:"N/A");
    Meteor.call('updateForm',updated_form);
    $("#edit-device").removeClass("show");
    toast("Device Saved");
    //Session.set("selectedDevice", {});
  },
  'click #canceleditformbtn': function(e) {
    e.preventDefault();
    $("#edit-device").removeClass("show");
    Session.set("selectedDevice", {});
  },
  'click .sort': function(e) {
    e.preventDefault();
    var sortby = $(e.target).attr('sortby');
    Session.set('fasisortby', sortby);
  }
});

Template.firealarminspection.helpers({
  formatCCT: function(cct) {
    if(cct == "")
      return "";
    return "(CCT: "+cct+")";
  },
  formatState: function(val) {
    if(val == "M - Missing" || val == "R - Requires Service or Repair") {
      return '<span style="color: red;">'+val+"<span>";
    }
    return '<span style="color: green">'+val+"<span>";
  },
  formatStatus: function(label, val) {
    if(val == "N/A") {
      return '<span style="color: lightgrey;">'+label+": "+val+"<span>";
    }
    if(val == "Not OK" || val == "No") {
      return '<span style="color: red;">'+label+": "+val+"<span>";
    }
    return '<span style="color: #111;">'+label+": "+val+"<span>";
  },
  getDevices: function() {
    var sortby = Session.get('fasisortby');
    if(sortby == "location") {
      return Forms.find({},{sort:{'value.location': 1, dateentered:-1}}).fetch();
    }
    return Forms.find({},{sort:{'value.type': 1, dateentered:-1}}).fetch();
  },
  getDeviceStates: function() {
    return [
      "C - Correctly Installed",
      "M - Missing",
      "R - Requires Service or Repair"
    ]
  },
  getDeviceTypes: function() {
    return [
      "M - Manual Pull Station",
      "HT - Heat Detector, Fixed Temperature",
      "RHT - Heat Detector - Rate of Rise",
      "S - Smoke Detector",
      "DS - Duct Smoke Detector",
      "FS - Sprinkler Flow Switch",
      "TS - Sprinkler Tamper Switch",
      "PS - Sprinkler Pressure Switch",
      "SA - Smoke Alarm Single Station Type",
      "B - Bell",
      "K - Horn (Klaxon Type)",
      "C - Chime",
      "V - Visual Alarm Appliance",
      "SP - Loudspeaker",
      "HSP - Horn Loaudspeaker",
      "T - Fire Fighters Telephone",
      "AD - Ancillary Devices",
      "EOL - End of Line Resistor",
      "BO - Boster Panel",
      "EXIT - Exit Light",
      "CP - Combo Pack",
      "BP - Battery Pack",
      "RHD - Double Remote Head",
      "RHS - Single Remote Head"
    ]
  },
  getFormDeficiencies: function(formid) {
    sel = "";
    selectedDevice = Session.get("selectedDevice");
    if(selectedDevice && Object.keys(selectedDevice).length != 0) {
      return InspectionItems.find({formid: selectedDevice._id, type: 'deficiency'}).fetch();
    }
  },
  isSortedBy: function(sortname) {
    if(Session.get("fasisortby") && Session.get("fasisortby") == sortname) {
      return true;
    }
    return false;
  },
  isDeficiencies: function(formid) {
    if(InspectionItems.find({formid: formid, type: 'deficiency'}).count() > 0)
      return true;
    return false;
  },
  isDevices: function() {
    return (Forms.find().count() > 0);
  },
  numDeficiencies: function(formid) {
    return InspectionItems.find({formid: formid, type: 'deficiency'}).count()
  },
  optionState: function(val) {
    sel = "";
    selectedDevice = Session.get("selectedDevice");
    if(selectedDevice && Object.keys(selectedDevice).length != 0 && selectedDevice.value.state == val)
      sel = " selected"
    return "<option value='"+val+"'"+sel+">"+val+"</option>";
  },
  optionType: function(val) {
    sel = "";
    selectedDevice = Session.get("selectedDevice");
    if(selectedDevice && Object.keys(selectedDevice).length != 0 && selectedDevice.value.type == val)
      sel = " selected"
    return "<option value='"+val+"'"+sel+">"+val+"</option>";
  },
  radioSelected: function(att, val) {
    selectedDevice = Session.get("selectedDevice");
    if( selectedDevice && Object.keys(selectedDevice).length != 0  && selectedDevice.value[att] == val) {
      return true;
    }
    return false;
  },
  selectedDevice: function() {
    return Session.get('selectedDevice');
  }
});

function resetDeficienciesForm(selector) {
  var sel = Session.get("selectedDevice");
  $("#"+selector).val(sel.value.type+"("+sel.value.cct+") "+sel.value.location);
}
