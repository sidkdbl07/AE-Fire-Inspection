Meteor.publish('singleform', function(form_id) {
  return Forms.find({_id: form_id});
});

Meteor.publish('forms', function(inspectionid, form) {
  //return Forms.find();
  return Forms.find({inspectionid: inspectionid, form: form});
});

Meteor.publish('singleinspection', function(inspection_id) {
  return Inspections.find({_id: inspection_id});
});

ReactiveTable.publish('inspections-rt', function() {
  return Inspections;
});

Meteor.publish('inspectionitems', function(inspection_id) {
  return InspectionItems.find({inspectionid: inspection_id});
});

Meteor.publish('singleuser', function(user_id) {
  return Meteor.users.find({_id: user_id}, {fields: {_id:1,"emails.address":1,profile:1}});
});

Meteor.publish('users', function() {
  return Meteor.users.find();
});

ReactiveTable.publish('users-rt', function() {
  return Meteor.users;
});
