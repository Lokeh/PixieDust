'use strict';


/* this is the magic that makes it possible */
function getValue(obj) {
    var pieces = obj.split(/[^A-Za-z]/);
    if (pieces.length <= 1) {
        return window[obj] ? eval(obj) : '';
    } else {
        return window[pieces[0]] ? eval(obj) : '';
    }
}

function setValue(obj, val) {
    var old = getValue(obj);
    eval(obj + ' = val;');
    return old;
}
/* END MAGIC */

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var bindingRegistry = function () {
    if (bindingRegistry.prototype._instance) {
        return bindingRegistry.prototype._instance;
    }
    bindingRegistry.prototype._instance = this;

    this.index = {};
};

function bindingRegister() { // This class keeps track of the variables we've bound in our view
    var registry = bindingRegistry();
    var boundElements = document.querySelectorAll('[data-binding]');
    for (var binding in registry.index) {
        var elements = [].filter.call(
        boundElements,

        function (el) {
            return el.getAttribute('data-binding') === binding;
        });
        registry.index[binding].elements = elements;
    }
}


function bindingCompile() { // This function parses the {{ variable }} tags in the body and translates it to spans with attribute data-binding="variable",
    var registry = new bindingRegistry();
    [].forEach.call( // allowing us to change the displayed text while keeping track of what we're binding
    document.querySelectorAll('[data-bound]'),

    function (el, i) {
        var bindings = el.innerHTML.match(/{{([^}}]+)}}/g); // finds all {{ variable }} tags in document
        bindings = bindings.map(function (bind) {
            return bind.match(/{{([^}}]+)}}/)[1]; // removes {{ }}
        });

        console.log(bindings);
        bindings.forEach(function (bind) {
            registry.index[bind.trim()] = {
                'value': getValue(bind.trim()), // Push variable names and values into global registry for use in bindingRegister() and bindingUpdate();
                'elements': []
            };
            var reg = new RegExp('{{' + escapeRegExp(bind) + '}}', 'g');
            console.log(reg);
            el.innerHTML = el.innerHTML.replace(reg, '<span class="data-binding" data-binding="' + bind.trim() + '">' + getValue(bind.trim()) + '</span>');
        });
    }

    );
    bindingRegister();
}

function bindingUpdate() { // This function watches the bound variables and writes to the view if the values in our registry do not match our variables. This is one-way binding.
    var registry = bindingRegistry();
    for (var binding in registry.index) {
        if (getValue(binding) !== registry.index[binding].value) {
            registry.index[binding].value = getValue(binding);
            registry.index[binding].elements.forEach(function (el) {
                el.innerHTML = registry.index[binding].value;
            });
        }
    }
}

function bindingCycle() { // Our binding cycle, runs every 60ms for lack of visual lag
    return setTimeout(function () {
        bindingUpdate();
        bindingCycle();
    }, 60);
}

function modelBind() { // This function establishes the event listeners for our forms - AKA, the 2nd data-binding.
    [].forEach.call(
    document.querySelectorAll('[data-model]'), // Input and text area forms, update variables
    function (el, i) {
        var attr = el.getAttribute('data-model');
        el.value = getValue(attr);
        el.addEventListener("keyup", function () {
            setValue(attr, el.value);
        });
    });

    [].forEach.call(
    document.querySelectorAll('[data-click]'), // Buttons and links, run a function
    function (el, i) {
        var attr = el.getAttribute('data-click');
        el.addEventListener('click', function () {
            eval(attr);
        });
    });
}

function bindingInit() { // Initiate the binding - has to go at the end of our definitions in order to populate our forms... for now!
    bindingCompile();
    modelBind();
    bindingCycle();
}
