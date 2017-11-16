var exposed = FlowRouter.group({});
var authWebOnly = FlowRouter.group({
  triggersEnter: [function(context, redirect) {
    if(Meteor.userId()){
      if(Meteor.isCordova) {
        redirect('notfound');
      }
    }else{
      redirect('/login');
    }
  }]
});
var authOnly = FlowRouter.group({
  triggersEnter: [function(context, redirect) {
    if(!Meteor.userId()) {
      redirect('/login');
    }
  }]
});

authOnly.route('/account', {
  name: "Account",
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "account" });
  },
  subscriptions: function(params, queryParams) {
    this.register('user', Meteor.subscribe('singleuser', Meteor.userId()));
  }
});

exposed.route('/login', {
  name: 'Login',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "blank", main: "login" });
  }
});

authOnly.route('/', {
  name: 'Inspections',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "inspections" });
  },
  subscriptions: function(params, queryParams) {
    this.register('users', Meteor.subscribe('users'));
  }
});

authOnly.route('/inspection/:inspectionid', {
  name: 'Inspection',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "inspection" });
  },
  subscriptions: function(params, queryParams) {
    this.register('inspection', Meteor.subscribe('singleinspection', params.inspectionid));
    this.register('inspectionitems', Meteor.subscribe('inspectionitems', params.inspectionid));
    this.register('users', Meteor.subscribe('users'));
  }
});

authOnly.route('/inspection/items/:inspectionid', {
  name: 'Inspection Items',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "inspectionitems" });
  },
  subscriptions: function(params, queryParams) {
    this.register('inspection', Meteor.subscribe('singleinspection', params.inspectionid));
    this.register('inspectionitems', Meteor.subscribe('inspectionitems', params.inspectionid));
    this.register('users', Meteor.subscribe('users'));
  }
});

authOnly.route('/inspection/:inspectionid/:formtemplate', {
  name: 'Inspection Form',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "inspectionform" });
  },
  subscriptions: function(params, queryParams) {
    this.register('forms', Meteor.subscribe('forms', params.inspectionid, params.formtemplate));
    this.register('inspection', Meteor.subscribe('singleinspection', params.inspectionid));
    this.register('inspectionitems', Meteor.subscribe('inspectionitems', params.inspectionid));
    this.register('users', Meteor.subscribe('users'));
  }
});

authWebOnly.route('/user/:userid', {
  name: 'User',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "user" });
  },
  subscriptions: function(params, queryParams) {
    this.register('user', Meteor.subscribe('singleuser', params.userid));
  }
});

authWebOnly.route('/users', {
  name: 'Users',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "users" });
  }
});

FlowRouter.notfound = {
  name: "Not Found",
  action: function() {
    BlazeLayout.render('mainlayout', { side: "blank", main: "notfound" });
  }
};
