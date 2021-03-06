module("Component");

test('should create an element', function(){
  var comp = new vjs.Component({}, {});

  ok(comp.el().nodeName);
});

test('should add a child component', function(){
  var comp = new vjs.Component({});

  var child = comp.addChild("component");

  ok(comp.children().length === 1);
  ok(comp.children()[0] === child);
  ok(comp.el().childNodes[0] === child.el());
  ok(comp.getChild('component') === child);
  ok(comp.getChildById(child.id()) === child);
});

test('should init child coponents from options', function(){
  var comp = new vjs.Component({}, {
    children: {
      'component': true
    }
  });

  ok(comp.children().length === 1);
  ok(comp.el().childNodes.length === 1);
});

test('should dispose of component and children', function(){
  var comp = new vjs.Component({});

  // Add a child
  var child = comp.addChild("Component");
  ok(comp.children().length === 1);

  // Add a listener
  comp.on('click', function(){ return true; });
  var data = vjs.getData(comp.el());
  var id = comp.el()[vjs.expando];

  comp.dispose();

  ok(!comp.children(), 'component children were deleted');
  ok(!comp.el(), 'component element was deleted');
  ok(!child.children(), 'child children were deleted');
  ok(!child.el(), 'child element was deleted');
  ok(!vjs.cache[id], 'listener cache nulled')
  ok(vjs.isEmpty(data), 'original listener cache object was emptied')
});

test('should add and remove event listeners to element', function(){
  var comp = new vjs.Component({}, {});

  // No need to make this async because we're triggering events inline.
  // We're going to trigger the event after removing the listener,
  // So if we get extra asserts that's a problem.
  expect(2);

  var testListener = function(){
    ok(true, 'fired event once');
    ok(this === comp, 'listener has the component as context');
  };

  comp.on('test-event', testListener);
  comp.trigger('test-event');
  comp.off('test-event', testListener);
  comp.trigger('test-event');
});

test('should trigger a listener once using one()', function(){
  var comp = new vjs.Component({}, {});

  expect(1);

  var testListener = function(){
    ok(true, 'fired event once');
  };

  comp.one('test-event', testListener);
  comp.trigger('test-event');
  comp.trigger('test-event');
});

test('should trigger a listener when ready', function(){
  expect(2);

  var optionsReadyListener = function(){
    ok(true, 'options listener fired')
  };
  var methodReadyListener = function(){
    ok(true, 'ready method listener fired')
  };

  var comp = new vjs.Component({}, {}, optionsReadyListener);

  comp.triggerReady();

  comp.ready(methodReadyListener);

  // First two listeners should only be fired once and then removed
  comp.triggerReady();
});

test('should add and remove a CSS class', function(){
  var comp = new vjs.Component({}, {});

  comp.addClass('test-class');
  ok(comp.el().className.indexOf('test-class') !== -1);
  comp.removeClass('test-class');
  ok(comp.el().className.indexOf('test-class') === -1);
});

test('should show and hide an element', function(){
  var comp = new vjs.Component({}, {});

  comp.hide();
  ok(comp.el().style.display === 'none');
  comp.show();
  ok(comp.el().style.display === 'block');
});

test('should change the width and height of a component', function(){
  var container = document.createElement('div');
  var comp = new vjs.Component({}, {});
  var el = comp.el();
  var fixture = document.getElementById('qunit-fixture');

  fixture.appendChild(container);
  container.appendChild(el);
  // Container of el needs dimensions or the component won't have dimensions
  container.style.width = '1000px'
  container.style.height = '1000px'

  comp.width('50%');
  comp.height('123px');

  ok(comp.width() === 500, 'percent values working');
  ok(vjs.getComputedStyleValue(el, 'width') === comp.width() + 'px', 'matches computed style');
  ok(comp.height() === 123, 'px values working');

  comp.width(321);
  ok(comp.width() === 321, 'integer values working');
});
