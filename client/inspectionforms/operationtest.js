import { toast } from '../snackbar.js';

Template.operationtest.events({
  "change .radiobutton": function(e) {
    e.preventDefault();
    var name = $(e.target).attr('name');
    var value = $(e.target).attr('id').split('_')[1];
    Meteor.call('saveForm', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      form: FlowRouter.getParam('formtemplate'),
      name: name,
      type: 'radiobutton',
      value: value
    });
    // deselect all othr buttons
    var name = $(e.target).attr('name');
    var answers = $("input[name="+name+"]");
    $.each(answers, function(index, inp) {
      if($(inp).parent('label').hasClass('btn-primary')) {
        $(inp).parent('label').removeClass('btn-primary');
        $(inp).parent('label').addClass('btn-default');
      }
    });
    // select chosen answer
    $(e.target).parent('label').removeClass("btn-default");
    $(e.target).parent('label').addClass("btn-primary");
    toast("Answer saved");
  },
  "change .textfield": function(e) {
    e.preventDefault();
    var name = $(e.target).attr('name');
    var value = $(e.target).val();
    Meteor.call('saveForm', {
      inspectionid: FlowRouter.getParam('inspectionid'),
      form: FlowRouter.getParam('formtemplate'),
      name: name,
      type: 'textfield',
      value: value
    });
    toast("Answer saved");
  }
});

Template.operationtest.helpers({
  getValue: function(str) {
    var form = Forms.findOne({inspectionid: FlowRouter.getParam("inspectionid"), name: str});
    if(form)
      return form.value;
    return "";
  },
  isSelected: function(str) {
    var [name, value] = str.split("_");
    var form = Forms.findOne({inspectionid: FlowRouter.getParam("inspectionid"), name: name, value: value});
    if(form)
      return true;
    return false;
  }
});
