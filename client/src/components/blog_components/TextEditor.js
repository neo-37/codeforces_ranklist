import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import htmlParser from "html-react-parser";
import "quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";


import "./editor.css";
import axios from "axios";

const Editor = ({ g_user, cf_user,setRenderBothBlogs, setBlogButtonText }) => {
  const [curhtml, setcurhtml] = useState(<></>); //useState imp if we want to see the hmtl result alongside
  const [title, setTitle] = useState("No Title Provided");
  const [isDisabled, setIsDisabled] = useState(false);

  const [inputText, setInputText] = useState("");

  const { state } = useLocation();
  console.log("display article", state);
  const article = state;


  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');//no need
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  const url = process.env.REACT_APP_API_URL;

  const sendArticleToServer = async (article_data) => {
    axios
      .post(`${url}/save_article`, article_data)
      .then((response) => {
        console.log("article sent", response);
      })
      .catch((err) => {
        console.log("send article to server", err);
      });
  };
  const handleSaveArticleClick = () => {
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
      html_string: htmlString,
    });
  };

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldContents) => {
        console.log(delta);

        let currrentContents = quill.getContents();
        console.log("cur contents", currrentContents);
        // console.log(currrentContents.diff(oldContents));
        // console.log('currect content',currrentContents.ops)
        // console.log('currect content',currrentContents.ops[0].insert)

        // const article_data_array = currrentContents.ops;
        // console.log('article data',article_data_array)
        // const converter = new QuillDeltaToHtmlConverter(article_data_array, {});
        // const htmlString = converter.convert();
        // setcurhtml(htmlParser(htmlString)); //parsing should be done here itself and not in return
      });
    }
  }, [quill, Quill]);

  useEffect(()=>{
    setRenderBothBlogs(true)
     setBlogButtonText('My Blogs')
    //  if(article&&quill)
    //  {
    //   console.log("SUCCESS")
    //   quill.getContents().ops=article.ops_array;
    //  }
  },[])
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
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleTitleSubmit}
        >
          Lock
        </button>

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
