# Eternal Tables

Automatically expand form tables with additional rows when all required fields
have been filled in. Name attributes are automatically transformed to array-like
syntax (for use with [PHP][2], [jQuery Serialize Object][1], etc).

Install with `npm install jquery-eternal`

Example:

```html
<form>
  <table id=mytable>
    <tr>
      <td><input name='title' required value="A Canticle for Leibowitz"></td>
      <td>
        <label><input type='radio' name='age' value='used' required>Used</label>
        <label><input type='radio' name='age' value='new' required checked>New</label>
      </td>
      <td><input type='number' name='cost' required value="9.99"></td>
    </tr>
    <tr>
      <td><input name='title' required></td>
      <td>
        <label><input type='radio' name='age' value='used' required>Used</label>
        <label><input type='radio' name='age' value='new' required>New</label>
      </td>
      <td><input type='number' name='cost' required></td>
    </tr>
  </table>
</form>

<script src="jquery.eternal.js"></script>
<script>
  $("#mytable").eternal();
</script>
```

After calling the .eternal() method on the table, name attributes are changed
and the DOM will automatically create more elements as needed.

```html
<form>
  <table id=mytable>
    <tr>
      <td><input name='data[0][title]' required value="A Canticle for Leibowitz"></td>
      <td>
        <label><input type='radio' name='data[0][age]' value='used' required>Used</label>
        <label><input type='radio' name='data[0][age]'  value='new' required checked>New</label>
      </td>
      <td><input type='number' name='data[0][cost]' required value="9.99"></td>
    </tr>
    <tr>
      <td><input name='data[1][title]' required></td>
      <td>
        <label><input type='radio' name='data[1][age]' value='used' required>Used</label>
        <label><input type='radio' name='data[1][age]' value='new' required>New</label>
      </td>
      <td><input type='number' name='data[1][cost]' required></td>
    </tr>
  </table>
</form>
```


## API
### `.eternal('destroy')`

Stop appending rows to the table.

### `.eternal(options)`

Where options is passed on creation and is an object with one or more of these
properties:

* `assignId` - The name of an input to assign a UUID in each row.
If the field is not found, a hidden input will be added with this name.

See `demo.html` for additional examples.

[1]: https://github.com/macek/jquery-serialize-object
[2]: http://php.net/manual/en/faq.html.php#faq.html.arrays
