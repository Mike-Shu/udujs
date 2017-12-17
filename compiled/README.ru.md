# Скомпилированная библиотека

**[The English version is here.]**

Библиотека представляет собой единый файл (бандл), который содержит набор методов для работы с кодом на клиенте.
Файл предназначен для непосредственного подключения к файлу HTML.
Например, вот так:

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

В папке <code>[compiled](./)</code> находится файл библиотеки, который вы можете подключить к своему проекту.

[The English version is here.]:./README.md
