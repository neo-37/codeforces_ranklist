const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieSession = require("cookie-session");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
require("./auth");

const ArticlesData = require("./db_models/ArticleModel");

mongoose
  .connect(process.env.MONGODB_URI_LOCAL)
  .catch((err) => console.log("error connecting to ranklistDb", err));

//.on is an event listener in node js,listening to error event on moongoose connection[0]
//.once is also event listener but it listens to the open event just once after the initial connection
const db = mongoose.connection; //connection[0]
db.once("open", function () {
  console.log("we are connected to cloud database!");
});
db.on("error", (err) => console.log("error on mongoose connection[0]", err));

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  cf_handle: String,
  rating: {
    type: Number,
    default: 0,
  },
  image: String,
  maxRating: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "-",
  },
});

const UsersData = mongoose.model("user", userSchema);

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
});

const AdminsData = mongoose.model("admin", adminSchema);

const announcementSchema = new mongoose.Schema({
  image: {
    type: String,
  },
});

const AnnouncementsData = mongoose.model("announcement", announcementSchema);

//connection with frontend

//the methods have some caveat write comments regarding them
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(
  cookieSession({
    name: "session",
    keys: ["ranklist"],
    maxAge: 24 * 60 * 60 * 1000, //1day
  })
);
const { readFile, writeFile } = require("fs");
const { auth } = require("google-auth-library");

const CF_API = "https://codeforces.com/api/user.info?handles=";

// Middleware
//It parses incoming requests with JSON payloads and is based on body-parser.
//app.use(express.json());
// Increase the payload size limit (e.g., 10MB)
app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));
//express.urlencoded() is a built-in middleware in Express.js.
//The main objective of this method is to parse the incoming request with urlencoded payloads and is based upon the body-parser.
//This method returns the middleware that parses all the urlencoded bodies.

//get requests are simple url string
//so these two are only needed for post requests as in post we have a http payload(or we can say body)

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URI,
    failureRedirect: process.env.FRONTEND_URI,
  })
);

function add_user(user, guser) {
  UsersData.updateOne(
    { email: guser.email },
    {
      email: guser.email,
      name: guser.name,
      cf_handle: user.handle,
      rating: user.rating ? user.rating : 0,
      image: user.titlePhoto,
      maxRating: user.maxRating,
      rank: user.rank,
    },
    { upsert: true }
  )
    .then((result) => {
      console.log("add_user", result);
    })
    .catch((err) => {
      console.error("add_user", err);
    });
}

//updating every 10mins
function update_list() {
  UsersData.find()
    .then((users) => {
      let url = CF_API;
      for (let i = 0; i < users.length; i++)
        url += users[i].cf_handle + (i == users.length - 1 ? "" : ";");

      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json(); //response is not in json
          }
          throw new Error("Something went wrong with CF API"); //without this the promise will resolve and try to go to next then
        })
        .then((res) => {
          //bulkwrite sends batch or write operation instead of one at a time,reducing network requests
          UsersData.bulkWrite(
            res.result.map((value, id) => ({
              updateOne: {
                filter: { email: users[id].email },
                update: {
                  $set: {
                    maxRating: value.maxRating,
                    rating: value.rating ? value.rating : 0,
                    image: value.titlePhoto,
                    rank: value.rank,
                  },
                },
              },
            }))
          )
            .then((result) => {
              console.log("Bulk write operation successful:", result);
            })
            .catch((err) => {
              console.error("Error during bulk write operation:", err);
            });
        })
        .catch((err) => {
          console.log("update_list fn", err);
        });
    })
    .catch((err) => {
      console.log("update_list", err);
    });
}

setInterval(update_list, 10 * 60 * 1000);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect(process.env.FRONTEND_URI);
});

app.get("/user_list", (req, res) => {
  UsersData.find()
    .then((users) => {
      res.send(
        users.sort(function (a, b) {
          return b.rating - a.rating;
        })
      );
    })
    .catch((err) => {
      console.log("user_list get", err);
      res.send([]);
    });
});

function get_admin_list(cb) {
  AdminsData.find()
    .then((users) => {
      cb(users);
    })
    .catch((err) => {
      console.log("get_admin_list", err);
      cb([]);
    });
}

function check_admin(guser, cb) {
  AdminsData.find({ email: guser.email })
    .then((users) => {
      cb(users.length > 0);
    })
    .catch((err) => {
      console.log("check_admin", err);
      cb(false);
    });
}

async function verify_admin(guser) {
  // verify if admin present
  AdminsData.updateOne(
    { email: guser.email },
    { $set: { verified: true, name: guser.name } }
  )
    .then((result) => {
      console.log("verify_admin", result);
    })
    .catch((err) => {
      console.log("verify_admin", err);
    });
}
app.get("/user_g_info", async (req, res) => {
  if (req.user) {
    await verify_admin(req.user._json);
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: {
        name: req.user._json.name,
        picture: req.user._json.picture,
        email: req.user._json.email,
      },
    });
    // })
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});
app.get("/all_admins", (req, res) => {
  get_admin_list(function (data) {
    res.send(data);
  });
});

function find_cfuser_email(my_email, cb) {
  UsersData.find({ email: my_email })
    .then((user) => {
      cb(user[0]);
    })
    .catch((err) => {
      console.log("find_cfuser_email", err);
      cb(null); //null
    });
}

app.get("/is_linked", (req, res) => {
  if (req.user) {
    find_cfuser_email(req.user._json.email, function (linked_user_data) {
      res.status(200).json({
        error: false,
        message: "Successfully Loged In",
        user: linked_user_data,
      });
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

function check_and_add(handle, guser, cb) {
  //handle should not contain ; semicolon
  if (!handle.includes(";")) {
    console.log("Do not contain semicolon");
    let url = CF_API + handle;

    //very imp to return the response.json(), as it is a promise that will be used in then
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong");
      })
      .then((response) => {
        add_user(response.result[0], guser);
        console.log("check_and_add", response.result[0]);
        cb({
          cf_handle: response.result[0].handle,
          email: guser.email,
          image: response.result[0].titlePhoto,
          maxRating: response.result[0].maxRating,
          name: guser.name,
          rank: response.result[0].rank,
          rating: response.result[0].rating ? response.result[0].rating : 0,
        });
      })
      .catch((error) => {
        console.error("check_and_add", error);
        cb(null);
      });
  } else cb(null);
}

app.get("/new_cf_user", (req, res) => {
  if (req.user) {
    if (req.query.cf_id.length > 0) {
      console.log("new_cf_user rt", req.query.cf_id);
      check_and_add(req.query.cf_id, req.user._json, function (cf_user) {
        res.status(200).json({
          error: false,
          message: cf_user ? "Found cf user" : "User not found!",
          user: cf_user,
        });
      });
    } else res.status(404).json({ error: true, message: "input not found" });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

function delete_user(my_email) {
  UsersData.deleteOne({ email: my_email })
    .then((result) => {
      console.log("delete_user", result.deletedCount);
    })
    .catch((err) => {
      console.error("delete_user", err);
    });
}
app.get("/remove_user", (req, res) => {
  // removing from sideinfo
  console.log("remove_user", req.user._json.email);
  delete_user(req.user._json.email);
  res.end();
});

app.post("/remove_user_from_list", (req, res) => {
  //Removing CF USER by admin
  console.log("/remove_user_from_list");
  console.log("Params pass:", req.body);
  check_admin(req.body, function (data) {
    console.log(data);
    if (data) {
      delete_user(req.body.cf_handle_email);
      res.status(200).json({
        error: false,
        message: "removed Successfully",
        isAdmin: true,
      });
    } else
      res.status(200).json({
        error: false,
        message: "Not removed",
        isAdmin: false,
      });
  });
});

function add_admin(my_email) {
  AdminsData.updateOne(
    { email: my_email },
    {
      verified: false,
      name: "",
    },
    { upsert: true } //act as insert if no match is found
  )
    .then((result) => {
      console.log("add_admin", result);
    })
    .catch((err) => {
      console.error("add_admin", err);
    });
}
app.post("/add_admin", (req, res) => {
  console.log("add_admin rt", req.body.add_email);
  check_admin(req.body, function (data) {
    console.log(data);
    if (data) {
      add_admin(req.body.add_email);
      res.status(200).json({
        error: false,
        message: "Added Successfully",
        isAdmin: true,
      });
    } else
      res.status(200).json({
        error: false,
        message: "Not Add",
        isAdmin: false,
      });
  });
});
function remove_admins(emails) {
  AdminsData.bulkWrite(
    emails.map((my_email) => ({
      deleteOne: {
        filter: { email: my_email },
      },
    }))
  )
    .then((result) => {
      console.log("Bulk write operation successful in remove_admins:");
    })
    .catch((err) => {
      console.error("Error during bulk write operation in remove_admins:", err);
    });
}
app.post("/remove_admins", (req, res) => {
  console.log("post /remove_admin", req.body.email);
  console.log(req.body.email_list);
  check_admin(req.body, function (data) {
    console.log("data in check_admin, post /remove_admins route", data);
    if (data) {
      remove_admins(req.body.email_list);
      res.status(200).json({
        error: false,
        message: "Successfully Removed Admins",
        isAdmin: true,
      });
    } else
      res.status(200).json({
        error: false,
        message: "Not Removed Admins",
        isAdmin: false,
      });
  });
});
app.get("/is_admin", (req, res) => {
  if (req.user)
    check_admin(req.user._json, function (data) {
      res.send(data);
    });
  else res.send(false);
});

app.post("/announcement", async (req, res) => {
  const img = req.body.image;
  await AnnouncementsData.create({ image: img })
    .then((reply) => {
      console.log("/accouncement post", reply._id);
    })
    .catch((err) => {
      console.error("/accouncment post", err);
    });
  res.status(200).json({ message: "Image stored successfully!" });
});

app.get("/announcement", async (req, res) => {
  // Fetch the image document from MongoDB using the provided imageId
  const images = await AnnouncementsData.find();

  if (images.length > 0) {
    const imageString = images[0];
    console.log(imageString._id);
    res.json({
      img: imageString.image,
    });
  } else res.status(404).json({ img: "no img present" });
});

app.get("/delete_announcement", async (req, res) => {
  AnnouncementsData.deleteOne({}).then((reply) => {
    console.log("delete img", reply);
  });

  res.status(200).json({ message: "Image deleted successfully!" });
});

app.post("/edit_article_title", (req, res) => {
  const key_title = req.body.new_title.trim().toLowerCase();
  const key = req.body.email + key_title;
  ArticlesData.updateOne({unique_key:req.body.unique_key}, { $set: {unique_key:key} })
  .then((result) => {
    console.log("title edited", result);
  })
  .catch((err) => {
    console.error("edit_article_title post", err);
  });

  res.end();
});

app.post("/delete_article", (req, res) => {
  ArticlesData.deleteOne({unique_key:req.body.unique_key})
  .then((result) => {
    console.log("deleted article", result);
  })
  .catch((err) => {
    console.error("delete_article post", err);
  });

  res.end();
});
app.post("/save_article", (req, res) => {
  console.log("save article", req.body);

  const key_title = req.body.title.trim().toLowerCase();
  const key = req.body.email + key_title;
  console.log(key);
  ArticlesData.updateOne(
    { unique_key: key },
    {
      email: req.body.email,
      author: req.body.author,
      title: req.body.title,
      ops_array: req.body.ops_array,
      article_html: req.body.html_string,
      review_status: req.body.review_status,
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

app.get("/retrieve_article", (req, res) => {
  match = {};
  if (req.user) match = { email: req.user._json.email };
  console.log("query", req.query.key);
  if (req.query.key) match = { unique_key: req.query.key };
  console.log("match", match);
  ArticlesData.find(match)
    .then((result) => {
      // console.log("article retrieved", result);
     
      res.send(result);
      // res.end();
    })
    .catch((err) => {
      console.error("retrieve_article pt", err);
    });
});

app.get("/cf_handle_details",(req,res)=>{

 const handle=req.query.cf_handle;

    let url = CF_API + handle;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw("wrong with cf api")
      })
      .then((response)=>{
        console.log(response.result)
res.send(response.result[0]);
      })

      .catch((err)=>{
        console.error("cf_handle_details","something wrong with cf api",err)
        res.end()
      })

})

// Catch-all route (should be defined after all specific routes)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

app.listen(3000, () => {
  console.log("Server port :3000 ");
});
