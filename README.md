Automatically expand form tables with additional rows when all required fields
have been filled in. Name attributes are automatically transformed to array-like
syntax (for use with [PHP][2], [jQuery Serialize Object][1], etc).

Install with `npm install jquery-eternal`

Example:

```html
<form>
  <table id=mytable>
    <tr>
      <td><input name='title' required></td>
      <td>
        <label><input type='radio' name='used' required>Used</label>
        <label><input type='radio' name='new' required>New</label>
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

See `demo.html` for additional examples.

[1]: https://github.com/macek/jquery-serialize-object
[2]: http://php.net/manual/en/faq.html.php#faq.html.arrays
