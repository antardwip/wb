var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const mongoose = require('mongoose');
var port = process.env.PORT || 3000;

app.use((req, res, next) => {
      res.setHeader('Permissions-Policy', '');
      next();
});

server.listen(port, function () {
      //console.log('Server listening at port %d', port);
});

var allusers = {};
var loggedinusers = new Object();
var admin = null;
var totalconnections = 0;

// connecting to internal mongodb instance.
var config = JSON.parse(process.env.APP_CONFIG);
var mongoPassword = 'lordjslogin';


mongoose.connect("mongodb://" + config.mongo.user + ":" + mongoPassword + "@" + config.mongo.hostString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
      console.error('Failed to connect to MongoDB', err);
});

//schema for
let y2025_news_headline_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      title: String,
      short_text: String,
      image: String,
      youtube_embed: String,
      block_number: Number,
      frontpage_comment: String,
      category: String,
      date_stamp: Number
}, {
      collection: '  y2025-news-headlines-collection'
});
let y2025_news_headline = mongoose.model('y2025_news_headline', y2025_news_headline_schema);

//schema for
let y2025_news_article_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      full_newstext: String,
      image: String,
      footer_ad: String,
      date_stamp: Number
}, {
      collection: '  y2025-news-articles-collection'
});
let y2025_news_article = mongoose.model('y2025_news_article', y2025_news_article_schema);

//schema for
let y2024_news_headline_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      title: String,
      short_text: String,
      image: String,
      youtube_embed: String,
      block_number: Number,
      frontpage_comment: String,
      category: String,
      date_stamp: Number
}, {
      collection: '  y2024-news-headlines-collection'
});
let y2024_news_headline = mongoose.model('y2024_news_headline', y2024_news_headline_schema);

//schema for
let y2024_news_article_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      full_newstext: String,
      image: String,
      footer_ad: String,
      date_stamp: Number
}, {
      collection: '  y2024-news-articles-collection'
});
let y2024_news_article = mongoose.model('y2024_news_article', y2024_news_article_schema);


//schema for
let y2023_news_headline_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      title: String,
      short_text: String,
      image: String,
      youtube_embed: String,
      block_number: Number,
      frontpage_comment: String,
      category: String,
      date_stamp: Number
}, {
      collection: '  y2023-news-headlines-collection'
});
let y2023_news_headline = mongoose.model('y2023_news_headline', y2023_news_headline_schema);


let y2023_news_article_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      full_newstext: String,
      image: String,
      footer_ad: String,
      date_stamp: Number
}, {
      collection: '  y2023-news-articles-collection'
});
let y2023_news_article = mongoose.model('y2023_news_article', y2023_news_article_schema);

//schema for
let y2022_news_headline_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      title: String,
      short_text: String,
      image: String,
      youtube_embed: String,
      block_number: Number,
      frontpage_comment: String,
      category: String,
      date_stamp: Number
}, {
      collection: '  y2022-news-headlines-collection'
});
let y2022_news_headline = mongoose.model('y2022_news_headline', y2022_news_headline_schema);

//schema for
let y2022_news_article_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      full_newstext: String,
      image: String,
      footer_ad: String,
      date_stamp: Number
}, {
      collection: '  y2022-news-articles-collection'
});
let y2022_news_article = mongoose.model('y2022_news_article', y2022_news_article_schema);

//schema for
let y2021_news_headline_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      title: String,
      short_text: String,
      image: String,
      youtube_embed: String,
      block_number: Number,
      frontpage_comment: String,
      category: String,
      date_stamp: Number
}, {
      collection: '  y2021-news-headlines-collection'
});
let y2021_news_headline = mongoose.model('y2021_news_headline', y2021_news_headline_schema);

//schema for
let y2021_news_article_schema = new mongoose.Schema({
      _id: { type: String, required: true },
      full_newstext: String,
      image: String,
      footer_ad: String,
      date_stamp: Number
}, {
      collection: '  y2021-news-articles-collection'
});
let y2021_news_article = mongoose.model('y2021_news_article', y2021_news_article_schema);


//schema for
let videos_schema = new mongoose.Schema({
      _id: String,
      title: String,
      url: String,
      extra: String
}, {
      collection: 'videos'
});
let vids = mongoose.model('vids', videos_schema)


//schema for
let mtvBanner_schema = new mongoose.Schema({
      _id: String,
      gif: String,
      startTime: String,
      stopTime: String,
      skipBanner: Boolean,
      xtra: String
}, {
      collection: 'mtvBannersCollection'
});
let mtvBanner = mongoose.model('mtvBanner', mtvBanner_schema)

var newsFrontpageHeadlines = []

// WHEN A WEB-PAGE CONNECTS...
io.sockets.on('connection', function (socket) {

      //  Create or save news article- admin only (#mainNews button, .posButton,#U1, #U2, ...)
      socket.on('updateNewsArticle', (anObject) => {
            console.log("in updateNewsArticle");
            var allData = anObject;
            console.log("allData[_id] = " + allData['_id']);
            var dateStored = parseInt(allData["_id"].substring(1, allData["_id"].length));
            const date = new Date(dateStored);
            console.log("dateStored = " + dateStored);
            const year = date.getFullYear();
            console.log(year);
            //variable and a string combination to call the schema
            const modelName = "y" + year + "_news_article";
            const thisNews = mongoose.model(modelName);
            thisNews.findOne({
                  _id: allData._id
            }).exec()
                  .then((result) => {
                        if (!result) { //newsMainpage record not found - make a new one
                              var data = new thisNews(allData);
                              data.save()
                                    .then(savedInfo => {
                                          console.log('User saved successfully:', savedInfo);
                                          socket.emit('SingleNewsArticle', savedInfo);
                                    })
                                    .catch(error => {
                                          console.log(error + " - updateData make new singleNews");
                                    });
                        } else { //singleNews record  found - updating data
                              console.log("");
                              for (var k in allData) {
                                    if (allData.hasOwnProperty(k)) {
                                          console.log("2Updating Data - " + k + ':' + allData[k]);
                                          if (k !== "_id") { //as record already exists, remove _id from the list
                                                result[k] = allData[k];
                                          }
                                    }
                              }
                              result.save()
                                    .then(savedInfo => {
                                          console.log('User saved successfully:', savedInfo);
                                          socket.emit('SingleNewsArticle', savedInfo);
                                    })
                                    .catch(error => {
                                          console.log(error + " - updateNewsArticle");
                                    });
                        };
                  })
                  .catch((error) => {
                        // Handle any errors here
                        console.log(error + " - database error in updateNewsArticle");
                  });
      });


      //  Create or save News headline - admin only (#mainNews button, .posButton,#U1, #U2, ...)
      socket.on('updateNewsHeadline', (anObject) => {
            console.log("in updateNewsHeadline");
            var allData = anObject;
            var dateStored = parseInt(allData["_id"]);
            const date = new Date(dateStored);
            const year = date.getFullYear();
            console.log(year);
            // variable and a string combination to call the schema so it is stored in the correct variable for the year
            // - otherwise the variable would get bigger and bigger
            const modelName = "y" + year + "_news_headline";
            const thisNews = mongoose.model(modelName);
            console.log("allData._id = " + allData._id);
            console.log("allData.block_number = " + allData.block_number);
            thisNews.findOne({
                  _id: allData._id
            }).exec()
                  .then((result) => {
                        if (!result) { //newsBox record not found - make a new one
                              var data = new thisNews(allData);
                              data.save()
                                    .then(savedInfo => {
                                          console.log('User saved successfully:', savedInfo);
                                          socket.emit('SingleNewsHeadline', savedInfo);
                                    })
                                    .catch(error => {
                                          console.log(error + " - create newsitem_headline failed");
                                    });
                        } else { //newsitem_headline record  exists already - updating data
                              console.log("");
                              for (var k in allData) {
                                    if (allData.hasOwnProperty(k)) {
                                          console.log("2Updating Data - " + k + ':' + allData[k]);
                                          if (k !== "_id") { //as record already exists, remove _id from object
                                                console.log("allData[" + k + "] = " + allData[k]);
                                                result[k] = allData[k];                   //result{} refreshes all its values from anObject{} received from admin.
                                                console.log("result[" + k + "] = " + result[k]);
                                          }
                                    }
                              }
                              result.save()
                                    .then(savedInfo => {
                                          console.log('User saved successfully:', savedInfo);
                                          // io.emit('newsboxTextsUpdated', allData);
                                          socket.emit('SingleNewsHeadline', savedInfo);
                                    })
                                    .catch(error => {
                                          console.log(error + " - newsitem_headline update failed");
                                    });
                        };
                  })
                  .catch((error) => {
                        // Handle any errors here
                        console.log(error + " - database error in updateNewsHeadline");
                  });
      });


      //     RETRIEVE the 16 news headlines - admin only
      socket.on('retrieve16NewsHeadlinesAdmin', () => {
            // For the headlines frontpage, we select 16 newsitems in order of their ascending position index (block_number) from 1 and 16 (the order they appear on the page)
            // all other news items block_numbers are set to 90
            // If there are not 16 news items numbered 1 to 16 in the current year, we go to the previoud year to get the remainder.
            //when clients connect, they do not each do this search through the database to get the 16 news headlines - they download the 'newsFrontpageHeadlines' file
            console.log("in retrieve16NewsHeadlinesAdmin  app");
            const date = new Date();
            var year = date.getFullYear();
            var remainder = 16108;
            var all16Headlines = [];
            // using a variable (the year) and a string combination to call the schema
            const modelName = "y" + year + "_news_headline";
            const thisNews = mongoose.model(modelName);
            console.log("modelName = " + modelName);
            thisNews.find()
                  .sort({
                        block_number: 1  //ascending order
                  }) // sort by block_number field
                  .limit(16) // Select 16 items
                  .then((sixteenDocuments) => {
                        all16Headlines = sixteenDocuments;
                        console.log("all16Headlines.length = " + all16Headlines.length);
                        for (var i = all16Headlines.length - 1; i > 0; i--) {
                              //console.log("i = "+i);
                              //console.log(all16Headlines[i]['date_stamp'] + "  aiiiieeeee");
                              if (all16Headlines[i]['block_number'] > 16) {  //remove from Frontpage Headlines list any news with position > 16
                                    console.log("Deleting: " + all16Headlines[i]);  //this should only happen if the 1-16 positions are spread across two different years
                                    all16Headlines.splice(i, 1);
                              }
                        }

                        remainder = 16 - all16Headlines.length
                        console.log("Only" + all16Headlines.length + "items"); // The sorted and selected documents
                        console.log("Need" + remainder + "more");
                        //there will only be a remainder if the 16 news headlines are spread across two years, eg dec 2022 and Jan 2023


                        if (year > 2022 && remainder > 0) {
                              year = year - 1;
                              const modelNewName = "y" + year + "_news_headline";
                              const prevYearNews = mongoose.model(modelNewName);
                              console.log("modelNewName = " + modelNewName);
                              prevYearNews.find()
                                    .sort({
                                          block_number: 1  //sort by block_number field, ascending order
                                    })
                                    .limit(remainder) // limit balance of news items missing from the following year to make total 16
                                    .then((balanceDocuments) => {
                                          //console.log("Number of previous year news items = "+balanceDocuments.length); // The sorted and selected documents
                                          Array.prototype.push.apply(all16Headlines, balanceDocuments); //merge the previous year news items with current year news items
                                          all16Headlines.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));  //must sort the array as just merged two arrays
                                          newsFrontpageHeadlines = all16Headlines;
                                          //console.log("newsFrontpageHeadlines = "+newsFrontpageHeadlines);
                                          //only the admin does a search through the database to get the 16 news headlines - clients download the 'newsFrontpageHeadlines' file
                                          console.log("sending 1 to 16NewsHeadlinesRetrieved");
                                          socket.emit('16NewsHeadlinesRetrieved', all16Headlines);  //16 news headlines from two years
                                    }).catch((err) => {
                                          console.log(err + " - database error lmn");
                                    });
                        } else {
                              all16Headlines.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));  //must sort the array as just merged two arrays
                              newsFrontpageHeadlines = all16Headlines;
                              //console.log("newsFrontpageHeadlines = "+newsFrontpageHeadlines);
                              //when clients connect, they do not each do a search through the database to get the 16 news headlines - they download the 'newsFrontpageHeadlines' file
                              console.log("sending 2 to 16NewsHeadlinesRetrieved");
                              socket.emit('16NewsHeadlinesRetrieved', all16Headlines); //16 news headlines from the current year
                              // return;
                        };
                  }).catch((err) => {
                        console.log(err + " - database error from thisNews.find");
                        //remainder=0
                  })
      });

      //     RETRIEVE all new headlines - admin only
      socket.on('retrieveAllNewsHeadlinesAdmin', () => {
            // console.log("in retrieve16NewsHeadlinesAdmin");
            const date = new Date();
            var year = date.getFullYear();
            //console.log("year = " + year);
            var remainder = 16;
            var all16Thumbnails = [];
            // using a variable (the year) and a string combination to call the schema
            const modelName = "y" + year + "_news_headline";
            const thisNews = mongoose.model(modelName);

            thisNews.find()
                  .sort({
                        date_stamp: -1  //descending order
                  }) // sort by date_stamp field
                  .then((sixteenDocuments) => {
                        all16thumbnails = sixteenDocuments;

                        year = year - 1;
                        const modelNewName = "y" + year + "_news_headline";
                        const prevYearNews = mongoose.model(modelNewName);
                        prevYearNews.find()
                              .sort({
                                    date_stamp: -1  //descending order
                              }) // sort by block_number field

                              .then((balanceDocuments) => {
                                    Array.prototype.push.apply(all16thumbnails, balanceDocuments); //merge the previous year news items with current year news items
                                    all16thumbnails.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));  //must sort the array as just merged two arrays
                                    socket.emit('16NewsHeadlinesRetrieved', all16thumbnails);  //all news headlines from two years
                              }).catch((err) => {
                                    console.log(err + " - database error lmn");
                              });

                  }).catch((err) => {
                        console.log(err + " - database error from thisNews.find");
                        remainder = 0
                  })
      });


      socket.on('get16MoreNewsHeadlines', (startIndex, year) => {        //this returns sixteen news items, allowing change from one year to the previous year
            console.log("in get16MoreNewsHeadlines");
            //const date = new Date();
            //var year = date.getFullYear(); //we need the current year in order to start
            var remainder = 108;
            var all16Headlines = [];

            // using a variable and a string combination to call the schema
            const modelName = "y" + year + "_news_headline";
            const thisNews = mongoose.model(modelName);
            //console.log("***NEW***   get16NewsHeadlines fromIndex = " + startIndex);
            console.log("startIndex = " + startIndex);

            thisNews.find()
                  .sort({
                        _id: -1  //sort by date_stamp field, descending order
                  }) // sort by date_stamp field
                  .skip(startIndex) // 'startIndex' is the index from where you want to start selecting items
                  .limit(16) // Select 16 items (maybe some news headlines will be from the 16 frontpage headlines originally sent. But there will be very few, so we can let them pass.
                  .then((sixteenDocuments) => {
                        console.log("Here are how many documents" + sixteenDocuments.length); // The sorted and selected documents
                        all16Headlines = sixteenDocuments;

                        if (all16Headlines.length < 16 && year > 2021) { //start loading the previous year's headlines
                              console.log("NOT ENOUGH HEADLINES IN " + year + " - must load from previous year" + all16Headlines.length + "items");
                              year = year - 1;
                              console.log("year = " + year);
                              const modelNewName = "y" + year + "_news_headline";
                              const prevYearNews = mongoose.model(modelNewName);
                              prevYearNews.find()
                                    .sort({
                                          _id: -1  //sort by date_stamp field, descending order
                                    })
                                    //date_stamp
                                    .limit(16) // limit balance of news items missing to 16
                                    .then((balanceDocuments) => {
                                          Array.prototype.push.apply(all16Headlines, balanceDocuments);
                                          console.log("ADDED HEADLINES FROM PREVIOUS YEAR= " + all16Headlines.length + "items");
                                          socket.emit('16MoreNewsHeadlinesRetrieved', all16Headlines);
                                    }).catch((err) => {
                                          console.log(err + " - database error lmno");
                                    });

                        } else {
                              console.log("ENOUGH HEADLINES IN YEAR= " + all16Headlines.length + "items");
                              socket.emit('16MoreNewsHeadlinesRetrieved', all16Headlines);
                        };
                  }).catch((err) => {
                        console.log(err + " - database error lmn");
                        remainder = 0
                  })
            console.log("leaving get16MoreNewsHeadlines");
      });

      socket.on('retrieveHeadlineNews', () => {
            //console.log("in retrieveHeadlineNews = "+newsFrontpageHeadlines);
            if (newsFrontpageHeadlines.length === 0) {
                  console.log("in retrieveHeadlineNews - newsFrontpageHeadlines is empty - need to retrieve 16 top news items");

                  // we select 16 newsitems in order of their ascending position index (block_number) from 1 and 16 (the order they appear on the page)
                  // all other news items block_numbers are set to 90
                  // If there are not 16 news items numbered 1 to 16 in the current year, we go to the previous year to get the remainder.
                  console.log("in retrieve16NewsHeadlinesAdmin  app");
                  const date = new Date();
                  var year = date.getFullYear();
                  var remainder = 16108;
                  var all16Headlines = [];
                  // using a variable (the year) and a string combination to call the schema
                  const modelName = "y" + year + "_news_headline";
                  const thisNews = mongoose.model(modelName);
                  console.log("modelName = " + modelName);
                  thisNews.find()
                        .sort({
                              block_number: 1  //ascending order
                        }) // sort by block_number field
                        .limit(16) // Select 16 items
                        .then((sixteenDocuments) => {
                              all16Headlines = sixteenDocuments;
                              console.log("all16Headlines.length = " + all16Headlines.length);
                              for (var i = all16Headlines.length - 1; i > 0; i--) {
                                    //console.log("i = "+i);
                                    //console.log(all16Headlines[i]['date_stamp'] + "  aiiiieeeee");
                                    if (all16Headlines[i]['block_number'] > 16) {  //remove from Frontpage Headlines list any news with position > 16
                                          console.log("Deleting: " + all16Headlines[i]);  //this should only happen if the 1-16 positions are spread across two different years
                                          all16Headlines.splice(i, 1);
                                    }
                              }

                              remainder = 16 - all16Headlines.length
                              console.log("Only" + all16Headlines.length + "items"); // The sorted and selected documents
                              console.log("Need" + remainder + "more");
                              //there will only be a remainder if the 16 news headlines are spread across two years, eg dec 2022 and Jan 2023


                              if (year > 2022 && remainder > 0) {
                                    year = year - 1;
                                    const modelNewName = "y" + year + "_news_headline";
                                    const prevYearNews = mongoose.model(modelNewName);
                                    console.log("modelNewName = " + modelNewName);
                                    prevYearNews.find()
                                          .sort({
                                                block_number: 1  //sort by block_number field, ascending order
                                          })
                                          .limit(remainder) // limit balance of news items missing from the following year to make total 16
                                          .then((balanceDocuments) => {
                                                //console.log("Number of previous year news items = "+balanceDocuments.length); // The sorted and selected documents
                                                Array.prototype.push.apply(all16Headlines, balanceDocuments); //merge the previous year news items with current year news items
                                                all16Headlines.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));  //must sort the array as just merged two arrays
                                                newsFrontpageHeadlines = all16Headlines;
                                                //console.log("newsFrontpageHeadlines = "+newsFrontpageHeadlines);
                                                console.log("sending 1 to 16NewsHeadlinesRetrieved");
                                                socket.emit('16NewsHeadlinesRetrieved', newsFrontpageHeadlines);  //16 news headlines from two years
                                          }).catch((err) => {
                                                console.log(err + " - database error lmn");
                                          });
                              } else {
                                    all16Headlines.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));  //must sort the array as just merged two arrays
                                    newsFrontpageHeadlines = all16Headlines;
                                    socket.emit('16NewsHeadlinesRetrieved', newsFrontpageHeadlines);; //16 news headlines from the current year
                              };
                        }).catch((err) => {
                              console.log(err + " - database error from thisNews.find");
                              //remainder=0
                        })

            } else {
                  socket.emit('16NewsHeadlinesRetrieved', newsFrontpageHeadlines);
            }
      });


      //Delete a News item  - Admin only
      socket.on('deleteNewsItem', the_id => {
            // Create a model based on the schema
            //const User = mongoose.model('User', userSchema);
            const date = new Date(parseInt(the_id));
            const year = date.getFullYear();
            console.log("year = " + year);
            // using a variable and a string combination to call the schema
            const modelSinglenews = "y" + year + "_news_article";
            const modelNewsbox = "y" + year + "_news_headline";
            const thisSinglenews = mongoose.model(modelSinglenews);
            const thisNewsbox = mongoose.model(modelNewsbox);
            // Delete a record

            thisSinglenews.deleteOne({
                  _id: "A" + the_id
            })
                  .then(() => {
                        console.log('Document deleted successfully');
                  })
                  .catch((error) => {
                        console.error("EERRRROORR" + error);
                  });

            thisNewsbox.deleteOne({
                  _id: the_id
            })
                  .then(() => {
                        console.log('Document deleted successfully');
                  })
                  .catch((error) => {
                        console.error("EERRRROORR108" + error);
                  });
      });

      //RETRIEVE A PARTICULAR singlenews_thumb DATA   (NOT IN USE)
      socket.on('retrieveNewsHeadline', news_id => {
            console.log("in retrieveNewsHeadline time = " + news_id);
            var dateStored = parseInt(news_id);
            const date = new Date(dateStored);
            const year = date.getFullYear();
            console.log("year = " + year);
            // using a variable and a string combination to call the schema
            const modelName = "y" + year + "_news_headline";
            const thisNews = mongoose.model(modelName);

            thisNews.findOne({
                  _id: news_id
            })
                  .then((result) => {
                        for (var h in result) {
                              console.log(h + " : " + result[h]);
                        };
                        socket.emit('newsHeadlineRetrieved', result);
                  })
                  .catch((error) => {
                        console.log(err + " - database error retrieveNewsHeadline");
                  });
      })

      //RETRIEVE A PARTICULAR newsitem_article DATA  
      socket.on('retrieveNewsArticle', news_id => {
            console.log("in retrieveNewsArticle time = " + news_id);
            var dateStored = parseInt(news_id.substring(1, news_id.length));
            //var dateStored = parseInt(news_id);
            const date = new Date(dateStored);
            const year = date.getFullYear();
            console.log("year = " + year);
            // using a variable and a string combination to call the schema
            const modelName = "y" + year + "_news_article";
            //const modelName =  "y"+year+"_news_headline";
            const thisNews = mongoose.model(modelName);

            thisNews.findOne({
                  _id: news_id
            })
                  .then((result) => {
                        console.log("result = " + result);
                        for (var h in result) {
                              //console.log(h+" : "+result[h]);
                        }
                        socket.emit('newsArticleRetrieved', result);
                  })
                  .catch((error) => {
                        console.log(err + " - database error retrieveNewsArticle");
                  })
      });

      //    RETRIEVE all videos
      socket.on('retrieveAllVideos', () => {
            //console.log("retrieve all videos");
            vids.find()
                  .then((allVids) => {
                        //console.log("retrieve allVids = "+allVids);
                        socket.emit('allVideosRetrieved', allVids);
                  }).catch((err) => {
                        console.log(err + " - database error lmn");
                  })
      });


      //  Update video
      socket.on('updateVideo', (anObject) => {
            //console.log("in updateVideos");
            var videoData = anObject;
            vids.findOne({
                  _id: videoData._id
            }).exec()
                  .then((result) => {
                        if (!result) { //newsBox record not found - make a new one
                              var newVideo = new vids(videoData);
                              newVideo.save()
                                    .then(savedInfo => {
                                          //console.log('User saved successfully:', savedInfo);
                                          socket.emit('videoUpdated', savedInfo);
                                    })
                                    .catch(error => {
                                          console.error(error.message);
                                          //console.log("9 - save video failed");
                                    });
                        } else { //video record  exists already - updating data
                              //console.log("");
                              for (var k in videoData) {
                                    if (videoData.hasOwnProperty(k)) {
                                          //console.log("2Updating Data - " + k + ':' + videoData[k]);
                                          if (k !== "_id") { //as record already exists, remove _id from object as it doesn't need updating
                                                //console.log("videoData[" + k + "] = " + videoData[k]);
                                                result[k] = videoData[k]; //result{} refreshes all its values from anObject{} received from admin.
                                                //console.log("result[" + k + "] = " + result[k]);
                                          }
                                    }
                              }
                              result.save()
                                    .then(savedInfo => {
                                          //console.log('Videos saved successfully:', savedInfo);
                                          socket.emit('videoUpdated', savedInfo);
                                    })
                                    .catch(error => {
                                          console.error(error.message);
                                          console.log("5 - videos update failed");
                                    });
                        };
                  })
                  .catch((error) => {
                        // Handle any errors here
                        console.error(error.message);
                        console.log("6 - database error in videosUpdated");
                  });
      });

      //    RETRIEVE all Banners
      socket.on('retrieveAllBanners', () => {
            //console.log("retrieve all banners");
            mtvBanner.find()
                  .then((allbanners) => {
                        // console.log("retrieveAllBanners = "+allbanners);
                        socket.emit('allBannersRetrieved', allbanners);
                  }).catch((err) => {
                        console.log(err + " - database error lmn");
                  })
      });

      //  Update Banner
      socket.on('updateBanner', (anObject) => {
            //console.log("in updateBanner");
            var bannerData = anObject;
            mtvBanner.findOne({
                  _id: bannerData._id
            }).exec()
                  .then((result) => {
                        if (!result) { //banner record not found - make a new one
                              var newBanner = new mtvBanner(bannerData);
                              newBanner.save()
                                    .then(savedInfo => {
                                          //console.log('User saved successfully:', savedInfo);
                                          io.emit('bannerUpdated', savedInfo);
                                    })
                                    .catch(error => {
                                          console.error(error.message);
                                          console.log("9 - save bannerx failed");
                                    });
                        } else { //banner record  exists already - updating data
                              for (var k in bannerData) {
                                    if (bannerData.hasOwnProperty(k)) {
                                          console.log("2Updating Data - " + k + ':' + bannerData[k]);
                                          if (k !== "_id") { //as record already exists, remove _id from object as it doesn't need updating
                                                //console.log("bannerData[" + k + "] = " + bannerData[k]);
                                                result[k] = bannerData[k]; //result{} refreshes all its values from anObject{} received from admin.
                                                //console.log("result[" + k + "] = " + result[k]);
                                          }
                                    }
                              }
                              result.save()
                                    .then(savedInfo => {
                                          //console.log('Banners saved successfully:', savedInfo);
                                          io.emit('bannerUpdated', savedInfo);
                                    })
                                    .catch(error => {
                                          console.error("5 - videos update failed");
                                    });
                        };
                  })
                  .catch((error) => {
                        // Handle any errors here
                        console.error("6 - database error in videosUpdated");
                  });
      });




      //     RETRIEVE all news articles - admin only
      socket.on('retrieveAllNewsarticlesAdmin', () => {
            // For the articles frontpage, we select 16 newsitems in order of their ascending position index (block_number) from 1 and 16 (the order they appear on the page)
            // all other news items block_numbers are set to 90
            // If there are not 16 news items numbered 1 to 16 in the current year, we go to the previoud year to get the remainder.
            //when clients connect, they do not each do this search through the database to get the 16 news articles - they download the 'newsFrontpagearticles' file
            // console.log("in retrieve16NewsarticlesAdmin");
            const date = new Date();
            var year = date.getFullYear();
            //console.log("year = " + year);
            var remainder = 16;
            var all16Thumbnails = [];
            // using a variable (the year) and a string combination to call the schema
            const modelName = "y" + year + "_news_article";
            const thisNews = mongoose.model(modelName);

            thisNews.find()
                  .sort({
                        date_stamp: -1  //descending order
                  }) // sort by date_stamp field
                  .then((sixteenDocuments) => {
                        all16thumbnails = sixteenDocuments;
                        console.log("all16thumbnails = " + all16thumbnails);
                        console.log("all16thumbnails.length = " + all16thumbnails.length);
                        year = year - 1;
                        const modelNewName = "y" + year + "_news_article";
                        const prevYearNews = mongoose.model(modelNewName);
                        prevYearNews.find()
                              .sort({
                                    date_stamp: -1  //descending order
                              }) // sort by block_number field

                              .then((balanceDocuments) => {
                                    Array.prototype.push.apply(all16thumbnails, balanceDocuments); //merge the previous year news items with current year news items
                                    //only the admin does a search through the database to get the 16 news articles - clients download the 'newsFrontpagearticles' file
                                    all16thumbnails.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));  //must sort the array as just merged two arrays
                                    socket.emit('16NewsarticlesRetrieved', all16thumbnails);  //all news articles from two years
                              }).catch((err) => {
                                    console.log(err + " - database error lmn");
                              });

                  }).catch((err) => {
                        console.log(err + " - database error from thisNews.find");
                        remainder = 0
                  })
      });




});