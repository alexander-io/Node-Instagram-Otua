var fs = require('fs'),
    readline = require('readline'),
    ig_scrape = require('instagram-scraping'),
    request = require('request');

module.exports = {
  funx : class {
    getPosts(user) {
      return new Promise((resolve, reject) => {
        console.log('get posttt')
        // TODO : scrapeUserPage() or scrapeTag() ?
        ig_scrape.scrapeUserPage(user).then((result) => {
          console.log(result.medias)
          resolve(result.medias)
        })
      });
    }

    file_exists_and_creation(path_to_file) {
    	return new Promise((resolve, reject) => {
    		try {
    		  if (fs.existsSync(path_to_file)) {
    				// file exists
    				resolve()
    		  } else {
    				// file does not exist, so make it
    				fs.writeFile(path_to_file, '', (err) => {
              if (err) throw err
              console.log(path_to_file, 'created successfully')
            })

    			}
    		} catch(err) {
    		  console.error(err)
    		}
    	})
    }


    // this function is used to create keys for a table
    // take in : '/data/283372531/2029528263885669117.jpg'
    // put out : '2029528263885669117'
    extract_id(string) {
      let end_index = string.length - 4
      let start_index = string.split('/', 3).join('/').length+1;
      return string.substring(start_index,end_index)
    }

    formatPosts(rawPosts, username) {
      let result = [];
      rawPosts = JSON.parse(rawPosts)
      try {
        rawPosts = JSON.parse(rawPosts.contents.split('window._sharedData = ')[1].split('\;\<\/script>')[0]).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges
        rawPosts.forEach(function (item) {
          result.push({
            user : username,
            image: item.node.display_url,
            dimensions: item.node.dimensions,
            likes: item.node.edge_liked_by.count,
            video: item.node.is_video,
            code: item.node.shortcode,
            url: 'https://instagram.com/p/' + item.node.shortcode,
            timestamp: item.node.taken_at_timestamp
          })
        })
      } catch (e) {
        console.log(e)
      }
      return result;
    }

    // reads file into a list structure, resolve the list
    readFile(path_to_file) {
      return new Promise((resolve, reject) => {
        let result = [],
        line_reader = readline.createInterface({
          input : fs.createReadStream(__dirname + path_to_file)
        })
        line_reader.on('line', (line) => {
          result.push(line)
        })
        line_reader.on('close', () => {
          resolve(result)
        })
      })
    }
    download(uri, filename, callback){
      return new Promise((resolve, reject) => {
        request.head(uri, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
          request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
        });
      })

    }
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    }

  },
  q : class {
    constructor() {
      this.supporting_array = []
    }
    enqueue(x) {
      this.supporting_array.push(x)
    }
    dequeue() {
      return this.supporting_array.shift()
    }
  }
}
