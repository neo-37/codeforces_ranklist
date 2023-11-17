import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import htmlParser from "html-react-parser";
import "quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";

import "./editor.css";
import axios from "axios";

const Editor = ({ g_user, cf_user, setRenderBothBlogs, setBlogButtonText }) => {
  const [curhtml, setcurhtml] = useState(<></>); //useState imp if we want to see the hmtl result alongside
  const [title, setTitle] = useState("No Title Provided");
  const [isDisabled, setIsDisabled] = useState(false);
  const [hideLockButton,setHideLockButton]=useState(false);

  const [inputText, setInputText] = useState("");
 

  const { state } = useLocation();
  console.log("text editor state", state); //null is no data

  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
  });

  if (Quill && !quill) {
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  const url = process.env.REACT_APP_API_URL;

  const [retrievedArticle,setRetrievedArticle] = useState(null);

  const editorIsEmpty =
    state&&quill &&
    quill.getContents().ops.length === 1 &&
    quill.getContents().ops[0].insert === "\n";

    if (editorIsEmpty) {
      console.log('empty');
      quill.setContents(state.ops_array);
  
      setInputText(state.title);
      setTitle(state.title);
      setIsDisabled(true);
    }
  

  const retrieveArticleFromServer = async () => {
    if (state) {
      axios
        .get(`${url}/retrieve_article`, { params: { key: state.unique_key } })
        .then(({ data }) => {
          //in respose data holds array of article objects
          console.log('text editor',data)
          if (data.length)
            setRetrievedArticle(data[0]);
        })
        .catch((err) => {
          console.log("receive article to server", err);
        });
    }
  };

  
  const sendArticleToServer = async (article_data) => {
    axios
      .post(`${url}/save_article`,{...article_data,text_editor_save:true})
      .then((response) => {
        console.log("article sent", response);
      })
      .catch((err) => {
        console.log("send article to server", err);
      });
  };

  const save_new_title = async () => {
    axios
      .post(`${url}/edit_article_title`, {
        email: state.email,
        unique_key: state.unique_key,
        new_title: title,
      })
      .then((response) => {
        console.log("title edit", response);
      })
      .catch((err) => {
        console.log("title edit error", err);
      });
  };

  const sendArticleHelp = () => {
    let currrentContents = quill.getContents();
    const article_data_array = currrentContents.ops;
    console.log("article data", article_data_array);
    const converter = new QuillDeltaToHtmlConverter(article_data_array, {});
    const htmlString = converter.convert();
    setcurhtml(htmlParser(htmlString)); //parsing should be done here itself and not in return
    sendArticleToServer({
      email: `${g_user.email}`,
      author: cf_user != null ? `${cf_user.cf_handle}` : "neo_37",
      title: `${title}`,
      ops_array: article_data_array,
      article_html: htmlString,
      review_status: 0
    });
  };
  const handleSaveArticleClick = async () => {
    if (isDisabled) {
      await retrieveArticleFromServer();
      if (!retrievedArticle)
      {
        sendArticleHelp();
      } else {
        await save_new_title();
        sendArticleHelp();
        setHideLockButton(true);
      }
    }
  };

  //not needed
  // useEffect(() => {
  //   if (quill) {
  //     quill.on("text-change", (delta, oldContents) => {
  //       console.log(delta);

  //       let currrentContents = quill.getContents();
  //       console.log("cur contents", currrentContents);
  //       // console.log(currrentContents.diff(oldContents));
  //       // console.log('currect content',currrentContents.ops)
  //       // console.log('currect content',currrentContents.ops[0].insert)

  //       // const article_data_array = currrentContents.ops;
  //       // console.log('article data',article_data_array)
  //       // const converter = new QuillDeltaToHtmlConverter(article_data_array, {});
  //       // const htmlString = converter.convert();
  //       // setcurhtml(htmlParser(htmlString)); //parsing should be done here itself and not in return
  //     });
  //   }
  // }, [quill, Quill]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth', // Optionally, use smooth scrolling for a nice effect
    });
  };


  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  const handleTitleSubmit = () => {
    // Access the input text value from the state and do something with it
    if (inputText !== "") {
      setTitle(inputText);
      setIsDisabled(true);
    }
  };

  const unlockTitle = () => {
    setIsDisabled(false);
  };

  useEffect(() => {
    setRenderBothBlogs(true);
    setBlogButtonText("My Blogs");

    scrollToTop();
   
  }, []);

 
  return (
    <>
      <div className="hstack gap-3" style={{ marginTop: "1rem" }}>
        <input
          className="form-control me-auto"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Title"
          aria-label="=Title of article"
          disabled={isDisabled}
        />
        {!hideLockButton?
        <button
          type="button"
          className="btn btn-secondary"
          onClick={isDisabled ? unlockTitle : handleTitleSubmit}
        >
          {isDisabled ? "Unlock" : "Lock"}
        </button>
        :<></>}
      </div>
      <div className="text-editor">
        <div>
          <div ref={quillRef} />
          <button
            type="button"
            className="btn btn-success save-button"
            onClick={handleSaveArticleClick}
          >
            Save Article
          </button>
        </div>
        <div>
          <div className="ql-toolbar ql-snow" style={{ marginTop: "4rem" }}>
            <h3 style={{ textAlign: "center" }}>Preview</h3>
          </div>

          <div className="preview-article ql-editor ">{curhtml}</div>
        </div>
      </div>
    </>
  );
};

export default Editor;
