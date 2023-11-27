const blogBackend = (app) => {
  const CF_API = "https://codeforces.com/api/user.info?handles=";

  const ArticlesData = require("./db_models/ArticleModel");
  const PublishedArticlesData = require("./db_models/PublishedArticleModel");
  const CommentsData = require("./db_models/CommentModel");

  app.post("/edit_article_title", (req, res) => {
    const key_title = req.body.new_title.trim().toLowerCase();
    const key = req.body.email + key_title;
    ArticlesData.updateOne(
      { unique_key: req.body.unique_key },
      { $set: { unique_key: key } }
    )
      .then((result) => {
        console.log("title edited", result);
      })
      .catch((err) => {
        console.error("edit_article_title post", err);
      });

    res.end();
  });

  app.post("/delete_article", async (req, res) => {
    try {
      await PublishedArticlesData.deleteOne({
        unique_key: req.body.unique_key,
      });

      if (!req.body.unpublish && !req.body.retract) {
        await ArticlesData.deleteOne({ unique_key: req.body.unique_key });
      }
      console.log("article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
    res.end();
  });

  app.post("/save_article", (req, res) => {
    const key_title = req.body.title.trim().toLowerCase();
    const key = req.body.email + key_title;
    console.log("save article", req.body);
    if (
      req.body.publish_status === true &&
      req.body.review_status === 2 &&
      req.body.text_editor_save === undefined
    ) {
      PublishedArticlesData.updateOne(
        { linking_key: req.body._id },
        {
          unique_key: key,
          email: req.body.email,
          title: req.body.title,
          article_html: req.body.article_html,
          ops_array: req.body.ops_array,
        },
        { upsert: true } //act as insert if no match is found
      )
        .then((result) => {
          console.log("article saved to publish article db", result);
        })
        .catch((err) => {
          console.error("save_article post", err);
        });
    }

    // If req.body.publish_status is undefined in your code, the updateOne operation will still proceed, and the existing publish_status field in the document will not be modified.
    ArticlesData.updateOne(
      { unique_key: key },
      {
        email: req.body.email,
        author: req.body.author,
        title: req.body.title,
        review_status: req.body.review_status,
        publish_status: req.body.publish_status,
        date: Date.now(),
        ops_array: req.body.ops_array,
        article_html: req.body.article_html, //it html string for the incoming object
      },
      { upsert: true } //act as insert if no match is found
    )
      .then((result) => {
        console.log("article saved", result);
      })
      .catch((err) => {
        console.error("save_article post", err);
      });

    res.end(); //always end a request by send,end,status etc,else it doesn't end by itself
    //end gives status 200 with empty data
  });

  //using async await alternative
  // const find_published_articles = async (match) => {
  //   try {
  //     const result = await PublishedArticlesData.find(match)
  //       .populate({
  //         path: "linking_key",
  //         select: "author review_status",
  //       });

  //     const joint_data = result.map((res) => {
  //       const jd = {
  //         article_html: res.article_html,
  //         title: res.title,
  //         unique_key: res.unique_key,
  //         review_status: res.linking_key.review_status,
  //         author: res.linking_key.author,
  //       };
  //       return jd;
  //     });

  //     console.log("joint result of two models", joint_data);
  //     return joint_data;
  //   } catch (err) {
  //     console.error("retrieve_article pt", err);
  //     return [{}];
  //   }
  // };

  // app.get("/retrieve_article", async (req, res) => {
  //   let match = {};

  //   try {
  //     if (req.query.all_blogs_review_status) {
  //       //for published articles request from AllBlogs page
  //       match = { review_status: req.query.review_status };
  //       const jd = await find_published_articles(match);
  //       console.log('ra1', jd);
  //       res.send(jd);
  //     } else {
  //       if (req.query.published_key) {
  //         match = { unique_key: req.query.published_key };
  //         const jd = await find_published_articles(match);
  //         console.log('ra2', jd);
  //         res.send(jd);
  //       } else {
  //         if (req.user) match = { email: req.user._json.email };
  //         console.log("query", req.query.key);
  //         if (req.query.key) match = { unique_key: req.query.key };
  //         const result = await ArticlesData.find(match);
  //         res.send(result);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error in /retrieve_article:", error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });

  const find_published_articles = (match) => {
    // in JavaScript, the function specified in the .then method returns a new promise. This behavior is central to the chaining capability provided by promises.
    return PublishedArticlesData.find(match)
      .populate({
        path: "linking_key", //the path we want to populate,i.e., the foreign key like(nosql doesn't have concept of foreign key) attribute in publised article db
        select: "author review_status publish_status email date",
      }) //Specify the path to populate
      .then((result) => {
        const joint_data = result.map((res) => {
          const jd = {
            article_html: res.article_html,
            title: res.title,
            unique_key: res.unique_key,
            review_status: res.linking_key.review_status,
            author: res.linking_key.author,
            publish_status: res.linking_key.publish_status,
            ops_array: res.ops_array,
            email: res.linking_key.email,
            date: res.linking_key.date,
          };
          return jd; //this is a promise as every async function return a promise(here jd will be wrapped in a promise and then returned as we know from namaste javascript)
        });

        console.log("joint result of two models", joint_data.length);
        return joint_data;
      })
      .catch((err) => {
        console.error("retrieve_article pt", err);
        return [{}];
      });

    return "hello"; //if we don't handle the mongoose method properly which is async by default then this hello will be returned
  };
  app.get("/retrieve_article", (req, res) => {
    let match = {}; //match will remain empty and all articles will be fetched if no case is hit

    if (req.query.all_blogs_publish_status) {
      //for published articles request from AllBlogs page
      match = { publish_status: req.query.publish_status };
      //when the promise resolves the result of promise is used by the .then method
      find_published_articles(match).then((jd) => {
        res.send(jd);
      });
    } else {
      //retrieve published for display and also for reverting
      if (req.query.published_key) {
        match = { unique_key: req.query.published_key };
        find_published_articles(match).then((jd) => {
          res.send(jd);
        });
      } else {
        //user for myblogs
        if (req.user) match = { email: req.user._json.email };

        //display unpublished article
        console.log("query", req.query.key);
        if (req.query.key) match = { unique_key: req.query.key };
        ArticlesData.find(match)
          .then((result) => {
            // console.log("article retrieved", result);

            res.send(result);
            // res.end();
          })
          .catch((err) => {
            console.error("retrieve_article pt", err);
          });
      }
    }
  });

  app.get("/cf_handle_details", (req, res) => {
    const handle = req.query.cf_handle;

    let url = CF_API + handle;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw "wrong with cf api";
      })
      .then((response) => {
        console.log(response.result.length);
        res.send(response.result[0]);
      })

      .catch((err) => {
        console.error("cf_handle_details", "something wrong with cf api", err);
        res.end();
      });
  });

  app.post("/create_comment", (req, res) => {
    let ct = req.body;
    CommentsData.create(
      {
        article_unique_key:ct.unique_key,
        user: ct.user,
        content: ct.content,
        
      })
        .then(async (result) => {
          console.log("post comment", result);
          try{
          res.send(result)//the whole document is returned
          }
          catch(err)
          {
            console.log("post comment 1", err);
            res.end();
          }
        })
        .catch((err) => {
          console.log("post comment", err);
          res.end();
        })
    
  
  });

  app.post("/create_reply", (req, res) => {
    let ct = req.body;
    
    CommentsData.create(
      {
        article_unique_key:ct.unique_key,
        user: ct.user,
        content: ct.content,
        parent_id:ct.parent_id,
      })
        .then(async (result) => {
          console.log("post create reply", result);
          try{
          const result1 =await CommentsData.updateOne(
            { _id: ct.parent_id },
            { $push: { replies: result._id } })

            console.log('post create reply 1',result1)
            const doc=await CommentsData.findOne({_id:result._id})

            res.send(doc)
          }
          catch(err)
          {
            console.log("post create reply ", err);
            res.end();
          }
        })
        .catch((err) => {
          console.log("post comment", err);
          res.end();
        })
    
  
  });

  app.get("/retrieve_comments", (req, res) => {
    
    CommentsData.find(
      {article_unique_key:req.query.unique_key,parent_id:null}
    )
      .then((result) => {
        console.error("retrieve comments", result);
        res.send(result)//array
      })
      .catch((err) => {
        console.error("retrieve comments", err);
        res.end();
      });
    
  });


app.get("/retrieve_replies", (req, res) => {
    
  CommentsData.find(
    {parent_id:req.query.parent_id}
  )
    .then((result) => {
      console.error("retrieve replies", result);
      res.send(result)//array
    })
    .catch((err) => {
      console.error("retrieve replies", err);
      res.end();
    });
});
};
module.exports = blogBackend;
