import axios from "axios";

function Sideinfo(props) {
  const url = process.env.REACT_APP_API_URL;

  const remove_cf_user = async () => {
    props.setCFUser(null);
    try {
      //without avait it seems like getArr function is working before removal occurs so the old list get rerendered
      await axios.get(`${url}/remove_user`, {
        withCredentials: true,
      })
     
    } catch (err) {
      console.log("remove_cf_user fn", err);
    } finally {
      console.log('props.getArr in side info')
      await props.getArr();//ending the get the request finally won't be activated so atleast do a res.end()
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("sideinfo event", e.target.cf_id);
      const cf_id = e.target.cf_id.value;
      e.target.cf_id.value = "";
      const { data } = await axios.get(`${url}/new_cf_user`, {
        params: { cf_id: cf_id },
        withCredentials: true,
      });
      console.log("Cf user");
      console.log(data.user);
      
      props.setCFUser(data.user);
      
      props.getArr();
    } catch (err) {
      console.log(err);
    }

  };
  return (
    <>
      <div className="text-center" style={{ marginTop: "60px" }}>
        {props.g_user ? (
          <>
            {props.cf_user ? (
              <>
                <img
                  src={props.cf_user.image}
                  className="rounded"
                  alt="..."
                  width="115px"
                  height="170px"
                />
                <div style={{ marginTop: "10px" }}>
                  User : {props.cf_user.cf_handle}
                  <br />
                  {/* since rating is not present so .rating will be undefined which is interpreted as false,this is done for handling
                  edge cases of user who haven't ever participate in contest */}
                  Rating :{" "}
                  {props.cf_user.rating ? props.cf_user.rating : "Unrated"}
                </div>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ marginTop: "10px" }}
                  onClick={remove_cf_user}
                >
                  remove
                </button>
              </>
            ) : (
              <div className="mb-3 mt-5">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control"
                    id="cf_id"
                    placeholder="Enter your Codeforces Handle"
                  />
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    style={{ marginTop: "10px", width: "110px" }}
                  >
                    add user
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
export default Sideinfo;
