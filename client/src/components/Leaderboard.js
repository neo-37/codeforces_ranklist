import axios from "axios";
import Rank from "./Rank";

function Leaderboard(props) {
  const url = process.env.REACT_APP_API_URL;

  const handleRemoveCfUser = (e) => {
    console.log(
      "event from button child logged in leaderboard",
      e.target.parentNode.value
    );
    let val = e.target.parentNode.value;

    if (props.cf_user != null && val === props.cf_user.email)
      props.setCFUser(null);

    try {
      axios
        .post(`${url}/remove_user_from_list`, { cf_handle_email: val })
        .then((res) => {
          props.setArr(props.list.filter((data) => data.email !== val));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div
        className="container-fluid"
        style={{
          marginBottom: "90px",
          paddingLeft: "40px",
          paddingRight: "20px",
        }}
      >
        <div
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "30px",
          }}
        >
          <i>
            <b>
              <u>Ranklist</u>
            </b>
          </i>
        </div>
        <table
          className="table table-striped table-hover"
          style={{ "--bs-table-hover-bg": "rgb(78 169 77 / 24%)" }}
        >
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Handle</th>
              <th scope="col">Name</th>
              <th scope="col">Max. Rating.</th>
              <th scope="col">Title</th>
              <th
                scope="col"
                style={{
                  width: "350px",
                  textAlign: "right",
                  paddingRight: "1em",
                }}
              >
                Rating.
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {props.list.map((value, index) => {
              return (
                <Rank
                  key={index}
                  value={value}
                  g_user={props.g_user}
                  id={index}
                  onSmash={handleRemoveCfUser}
                  isAdmin={props.isAdmin}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Leaderboard;
