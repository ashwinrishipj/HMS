
export const fetchMail = async (body) => {

  return fetch("https://hms-server.herokuapp.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "appliction/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 500) {
        console.log('Looks like there was a problem. Status Code: ' +
          res.status);
        return false;
      }
      return res.json();
    })
    .then((Response) => {
      if (Response.data.getMailData) {
        console.log("response:",Response.data.getMailData);
        return Response.data.getMailData;
      } else {
        return Response.errors[0].message;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export const sendEmail = async (data) =>{
  return fetch("https://hms-server.herokuapp.com/graphql", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "appliction/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 500) {
        console.log('Looks like there was a problem. Status Code: ' +
          res.status);
        return false;
      }
      return res.json();
    })
    .then((Response) => {
      if (Response.data.sendMail) {
        console.log("response:",Response.data.sendMail);
        return Response.data.sendMail;
      } else {
        return Response.errors[0];
      }
    })
    .catch((err) => {
      console.log(err);
    });
}