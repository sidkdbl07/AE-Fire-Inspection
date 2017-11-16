import { toast } from '../snackbar.js';

Template.ancillarydeviceunit.onCreated(function() {
  if(!Session.set('adusortby')) {
    Session.set('adusortby',"device");
  }
});

Template.ancillarydeviceunit.events({
  'click #addancillarydevice': function(e) {
    e.preventDefault();
    var name = $("#aduttype").val();
    var value = {};
    var confirm = $("label.btn.active").children('.radiobutton').attr('id');
    if(name == "" || !confirm) {
      toast("Error: Enter a valid device and confirmation value");
      return;
    }
    value.type = name;
    value.confirm = confirm.split('_')[1];
    Meteor.call('saveForm', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      form: FlowRouter.getParam('formtemplate'),
      dateentered: new Date(), // now
      name: new Date(), // needs to be unique
      type: 'radiobutton',
      value: value
    });
    $("label.btn.active").removeClass('active');
    $("#aduttype").val("");
    toast("Answer saved");
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
  'click .deleteform': function(e) {
    e.preventDefault();
    var id = $(e.target).attr('formid');
    if(!id) {
      id = $(e.target).parent('a').attr('formid'); // user clicked on the icon
    }
    Meteor.call('removeForm',id, FlowRouter.getParam('formtemplate'));
    toast("Unit removed");
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
    updated_form.value.type = $("#editaduttype").val();
    var confirmed = $("#editadutconfirm").children('label.btn.active').children('.radiobutton').attr('id');
    updated_form.value.confirmed = ((confirmed)?confirmed.split('_')[1]:"N/A");
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
    Session.set('adusortby', sortby);
  }
});

Template.ancillarydeviceunit.helpers({
  getDevices: function() {
    return Forms.find({},{sort:{dateentered:-1}}).fetch();
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
  isSortedBy: function(sortname) {
    if(Session.get("adusortby") && Session.get("adusortby") == sortname) {
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
  $("#"+selector).val(sel.value.type);
}
