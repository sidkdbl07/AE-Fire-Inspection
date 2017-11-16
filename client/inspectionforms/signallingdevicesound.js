import { toast } from '../snackbar.js';

Template.signallingdevicesound.onCreated(function() {
  if(!Session.set('sdssortby')) {
    Session.set('sdssortby',"device");
  }
});

Template.signallingdevicesound.events({
  'change #editsdstype': function(e) {
    e.preventDefault();
    if($(e.target).val() == "O - Other") {
      $("#editsdstypeother").closest('.question-text').show();
      return;
    }
    $("#editsdstypeother").closest('.question-text').hide();
  },
  'change #sdstype': function(e) {
    e.preventDefault();
    if($(e.target).val() == "O - Other") {
      $("#sdstypeother").closest('.question-text').show();
      return;
    }
    $("#sdstypeother").closest('.question-text').hide();
  },
  'click #addfasdevice': function(e) {
    e.preventDefault();
    var value = {};
    var type = $("#sdstype").val()
    if(type == 'O - Other') {
      value.typeother = " "+$("#sdstypeother").val();
    }
    value.type = type;
    value.cct = $("#sdscct").val();
    value.location = $("#sdslocation").val();
    value.ambientdb = $("#sdsambient").val();
    value.signaldb = $("#sdssignal").val();
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
    $("#sdscct").val("");
    $("#sdslocation").val("");
    $("#sdsambient").val("");
    $("#sdssignal").val("");
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
    updated_form.value.type = $("#editsdstype").val();
    if(updated_form.value.type == "O- Other") {
      updated_form.value.typeother = $("#editsdstyeother").val()
    }
    updated_form.value.cct = $("#editsdscct").val();
    updated_form.value.location = $("#editsdslocation").val();
    updated_form.value.ambientdb = $("#editsdsambient").val();
    updated_form.value.signaldb = $("#editsdssignal").val();
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
    Session.set('sdssortby', sortby);
  }
});

Template.signallingdevicesound.helpers({
  formatCCT: function(cct) {
    if(cct == "")
      return "";
    return "(CCT: "+cct+")";
  },
  formatState: function(val) {
    if(val == "M - Missing" || val == "R - Requires Service or Repair") {
      return '<span style="color: red;">'+val+"<span>";
    }
    return '<span style="color: #111;">'+val+"<span>";
  },
  formatStatus: function(label, val) {
    if(val == "N/A") {
      return '<span style="color: lightgrey;">'+label+": "+val+"<span>";
    }
    if(val == "Not OK" || val == "No") {
      return '<span style="color: red;">'+label+": "+val+"<span>";
    }
    if(val == "Yes" || val == "Test OK") {
      return '<span style="color: green;">'+label+": "+val+"<span>";
    }
    return '<span style="color: #111;">'+label+": "+val+"<span>";
  },
  getDevices: function() {
    var sortby = Session.get('sdssortby');
    if(sortby == "location") {
      return Forms.find({},{sort:{'value.location': 1, dateentered:-1}}).fetch();
    }
    return Forms.find({},{sort:{'value.type': 1, dateentered:-1}}).fetch();
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
      "RHS - Single Remote Head",
      "O - Other"
    ]
  },
  getFormDeficiencies: function(formid) {
    sel = "";
    selectedDevice = Session.get("selectedDevice");
    if(selectedDevice && Object.keys(selectedDevice).length != 0) {
      return InspectionItems.find({formid: selectedDevice._id, type: 'deficiency'}).fetch();
    }
  },
  isDeficiencies: function(formid) {
    if(InspectionItems.find({formid: formid, type: 'deficiency'}).count() > 0)
      return true;
    return false;
  },
  isDevices: function() {
    return (Forms.find().count() > 0);
  },
  isDeviceTypeOther: function() {
    var sel = Session.get("selectedDevice")
    if(sel.value.type == "O - Other") {
      return true;
    }
    return false;
  },
  isSortedBy: function(sortname) {
    if(Session.get("sdssortby") && Session.get("sdssortby") == sortname) {
      return true;
    }
    return false;
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
  $("#"+selector).val(sel.value.type+" "+((sel.value.typeother)?sel.value.typeother:"")+" ("+sel.value.cct+") "+sel.value.location);
}
