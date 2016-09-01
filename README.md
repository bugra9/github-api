# PHP, Javascript GitHub API
Creating/changing/deleting multiple files in a single commit

## Basic usage
### PHP
```php
$gh = new Github('user', 'token', 'owner/repo/branch');
$gh->add('path/fileName', 'file content');
$gh->add('path/fileName', 'file content (base64 encoded)', false);
$gh->commit("message");
// $gh->commit("message", "Author Name", "Author Email");
```

### Javascript
```javascript
var gh = new Github('user', 'token', 'owner/repo/branch');
gh.add('path/fileName', 'file content');
gh.add('path/fileName', 'file content (base64 encoded)', false);
gh.commit("message"); 
// gh.commit("message", "Author Name", "Author Email");
```
