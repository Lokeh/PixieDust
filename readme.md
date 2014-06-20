PixieDust
==============
Angular-like two-way data binding. I got curious how Angular's magic two-way binding with variables and forms worked, so I decided to try implementing it myself.

In your JS, you can use it like so:

```javascript
window.onload = function () {
  this.likes = 'Potatoes';
  this.setLikes = function (string) {
      likes = string;
  };

  this.Test = 'Super ninja two-way data biiiiind!!!!!!';

  function Person(name, age) {
      return {
          'name': name,
              'age': age
      };
  }
  this.Kathy = new Person('Kathy', 23);
  
  
  bindingInit(); // compile our HTML, bind our variables and begin the update cycle
};
```

And in your HTML, similar to AngularJS' syntax:

```html
<div data-bound>
	<h1>Hello, {{ Kathy.name }}!</h1>
  <p>{{ Test }}</p>
  <p>I like: {{ likes }}</p>

  Name: <input type="text" data-model="Kathy.name">
  <br />
  <textarea type="text" style="width: 50%" data-model="Test"></textarea>
  <br />Likes:
  <button data-click="setLikes('Turtles')">Turtles</button>
  <button data-click="setLikes('Potatoes')">Potatoes</button>
</div>
<div data-bound>{{ whatever }}</div>
```

TODO
-------
 - Apparently addEventHandler does not garbage collect on node destruct. Either handle this or switch to binding directly to the node property.
 - Support for radios, checkboxes
 - Repeat
 - Filtering
 - Multiple scopes
 - Custom triggers
