/**
 * GitHub API Javascript Client
 *
 * @link   https://github.com/bugra9/github-api
 * @author bugra9
 */

function Github(p1, p2, p3) {
	this.user = '';
    this.pass = '';
    this.owner = '';
    this.repo = '';
    this.branch = '';
    this.file = [];

	this.init = function(user, password, repo) {
		repo = typeof repo !== 'undefined' ?  repo : "";
		this.user = user;
		this.pass = password;
		this.setRepo(repo);
    };
    this.setRepo = function(repo) {
    	var temp = repo.split('/');
    	if(temp.length == 3) {
    		this.owner = temp[0];
    		this.repo = temp[1];
    		this.branch = temp[2];
    	}
    };

    this.add = function(path, content, base64) {
        base64 = typeof base64 !== 'undefined' ?  base64 : true;
        if(base64)
            content = window.btoa(unescape(encodeURIComponent(content)));
        var data = {
            'content': content,
            'encoding': "base64"
        };
        this.file.push({
            "sha": this.getData('git/blobs', data, 'POST').sha,
            "path": path,
            "mode": "100644",
            "type": "blob"
        });
    };

    this.commit = function(msg, authorName, authorEmail) {
        authorName = typeof authorName !== 'undefined' ?  authorName : false;
        authorEmail = typeof authorEmail !== 'undefined' ?  authorEmail : false;
        // Store the SHA for the latest commit
        var shaLatestCommit = this.getData('git/refs/heads/'+this.branch).object;

        // Store the SHA for the tree
        var tree = this.getData(this.getData(shaLatestCommit.url).tree.url).sha;
        shaLatestCommit = shaLatestCommit.sha;
        
        // Create a tree containing the file(s) we wish to add and post it
        var newTree = {};
        newTree.tree = this.file;
        newTree.base_tree = tree;
        var shaNewTree = this.getData('git/trees', newTree, 'POST').sha;

        // Create a commit which references your new tree
        var data = {
            'message': msg,
            'parents': [shaLatestCommit],
            'tree': shaNewTree
        };
        if(authorName && authorEmail)
            data.author = {
                'name': authorName,
                'email': authorEmail,
                'date': (new Date()).toISOString()
            };
        var shaNewCommit = this.getData('git/commits', data, 'POST').sha;

        // Update HEAD
        data = {
            'sha': shaNewCommit,
            'force': true
        };
        var final = this.getData('git/refs/heads/'+this.branch, data, 'POST');
        console.log(final);
    };

    this.getData = function(url, data, method) {
    	data = typeof data !== 'undefined' ?  data : new Array();
    	method = typeof method !== 'undefined' ?  method : "GET";
    	var output;

    	if(url.substr(0, 4) != 'http')
    		url = 'https://api.github.com/repos/' + this.owner + '/' + this.repo + '/' + url;

    	var request = new XMLHttpRequest();
		request.open(method, url, false);
		request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		request.setRequestHeader('Authorization', 'Basic ' + window.btoa(this.user + ':' + this.pass));
		request.setRequestHeader('Accept', 'application/json');
		request.send(JSON.stringify(data));

		if (request.status === 200 || request.status === 201) {
			return JSON.parse(request.responseText);
		}
		else
			console.log("ERROR: "+request.status);

		return false;
    };

	this.init(p1, p2, p3);
}
