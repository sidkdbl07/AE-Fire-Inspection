Template.inspectionform.onRendered(function() {
  this.autorun(function() {
    // We want to default non-saved values to N/A
    FlowRouter.subsReady('forms', function() {
      var name = "";
      $(".question-text").find('input.radiobutton:not(.addedit)').each(function(i,e) {
        if(name == $(e).attr('name')) { // we have multiple elements with the same name, so only do one.
          return;
        }
        name = $(e).attr('name');
        var na_selector = "input[id=']"+name+"_N/A']";
        if( $(na_selector) == null ) {// if N/A option doesn't exist, quit
          console.log("No N/A")
          return;
        }
        var count = Forms.find({name: name}).count();
        if(count < 1) { // look for a form already saved, otherwise we need to save this as a value
          Meteor.call('saveForm', {
            inspectionid: FlowRouter.getParam('inspectionid'),
            form: FlowRouter.getParam('formtemplate'),
            name: name,
            type: 'radiobutton',
            value: 'N/A'
          });
        }
      });
    })
  });
});

Template.inspectionform.events({
  'change .test-status.radiobutton': function(e) {
    e.preventDefault();
    var status = $(e.target).attr('name'); // status Level
    var insp = Inspections.findOne({_id: FlowRouter.getParam("inspectionid")});
    var test = FlowRouter.getParam("formtemplate");
    for(var i=0; i<insp.tests.length; i++) {
      if(insp.tests[i].form != test) {
        continue;
      }else{
        insp.tests[i].status = status;
        Meteor.call('updateInspection',insp);
      }
    };
  }
});

Template.inspectionform.helpers({
  formtemplate: function(){
     return FlowRouter.getParam('formtemplate');
  },
  getInspection: function(){
    var insp = Inspections.findOne({_id: FlowRouter.getParam("inspectionid")});
    if(insp) {
      return insp;
    }
  },
  isTestComplete: function(){
    var insp = Inspections.findOne({_id: FlowRouter.getParam("inspectionid")});
    if(insp) {
      var test = FlowRouter.getParam("formtemplate");
      for(var i=0; i<insp.tests.length; i++) {
        if(insp.tests[i].form != test) {
          continue;
        }else{
          return (insp.tests[i].status == 'complete');
        }
      };
    }
    return false;
  },
  isTestNA: function(){
    var insp = Inspections.findOne({_id: FlowRouter.getParam("inspectionid")});
    if(insp) {
      var test = FlowRouter.getParam("formtemplate");
      for(var i=0; i<insp.tests.length; i++) {
        if(insp.tests[i].form != test) {
          continue;
        }else{
          return (insp.tests[i].status == 'n/a');
        }
      };
    }
    return false;
  },
  isTestPending: function(){
    var insp = Inspections.findOne({_id: FlowRouter.getParam("inspectionid")});
    if(insp) {
      var test = FlowRouter.getParam("formtemplate");
      for(var i=0; i<insp.tests.length; i++) {
        if(insp.tests[i].form != test) {
          continue;
        }else{
          return (insp.tests[i].status == 'pending');
        }
      };
    }
    return false;
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
