
function set_color(rating) {
  if (rating < 1200) return "gray";
  else if (rating < 1400) return "#008000";
  else if (rating < 1600) return "#03a89e";
  else if (rating < 1900) return "blue";
  else if (rating < 2100) return "#a0a";
  else if (rating < 2300) return "#ff8c00";
  else if (rating < 2400) return "#ff8c00";
  else if (rating < 2600) return "#ff0000";
  else if (rating < 3000) return "#ff0000";
  else return "#ff0000"; //case for tourist
}


const CfHandleColor=({value})=>{


return(
    <a
          href={"https://codeforces.com/profile/" + value.cf_handle}
          target="_blank"
          rel="noopener noreferrer"
          // for unrated user the stlye object is accessed conditionally,we could render the values conditionally but just to show this
          style={
            value.rating
              ? {
                  fontFamily: "helvetica neue,Helvetica,Arial,sans-serif",
                  fontWeight: "700",
                  fontSize : value.display_article?'1.6rem':'0.9rem',
                  textDecoration: "none",
                  color: set_color(value.rating),
                }
              : {
                  fontFamily: "helvetica neue,Helvetica,Arial,sans-serif",
                  fontWeight: "400",
                  textDecoration: "none",
                  color: "black",
                }
          }
        >
          {!value.rating||(value.rating && value.rating < 3000) ? (
            value.cf_handle
          ) : (
            <>
             {/* we cna conditionally render just one element so an empty fragment will do the job*/}
              <span style={{color:"black"}}>
                {value.cf_handle[0]}
              </span>
              {value.cf_handle.substr(1,value.cf_handle.length-1)}
            </>
          )}
        </a>

    
)
}

export default CfHandleColor