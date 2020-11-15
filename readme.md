# exorciser.ch gems 💎

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
