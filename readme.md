# exorciser.ch gems 💎 x

#### How to use
```html
<!doctype html>
<html><head>
  <script type='module'>
    import w from 'https://gem.exorciser.ch/app/wrapper.js'
  </script>
</head><body>
  <gem-wrapper id='gem' app='cs/frequency'></gem-wrapper>
</body></html>
```

##### Events

##### Events
```javascript
gem.onchange = (event) => {
  console.log(event)
}
```

#### How to contribute
   * get your local webserver ready
   * clone the repository
   * edit your `.htaccess` to contain:
      ```Header always set Access-Control-Allow-Origin "*"
      RewriteEngine on
      RewriteBase /
      RewriteRule ^$ index.html [QSA,L]
      RewriteCond "%{REQUEST_FILENAME}"   !-f
      RewriteRule ^(.*) proxy.php?ref=$1 [QSA,L]
      ```
   * Open your app on `localhost/#[appname]`
   * Commit your changes
