<?php
/**
 * GitHub API Php Client
 *
 * @link   https://github.com/bugra9/github-api
 * @author bugra9
 */

class Github {
	private $user = '';
	private $pass = '';
	private $owner = '';
	private $repo = '';
	private $branch = '';
	private $file = array();

	public function __construct($user, $password, $repo = "") {
		$this->user = $user;
		$this->pass = $password;
		$this->setRepo($repo);
	}

	public function setRepo($repo) {
		$temp = explode('/', $repo);
		if(count($temp) == 3) {
			$this->owner = $temp[0];
			$this->repo = $temp[1];
			$this->branch = $temp[2];
		}
	}

	public function add($path, $content, $base64 = true) {
		// Create a Blob
		if($base64)
			$content = base64_encode($content);
		$data = array(
	        'content' => $content,
	        'encoding' => "base64"
	    );
		$this->file[] = array(
			"sha" => $this->getData('git/blobs', $data, 'POST')->sha,
			"path" => $path,
			"mode" => "100644",
			"type" => "blob"
		);
	}

	public function commit($msg) {
		// Store the SHA for the latest commit
		$shaLatestCommit = $this->getData('git/refs/heads/'.$this->branch)->object;
		
		// Store the SHA for the tree
		$tree = $this->getData($this->getData($shaLatestCommit->url)->tree->url)->sha;
		$shaLatestCommit = $shaLatestCommit->sha;
		
		// Create a tree containing the file(s) we wish to add and post it
		$newTree = array();
		$newTree['tree'] = $this->file;
		$newTree['base_tree'] = $tree;
		$shaNewTree = $this->getData('git/trees', $newTree, 'POST')->sha;

		// Create a commit which references your new tree
		$data = array(
	        'message' => $msg,
	        'parents' => array($shaLatestCommit),
	        'tree' => $shaNewTree
	    );
		$shaNewCommit = $this->getData('git/commits', $data, 'POST')->sha;

		// Update HEAD
		$data = array(
	        'sha' => $shaNewCommit,
	        'force' => true
	    );
		$final = $this->getData('git/refs/heads/'.$this->branch, $data, 'POST');
		print_r($final);
	}

	public function getData($url, $data = array(), $method = 'GET') {
		if(substr($url, 0, 4) != 'http')
			$url = 'https://api.github.com/repos/'.$this->owner.'/'.$this->repo.'/'.$url;
	    $ch = curl_init($url);
	    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
	    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($ch, CURLOPT_HTTPHEADER, array('User-Agent: Awesome-Octocat-App', 'Content-Type: application/json', 
	        "Authorization: Basic " . base64_encode($this->user . ":" . $this->pass)));
	    $output = curl_exec($ch);
	    if(!$output)
	        echo 'Error: ' . curl_error($ch);
	    curl_close($ch);
	    return $output = json_decode($output);
	}
}
?>
