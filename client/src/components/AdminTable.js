
function AdminTable({vList,uvList,onClick, list,g_user}) {
  return (
    <>
      <table className="table">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th
                scope="col"
                style={{
                  width: "350px",
                  textAlign: "right",
                  paddingRight: "1em",
                }}
              >
                Select
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {vList.map((data, index) => {
              return list && list[data.value] ? (
                <tr key={list[data.value].email}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <a>{list[data.value].name}</a>
                  </td>
                  <td>{list[data.value].email}</td>
                  <td
                    colSpan="2"
                    style={{ textAlign: "right", paddingRight: "1em" }}
                  >
                    {g_user.email != list[data.value].email ? (
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={data.value}
                        key={list[data.value].email}
                        onClick={onClick}
                      />
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ) : (
                <></>
              );
            })}
          </tbody>
        </table>

        <h5>
          <u>Unverified Admins : </u>
        </h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">Email</th>
              <th
                scope="col"
                style={{
                  width: "350px",
                  textAlign: "right",
                  paddingRight: "1em",
                }}
              >
                Select
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {uvList.map((data, index) => {
              return list && list[data.value] ? (
                <tr key={list[data.value].email}>
                  <th scope="row">{index + 1}</th>
                  <td>{list[data.value].email}</td>
                  <td
                    colSpan="2"
                    style={{ textAlign: "right", paddingRight: "1em" }}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={data.value}
                      key={list[data.value].email}
                      id={"uvID" + index + 1}
                      onClick={onClick}
                    />
                  </td>
                </tr>
              ) : (
                <></>
              );
            })}
          </tbody>
        </table>
    </>
  );
}

export default AdminTable;