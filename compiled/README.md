# Compiled library

**[Русская версия здесь.]**

The library is a single file (bundle), which contains a set of methods for working with the code on the client.
The file is intended for direct connection to the HTML file.
For example, like this:

```html
<!DOCTYPE html>
<head>
    <title>Example connection UduJS</title>
</head>
<body>
<h1>Example connection UduJS</h1>
<p>Damn, it work!</p>
<script src="js/mod/udujs-1.0.0.min.js"></script>
<script>
  var Debug = new UduJS({
    maxWidth: 'auto',
    fontSize: '1.2em',
    decimalPlaces: 4,
    popupColorScheme: 'dark',
  });
  
  Debug.show('Yeah, piece of cake!');
</script>
</body>
</html>
```

In this folder there is a library file that you can connect to your project.

[Русская версия здесь.]:./README.ru.md
