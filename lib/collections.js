var Collections = {}

Forms = Collections.Forms = new Meteor.Collection("forms");
Forms.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});
Meteor.methods({
  saveForm: function(element) {
    var existingvalue = Forms.findOne({inspectionid: element.inspectionid, form: element.form, name: element.name});
    if(existingvalue) {
      Forms.remove(existingvalue._id);
    }
    Forms.insert(element);
    updateCount(element.inspectionid, element.form);
    return
  },
  updateForm: function(form) {
    Forms.update(form._id, form);
    return;
  },
  removeForm: function(formid, formname) {
    var form = Forms.findOne({_id: formid});
    var insp = Inspections.findOne({_id: form.inspectionid});
    Forms.remove(formid);
    // Make sure comments, deficiencies and recommendations are removed too.
    var items = InspectionItems.find({formid: formid}).fetch();
    items.forEach(function(item) {
      InspectionItems.remove(item._id);
    })
    updateCount(insp._id, formname);
    return;
  }
});

function updateCount(inspectionid, form) {
  var insp = Inspections.findOne({_id: inspectionid});
  var count = Forms.find({inspectionid: inspectionid, form: form}).count();
  for(var i=0; i<insp.tests.length; i++) {
    if(insp.tests[i].form != form) {
      continue;
    }else{
      insp.tests[i].count = count;
    }
  }
  Inspections.update(insp._id, insp);
}

///////////////////////////////////////////
// INSPECTIONS
Inspections = Collections.Inspections = new Meteor.Collection("inspections");
Inspections.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});
Meteor.methods({
  createInspection: function(elements) {
    elements = elements || {};

    return Inspections.insert(elements);
  },
  updateInspection: function(inspection) {
    Inspections.update(inspection._id, inspection);
  },
  removeInspection: function(inspectionid) {
    var items = InspectionItems.find({inspectionid: inspectionid}).fetch();
    items.forEach(function(item) {
      InspectionItems.remove(item._id);
    });
    var forms = Forms.find({inspectionid: inspectionid}).fetch();
    forms.forEach(function(form) {
      Forms.remove(form._id);
    });
    Inspections.remove(inspectionid);
  }
});

///////////////////////////////////////////
// INSPECTION ITEMS
InspectionItems = Collections.InspectionItems = new Meteor.Collection("inspectionitems");
InspectionItems.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});
Meteor.methods({
  createInspectionItem: function(elements) {
    elements = elements || {};
    console.log("Adding item");
    return InspectionItems.insert(elements);
  },
  removeInspectionItem: function(inspectionitemid) {
    InspectionItems.remove(inspectionitemid);
  }
});



//////////////////////////////////
// USERS
Meteor.users.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove:function() {
    return true;
  }
})
Meteor.methods({
  addUser: function(elements) {
    elements = elements || {};

    Accounts.createUser({ email: elements.email, password: elements.password, profile: {firstname: elements.firstname, lastname: elements.lastname}})
  },
  updateUserDetails: function(user) {
    return Meteor.users.update(user._id, {
      $set: {
        'emails.0.address': user.email,
        'profile.firstname': user.firstname,
        'profile.lastname': user.lastname
      }
    });
  },
  removeUser: function(userid) {
    Meteor.users.remove(userid);
  }
});
