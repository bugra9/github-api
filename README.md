# PHP, Javascript GitHub API

## Basic usage
### PHP
```php
$gh = new Github('user', 'token', 'owner/repo/branch');
$gh->add('path/fileName', 'file content');
$gh->add('path/fileName', 'file content (base64 encoded)', false);
$gh->commit("message");
```

### Javascript
```javascript
var gh = new Github('user', 'token', 'owner/repo/branch');
gh.add('path/fileName', 'file content');
gh.add('path/fileName', 'file content (base64 encoded)', false);
gh.commit("message");
```
